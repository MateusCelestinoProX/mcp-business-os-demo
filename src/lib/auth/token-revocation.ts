/**
 * ============================================================
 * REGISTRO DE REVOGAÇÃO REAL DE SESSÕES E TOKENS JWT (EDGE-SAFE)
 * ============================================================
 * Compatível com Edge Runtime (src/middleware.ts) e Node.js.
 * Sem dependências `node:*` para manter compatibilidade Edge 100%.
 */

interface RevocationEntry {
  expiresAtMs: number;
}

const MAX_REVOKED_ENTRIES = 10_000;
const DEFAULT_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const revokedJtis = new Map<string, RevocationEntry>();
const revokedTokenHashes = new Map<string, RevocationEntry>();

function pruneMap(map: Map<string, RevocationEntry>, now: number) {
  for (const [key, entry] of map.entries()) {
    if (entry.expiresAtMs <= now) {
      map.delete(key);
    }
  }
  if (map.size > MAX_REVOKED_ENTRIES) {
    const excess = map.size - MAX_REVOKED_ENTRIES;
    let deleted = 0;
    for (const key of map.keys()) {
      map.delete(key);
      deleted++;
      if (deleted >= excess) break;
    }
  }
}

async function sha256HexEdgeSafe(value: string): Promise<string> {
  if (globalThis.crypto?.subtle) {
    const bytes = new TextEncoder().encode(value);
    const digest = await globalThis.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  return value.slice(-48);
}

export async function revokeToken(params: {
  jti?: string;
  token?: string;
  expUnixSeconds?: number;
}): Promise<void> {
  const now = Date.now();
  const expiresAtMs =
    typeof params.expUnixSeconds === 'number' && params.expUnixSeconds > 0
      ? Math.max(now + 60_000, params.expUnixSeconds * 1000)
      : now + DEFAULT_TTL_MS;

  if (params.jti && typeof params.jti === 'string') {
    pruneMap(revokedJtis, now);
    revokedJtis.set(params.jti, { expiresAtMs });
  }

  if (params.token && typeof params.token === 'string') {
    pruneMap(revokedTokenHashes, now);
    const digest = await sha256HexEdgeSafe(params.token);
    revokedTokenHashes.set(digest, { expiresAtMs });
  }
}

export async function isTokenRevoked(params: {
  jti?: string;
  token?: string;
}): Promise<boolean> {
  const now = Date.now();

  if (params.jti) {
    const entry = revokedJtis.get(params.jti);
    if (entry) {
      if (entry.expiresAtMs > now) return true;
      revokedJtis.delete(params.jti);
    }
  }

  if (params.token) {
    const digest = await sha256HexEdgeSafe(params.token);
    const entry = revokedTokenHashes.get(digest);
    if (entry) {
      if (entry.expiresAtMs > now) return true;
      revokedTokenHashes.delete(digest);
    }
  }

  return false;
}
