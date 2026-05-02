import { createClient } from '@libsql/client';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

const db = createClient({
  url: process.env.TURSO_DATABASE_URL ?? 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function runMigrations() {
  const migrationDir = join(__dirname);
  const files = readdirSync(migrationDir)
    .filter((f) => f.endsWith('.sql'))
    .sort();

  if (files.length === 0) {
    console.log('No migration files found.');
    return;
  }

  await db.execute(`
    CREATE TABLE IF NOT EXISTS _migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      applied_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  const applied = await db.execute('SELECT filename FROM _migrations');
  const appliedFiles = new Set(
    applied.rows.map((r) => r.filename as string)
  );

  for (const file of files) {
    if (appliedFiles.has(file)) {
      console.log(`⏭️  ${file} (already applied)`);
      continue;
    }

    console.log(`▶️  ${file}...`);
    const sql = readFileSync(join(migrationDir, file), 'utf-8');
    await db.execute(sql);
    await db.execute({
      sql: 'INSERT INTO _migrations (filename) VALUES (?)',
      args: [file],
    });
    console.log(`✅ ${file}`);
  }

  console.log('\n✅ All migrations applied.');
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err);
  process.exit(1);
});
