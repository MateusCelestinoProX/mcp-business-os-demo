/**
 * =========================================================================
 * MOTOR SOBERANO DE CACHE EM MEMÓRIA (IN-MEMORY LRU & TTL MICRO-CACHE)
 * =========================================================================
 * Plataforma Unificada Soberana — Mateus Celestino Pro X
 *
 * Inspirado nos melhores plugins de cache WordPress (Redis Object Cache,
 * LiteSpeed LSCache, WP Rocket), adaptado para Next.js 15 Server Runtime.
 *
 * Características:
 * 1. Respostas em submilisegundos (< 1ms) para consultas repetidas
 * 2. TTL (Time To Live) configurável por chave/recurso
 * 3. Limite de capacidade com política LRU (Least Recently Used)
 * 4. Invalidação seletiva por padrão/prefixo (ex: purge em updates do admin)
 * 5. Telemetria de hits, misses e taxa de acerto (Hit Ratio)
 * 6. Preservação em globalThis para evitar reset em hot-reload
 * =========================================================================
 */

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  createdAt: number;
  accessCount: number;
  lastAccessed: number;
  sequence: number;
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRatio: number;
  evictions: number;
  uptimeSeconds: number;
}

export class MemoryCache {
  private store: Map<string, CacheEntry<any>> = new Map();
  private maxSize: number;
  private defaultTtlMs: number;
  private hits: number = 0;
  private misses: number = 0;
  private evictions: number = 0;
  private startTime: number = Date.now();
  private accessSequence: number = 0;

  constructor(options: { maxSize?: number; defaultTtlSeconds?: number } = {}) {
    this.maxSize = options.maxSize || 1000;
    this.defaultTtlMs = (options.defaultTtlSeconds || 300) * 1000; // 5 minutos default
  }

  /**
   * Obtém um item do cache se válido e não expirado
   */
  public get<T>(key: string): T | null {
    const entry = this.store.get(key);
    if (!entry) {
      this.misses++;
      return null;
    }

    const now = Date.now();
    if (entry.expiresAt <= now) {
      this.store.delete(key);
      this.misses++;
      return null;
    }

    // Atualiza metadados LRU determinísticos
    entry.accessCount++;
    entry.lastAccessed = now;
    entry.sequence = ++this.accessSequence;
    this.hits++;
    return entry.value as T;
  }

  /**
   * Armazena um item com TTL customizado ou default
   */
  public set<T>(key: string, value: T, ttlSeconds?: number): void {
    const now = Date.now();
    const ttlMs = ttlSeconds !== undefined ? ttlSeconds * 1000 : this.defaultTtlMs;

    // Evicção LRU se atingir o tamanho máximo
    if (this.store.size >= this.maxSize && !this.store.has(key)) {
      this.evictLeastRecentlyUsed();
    }

    this.store.set(key, {
      value,
      expiresAt: now + ttlMs,
      createdAt: now,
      accessCount: 1,
      lastAccessed: now,
      sequence: ++this.accessSequence,
    });
  }

  /**
   * Obtém item existente ou executa a função geradora, armazenando o resultado
   */
  public async getOrSet<T>(
    key: string,
    fetcher: () => Promise<T>,
    ttlSeconds?: number
  ): Promise<{ data: T; source: 'memory_cache' | 'fresh_fetch' }> {
    const cached = this.get<T>(key);
    if (cached !== null) {
      return { data: cached, source: 'memory_cache' };
    }

    const fresh = await fetcher();
    this.set(key, fresh, ttlSeconds);
    return { data: fresh, source: 'fresh_fetch' };
  }

  /**
   * Remove uma chave específica
   */
  public delete(key: string): boolean {
    return this.store.delete(key);
  }

  /**
   * Invalida chaves que correspondam a um prefixo ou expressão regular
   * (Equivalente ao purge seletivo de plugins como WP Rocket)
   */
  public invalidatePattern(pattern: string | RegExp): number {
    let deletedCount = 0;
    const isRegExp = pattern instanceof RegExp;

    for (const key of Array.from(this.store.keys())) {
      const match = isRegExp ? (pattern as RegExp).test(key) : key.startsWith(pattern as string);
      if (match) {
        this.store.delete(key);
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * Limpa integralmente todo o cache em memória
   */
  public clear(): void {
    this.store.clear();
  }

  /**
   * Retorna estatísticas completas de saúde e performance do cache
   */
  public getStats(): CacheStats {
    const total = this.hits + this.misses;
    const hitRatio = total > 0 ? Number((this.hits / total).toFixed(4)) : 0;

    return {
      size: this.store.size,
      maxSize: this.maxSize,
      hits: this.hits,
      misses: this.misses,
      hitRatio,
      evictions: this.evictions,
      uptimeSeconds: Math.floor((Date.now() - this.startTime) / 1000),
    };
  }

  /**
   * Evicção de item mais antigo / menos recentemente utilizado
   */
  private evictLeastRecentlyUsed(): void {
    let oldestKey: string | null = null;
    let oldestSequence = Infinity;

    for (const [key, entry] of this.store.entries()) {
      if (entry.sequence < oldestSequence) {
        oldestSequence = entry.sequence;
        oldestKey = key;
      }
    }

    if (oldestKey) {
      this.store.delete(oldestKey);
      this.evictions++;
    }
  }
}

// Instância singleton global tolerante a HMR
const globalForCache = globalThis as unknown as {
  __mcp_memory_cache__: MemoryCache | undefined;
};

export const memoryCache =
  globalForCache.__mcp_memory_cache__ ??
  new MemoryCache({
    maxSize: 2000,
    defaultTtlSeconds: 300, // 5 minutos default
  });

if (process.env.NODE_ENV !== 'production') {
  globalForCache.__mcp_memory_cache__ = memoryCache;
}

export default memoryCache;
