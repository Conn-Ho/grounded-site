import { Pool, type PoolConfig } from "pg";

/**
 * Singleton pg pool. When DATABASE_URL is missing, pool is null and
 * the API handler falls back to stdout-only mode (useful in local dev
 * before GCP is provisioned).
 */

declare global {
  // eslint-disable-next-line no-var
  var __pgPool: Pool | null | undefined;
}

function buildConfig(): PoolConfig | null {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const config: PoolConfig = {
    connectionString: url,
    max: 5,
    idleTimeoutMillis: 30_000,
  };
  // Cloud SQL via Unix socket: connectionString is fine.
  // Cloud SQL via public IP: expect ?sslmode=require appended by caller.
  return config;
}

export function getPool(): Pool | null {
  if (global.__pgPool !== undefined) return global.__pgPool;
  const config = buildConfig();
  global.__pgPool = config ? new Pool(config) : null;
  return global.__pgPool;
}

export async function query<T extends Record<string, unknown>>(
  text: string,
  params?: unknown[]
): Promise<T[]> {
  const pool = getPool();
  if (!pool) throw new Error("DATABASE_URL is not set");
  const res = await pool.query<T>(text, params as never);
  return res.rows;
}

export function hasDatabase(): boolean {
  return !!process.env.DATABASE_URL;
}
