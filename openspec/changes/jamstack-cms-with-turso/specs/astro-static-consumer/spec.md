## ADDED Requirements

### Requirement: Astro static site generation
The system SHALL use Astro to generate static HTML for all public-facing routes. The Astro build SHALL fetch content from the API at build time and produce zero-JavaScript pages by default. JavaScript SHALL only be loaded when interactive components require it via Astro islands.

#### Scenario: Build public site with Astro
- **WHEN** the build process runs
- **THEN** Astro generates static HTML files for all public routes

#### Scenario: Zero-JS default output
- **WHEN** a public page is viewed in a browser
- **THEN** the page renders with no JavaScript unless interactive components are present

### Requirement: Build-time content fetching
Astro pages SHALL fetch content from the API during the build process using `getStaticPaths()` and `fetch()`. The API endpoint URL SHALL be configured via the `PUBLIC_API_URL` environment variable. Build failures SHALL occur if the API is unreachable or returns errors.

#### Scenario: Fetch posts at build time
- **WHEN** the `/posts/[slug].astro` page builds
- **THEN** it fetches all published posts from the API to generate static paths

#### Scenario: Build fails on API error
- **WHEN** the API returns a 500 error during build
- **THEN** the build fails with a clear error message about the API failure

### Requirement: Public route structure
The system SHALL generate the following public routes: `/` (landing page), `/posts` (post listing), `/posts/[slug]` (individual post), `/pages/[slug]` (individual page), `/events` (event listing), `/events/[id]` (individual event).

#### Scenario: Landing page renders
- **WHEN** a visitor navigates to `/`
- **THEN** they see the business identity, active banner, and recent posts

#### Scenario: Event listing renders
- **WHEN** a visitor navigates to `/events`
- **THEN** they see a list of upcoming published events with title, date, and location

### Requirement: SEO meta tags
The Astro layout SHALL render semantic HTML with proper `<title>`, `<meta description>`, Open Graph tags (`og:title`, `og:description`, `og:image`, `og:url`), Twitter Card tags, and canonical URLs for every public page. When a page or post has `seoNoIndex: true`, the system SHALL render `<meta name="robots" content="noindex">`.

#### Scenario: Post with custom SEO
- **WHEN** a post has seoTitle="Summer Sale" and seoDescription="Join us for..."
- **THEN** the public page has `<title>Summer Sale</title>` and corresponding meta tags

#### Scenario: No-index page
- **WHEN** a page has seoNoIndex set to true
- **THEN** the rendered HTML includes `<meta name="robots" content="noindex">`

### Requirement: ImageKit CDN image rendering
Public pages SHALL render images using ImageKit CDN URLs with appropriate transformation parameters. Hero images SHALL use large dimensions (`tr:w-1200,f-webp`), post thumbnails SHALL use medium dimensions (`tr:w-600,f-webp`), and srcset attributes SHALL provide multiple sizes for responsive loading.

#### Scenario: Render hero image with srcset
- **WHEN** a landing page has a hero image
- **THEN** the `<img>` tag includes srcset with widths 400, 800, and 1200

#### Scenario: Render WebP format
- **WHEN** any image is rendered on a public page
- **THEN** the ImageKit URL includes `f-webp` for automatic WebP delivery

### Requirement: Incremental Static Regeneration
The system SHALL support Astro's on-demand ISR pattern for content updates without full rebuilds. The API SHALL provide a `POST /api/revalidate` endpoint that accepts a content type and ID, invalidating the corresponding static page. Revalidated pages SHALL be regenerated on the next request.

#### Scenario: Revalidate a single post
- **WHEN** `POST /api/revalidate` is called with `{"type": "post", "id": "uuid"}`
- **THEN** the cached page for that post is invalidated and regenerated on next visit

#### Scenario: Revalidate all pages
- **WHEN** `POST /api/revalidate` is called with `{"type": "all"}`
- **THEN** all cached public pages are invalidated

### Requirement: Mobile-first responsive layout
The system SHALL generate pages that pass Google Lighthouse mobile performance score of 90 or higher. All public pages SHALL use responsive layouts optimized for 320px minimum viewport width with touch targets of at least 44px.

#### Scenario: Mobile viewport rendering
- **WHEN** a page is viewed at 375px viewport width
- **THEN** all content is readable without horizontal scrolling

### Requirement: Accessibility compliance
The system SHALL generate HTML that meets WCAG 2.1 AA standards, including: proper heading hierarchy, sufficient color contrast (4.5:1 for text, 3:1 for large text), alt text on all images, keyboard navigability, focus indicators, and ARIA labels on interactive elements.

#### Scenario: Screen reader navigation
- **WHEN** a page is viewed with a screen reader
- **THEN** all content is accessible via landmarks, headings, and descriptive link text

### Requirement: Markdown rendering
The system SHALL render markdown body content from posts, pages, and events to HTML with safe sanitization, proper semantic tags, and support for headings, lists, links, images, code blocks, and emphasis.

#### Scenario: Render post with markdown
- **WHEN** a post body contains markdown with headings, lists, and bold text
- **THEN** the public page renders semantic HTML (`<h2>`, `<ul>`, `<strong>`)
