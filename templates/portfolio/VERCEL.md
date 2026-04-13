# Vercel deployment

This fork treats Vercel as a first-class deployment target for quick-launch client sites.

## Recommended stack

- Public site: Astro
- Admin: existing React admin shipped with EmDash
- Local development database: SQLite
- Production database: Turso (libSQL)
- Local media storage: filesystem
- Production media storage: S3-compatible storage or Vercel Blob
- Plugins: none by default

## Why this setup

- Astro keeps public pages fast
- React admin stays isolated behind auth, so it does not hurt visitor performance
- SQLite keeps local setup simple
- Turso avoids Vercel filesystem limits in production
- No plugin marketplace means less product surface and fewer support headaches

## Local development

```bash
pnpm install
pnpm dev
```

Default node templates use:

- `better-sqlite3` with `file:./data.db`
- local uploads in `./uploads`

## Production on Vercel

Use the Vercel adapter and libSQL/Turso.

### 1. Install adapter and libSQL driver

```bash
pnpm add @astrojs/vercel @libsql/kysely-libsql
```

### 2. Update `astro.config.mjs`

```ts
import vercel from "@astrojs/vercel/serverless";
import react from "@astrojs/react";
import { defineConfig } from "astro/config";
import emdash from "emdash/astro";
import { libsql } from "emdash/db";
import { s3 } from "emdash/storage/s3";

export default defineConfig({
  output: "server",
  adapter: vercel(),
  integrations: [
    react(),
    emdash({
      database: libsql({
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!
      }),
      storage: s3({
        endpoint: process.env.S3_ENDPOINT,
        bucket: process.env.S3_BUCKET!,
        region: process.env.S3_REGION,
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
        baseUrl: process.env.PUBLIC_ASSET_BASE_URL
      }),
      plugins: []
    })
  ],
  devToolbar: { enabled: false }
});
```

### 3. Set env vars in Vercel

```bash
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
S3_ENDPOINT=
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
PUBLIC_ASSET_BASE_URL=
```

## Product stance for this fork

This fork is aimed at opinionated local-business sites:

- built-in CMS experience
- minimal moving parts
- no plugin marketplace dependency
- fast Astro frontends
- simple editor workflow for small business owners
