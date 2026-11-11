import net from 'node:net';

/**
 * ============================================================
 * EXTRAÇÃO CONFIÁVEL DO IP DE ORIGEM DA REQUISIÇÃO
 * ============================================================
 * Prioriza cabeçalhos definidos e sobrescritos pela borda (Vercel/Cloudflare)
 * evitando bypass de rate limit por spoofing simples de x-forwarded-for.
 */

function normalizeValidIp(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const candidate = raw.trim().slice(0, 64);
  if (!candidate) return null;

  // Remove eventual porta em IPv4 (ex: 1.2.3.4:12345)
  const withoutPort = candidate.replace(/^(\d{1,3}(?:\.\d{1,3}){3}):\d+$/, '$1');
  if (net.isIP(withoutPort) !== 0) {
    return withoutPort;
  }
  return null;
}

export function getClientIp(req: Request): string {
  // 1. Cabeçalho autoritativo da plataforma Vercel Edge
  const vercelIp = normalizeValidIp(req.headers.get('x-vercel-forwarded-for')?.split(',')[0]);
  if (vercelIp) return vercelIp;

  // 2. Cloudflare Connecting IP
  const cfIp = normalizeValidIp(req.headers.get('cf-connecting-ip'));
  if (cfIp) return cfIp;

  // 3. X-Real-IP
  const realIp = normalizeValidIp(req.headers.get('x-real-ip'));
  if (realIp) return realIp;

  // 4. Fallback em X-Forwarded-For (usa o último salto confiável antes do proxy local se houver vários, ou único válido)
  const xff = req.headers.get('x-forwarded-for');
  if (xff) {
    const hops = xff.split(',').map((s) => s.trim()).filter(Boolean);
    for (let i = hops.length - 1; i >= 0; i--) {
      const valid = normalizeValidIp(hops[i]);
      if (valid) return valid;
    }
  }

  return 'unknown';
}
