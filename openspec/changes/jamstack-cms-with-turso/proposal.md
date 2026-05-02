## Why

Small local businesses need a fast, cheap, mobile-optimized public site and a simple admin to update hours, contact details, posts, events, and temporary banners. Content must be backed by a proper database with a media pipeline — not tied to a repository or requiring rebuilds for every change.

## What Changes

- All persistent content stored in Turso (edge SQLite) with proper schema and migrations
- API layer mediates all content access — admin and public builds both consume via API
- ImageKit integration for media asset management — uploads via CMS, CDN delivery with automatic optimization
- Client-driven SvelteKit admin communicates via API endpoints
- Public Astro pages consume content via build-time API fetches, with optional incremental revalidation for near-real-time updates
- Structured support for events as a first-class content type alongside posts and pages
- Focus on small business use cases: hours, contact details, posts, events, banners, and simple pages

## Capabilities

### New Capabilities

- `turso-content-storage`: Turso-based persistent storage for all structured content (business settings, hours, posts, pages, events, banners) with schema management and migrations
- `content-api-layer`: RESTful API endpoints for CRUD operations on all content types, consumed by both the admin CMS and public site builds
- `imagekit-media-pipeline`: ImageKit integration for image uploads, optimization, transformation, and CDN delivery
- `jamstack-admin-cms`: Client-driven SvelteKit admin that communicates exclusively via API endpoints, with no direct filesystem or database access
- `astro-static-consumer`: Astro public site that fetches content via API at build time, with optional client-side hydration for dynamic elements
- `events-content-type`: First-class events content type with date, time, location, description, and optional image fields
- `structured-content`: Content model for business identity, hours, contact details, posts, pages, and sitewide banners (extends existing model, now backed by Turso)
- `template-system`: Reusable industry-specific templates (restaurant, salon, shop, church, service provider) with pre-defined layouts and content blocks
- `preview-publish-workflow`: Draft/preview mode and publish mechanism so changes are reviewed before going live on the static site
- `sitewide-banners`: Temporary promotional or informational banners with configurable start/end dates

### Modified Capabilities

<!-- No existing specs to modify -->

## Impact

- **Architecture**: Moves from monolithic SvelteKit to JAMstack: client-driven SvelteKit admin + API layer + Turso database + Astro static public site
- **Database**: Introduces Turso (libSQL/SQLite) as the persistent content store; removes all JSON file-based storage
- **API Layer**: New API service (Edge functions or serverless endpoints) between admin/database and between public builds/database
- **Media**: Introduces ImageKit external service for all image handling — uploads, optimization, CDN delivery
- **Public Build**: Astro pages fetch from API at build time instead of reading local JSON; supports ISR patterns for freshness
- **Admin**: Transitions from direct file writes to API-driven CRUD; becomes a pure client application
- **Dependencies**: Adds `@libsql/client`, ImageKit SDK, API framework (e.g., Hono or native SvelteKit API routes)
- **Deployment**: Admin deploys as SvelteKit app, public site as Astro static output, API as edge functions; Turso hosted externally
- **Removed**: All filesystem-based content operations, legacy React admin package
