import dns from 'node:dns/promises';
import net from 'node:net';

/**
 * ============================================================
 * GUARDIÃO CONTRA SSRF, ORIGEM NÃO CONFIÁVEL E HOST SPOOFING
 * ============================================================
 */

function ipv4ToInt(ip: string): number | null {
  const parts = ip.split('.');
  if (parts.length !== 4) return null;
  let num = 0;
  for (const part of parts) {
    if (!/^\d+$/.test(part)) return null;
    const octet = Number(part);
    if (octet < 0 || octet > 255) return null;
    num = (num << 8) + octet;
  }
  return num >>> 0;
}

export function isPrivateOrReservedIp(ip: string): boolean {
  if (!ip || typeof ip !== 'string') return true;
  let clean = ip.trim().replace(/^\[|\]$/g, '');
  const zoneIdx = clean.indexOf('%');
  if (zoneIdx !== -1) clean = clean.slice(0, zoneIdx);

  const kind = net.isIP(clean);
  if (kind === 4) {
    const val = ipv4ToInt(clean);
    if (val === null) return true;

    const first = (val >>> 24) & 0xff;
    const second = (val >>> 16) & 0xff;

    if (first === 0) return true; // 0.0.0.0/8
    if (first === 10) return true; // 10.0.0.0/8
    if (first === 127) return true; // 127.0.0.0/8 loopback
    if (first === 169 && second === 254) return true; // 169.254.0.0/16 cloud metadata/link-local
    if (first === 172 && second >= 16 && second <= 31) return true; // 172.16.0.0/12
    if (first === 192 && second === 168) return true; // 192.168.0.0/16
    if (first === 100 && second >= 64 && second <= 127) return true; // 100.64.0.0/10 CGNAT / Tailscale
    if (first === 192 && second === 0 && (((val >>> 8) & 0xff) === 0 || ((val >>> 8) & 0xff) === 2)) return true;
    if (first === 198 && (second === 18 || second === 19)) return true; // benchmarking
    if (first >= 224) return true; // multicast + reserved
    return false;
  }

  if (kind === 6) {
    const lower = clean.toLowerCase();
    if (lower === '::' || lower === '::1') return true;
    if (lower.startsWith('::ffff:')) {
      const mappedV4 = lower.slice(7);
      if (net.isIP(mappedV4) === 4) return isPrivateOrReservedIp(mappedV4);
      // hex-encoded mapped IPv4 (::ffff:7f00:1)
      return true;
    }
    if (lower.startsWith('fe8') || lower.startsWith('fe9') || lower.startsWith('fea') || lower.startsWith('feb')) {
      return true; // fe80::/10 link-local
    }
    if (lower.startsWith('fc') || lower.startsWith('fd')) {
      return true; // fc00::/7 ULA
    }
    if (lower.startsWith('ff')) {
      return true; // multicast
    }
    return false;
  }

  return true;
}

const BLOCKED_HOSTNAMES = new Set([
  'localhost',
  'localhost.localdomain',
  'metadata.google.internal',
  'metadata',
  'instance-data',
]);

export function isBlockedHostname(hostname: string): boolean {
  const lower = hostname.trim().toLowerCase().replace(/\.$/, '');
  if (!lower) return true;
  if (BLOCKED_HOSTNAMES.has(lower)) return true;
  if (
    lower.endsWith('.local') ||
    lower.endsWith('.localhost') ||
    lower.endsWith('.internal') ||
    lower.endsWith('.localdomain') ||
    lower.endsWith('.home.arpa')
  ) {
    return true;
  }
  if (!lower.includes('.') && net.isIP(lower) === 0) return true;
  return false;
}

/**
 * Valida URL externa com proteção anti-SSRF (esquema, IP literal e resolução DNS).
 */
