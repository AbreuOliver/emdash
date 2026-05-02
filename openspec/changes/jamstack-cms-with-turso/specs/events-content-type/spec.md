## ADDED Requirements

### Requirement: Events data model
The system SHALL store events with the following fields: `id` (UUID), `site_id`, `title` (required), `description` (markdown), `startDateTime` (ISO datetime), `endDateTime` (ISO datetime, optional), `location` (string), `imageId` (FK to images table, optional), `status` (draft/published), `seoTitle`, `seoDescription`, `seoKeywords`, `seoNoIndex` (boolean), `created_at`, and `updated_at`.

#### Scenario: Create an event
- **WHEN** a new event is created with title, description, and startDateTime
- **THEN** the event is saved with `status=draft` and a generated UUID

#### Scenario: Event with optional end date
- **WHEN** an event is created without an endDateTime
- **THEN** the event is saved with `endDateTime=null`

### Requirement: Events API endpoints
The API SHALL provide `GET /api/events` (list with optional `?upcoming=true` and `?status=draft|published` filters), `GET /api/events/:id` (single), `POST /api/events` (create), `PUT /api/events/:id` (update), and `DELETE /api/events/:id` (delete).

#### Scenario: List upcoming published events
- **WHEN** a GET request is made to `/api/events?upcoming=true&status=published`
- **THEN** the response contains only events where `startDateTime >= now()` and `status=published`, sorted by `startDateTime` ascending

#### Scenario: Get a single event
- **WHEN** a GET request is made to `/api/events/:id`
- **THEN** the response contains the published event with the matching ID

### Requirement: Event listing page
The public site SHALL render an event listing page at `/events` showing upcoming events sorted by `startDateTime` ascending. Each event card SHALL display the title, start date, location, and optional thumbnail image.

#### Scenario: Render event listing
- **WHEN** a visitor navigates to `/events`
- **THEN** they see upcoming events with title, date, location, and thumbnail

#### Scenario: No upcoming events
- **WHEN** there are no upcoming published events
- **THEN** the event listing page displays a "No upcoming events" message

### Requirement: Event detail page
The public site SHALL render an event detail page at `/events/[id]` showing the full event title, description (rendered from markdown), start/end date and time, location, and optional hero image. The page SHALL include structured data (JSON-LD Event schema) for search engine discovery.

#### Scenario: Render event detail
- **WHEN** a visitor navigates to `/events/[id]`
- **THEN** they see the full event details with rendered markdown description

#### Scenario: Event structured data
- **WHEN** an event detail page is rendered
- **THEN** the HTML includes JSON-LD Event schema with name, startDate, location, and description

### Requirement: Admin events editor
The admin SHALL provide an events management page at `/admin/events` with a list of events and an editor form. The editor SHALL include fields for title, description (markdown), start date/time, end date/time (optional), location (text input), and image upload. Validation SHALL ensure startDateTime is required and endDateTime, if provided, is after startDateTime.

#### Scenario: Create an event with date validation
- **WHEN** a user sets endDateTime before startDateTime and saves
- **THEN** an inline error appears on the end date field and the save is blocked

#### Scenario: Edit an event
- **WHEN** a user modifies the location of an existing event and saves
- **THEN** the change is saved to draft status
