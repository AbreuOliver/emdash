## ADDED Requirements

### Requirement: Business identity data model
The system SHALL maintain a structured business identity object in the `site_settings` table containing: title (required), tagline, phone, email, address, facebookUrl, and instagramUrl. All fields SHALL be strings except title which is required. Values SHALL be scoped to a site via `site_id`.

#### Scenario: Initialize business profile
- **WHEN** a new site is provisioned
- **THEN** default settings are created with placeholder values for all fields

#### Scenario: Update contact information
- **WHEN** the phone field is updated via the API
- **THEN** the change is saved to draft and reflected in all public-facing pages after publish

### Requirement: Business hours data model
The system SHALL store business hours as individual rows in the `business_hours` table, each with: `site_id`, `label` (e.g., "Monday", "Christmas"), `opens` (HH:MM), `closes` (HH:MM), `closed` (boolean), and `sort_order` (integer for ordering). Labels SHALL be unique within a site's hours entries. Required labels SHALL include all seven days of the week.

#### Scenario: Configure weekly hours
- **WHEN** Monday hours are set to 09:00–17:00
- **THEN** the Monday row has opens="09:00", closes="17:00", closed=false

#### Scenario: Mark a day as closed
- **WHEN** Christmas is marked as closed
- **THEN** the Christmas row has closed=true with empty opens and closes fields

### Requirement: Post content model
The system SHALL store posts in the `posts` table with fields: `id` (UUID), `site_id`, `slug` (unique per site), `title`, `excerpt`, `publishedAt` (ISO date), `body` (markdown), `imageId` (FK to images, optional), `seoTitle`, `seoDescription`, `seoKeywords`, `seoNoIndex` (boolean), `status` (draft/published), `created_at`, `updated_at`.

#### Scenario: Auto-generate slug from title
- **WHEN** a post titled "Summer Sale 2026" is created
- **THEN** the slug is auto-generated as "summer-sale-2026"

#### Scenario: Publish a post with SEO metadata
- **WHEN** a post is published with seoTitle and seoDescription
- **THEN** the public page renders those values in the HTML `<title>` and `<meta description>` tags

### Requirement: Page content model
The system SHALL store pages in the `pages` table with fields: `id` (UUID), `site_id`, `slug` (unique per site), `title`, `body` (markdown), `seoTitle`, `seoDescription`, `seoKeywords`, `seoNoIndex` (boolean), `status` (draft/published), `created_at`, `updated_at`.

#### Scenario: Create a new page
- **WHEN** a page titled "About Us" is created
- **THEN** a page is created with slug "about-us" and all required fields

### Requirement: Content API retrieval
The API SHALL serve content from the Turso database. Public-facing API calls (without draft query parameter) SHALL return only rows with `status=published`. Admin API calls with `?status=draft` SHALL return draft rows. The API SHALL enforce site scoping via the `X-Site-Key` header.

#### Scenario: Public API returns only published content
- **WHEN** a GET request is made to `/api/posts`
- **THEN** only posts with `status=published` are returned

#### Scenario: Admin API returns draft content
- **WHEN** a GET request is made to `/api/posts?status=draft`
- **THEN** posts with `status=draft` are returned for the authenticated site
