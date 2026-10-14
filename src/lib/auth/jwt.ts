import { SignJWT, jwtVerify, type JWTPayload } from 'jose';

/**
 * ============================================================
 * AUTENTICAÇÃO JWT EDGE-COMPATIBLE COM JOSE
 * ============================================================
 */

const JWT_SECRET_STRING =
  process.env.JWT_SECRET ||
  'mcp-plataforma-unificada-soberana-secret-key-2026-super-secure';

const JWT_SECRET = new TextEncoder().encode(JWT_SECRET_STRING);

export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'editor' | 'member';
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
    .sign(JWT_SECRET);
}

/**
 * Verifica e decodifica um token JWT
 * Retorna o payload se válido ou null se inválido/expirado
 */
export async function verifyToken<T extends SessionPayload = SessionPayload>(
  token: string
): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as T;
  } catch (error) {
    return null;
  }
}
