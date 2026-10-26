import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';
import type { JWTPayload } from 'jose';

/**
 * ============================================================
 * AUTENTICAÇÃO JWT EDGE-COMPATIBLE COM JOSE
 * ============================================================
 */

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET não configurado nas variáveis de ambiente!');
    }
    return new TextEncoder().encode('mcp-soberana-dev-secret-minimum-64-characters-random-key-2026-prod-guard');
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'moder' | 'moderator' | 'editor' | 'member';
  tier?: 'free' | 'pro' | 'vip';
}

/**
 * Assina e gera um JWT assinado com algoritmo HS256
 */
export async function signToken(
  payload: SessionPayload,
  expiresIn: string = '7d'
): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
}

/**
 * Verifica e decodifica um token JWT
 * Retorna o payload se válido ou null se inválido/expirado
 */
export async function verifyToken<T extends SessionPayload = SessionPayload>(
  token: string
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return payload as unknown as T;
  } catch (error) {
    return null;
  }
}
