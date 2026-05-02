## ADDED Requirements

### Requirement: API authentication via site key
All API endpoints SHALL require authentication via the `X-Site-Key` header. The system SHALL validate the key against the `sites` table and reject requests with invalid or missing keys with a 401 status. The API SHALL scope all queries to the authenticated site's data.

#### Scenario: Valid site key
- **WHEN** a request includes a valid `X-Site-Key` header
- **THEN** the request proceeds with queries scoped to that site

#### Scenario: Missing site key
- **WHEN** a request omits the `X-Site-Key` header
- **THEN** the API returns 401 Unauthorized

#### Scenario: Invalid site key
- **WHEN** a request includes an unrecognized `X-Site-Key`
- **THEN** the API returns 401 Unauthorized

### Requirement: Business settings API
The API SHALL provide `GET /api/settings` to retrieve the published business settings and `PUT /api/settings` to update settings. Updates SHALL write to the draft status. The settings object SHALL include: title, tagline, phone, email, address, and social media URLs.

#### Scenario: Get published settings
- **WHEN** a GET request is made to `/api/settings`
- **THEN** the response contains the published settings for the authenticated site

#### Scenario: Update settings to draft
- **WHEN** a PUT request is made to `/api/settings` with new values
- **THEN** the draft settings are updated and the response contains the updated draft

### Requirement: Business hours API
The API SHALL provide `GET /api/hours` to retrieve published business hours and `PUT /api/hours` to update the hours array. Hours SHALL be stored as individual rows in the `business_hours` table and returned as an ordered array.

#### Scenario: Get published hours
- **WHEN** a GET request is made to `/api/hours`
- **THEN** the response contains an array of hours entries sorted by day order

#### Scenario: Update all hours
- **WHEN** a PUT request is made to `/api/hours` with a full hours array
- **THEN** all hours rows are updated in a single transaction

### Requirement: Posts API
The API SHALL provide `GET /api/posts` (list), `GET /api/posts/:slug` (single), `POST /api/posts` (create), `PUT /api/posts/:id` (update), and `DELETE /api/posts/:id` (delete). List and single endpoints SHALL return published content by default and accept a `?status=draft` query parameter to retrieve drafts. Create and update operations SHALL save with `status=draft`.

#### Scenario: List published posts
- **WHEN** a GET request is made to `/api/posts`
- **THEN** the response contains an array of published posts sorted by `publishedAt` descending

#### Scenario: Create a post as draft
- **WHEN** a POST request is made to `/api/posts` with post data
- **THEN** a new post is created with `status=draft` and the response includes the new post ID

#### Scenario: Update an existing post
- **WHEN** a PUT request is made to `/api/posts/:id` with updated fields
- **THEN** the post is updated in draft status and the response contains the updated post

#### Scenario: Delete a post
- **WHEN** a DELETE request is made to `/api/posts/:id`
- **THEN** the post is removed from the database and a 204 No Content is returned

### Requirement: Pages API
The API SHALL provide `GET /api/pages` (list), `GET /api/pages/:slug` (single), `POST /api/pages` (create), `PUT /api/pages/:id` (update), and `DELETE /api/pages/:id` (delete). Behavior SHALL mirror the Posts API with draft/published status support.

#### Scenario: Get a page by slug
- **WHEN** a GET request is made to `/api/pages/about-us`
- **THEN** the response contains the published page with slug "about-us"

### Requirement: Events API
The API SHALL provide `GET /api/events` (list), `GET /api/events/:id` (single), `POST /api/events` (create), `PUT /api/events/:id` (update), and `DELETE /api/events/:id` (delete). Events SHALL include fields: title, description, startDateTime, endDateTime, location, imageUrl, and status. The list endpoint SHALL support a `?upcoming=true` filter that returns only events with `startDateTime >= now()`.

#### Scenario: List upcoming events
- **WHEN** a GET request is made to `/api/events?upcoming=true&status=published`
- **THEN** the response contains only published events that have not yet occurred

#### Scenario: Create an event
- **WHEN** a POST request is made to `/api/events` with event data
- **THEN** a new event is created with `status=draft`

### Requirement: Banners API
The API SHALL provide `GET /api/banners` (list), `POST /api/banners` (create), `PUT /api/banners/:id` (update), and `DELETE /api/banners/:id` (delete). Banners SHALL include fields: text, enabled (boolean), startDate, endDate, variant, and status.

#### Scenario: List active banners
- **WHEN** a GET request is made to `/api/banners`
- **THEN** the response includes all banners with their enabled status and date ranges

#### Scenario: Update banner enabled state
- **WHEN** a PUT request is made to `/api/banners/:id` with `enabled: true`
- **THEN** the banner's enabled field is updated in draft status

### Requirement: Publish endpoint
The API SHALL provide `POST /api/publish` that transitions specified content from draft to published status. The request body SHALL specify the content type (`settings`, `hours`, `post`, `page`, `event`, `banner`) and the content ID (or `all` for settings/hours). The operation SHALL be transactional — all specified items are published or none.

#### Scenario: Publish a single post
- **WHEN** a POST request is made to `/api/publish` with `{"type": "post", "id": "uuid"}`
- **THEN** the post's status is changed from `draft` to `published`

#### Scenario: Publish all settings and hours
- **WHEN** a POST request is made to `/api/publish` with `{"type": "all"}`
- **THEN** all draft settings, hours, posts, pages, events, and banners are published in a single transaction

#### Scenario: Publish failure rolls back
- **WHEN** a publish transaction encounters an error midway
- **THEN** no items have their status changed and an error is returned

### Requirement: API error handling
The API SHALL return consistent error responses with a JSON body containing `error` (string message) and `code` (machine-readable string). Validation errors SHALL return 400 with field-level details. Not-found errors SHALL return 404. Server errors SHALL return 500 with a generic message (no stack traces).

#### Scenario: Validation error on post creation
- **WHEN** a POST request to `/api/posts` omits the required title field
- **THEN** the response is 400 with `{"error": "Title is required", "code": "VALIDATION_ERROR", "field": "title"}`

#### Scenario: Not-found error
- **WHEN** a GET request is made to `/api/posts/nonexistent-slug`
- **THEN** the response is 404 with `{"error": "Post not found", "code": "NOT_FOUND"}`
