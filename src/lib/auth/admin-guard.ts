import { NextRequest, NextResponse } from 'next/server';
import { getSession } from './session';
import { verifyToken, type SessionPayload } from './jwt';

/**
 * ============================================================
 * GUARDIÃO DE AUTORIZAÇÃO ADMINISTRATIVA SOBERANA (RBAC)
 * ============================================================
 * Valida se a requisição possui credencial legítima de administrador
 * ou moderador através de:
 * 1. Cookie HTTP-Only seguro (mcp_session_token)
 * 2. Header Authorization: Bearer <token> assinado com HS256
 */
export async function verifyAdminRequest(
  req: Request | NextRequest,
  options?: { requireInDev?: boolean }
): Promise<{ authorized: boolean; session: SessionPayload | null; error?: string }> {
  const isProduction = process.env.NODE_ENV === 'production';

  let session: SessionPayload | null = await getSession();

  if (!session) {
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7).trim();
      session = await verifyToken(token);
    }
  }

  // Se não foi encontrada sessão válida
  if (!session) {
    // Apenas concede bypass se explicitamente habilitado via variável de ambiente de desenvolvimento
    if (process.env.ALLOW_DEV_ADMIN_BYPASS === 'true' && !isProduction && !options?.requireInDev) {
      return {
        authorized: true,
        session: {
          userId: 'dev_admin_id',
          email: 'mcp6667@proton.me',
          name: 'Mateus Celestino (Dev Local)',
          role: 'admin',
        },
      };
    }

    return {
      authorized: false,
      session: null,
      error: 'Autenticação obrigatória. Faça login como administrador para prosseguir.',
    };
  }

  // Verifica se o usuário tem privilégio administrativo
  const role = session.role;
  const isAllowed = role === 'admin' || (role as string) === 'moder' || (role as string) === 'moderator';

  if (!isAllowed) {
    return {
      authorized: false,
      session,
      error: 'Acesso negado. Esta operação exige privilégios de Administrador ou Moderador.',
    };
  }

  return { authorized: true, session };
}

/**
 * Helper de resposta padrão HTTP 401/403 para acessos negados
 */
export function unauthorizedResponse(errorMsg?: string) {
  return NextResponse.json(
    {
      success: false,
      error: errorMsg || 'Acesso restrito. Autenticação de Administrador obrigatória.',
    },
    { status: 401 }
  );
}

export function forbiddenResponse(errorMsg?: string) {
  return NextResponse.json(
    {
      success: false,
      error: errorMsg || 'Acesso negado. Privilégios insuficientes.',
    },
    { status: 403 }
  );
}
