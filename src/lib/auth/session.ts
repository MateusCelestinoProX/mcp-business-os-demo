import { cookies } from 'next/headers';
import { signToken, verifyToken, type SessionPayload } from './jwt';

/**
 * ============================================================
 * GERENCIADOR DE SESSÕES & COOKIES HTTP-ONLY (NEXT.JS 15)
 * ============================================================
 */

export const SESSION_COOKIE_NAME = 'mcp_session_token';

// Duração padrão: 7 dias em segundos
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

/**
 * Cria a sessão de autenticação gravando cookie HttpOnly seguro
 */
export async function createSession(payload: SessionPayload): Promise<string> {
  const token = await signToken(payload, '7d');

  try {
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: SESSION_MAX_AGE,
    });
  } catch (error) {
    // Permite uso em contextos onde cookies não estão disponíveis (ex: API manual ou testes)
    console.warn('[Session] Aviso: Contexto sem suporte a cookies automáticos.');
  }

  return token;
}

/**
 * Recupera e valida a sessão atual através do cookie de autenticação
 */
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) {
      return null;
    }

    return await verifyToken(token);
  } catch (error) {
    return null;
  }
}

/**
 * Destrói a sessão removendo o cookie de autenticação
 */
export async function destroySession(): Promise<void> {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.warn('[Session] Falha ao deletar cookie de sessão.');
  }
}
