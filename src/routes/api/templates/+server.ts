import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const templatesDir = join(__dirname, '../../../../templates');

export const GET: RequestHandler = async () => {
  try {
    const entries = readdirSync(templatesDir, { withFileTypes: true });
    const templates = entries
      .filter((e) => e.isDirectory())
      .map((dir) => {
        try {
          const configPath = join(templatesDir, dir.name, 'config.json');
          const config = JSON.parse(readFileSync(configPath, 'utf-8'));
          return {
            id: dir.name,
            name: config.name || dir.name,
            displayName: config.displayName || dir.name,
            description: config.description || '',
            sections: config.sections || [],
          };
        } catch {
          return { id: dir.name, name: dir.name, displayName: dir.name, description: '', sections: [] };
        }
      });
    return new Response(JSON.stringify(templates), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify([]), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
