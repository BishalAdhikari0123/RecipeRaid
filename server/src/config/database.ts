import { Pool, PoolConfig } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const {
  DATABASE_URL,
  DB_HOST,
  DB_PORT,
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_SSL,
} = process.env as Record<string, string | undefined>;

let poolConfig: PoolConfig;

if (DATABASE_URL) {
  // Primary: single connection string (recommended for Neon)
  poolConfig = {
    connectionString: DATABASE_URL,
    ssl: DB_SSL === 'false' ? false : { rejectUnauthorized: false },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  };
} else {
  // Fallback: discrete parameters (useful for local Postgres)
  const host = DB_HOST || 'localhost';
  const port = DB_PORT ? parseInt(DB_PORT, 10) : 5432;
  const database = DB_NAME;
  const user = DB_USER;
  const password = DB_PASSWORD;

  const enableSSL = DB_SSL === 'true' || (host?.includes('neon.tech') ?? false);

  poolConfig = {
    host,
    port,
    database,
    user,
    password,
    ssl: enableSSL ? { rejectUnauthorized: false } : false,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 10000,
  } as PoolConfig;
}

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  const mode = DATABASE_URL ? 'connection string' : 'discrete params';
  console.log(`✅ Database connected using ${mode}`);
});

pool.on('error', (err) => {
  console.error('❌ Unexpected database error:', err);
  process.exit(-1);
});

export default pool;
