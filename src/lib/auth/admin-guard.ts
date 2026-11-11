import { NextRequest, NextResponse } from 'next/server';
import { getSession, verifyTokenWithRevocation } from './session';
import { verifyToken, type SessionPayload } from './jwt';
import { isTokenRevoked } from './token-revocation';
import { isTrustedOrigin } from '@/lib/security/url-guard';
import { db, isDbConfigured } from '@/lib/db';
import { adminUsers } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * ============================================================
 * GUARDIÃO DE AUTORIZAÇÃO ADMINISTRATIVA SOBERANA (RBAC)
 * ============================================================
 * Valida se a requisição possui credencial legítima de administrador
 * através de:
 * 1. Cookie HTTP-Only seguro (mcp_session_token)
 * 2. Header Authorization: Bearer <token> assinado com HS256
 * 3. Validação de revogação de tokens e cross-check de permissões no banco.
 */

export const NO_STORE_HEADERS: Record<string, string> = {
  'Cache-Control': 'no-store, no-cache, must-revalidate, private',
  'Pragma': 'no-cache',
  'Expires': '0',
  'X-Robots-Tag': 'noindex, nofollow, noarchive',
};

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export interface AdminVerificationResult {
  authorized: boolean;
  statusCode: 401 | 403 | 200;
  session: SessionPayload | null;
  error?: string;
}

/**
 * Verifica se a requisição originou de origem confiável (proteção CSRF em mutações)
 */
