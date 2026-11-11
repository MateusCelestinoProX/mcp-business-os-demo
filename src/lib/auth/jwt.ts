import { SignJWT } from 'jose/jwt/sign';
import { jwtVerify } from 'jose/jwt/verify';
import type { JWTPayload } from 'jose';
import { isTokenRevoked } from './token-revocation';

/**
 * ============================================================
 * AUTENTICAÇÃO JWT EDGE-COMPATIBLE COM JOSE (HS256 ESTRITO)
 * ============================================================
 * 100% compatível com Edge Runtime (src/middleware.ts) e Node.js.
 * Zero dependências `node:*` para preservar compatibilidade Edge.
 */

export const JWT_ISSUER = 'mcp-business-os';
export const JWT_AUDIENCE = 'mcp-platform';
const DEV_FALLBACK_SECRET = 'mcp-business-os-demo-public-showcase-jwt-secret-key-2026-hmac-sha256';

function getJwtSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return new TextEncoder().encode(DEV_FALLBACK_SECRET);
  }
  return new TextEncoder().encode(secret);
}

export interface SessionPayload extends JWTPayload {
  userId: string;
  email: string;
  name: string;
  role: 'admin' | 'moder' | 'moderator' | 'editor' | 'member';
  tier?: 'free' | 'pro' | 'vip' | 'max';
}

/**
 * Assina e gera um JWT assinado com algoritmo HS256, jti único, issuer e audience.
 */
export async function signToken(
  payload: SessionPayload,
  expiresIn: string = '7d'
): Promise<string> {
  const jti =
    typeof payload.jti === 'string' && payload.jti.length > 0
      ? payload.jti
      : globalThis.crypto?.randomUUID?.() ||
        `${Date.now()}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;

  return await new SignJWT({ ...payload, jti })
    .setProtectedHeader({ alg: 'HS256', typ: 'JWT' })
    .setIssuer(JWT_ISSUER)
    .setAudience(JWT_AUDIENCE)
    .setJti(jti)
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(getJwtSecret());
}

/**
 * Validação rigorosa e decodificação do token JWT:
 * - Algoritmo restrito a HS256 (rejeita 'none' e algoritmos assimétricos não previstos)
 * - Verificação de revogação de token (via jti e hash do token)
 * - Validação de claims essenciais (userId, email, role)
 */
export async function verifyToken<T extends SessionPayload = SessionPayload>(
  token: string
): Promise<T | null> {
  if (!token || typeof token !== 'string') return null;

  // Sanitização estrutural do formato JWT (3 partes base64url)
  const parts = token.trim().split('.');
  if (parts.length !== 3) return null;

  try {
    const { payload, protectedHeader } = await jwtVerify(token.trim(), getJwtSecret(), {
      algorithms: ['HS256'],
    });

    if (!protectedHeader || protectedHeader.alg !== 'HS256') {
      return null;
    }

    // Se o token especificar issuer ou audience, validar correspondência estrita
    if (payload.iss && payload.iss !== JWT_ISSUER) {
      return null;
    }
    if (payload.aud) {
      const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
      if (!auds.includes(JWT_AUDIENCE)) {
        return null;
      }
    }

    const typed = payload as unknown as T;

    if (!typed.userId || !typed.email || !typed.role) {
      return null;
    }

    // Checa blacklist de revogação em memória/Edge
    if (await isTokenRevoked({ jti: typed.jti, token })) {
      return null;
    }

    return typed;
  } catch {
    return null;
  }
}
