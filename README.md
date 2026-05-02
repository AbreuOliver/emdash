# EmDash — JAMstack Website Ops Tool

A JAMstack website operations tool for small local businesses.

## Architecture

- **Admin UI** — SvelteKit client at `/admin` (draft/publish workflow, CRUD for all content types)
- **API layer** — SvelteKit server routes under `/api/*` (authenticated via `X-Site-Key` header)
- **Database** — Turso (edge SQLite) for persistent content storage
- **Media** — ImageKit for uploads, CDN delivery, and automatic optimization
- **Public site** — Astro static output, zero-JS default, SEO/OG tags

## Development

```bash
pnpm install
pnpm dev
```

## Project structure

- `src/routes/admin/` — SvelteKit admin pages (dashboard, settings, posts, pages, events, banners, media, templates)
- `src/routes/api/` — REST API endpoints for all content operations
- `src/lib/server/` — Turso database layer, ImageKit integration, auth middleware
- `src/lib/admin/` — Browser-side API client and shared admin styles
- `src/pages/` — Astro public site routes
- `src/layouts/` — Astro public site layouts
- `migrations/` — Turso SQL schema migrations

## Key scripts

- `pnpm db:setup` — Run migrations and seed default site/content
- `pnpm check` — TypeScript type check
- `pnpm build` — Build admin (SvelteKit) then public site (Astro)
