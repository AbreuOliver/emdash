## 1. Project Setup & Dependencies

- [x] 1.1 Add `@libsql/client`, `@imagekit/nodejs`, Astro, and related dependencies to package.json
- [x] 1.2 Set up environment variable configuration (.env.example with TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, IMAGEKIT_PUBLIC_KEY, IMAGEKIT_PRIVATE_KEY, IMAGEKIT_URL_ENDPOINT, PUBLIC_API_URL)
- [x] 1.3 Create `migrations/` directory with migration runner script
- [x] 1.4 Remove legacy filesystem-based storage (`src/lib/server/cms-store.ts`)
- [x] 1.5 Update `package.json` scripts for dual build: `pnpm build` runs API/admin and Astro sequentially

## 2. Database Schema & Migrations

- [x] 2.1 Create migration 001: `sites` table with id, api_key, name, template, created_at, updated_at
- [x] 2.2 Create migration 002: `site_settings` table with site_id, title, tagline, phone, email, address, facebookUrl, instagramUrl, status, created_at, updated_at
- [x] 2.3 Create migration 003: `business_hours` table with site_id, label, opens, closes, closed, sort_order, status, created_at, updated_at
- [x] 2.4 Create migration 004: `posts` table with site_id, slug, title, excerpt, publishedAt, body, imageId, seoTitle, seoDescription, seoKeywords, seoNoIndex, status, created_at, updated_at
- [x] 2.5 Create migration 005: `pages` table with site_id, slug, title, body, seoTitle, seoDescription, seoKeywords, seoNoIndex, status, created_at, updated_at
- [x] 2.6 Create migration 006: `events` table with site_id, title, description, startDateTime, endDateTime, location, imageId, seoTitle, seoDescription, seoKeywords, seoNoIndex, status, created_at, updated_at
- [x] 2.7 Create migration 007: `banners` table with site_id, text, enabled, startDate, endDate, variant, status, created_at, updated_at
- [x] 2.8 Create migration 008: `images` table with site_id, imagekit_file_id, imagekit_url, original_filename, width, height, file_size, mime_type, created_at
- [x] 2.9 Create migration 009: indexes on api_key, site_id+status, site_id+slug for posts/pages
- [x] 2.10 Implement migration runner that applies pending SQL migrations in order
- [x] 2.11 Write seed script that creates a default site with sample content

## 3. Database Layer

- [x] 3.1 Create `src/lib/server/db.ts` with Turso client initialization from env vars
- [x] 3.2 Implement connection validation on startup
- [x] 3.3 Create `src/lib/server/queries.ts` with parameterized query helpers scoped by site_id
- [x] 3.4 Implement site lookup by API key query
- [x] 3.5 Implement settings CRUD queries (get published, get draft, upsert draft)
- [x] 3.6 Implement hours CRUD queries (get all, upsert all in transaction)
- [x] 3.7 Implement posts CRUD queries (list, by slug, create, update, delete)
- [x] 3.8 Implement pages CRUD queries (list, by slug, create, update, delete)
- [x] 3.9 Implement events CRUD queries (list, upcoming filter, by id, create, update, delete)
- [x] 3.10 Implement banners CRUD queries (list, active filter, create, update, delete)
- [x] 3.11 Implement images CRUD queries (create, by id, by site)
- [x] 3.12 Implement publish transaction that transitions draft to published for specified content

## 4. Content API Layer

