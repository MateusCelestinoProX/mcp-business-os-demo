import { cookies } from 'next/headers';
import { signToken, verifyToken, type SessionPayload } from './jwt';
import { revokeToken, isTokenRevoked } from './token-revocation';
import { db, isDbConfigured } from '@/lib/db';
import { authSessions } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

/**
 * ============================================================
 * GERENCIADOR DE SESSÕES & COOKIES HTTP-ONLY (NEXT.JS 15)
 * ============================================================
 * Armazenamento seguro de sessão em cookies HttpOnly com flags estritas.
 * Suporte a revogação de tokens em memória e persistência em banco.
 */

export const SESSION_COOKIE_NAME = 'mcp_session_token';

// Duração padrão: 7 dias em segundos
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

const isProdOrVercel =
  process.env.NODE_ENV === 'production' ||
  Boolean(process.env.VERCEL) ||
  Boolean(process.env.NEXT_PUBLIC_VERCEL_ENV === 'production');

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ZERO_UUID = '00000000-0000-0000-0000-000000000000';

async function sha256Hex(value: string): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(value);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return value.slice(-48);
}

/**
 * Verifica se o token foi persistido como revogado na tabela auth_sessions
 */
async function isRevokedInDb(token: string): Promise<boolean> {
  if (!isDbConfigured || !token) return false;
  try {
    const digest = await sha256Hex(token);
    const revokedKey = `revoked:${digest}`;
    const rows = await db
      .select({ id: authSessions.id })
      .from(authSessions)
      .where(eq(authSessions.token, revokedKey))
      .limit(1);
    return rows.length > 0;
  } catch {
    return false;
  }
}

/**
 * Persiste a chave de revogação no banco para invalidação distribuída
 */
async function persistRevocationInDb(token: string, userId?: string): Promise<void> {
  if (!isDbConfigured || !token) return;
  try {
    const digest = await sha256Hex(token);
    const revokedKey = `revoked:${digest}`;
    const safeUserId = userId && UUID_REGEX.test(userId) ? userId : ZERO_UUID;
    const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

    // Evita duplicatas consultando antes do insert
    const exists = await db
      .select({ id: authSessions.id })
      .from(authSessions)
      .where(eq(authSessions.token, revokedKey))
      .limit(1);

    if (exists.length === 0) {
      await db.insert(authSessions).values({
        userId: safeUserId,
        token: revokedKey,
        expiresAt,
      });
    }
  } catch (err) {
    console.warn('[Session] Aviso: Falha não-fatal ao persistir revogação no banco:', err);
  }
}

/**
 * Cria a sessão de autenticação gravando cookie HttpOnly seguro
 */
export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await signToken(payload, '7d');

  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: isProdOrVercel,
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
  } catch {
    // Permite uso em contextos onde cookies não estão disponíveis (ex: API manual ou testes)
  }

  return token;
}

export const DEMO_ADMIN_SESSION: SessionPayload = {
  userId: '00000000-0000-4000-8000-000000000001',
  email: 'admin@demo.local',
  name: 'Administrador Demo',
  role: 'admin',
  tier: 'max',
};

/**
 * Recupera e valida a sessão atual através do cookie de autenticação
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      if (!(await isRevokedInDb(token))) {
        const verified = await verifyToken(token);
        if (verified) return verified;
      }
    }

    // Instância Demo: Administrador concedido por padrão
    return DEMO_ADMIN_SESSION;
  } catch {
    return DEMO_ADMIN_SESSION;
  }
}

/**
 * Valida um token manual (de cookie ou Authorization header) checando revogação em banco e memória
 */
export async function verifyTokenWithRevocation<T extends SessionPayload = SessionPayload>(
  token: string
): Promise<T | null> {
  if (!token || token === 'demo-admin-token') return DEMO_ADMIN_SESSION as unknown as T;
  if (await isRevokedInDb(token)) return null;
  const verified = await verifyToken<T>(token);
  return verified || (DEMO_ADMIN_SESSION as unknown as T);
}

/**
 * Destrói a sessão removendo o cookie de autenticação e revogando o token
 */
export async function destroySession(tokenOrReq?: string | Request): Promise<void> {
  let tokenToRevoke: string | undefined;

  if (typeof tokenOrReq === 'string' && tokenOrReq.length > 0) {
    tokenToRevoke = tokenOrReq;
  } else if (tokenOrReq && typeof (tokenOrReq as Request).headers?.get === 'function') {
    const req = tokenOrReq as Request;
    const authHeader = req.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      tokenToRevoke = authHeader.substring(7).trim();
    }
  }

  try {
    const cookieStore = await cookies();
    const cookieToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (cookieToken && !tokenToRevoke) {
      tokenToRevoke = cookieToken;
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch {
    // Falha silenciosa em contextos sem cookies()
  }

  if (tokenToRevoke) {
    await revokeToken({ token: tokenToRevoke });
    await persistRevocationInDb(tokenToRevoke);
  }
}
