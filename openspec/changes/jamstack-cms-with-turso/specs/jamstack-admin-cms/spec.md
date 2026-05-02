## ADDED Requirements

### Requirement: SvelteKit admin application
The system SHALL provide a SvelteKit-based admin application at `/admin` that renders as a client-side SPA. The admin SHALL communicate exclusively with API endpoints under `/api/*` for all data operations. The admin SHALL NOT have direct database or filesystem access.

#### Scenario: Load admin application
- **WHEN** a user navigates to `/admin`
- **THEN** the admin shell loads and initializes the API client with the site key

#### Scenario: Admin loads data from API
- **WHEN** the admin dashboard opens
- **THEN** it fetches settings, recent posts, and active banners from the API

### Requirement: Admin API client
The admin SHALL include an API client module that attaches the `X-Site-Key` header to all requests, handles authentication errors (401 redirects to login), and provides typed methods for each content type (`getSettings()`, `saveSettings()`, `getPosts()`, `createPost()`, `updatePost()`, `deletePost()`, etc.).

#### Scenario: API client includes site key
- **WHEN** the API client makes a request to `/api/posts`
- **THEN** the request includes the `X-Site-Key` header

#### Scenario: Handle authentication failure
- **WHEN** the API client receives a 401 response
- **THEN** it redirects the user to the admin login screen

### Requirement: Admin navigation structure
The admin SHALL provide a sidebar navigation with sections: Dashboard, Settings (business identity + hours), Posts, Pages, Events, Banners, Media, and Template. Each section SHALL route to a dedicated admin page at `/admin/settings`, `/admin/posts`, `/admin/pages`, `/admin/events`, `/admin/banners`, `/admin/media`, `/admin/template`.

#### Scenario: Navigate to posts list
- **WHEN** a user clicks "Posts" in the sidebar
- **THEN** they are taken to `/admin/posts` showing the post list

#### Scenario: Navigate to settings
- **WHEN** a user clicks "Settings" in the sidebar
- **THEN** they are taken to `/admin/settings` with business identity and hours tabs

### Requirement: Dashboard page
The admin dashboard SHALL display an overview of the site: recent posts (last 5), upcoming events (next 3), active banner status, last publish time, and quick actions (new post, edit hours, publish changes).

#### Scenario: Dashboard shows overview
- **WHEN** a user opens the admin dashboard
- **THEN** they see recent posts, upcoming events, banner status, and quick actions

### Requirement: Admin form validation
All admin forms SHALL validate input client-side before submitting to the API. Validation rules SHALL include: required fields, email format, URL format, date ranges (end >= start), and character limits. Validation errors SHALL be displayed inline next to the relevant field.

#### Scenario: Invalid email rejected
- **WHEN** a user enters "not-an-email" in the email field and saves
- **THEN** an inline error appears and the save is not sent to the API

#### Scenario: Invalid date range rejected
- **WHEN** a user sets a banner end date before the start date
- **THEN** an inline error appears on the end date field

### Requirement: Markdown editor
The admin SHALL provide a markdown editor for post bodies, page bodies, and event descriptions. The editor SHALL include a toolbar with buttons for bold, italic, headings, links, lists, and images. A live preview pane SHALL render the markdown as HTML.

#### Scenario: Insert bold text
- **WHEN** a user selects text and clicks the bold button
- **THEN** the selected text is wrapped in `**` markers

#### Scenario: Preview markdown rendering
- **WHEN** a user types `## Heading` in the editor
- **THEN** the preview pane renders it as an `<h2>` element

### Requirement: Safe editing boundaries
The admin SHALL only expose editable fields for structured content: text, numbers, dates, toggles, markdown bodies, and image references. The admin SHALL NOT provide controls for modifying HTML, CSS, JavaScript, layout templates, design tokens, or component structure.

#### Scenario: Cannot edit layout
- **WHEN** a user browses the admin interface
- **THEN** there are no controls for changing page structure, colors, or fonts

#### Scenario: Can edit business hours
- **WHEN** a user opens the hours editor
- **THEN** they can modify opens/closes times and toggle closed status for each day
