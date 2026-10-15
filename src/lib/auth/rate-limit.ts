/**
 * Rate Limiter em memória para proteção contra brute-force em endpoints de autenticação
 * Compatível com Next.js Serverless & Node.js Runtime
 */

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const attemptsMap = new Map<string, RateLimitRecord>();

// Limpeza periódica de entradas expiradas a cada 5 minutos
if (typeof setInterval !== 'undefined') {
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of attemptsMap.entries()) {
      if (record.resetAt <= now) {
        attemptsMap.delete(key);
      }
    }
  }, 5 * 60 * 1000);
  if (timer.unref) {
    timer.unref();
  }
}

/**
 * Verifica e incrementa contador de requisições por chave (IP ou e-mail)
 * @param key Identificador único (ex: IP ou email)
 * @param maxAttempts Limite de tentativas permitidas na janela
 * @param windowMs Duração da janela em milissegundos (padrão: 15 minutos)
 * @returns { allowed: boolean, remaining: number, resetInSeconds: number }
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 10,
  windowMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const record = attemptsMap.get(key);

  if (!record || record.resetAt <= now) {
    attemptsMap.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  if (record.count >= maxAttempts) {
    return {
      allowed: false,
      remaining: 0,
      resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
    };
  }

  record.count += 1;
  return {
    allowed: true,
    remaining: maxAttempts - record.count,
    resetInSeconds: Math.ceil((record.resetAt - now) / 1000),
  };
}

/**
 * Limpa histórico para login bem-sucedido
 */
export function resetRateLimit(key: string): void {
  attemptsMap.delete(key);
}