export async function assertSafeExternalUrl(
  rawUrl: string,
  options: { allowHttpInDev?: boolean; skipDnsInTests?: boolean } = {}
): Promise<URL> {
  let parsed: URL;
  try {
    parsed = new URL(rawUrl.trim());
  } catch {
    throw new Error('URL externa malformada.');
  }

  const allowHttp = Boolean(options.allowHttpInDev && process.env.NODE_ENV !== 'production');
  if (parsed.protocol !== 'https:' && !(allowHttp && parsed.protocol === 'http:')) {
    throw new Error('Protocolo não permitido para acesso externo (apenas HTTPS).');
  }

  if (parsed.username || parsed.password) {
    throw new Error('Credenciais embutidas na URL não são permitidas.');
  }

  const hostname = parsed.hostname.replace(/^\[|\]$/g, '');
  if (isBlockedHostname(hostname)) {
    throw new Error('Destino de rede interna ou restrita bloqueado.');
  }

  if (net.isIP(hostname) !== 0) {
    if (isPrivateOrReservedIp(hostname)) {
      throw new Error('Acesso a faixa de IP privada ou reservada bloqueado.');
    }
    return parsed;
  }

  if (options.skipDnsInTests) {
    return parsed;
  }

  let resolved: Array<{ address: string; family: number }>;
  try {
    resolved = await dns.lookup(hostname, { all: true, verbatim: true });
  } catch {
    throw new Error('Não foi possível resolver o domínio externo com segurança.');
  }

  if (!resolved || resolved.length === 0) {
    throw new Error('Resolução DNS vazia para domínio externo.');
  }

  for (const entry of resolved) {
    if (isPrivateOrReservedIp(entry.address)) {
      throw new Error('Domínio resolveu para endereço IP interno ou reservado (bloqueio anti-SSRF).');
    }
  }

  return parsed;
}

/**
 * Retorna a lista estrita de origens confiáveis para CORS e verificação anti-CSRF.
 */
export function getTrustedOrigins(): Set<string> {
  const origins = new Set<string>([
    'https://mcp-business-os-demo.vercel.app',
  ]);

  const envUrls = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];

  for (const candidate of envUrls) {
    if (!candidate) continue;
    try {
      const normalized = candidate.startsWith('http') ? candidate : `https://${candidate}`;
      const u = new URL(normalized);
      origins.add(u.origin);
    } catch {
      // ignora URL inválida de env
    }
  }

  if (process.env.NODE_ENV !== 'production') {
    origins.add('http://localhost:3000');
    origins.add('http://127.0.0.1:3000');
  }

  return origins;
}

/**
 * Comparação estrita de origem (hostname + protocolo + porta) sem substring bypass (.includes).
 */
export function isTrustedOrigin(originHeader: string | null): boolean {
  if (!originHeader || typeof originHeader !== 'string') return false;
  try {
    const parsed = new URL(originHeader.trim());
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') return false;

    const trusted = getTrustedOrigins();
    if (trusted.has(parsed.origin)) return true;

    // Permite previews oficiais do projeto e subdomínios vercel.app da demo em HTTPS
    if (
      parsed.protocol === 'https:' &&
      (/^mcp-business(?:-[a-z0-9-]+)?\.vercel\.app$/i.test(parsed.hostname) ||
        parsed.hostname.endsWith('-mcp-team.vercel.app'))
    ) {
      return true;
    }

    return false;
  } catch {
    return false;
  }
}

/**
 * Resolve a URL base confiável da aplicação sem confiar no cabeçalho Host em produção.
 */
export function getTrustedSiteUrl(req?: Request): string {
  const candidates = [
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.NEXT_PUBLIC_SITE_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
  ];

  for (const raw of candidates) {
    if (!raw) continue;
    try {
      const normalized = raw.startsWith('http') ? raw : `https://${raw}`;
      const u = new URL(normalized);
      if (u.protocol === 'https:' || (process.env.NODE_ENV !== 'production' && u.protocol === 'http:')) {
        return u.origin;
      }
    } catch {
      // ignora entrada inválida
    }
  }

  if (process.env.NODE_ENV !== 'production' && req) {
    try {
      const reqUrl = new URL(req.url);
      if (reqUrl.hostname === 'localhost' || reqUrl.hostname === '127.0.0.1') {
        return reqUrl.origin;
      }
    } catch {
      // fallback
    }
    return 'http://localhost:3000';
  }

  return 'https://mcp-business-os-demo.vercel.app';
}
