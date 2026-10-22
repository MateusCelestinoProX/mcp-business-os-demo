import { drizzle as drizzleNeon } from 'drizzle-orm/neon-http';
import { drizzle as drizzlePg } from 'drizzle-orm/node-postgres';
import { neon, NeonQueryFunction } from '@neondatabase/serverless';
import { Pool } from 'pg';
import * as schema from './schema';

/**
 * ============================================================
 * CONEXÃO DRIZZLE ORM UNIVERSAL — POSTGRESQL & NEON SERVERLESS
 * ============================================================
 * Suporta:
 * 1. Neon Serverless Postgres (@neondatabase/serverless)
 * 2. PostgreSQL Padrão / Supabase / Localhost (pg Pool)
 * 3. Fallback Gracioso Offline para Next.js 15 Static Build
 */

const connectionString = (
  process.env.DATABASE_URL ||
  process.env.POSTGRES_URL ||
  process.env.SUPABASE_DATABASE_URL ||
  ''
).trim();

export const isDbConfigured: boolean = Boolean(
  connectionString &&
  !connectionString.includes('YOUR_PASSWORD') &&
  !connectionString.includes('placeholder') &&
  !connectionString.includes('ep-sample-pooler')
);

// Cache de instâncias no escopo global para evitar múltiplas conexões em hot-reload
declare global {
  // eslint-disable-next-line no-var
  var __mcp_drizzle_instance: any | undefined;
  // eslint-disable-next-line no-var
  var __mcp_pg_pool: Pool | undefined;
}

function createDrizzleClient() {
  if (!isDbConfigured || !connectionString) {
    // Modo de Resiliência Offline (Safe Mock Proxy para Next.js 15 static generation)
    // Permite que npm run build avalie as rotas de servidor sem explodir exceções
    return new Proxy(
      {},
      {
        get(_target, prop) {
          if (prop === 'query') {
            return new Proxy(
              {},
              {
                get(_t, _table) {
                  return {
                    findFirst: async () => null,
                    findMany: async () => [],
                  };
                },
              }
            );
          }
          if (prop === 'select') {
            return () => ({
              from: () => ({
                where: () => ({
                  limit: async () => [],
                  execute: async () => [],
                }),
                orderBy: () => ({
                  limit: async () => [],
                  execute: async () => [],
                }),
                limit: async () => [],
                execute: async () => [],
              }),
            });
          }
          if (prop === 'insert' || prop === 'update' || prop === 'delete') {
            return () => ({
              values: () => ({
                returning: async () => [],
                execute: async () => ({ rowCount: 0 }),
              }),
              set: () => ({
                where: () => ({
                  returning: async () => [],
                  execute: async () => ({ rowCount: 0 }),
                }),
              }),
              where: () => ({
                execute: async () => ({ rowCount: 0 }),
              }),
            });
          }
          return () => Promise.resolve([]);
        },
      }
    ) as ReturnType<typeof drizzleNeon<typeof schema>>;
  }

  // Detecta se é Neon Postgres (específico da nuvem Neon)
  const isNeon =
    (connectionString.includes('neon.tech') || process.env.DB_PROVIDER === 'neon') &&
    !connectionString.includes('supabase.co');

  if (isNeon) {
    const sql: NeonQueryFunction<boolean, boolean> = neon(connectionString);
    return drizzleNeon(sql, { schema });
  }

  // PostgreSQL nativo / Supabase / Localhost
  if (!globalThis.__mcp_pg_pool) {
    const isSupabaseOrSsl =
      connectionString.includes('supabase.co') ||
      connectionString.includes('sslmode=require');

    const cleanConnStr = connectionString
      .replace(/[?&]sslmode=[^&]+/g, '')
      .replace(/\?$/, '');

    const allowInsecureSsl = process.env.PG_SSL_ALLOW_INSECURE === 'true';
    const sslConfig = isSupabaseOrSsl
      ? {
          rejectUnauthorized: !allowInsecureSsl,
          ...(process.env.PG_CA_CERT ? { ca: process.env.PG_CA_CERT } : {}),
        }
      : undefined;

    globalThis.__mcp_pg_pool = new Pool({
      connectionString: cleanConnStr,
      ssl: sslConfig,
      max: process.env.NODE_ENV === 'production' ? 10 : 3,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });
  }

  return drizzlePg(globalThis.__mcp_pg_pool, { schema });
}

export const db =
  globalThis.__mcp_drizzle_instance ||
  (globalThis.__mcp_drizzle_instance = createDrizzleClient());

export function getDb() {
  return db;
}

/**
 * Status de Saúde do Banco de Dados
 */
export async function checkDatabaseHealth() {
  if (!isDbConfigured || !connectionString) {
    return {
      connected: false,
      mode: 'offline-resilience' as const,
      message: 'DATABASE_URL não configurada. Operando em modo de resiliência offline segura.',
      provider: 'offline-mock',
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const startTime = Date.now();
    if (connectionString.includes('neon.tech') || process.env.DB_PROVIDER === 'neon') {
      const sql = neon(connectionString);
      const res = await sql`SELECT 1 as alive, current_database() as db_name, version() as version;`;
      const latency = Date.now() - startTime;
      return {
        connected: true,
        mode: 'neon-serverless' as const,
        provider: 'Neon Postgres',
        database: res[0]?.db_name || 'neondb',
        latencyMs: latency,
        message: 'Conexão ativa e saudável com Neon Serverless Postgres.',
        timestamp: new Date().toISOString(),
      };
    } else {
      const isSupabase = connectionString.includes('supabase.co');
      const cleanConnStr = connectionString
        .replace(/[?&]sslmode=[^&]+/g, '')
        .replace(/\?$/, '');
      const pool =
        globalThis.__mcp_pg_pool ||
        new Pool({
          connectionString: cleanConnStr,
          ssl: isSupabase || connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : undefined,
        });
      const client = await pool.connect();
      try {
        const res = await client.query('SELECT 1 as alive, current_database() as db_name, version() as version;');
        const latency = Date.now() - startTime;
        return {
          connected: true,
          mode: 'postgres-native' as const,
          provider: isSupabase ? 'Supabase PostgreSQL (sa-east-1)' : 'PostgreSQL Pool',
          database: res.rows[0]?.db_name || 'postgres',
          latencyMs: latency,
          message: isSupabase
            ? 'Conexão ativa e saudável com Supabase PostgreSQL.'
            : 'Conexão ativa e saudável com PostgreSQL nativo.',
          timestamp: new Date().toISOString(),
        };
      } finally {
        client.release();
      }
    }
  } catch (error: any) {
    return {
      connected: false,
      mode: 'degraded-error' as const,
      provider: 'unknown',
      error: error?.message || 'Erro de conexão com o banco de dados',
      timestamp: new Date().toISOString(),
    };
  }
}

// Alias para retrocompatibilidade
export const checkDbStatus = checkDatabaseHealth;

export * from './schema';