- [x] 4.1 Create SvelteKit API middleware that validates `X-Site-Key` header and attaches site context
- [x] 4.2 Implement 401 response for missing/invalid site key
- [x] 4.3 Create `GET /api/settings` returning published settings
- [x] 4.4 Create `PUT /api/settings` saving to draft status
- [x] 4.5 Create `GET /api/hours` returning published hours array
- [x] 4.6 Create `PUT /api/hours` saving all hours to draft in transaction
- [x] 4.7 Create `GET /api/posts` with optional `?status=draft` filter
- [x] 4.8 Create `GET /api/posts/:slug` returning single post
- [x] 4.9 Create `POST /api/posts` creating post as draft
- [x] 4.10 Create `PUT /api/posts/:slug` updating post in draft
- [x] 4.11 Create `DELETE /api/posts/:slug` removing post
- [x] 4.12 Create `GET /api/pages` with optional `?status=draft` filter
- [x] 4.13 Create `GET /api/pages/:slug` returning single page
- [x] 4.14 Create `POST /api/pages` creating page as draft
- [x] 4.15 Create `PUT /api/pages/:slug` updating page in draft
- [x] 4.16 Create `DELETE /api/pages/:slug` removing page
- [x] 4.17 Create `GET /api/events` with `?upcoming=true` and `?status=` filters
- [x] 4.18 Create `GET /api/events/:id` returning single event
- [x] 4.19 Create `POST /api/events` creating event as draft
- [x] 4.20 Create `PUT /api/events/:id` updating event in draft
- [x] 4.21 Create `DELETE /api/events/:id` removing event
- [x] 4.22 Create `GET /api/banners` returning all banners with active status
- [x] 4.23 Create `POST /api/banners` creating banner as draft
- [x] 4.24 Create `PUT /api/banners/:id` updating banner in draft
- [x] 4.25 Create `DELETE /api/banners/:id` removing banner
- [x] 4.26 Create `POST /api/publish` with transactional publish for specified content types
- [x] 4.27 Create `GET /api/templates` returning available template list
- [x] 4.28 Implement consistent error response format with error message and code
- [x] 4.29 Implement validation error responses with field-level details (400)

## 5. ImageKit Media Pipeline

- [x] 5.1 Create `src/lib/server/imagekit.ts` with ImageKit client initialization from env vars
- [x] 5.2 Implement startup validation for ImageKit credentials
- [x] 5.3 Create `POST /api/media/upload` accepting multipart form
- [x] 5.4 Implement file validation: max 10MB, JPEG/PNG/WebP/GIF/AVIF only, max 8000x8000px
- [x] 5.5 Implement upload to ImageKit in site-specific folder (`/sites/{site-id}/`)
- [x] 5.6 Store image metadata in `images` table after successful upload
- [x] 5.7 Implement ImageKit URL transformation utility (resize, format, quality params)
- [x] 5.8 Create helper to generate responsive srcset URLs with multiple widths

## 6. Admin CMS - Shell & Navigation

- [ ] 6.1 Rebuild `/admin` route as SvelteKit SPA with client-side routing
- [ ] 6.2 Create admin API client module with site key header attachment
- [ ] 6.3 Implement admin layout with sidebar navigation
- [ ] 6.4 Create sidebar nav items: Dashboard, Settings, Posts, Pages, Events, Banners, Media, Template
- [ ] 6.5 Implement 401 handler that redirects to admin login
- [ ] 6.6 Create admin login page (API key entry with localStorage persistence)
- [ ] 6.7 Create admin API client with typed methods for each content type

## 7. Admin CMS - Dashboard

- [ ] 7.1 Create dashboard page fetching recent posts, upcoming events, banner status, last publish time
- [ ] 7.2 Add quick action buttons: New Post, Edit Hours, Publish Changes
- [ ] 7.3 Implement unpublished changes indicator in admin header
- [ ] 7.4 Create draft-vs-published diff utility for change summary

## 8. Admin CMS - Settings Editor

- [ ] 8.1 Create settings page at `/admin/settings` with business identity form
- [ ] 8.2 Add fields: title, tagline, phone, email, address, facebookUrl, instagramUrl
- [ ] 8.3 Implement client-side validation (email format, URL format, required fields)
- [ ] 8.4 Create hours editor tab with day-by-day time inputs and closed toggles
- [ ] 8.5 Implement save-to-draft API calls for settings and hours
- [ ] 8.6 Add save confirmation toast and error handling UI

## 9. Admin CMS - Post Editor

- [ ] 9.1 Create post list page at `/admin/posts` with create/edit/delete actions
- [ ] 9.2 Create post editor form with title, excerpt, body, publishedAt, and SEO fields
- [ ] 9.3 Integrate markdown editor with toolbar (bold, italic, headings, links, lists, images) and live preview
- [ ] 9.4 Implement auto-slug generation from title with manual override
- [ ] 9.5 Add image upload button in markdown editor that calls media upload API
- [ ] 9.6 Implement create/update/delete via API with draft status

## 10. Admin CMS - Page Editor

