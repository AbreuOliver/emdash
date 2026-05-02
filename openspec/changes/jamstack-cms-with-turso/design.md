## Context

The current repo was a monolithic SvelteKit app ("symballo-starter") where content lived in a JSON file on the filesystem. Both the public site and admin shared the same framework. Public routes were server-rendered by SvelteKit. This worked for a single-site starter but did not scale: content was tied to the repo, updates required rebuilds or direct file edits, there was no media pipeline, and the admin had direct filesystem access rather than operating through an API.

The repositioning targets a JAMstack architecture suitable for small local businesses who need a fast, cheap, mobile-optimized public site and a simple admin to update hours, contact details, posts, events, and temporary banners — with content backed by a proper database and images delivered through a CDN.

## Goals / Non-Goals

**Goals:**

- Persistent content storage in Turso (edge SQLite) with proper schema and migrations
- API layer mediates all content access — admin and public builds both consume via API
- Client-driven SvelteKit admin that communicates exclusively through API endpoints
- Astro static public site that fetches content at build time, with optional ISR for freshness
- ImageKit integration for image uploads, automatic optimization, and CDN delivery
- Events as a first-class content type alongside posts and pages
- Industry-specific templates (restaurant, salon, shop, church, service provider)
- Draft/preview workflow with explicit publish action
- Sitewide banners with start/end dates
- Mobile-first, SEO-optimized, WCAG 2.1 AA compliant public output

**Non-Goals:**

- No visual page builder or drag-and-drop layout customization
- No ecommerce or online payment processing
- No online booking or appointment scheduling
- No customer accounts or user-facing authentication
- No complex multi-user roles (single business owner/editor for MVP)
- No multi-tenant SaaS or self-hosted CMS marketplace in this phase
- No self-hosted media storage — ImageKit is the designated media service

## Decisions

### 1. Turso (libSQL/SQLite) for content storage

**Decision**: Use Turso as the persistent database for all structured content. Use `@libsql/client` for the Node.js driver.

**Rationale**: Turso is SQLite-compatible, runs at the edge, has generous free tier, requires zero server management, and is ideal for the read-heavy, low-write patterns of small business websites. SQLite's simplicity means no ORM is needed for MVP — parameterized queries are sufficient.

**Alternatives considered**:
- PostgreSQL (Neon, Supabase): more powerful but overkill for this data model; adds cost.
- File-based JSON (current): cannot support multi-site, real-time updates, or API-driven architecture.
- MongoDB: document model is a mismatch for relational content (posts belong to sites, events have structured dates).

### 2. API layer via SvelteKit API routes (Edge compatible)

**Decision**: The API is implemented as SvelteKit `+server.ts` route handlers within the admin project. The same codebase serves both the admin SPA and the API endpoints under `/api/*`.

**Rationale**: Co-locating admin and API simplifies deployment (single SvelteKit app), CORS management, and authentication. SvelteKit API routes are compatible with edge deployment (Cloudflare Workers, Vercel Edge). For MVP, no separate API service is needed.

**Alternatives considered**:
- Separate Hono API service: better separation of concerns but adds deployment complexity and CORS overhead for MVP.
- Serverless functions (AWS Lambda, Vercel Functions): viable but fragments the codebase.
- tRPC/GraphQL: adds abstraction overhead; simple REST is sufficient for this data model.

### 3. ImageKit for media pipeline

**Decision**: Use ImageKit.io for all image handling. Admin uploads images through the API, which calls ImageKit's upload API. Public pages reference ImageKit CDN URLs with transformation parameters.

**Rationale**: ImageKit provides upload, automatic format conversion (WebP/AVIF), responsive resizing, and global CDN in one service. The free tier covers small business needs. It eliminates the need for a self-managed media server or Cloudflare R2 + custom processing pipeline.

**Alternatives considered**:
- Cloudflare R2 + manual optimization: cheaper but requires building upload handling, format conversion, and CDN config.
- Self-hosted with local storage: not viable for CDN delivery or optimization.
- Cloudinary: comparable feature set but ImageKit has simpler pricing and API for MVP needs.

### 4. Astro build-time content fetching

**Decision**: Astro pages fetch content via the API at build time using `getStaticPaths()`. For freshness, use Astro's `on:demand` ISR pattern to revalidate specific pages after publish without a full rebuild.

**Rationale**: Build-time fetching produces zero-JS static pages with excellent performance. ISR allows targeted updates (e.g., a new post or updated hours) without rebuilding the entire site. The API serves as the single source of truth.

**Alternatives considered**:
- Full client-side rendering (CSR): degrades Lighthouse scores and SEO; unacceptable for public pages.
- SSG with webhook-triggered full rebuilds: works but slow for frequent updates; ISR is more granular.
- Edge-rendered pages (Cloudflare Workers SSR): adds server cost and complexity vs. static + ISR.

### 5. Admin as client-driven SvelteKit SPA

**Decision**: The admin renders as a client-side SvelteKit application (CSR) that fetches from `/api/*` endpoints. The initial page load is a minimal shell; all data loading happens client-side.

**Rationale**: The admin is a tool for a single logged-in user — SEO and initial load performance are irrelevant. CSR simplifies the build (no SSR complexity) and makes the admin feel app-like. API endpoints handle auth checks.

**Alternatives considered**:
- SSR admin: adds complexity for no benefit — admin users expect app-like interactions, not fast first paint.

### 6. Draft/publish via status field in database

**Decision**: Each content row has a `status` column (`draft` or `published`). The admin edits draft rows; publishing sets status to `published`. Preview reads draft rows; public builds read published rows.

**Rationale**: Single-table with status is simpler than dual-file or dual-table approaches. Turso supports fast filtered queries. No need for a separate draft database or file.

**Alternatives considered**:
- Draft table + published table: doubles schema complexity and requires sync logic.
- Draft file + published file (previous approach): doesn't work with database backend.
- Version history with latest-published pointer: overkill for MVP; can add later.

### 7. Site identification via API key

**Decision**: Each business site has a unique API key. All API requests include this key (header: `X-Site-Key`). The API validates the key and scopes all queries to that site's data.

**Rationale**: Simple, stateless auth suitable for MVP. One key per site — no user accounts or multi-user complexity. The key is stored in the admin's environment or localStorage.

**Alternatives considered**:
- JWT-based auth: adds complexity (token refresh, expiry) without benefit for single-user MVP.
- OAuth/Social login: overkill for a business tool; adds third-party dependency.

## Risks / Trade-offs

| Risk | Mitigation |
|------|------------|
| Turso free tier limits (2 billion row reads/month) | Small business sites generate minimal reads; well within free tier |
| ImageKit vendor lock-in for media | Image URLs are stored in the database; migration would require re-uploading, but the data model is simple |
| ISR cache invalidation complexity | Start with build-time only; add ISR incrementally after core functionality works |
| Co-located admin + API creates tight coupling | API routes are designed as standalone handlers; easy to extract to separate service later |
| API key in client-side admin is exposed | API key only grants read/write to that site's content; no admin-level or cross-site access; rate limit per key |
| Astro build fails if API is unavailable | Build scripts include retry logic and fail-fast with clear error messages |
| Seeding default content for new sites | `scripts/seed.ts` creates a default site with sample content on first run |