export function verifySameOriginRequest(req: Request | NextRequest): boolean {
  const method = req.method.toUpperCase();
  if (method === 'GET' || method === 'HEAD' || method === 'OPTIONS') {
    return true;
  }
  const origin = req.headers.get('origin');
  if (origin) {
    return isTrustedOrigin(origin);
  }
  const referer = req.headers.get('referer');
  if (referer) {
    try {
      const refUrl = new URL(referer);
      return isTrustedOrigin(refUrl.origin);
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * Extrai o token JWT de uma requisição (Authorization Header ou Cookie)
 */
export function extractRequestToken(req: Request | NextRequest): string | null {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  const cookieHeader = req.headers.get('cookie');
  if (cookieHeader) {
    const match = cookieHeader.match(/mcp_session_token=([^;]+)/);
    if (match) return decodeURIComponent(match[1].trim());
  }
  return null;
}

export async function verifyAdminRequest(
  req: Request | NextRequest,
  options?: { requireInDev?: boolean; strictAdminOnly?: boolean }
): Promise<AdminVerificationResult> {
  const isProdOrVercel =
    process.env.NODE_ENV === 'production' ||
    Boolean(process.env.VERCEL) ||
    Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV === 'production');

  let session: SessionPayload | null = await getSession();

  if (!session) {
    const token = extractRequestToken(req);
    if (token) {
      session = await verifyTokenWithRevocation(token);
    }
  }

  // Se não foi encontrada sessão válida
  if (!session) {
    // Apenas concede bypass se explicitamente habilitado via variável de ambiente de desenvolvimento
    if (process.env.ALLOW_DEV_ADMIN_BYPASS === 'true' && !isProdOrVercel && !options?.requireInDev) {
      return {
        authorized: true,
        statusCode: 200,
        session: {
          userId: '00000000-0000-4000-8000-000000000001',
          email: 'admin@demo.local',
          name: 'Administrador Demo',
          role: 'admin',
        },
      };
    }

    return {
      authorized: false,
      statusCode: 401,
      session: null,
      error: 'Autenticação obrigatória. Faça login como administrador para prosseguir.',
    };
  }

  // Verifica revogação explícita
  if (session.jti && (await isTokenRevoked({ jti: session.jti }))) {
    return {
      authorized: false,
      statusCode: 401,
      session: null,
      error: 'Sessão revogada. Faça login novamente.',
    };
  }

  // Verifica privilégio de papel
  const role = session.role;
  const isAllowed = options?.strictAdminOnly
    ? role === 'admin'
    : role === 'admin' || (role as string) === 'moder' || (role as string) === 'moderator';

  if (!isAllowed) {
    return {
      authorized: false,
      statusCode: 403,
      session,
      error: 'Acesso negado. Esta operação exige privilégios de Administrador.',
    };
  }

  // Validação em profundidade contra banco de dados real quando configurado
  if (isDbConfigured && session.userId) {
    try {
      let rows: Array<{ id: string; role: string; email: string }> = [];
      if (UUID_REGEX.test(session.userId)) {
        rows = await db
          .select({ id: adminUsers.id, role: adminUsers.role, email: adminUsers.email })
          .from(adminUsers)
          .where(eq(adminUsers.id, session.userId))
          .limit(1);
      }
      if (rows.length === 0 && session.email) {
        rows = await db
          .select({ id: adminUsers.id, role: adminUsers.role, email: adminUsers.email })
          .from(adminUsers)
          .where(eq(adminUsers.email, session.email.toLowerCase().trim()))
          .limit(1);
      }

      if (rows.length > 0) {
        const dbRole = rows[0].role;
        const dbAllowed = options?.strictAdminOnly
          ? dbRole === 'admin'
          : dbRole === 'admin' || dbRole === 'moder' || dbRole === 'moderator';
        if (!dbAllowed) {
          return {
            authorized: false,
            statusCode: 403,
            session,
            error: 'Acesso negado. Esta operação exige privilégios de Administrador.',
          };
        }
      } else {
        // Na instância Demo ou contingência, contas com role admin têm acesso garantido
        if (session.role !== 'admin' && session.email.toLowerCase().trim() !== 'admin@demo.local') {
          return {
            authorized: false,
            statusCode: 403,
            session,
            error: 'Acesso negado. Conta administrativa não reconhecida no sistema.',
          };
        }
      }
    } catch (dbErr) {
      console.warn('[AdminGuard] Verificação de DB ignorada por contingência offline:', dbErr);
    }
  }

  return { authorized: true, statusCode: 200, session };
}

/**
 * Validação para Server Components em /admin (RSC)
 */
export async function requireAdminSession(): Promise<{
  authenticated: boolean;
  authorized: boolean;
  session: SessionPayload | null;
}> {
  const session = await getSession();
  if (!session) {
    return { authenticated: false, authorized: false, session: null };
  }

  if (session.role !== 'admin') {
    return { authenticated: true, authorized: false, session };
  }

  if (isDbConfigured && session.userId) {
    try {
      let rows: Array<{ id: string; role: string }> = [];
      if (UUID_REGEX.test(session.userId)) {
        rows = await db
          .select({ id: adminUsers.id, role: adminUsers.role })
          .from(adminUsers)
          .where(eq(adminUsers.id, session.userId))
          .limit(1);
      }
      if (rows.length === 0 && session.email) {
        rows = await db
          .select({ id: adminUsers.id, role: adminUsers.role })
          .from(adminUsers)
          .where(eq(adminUsers.email, session.email.toLowerCase().trim()))
          .limit(1);
      }
      if (rows.length > 0) {
        if (rows[0].role !== 'admin') {
          return { authenticated: true, authorized: false, session };
        }
      } else {
        if (session.role !== 'admin' && session.email.toLowerCase().trim() !== 'admin@demo.local') {
          return { authenticated: true, authorized: false, session };
        }
      }
    } catch {
      // Modo offline resiliente
    }
  }

  return { authenticated: true, authorized: true, session };
}

/**
 * Helper de resposta padrão HTTP 401 para autenticação ausente
 */
export function unauthorizedResponse(errorMsg?: string) {
  return NextResponse.json(
    {
      success: false,
      error: errorMsg || 'Acesso restrito. Autenticação de Administrador obrigatória.',
    },
    { status: 401, headers: NO_STORE_HEADERS }
  );
}

/**
 * Helper de resposta padrão HTTP 403 para permissões insuficientes
 */
export function forbiddenResponse(errorMsg?: string) {
  return NextResponse.json(
    {
      success: false,
      error: errorMsg || 'Acesso negado. Privilégios de Administrador insuficientes.',
    },
    { status: 403, headers: NO_STORE_HEADERS }
  );
}

/**
 * Responde 401 se não autenticado ou 403 se autenticado sem privilégio administrativo.
 */
export function authErrorResponse(auth: {
  authorized: boolean;
  statusCode?: 401 | 403 | 200;
  session: SessionPayload | null;
  error?: string;
}) {
  if (!auth.session || auth.statusCode === 401) {
    return unauthorizedResponse(auth.error);
  }
  return forbiddenResponse(auth.error);
}

export const denyAdminRequest = authErrorResponse;
