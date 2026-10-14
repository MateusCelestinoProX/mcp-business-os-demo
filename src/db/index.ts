import * as schema from './schema';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { drizzle as drizzleNeonHttp } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

// Export all schema definitions and types for unified access
export * from './schema';

/**
 * Interface de Status de Conexão do Banco de Dados Soberano
 */
export interface DbStatus {
  connected: boolean;
  mode: 'neon-serverless' | 'node-postgres' | 'local-fallback';
  message: string;
  database?: string;
  latencyMs?: number;
}

let cachedDb: any = null;
let cachedPool: Pool | null = null;

/**
 * Avalia a URL de conexão e descobre o driver ideal
 */
function getConnectionString(): string | null {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.SUPABASE_DATABASE_URL;
  if (!url || url.includes('YOUR_PASSWORD') || url.includes('ep-sample-pooler')) {
    return null;
  }
  return url;
}

/**
 * Cria ou recupera a instância do cliente Drizzle ORM sobre PostgreSQL Universal
 */
export function getDb() {
  if (cachedDb) return cachedDb;

  const connectionString = getConnectionString();

  if (!connectionString) {
    // Modo Fallback Seguro para Localhost sem Banco Remoto
    return createFallbackProxy();
  }

  try {
    const isNeon = connectionString.includes('neon.tech') || connectionString.includes('sslmode=require');

    if (isNeon) {
      const sql: NeonQueryFunction<boolean, boolean> = neon(connectionString);
      cachedDb = drizzleNeonHttp(sql, { schema });
      return cachedDb;
    } else {
      if (!cachedPool) {
        cachedPool = new Pool({
          connectionString,
          max: 10,
          idleTimeoutMillis: 30000,
        });
      }
      cachedDb = drizzlePg(cachedPool, { schema });
      return cachedDb;
    }
  } catch (error) {
    console.warn('[DB] Falha ao inicializar driver PostgreSQL universal, usando proxy de resiliência:', error);
    return createFallbackProxy();
  }
}

/**
 * Proxy de Resiliência para execução segura em localhost quando DATABASE_URL não estiver ativa
 */
function createFallbackProxy() {
  return new Proxy({}, {
    get(_target, prop) {
      if (prop === 'query' || prop === 'select' || prop === 'insert' || prop === 'update' || prop === 'delete') {
        return () => {
          console.warn(`[DB-PROXY] Operação ${String(prop)} invocada em modo fallback local (DATABASE_URL não configurada ou inacessível).`);
          return {
            from: () => ({
              where: () => Promise.resolve([]),
              orderBy: () => Promise.resolve([]),
              limit: () => Promise.resolve([]),
              then: (resolve: any) => resolve([]),
            }),
            values: () => ({
              returning: () => Promise.resolve([{ id: Date.now() }]),
              then: (resolve: any) => resolve([{ id: Date.now() }]),
            }),
            set: () => ({
              where: () => Promise.resolve([{ id: 1 }]),
              then: (resolve: any) => resolve([{ id: 1 }]),
            }),
            where: () => Promise.resolve([]),
            then: (resolve: any) => resolve([]),
          };
        };
      }
      return undefined;
    }
  });
}

/**
 * Instância exportada padrão do banco de dados Drizzle
 */
export const db = getDb();

/**
 * Verifica a saúde e a latência da conexão com o PostgreSQL
 */
export async function checkDbStatus(): Promise<DbStatus> {
  const connectionString = getConnectionString();

  if (!connectionString) {
    return {
      connected: false,
      mode: 'local-fallback',
      message: 'DATABASE_URL não configurada ou usando placeholder. Rodando em modo de emulação local segura.',
    };
  }

  const start = Date.now();
  try {
    const isNeon = connectionString.includes('neon.tech') || connectionString.includes('sslmode=require');
    if (isNeon) {
      const sql = neon(connectionString);
      const res = await sql`SELECT 1 as alive, current_database() as db_name, version() as version;`;
      return {
        connected: true,
        mode: 'neon-serverless',
        latencyMs: Date.now() - start,
        database: res[0]?.db_name || 'neondb',
        message: 'Conexão ativa e saudável com Neon Serverless Postgres.',
      };
    } else {
      if (!cachedPool) {
        cachedPool = new Pool({ connectionString });
      }
      const client = await cachedPool.connect();
      try {
        const res = await client.query('SELECT 1 as alive, current_database() as db_name;');
        return {
          connected: true,
          mode: 'node-postgres',
          latencyMs: Date.now() - start,
          database: res.rows[0]?.db_name || 'postgres',
          message: 'Conexão ativa e saudável com PostgreSQL padrão (pg driver).',
        };
      } finally {
        client.release();
      }
    }
  } catch (err: any) {
    return {
      connected: false,
      mode: 'local-fallback',
      message: `Erro ao conectar ao PostgreSQL: ${err?.message || String(err)}`,
    };
  }
}
