## ADDED Requirements

### Requirement: Turso database connection
The system SHALL connect to a Turso database using the `@libsql/client` driver. Connection configuration SHALL be provided via environment variables (`TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`). The system SHALL validate the connection on startup and fail fast if the database is unreachable.

#### Scenario: Successful database connection
- **WHEN** the application starts with valid `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN`
- **THEN** a database connection pool is established and ready for queries

#### Scenario: Failed database connection
- **WHEN** the application starts with invalid credentials
- **THEN** startup fails with a clear error message indicating the connection issue

### Requirement: Database schema management
The system SHALL use a migration system to manage the database schema. Migrations SHALL be stored as SQL files in a `migrations/` directory and applied in order. The system SHALL track which migrations have been applied and skip already-applied migrations.

#### Scenario: Apply migrations on startup
- **WHEN** the application starts
- **THEN** all pending migrations are applied in sequence before serving requests

#### Scenario: Skip already-applied migrations
- **WHEN** the database already has all migrations applied
- **THEN** no migrations are executed and startup proceeds normally

### Requirement: Sites table
The system SHALL maintain a `sites` table with columns: `id` (UUID, primary key), `api_key` (unique, indexed), `name`, `template` (kebab-case template identifier), `created_at`, and `updated_at`. Each site represents one business website.

#### Scenario: Create a new site
- **WHEN** a new site is provisioned
- **THEN** a row is inserted with a generated UUID, unique API key, and default template

#### Scenario: Site lookup by API key
- **WHEN** an API request includes `X-Site-Key` header
- **THEN** the corresponding site is retrieved to scope subsequent queries

### Requirement: Content tables
The system SHALL maintain tables for business settings (`site_settings`), business hours (`business_hours`), posts (`posts`), pages (`pages`), events (`events`), and banners (`banners`). All content tables SHALL include a `site_id` foreign key referencing the `sites` table, a `status` column (`draft` or `published`), and `created_at`/`updated_at` timestamps.

#### Scenario: Query published posts for a site
- **WHEN** the API requests posts with `status='published'` for a given `site_id`
- **THEN** only published posts belonging to that site are returned

#### Scenario: Draft content isolation
- **WHEN** the admin edits a post in draft status
- **THEN** the changes are stored with `status='draft'` and do not affect published queries

### Requirement: Database query parameterization
All database queries SHALL use parameterized statements to prevent SQL injection. No raw string concatenation SHALL be used for query values.

#### Scenario: Parameterized post creation
- **WHEN** a new post is created via the API
- **THEN** the title, body, and metadata are passed as query parameters, not concatenated into SQL
