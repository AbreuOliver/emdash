# Starter Vercel template

This template is the quick-launch path for this fork.

## Defaults

- public site: Astro
- admin: existing EmDash React admin
- local dev db: SQLite (`file:./data.db`)
- production db: Turso/libSQL via `TURSO_DATABASE_URL`
- local media: `./uploads`
- production media: S3-compatible storage via `S3_*` env vars
- plugins: disabled by default
- marketplace: disabled by default

## Local dev

```bash
pnpm install
pnpm dev
```

If `TURSO_DATABASE_URL` is not set, the template uses local SQLite.
If `S3_BUCKET` is not set, the template uses local file uploads.

## Vercel production env vars

```bash
TURSO_DATABASE_URL=
TURSO_AUTH_TOKEN=
S3_ENDPOINT=
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_PUBLIC_URL=
```

## Notes

- Do not use local SQLite as the primary production database on Vercel.
- Turso is the intended production path for this template.
- S3-compatible storage can be AWS S3, Cloudflare R2, MinIO, Backblaze, or similar.
