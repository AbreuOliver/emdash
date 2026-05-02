import { createClient, type Client } from '@libsql/client';

let db: Client | null = null;

export function getDb(): Client {
  if (!db) {
    const url = process.env.TURSO_DATABASE_URL ?? 'file:local.db';
    const authToken = process.env.TURSO_AUTH_TOKEN;
    db = createClient({ url, authToken });
  }
  return db;
}

export async function validateConnection(): Promise<void> {
  const conn = getDb();
  try {
    await conn.execute('SELECT 1');
  } catch (err) {
    throw new Error(
      `Database connection failed: ${err instanceof Error ? err.message : 'unknown error'}. Check TURSO_DATABASE_URL and TURSO_AUTH_TOKEN.`
    );
  }
}