- [ ] 10.1 Create page list page at `/admin/pages` with create/edit/delete actions
- [ ] 10.2 Create page editor form with title, body (markdown), and SEO fields
- [ ] 10.3 Integrate markdown editor with toolbar and live preview
- [ ] 10.4 Implement auto-slug generation with manual override
- [ ] 10.5 Implement create/update/delete via API with draft status

## 11. Admin CMS - Events Editor

- [ ] 11.1 Create events list page at `/admin/events` with upcoming/past toggle
- [ ] 11.2 Create event editor form with title, description (markdown), start date/time, end date/time, location, and image upload
- [ ] 11.3 Implement date validation (endDateTime > startDateTime when both set)
- [ ] 11.4 Implement create/update/delete via API with draft status

## 12. Admin CMS - Banners Manager

- [ ] 12.1 Create banners list page at `/admin/banners` with active status indicators
- [ ] 12.2 Create banner editor form with text, enabled toggle, date pickers, and variant selector
- [ ] 12.3 Implement banner active logic display (shows whether banner would be active given current date)
- [ ] 12.4 Implement create/update/delete via API with draft status

## 13. Admin CMS - Media Library

- [ ] 13.1 Create media library page at `/admin/media` showing uploaded images grid
- [ ] 13.2 Implement image upload via drag-and-drop and file picker
- [ ] 13.3 Show image metadata (dimensions, size, format) in library view
- [ ] 13.4 Implement image delete with confirmation

## 14. Admin CMS - Template Selector

- [ ] 14.1 Create template selection page at `/admin/template` with available templates grid
- [ ] 14.2 Show template preview thumbnails, names, and descriptions
- [ ] 14.3 Implement template change saved to draft status
- [ ] 14.4 Fetch available templates from `GET /api/templates`

## 15. Preview & Publish Workflow

- [ ] 15.1 Implement draft content fetching in all admin pages (use `?status=draft`)
- [ ] 15.2 Create "Preview" button that opens new tab with `X-Preview-Mode: true` header
- [ ] 15.3 Implement API preview mode: serve draft content when preview header is present
- [ ] 15.4 Add visible "Preview" banner to preview pages
- [ ] 15.5 Create publish confirmation dialog with change summary (diff of draft vs published)
- [ ] 15.6 Implement `POST /api/publish` call from admin with content type selection
- [ ] 15.7 Trigger ISR revalidation after successful publish
- [ ] 15.8 Handle publish failure with error message and no partial state change
- [ ] 15.9 Implement unpublished changes comparison (draft vs published) for header indicator

## 18. ISR & Revalidation

- [ ] 18.1 Configure Astro ISR adapter for on-demand revalidation
- [x] 18.2 Create `POST /api/revalidate` endpoint that invalidates cached pages
- [ ] 18.3 Integrate ISR revalidation trigger into publish workflow
- [ ] 18.4 Test revalidation of single post page after publish
- [ ] 18.5 Test revalidation of all pages after full publish

## 19. Styling, Accessibility & Performance

- [x] 19.1 Style all public pages with mobile-first responsive layouts (320px minimum)
- [x] 19.2 Ensure WCAG 2.1 AA compliance: heading hierarchy, color contrast, alt text, keyboard nav, ARIA labels
- [ ] 19.3 Style admin UI with consistent Tailwind CSS design system
- [ ] 19.4 Add loading states and empty states for all admin pages
- [ ] 19.5 Optimize public pages for Lighthouse mobile score >= 90
- [x] 19.6 Implement proper focus indicators and skip-to-content link
- [x] 19.7 Add semantic HTML landmarks (header, nav, main, footer)

## 20. Build & Deployment

- [x] 20.1 Configure SvelteKit build output for admin + API to `dist/admin/`
- [ ] 20.2 Configure Astro build output to `dist/public/`
- [x] 20.3 Create unified `pnpm build` script running both builds in sequence
- [x] 20.4 Add `.gitignore` entries for `dist/`, `.env`, and `.turso*`
- [ ] 20.5 Create deployment documentation for Cloudflare Pages / Netlify / Vercel
- [x] 20.6 Write seed script to populate Turso with default site and sample content
- [ ] 20.7 Test full workflow: site provision → edit settings → create post → preview → publish → verify static output
