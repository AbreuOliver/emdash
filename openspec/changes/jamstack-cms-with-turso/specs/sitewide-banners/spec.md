## ADDED Requirements

### Requirement: Banner data model
The system SHALL store banners in the `banners` table with fields: `id` (UUID), `site_id`, `text` (required, string), `enabled` (boolean), `startDate` (ISO date, nullable), `endDate` (ISO date, nullable), `variant` (string: "info", "warning", "success"), `status` (draft/published), `created_at`, `updated_at`.

#### Scenario: Create a banner
- **WHEN** a new banner is created with text "Holiday hours: closed Dec 25"
- **THEN** the banner is saved with the text, variant="info", enabled=false, and status=draft

#### Scenario: Banner with date range
- **WHEN** a banner has startDate="2026-12-20" and endDate="2026-12-26"
- **THEN** the banner is configured to display only within that date range when enabled and published

### Requirement: Banner active logic
A banner SHALL be considered active when ALL of the following are true: `enabled=true`, `status=published`, current date >= startDate (if set), and current date <= endDate (if set). If startDate is null, the banner is active from any date <= endDate. If endDate is null, the banner is active from startDate onwards. If both are null and enabled, the banner is always active.

#### Scenario: Banner within date range
- **WHEN** today is 2026-04-25 and banner has startDate="2026-04-22", endDate="2026-05-01", enabled=true, status=published
- **THEN** the banner is active and displayed on public pages

#### Scenario: Banner before start date
- **WHEN** today is 2026-04-20 and banner has startDate="2026-04-22", enabled=true, status=published
- **THEN** the banner is not active

#### Scenario: Banner after end date
- **WHEN** today is 2026-05-02 and banner has endDate="2026-05-01", enabled=true, status=published
- **THEN** the banner is not active

#### Scenario: Disabled banner
- **WHEN** a banner has enabled=false, startDate="2026-01-01", endDate="2026-12-31"
- **THEN** the banner is not active regardless of date range

#### Scenario: Banner with no dates, enabled
- **WHEN** a banner has enabled=true, startDate=null, endDate=null, status=published
- **THEN** the banner is always active

### Requirement: Banner display on public pages
When a banner is active, the system SHALL render it as a dismissible bar at the top of every public page, above all other content. The banner SHALL use the configured variant for styling (info=blue, warning=amber, success=green). The dismiss state SHALL be stored in the browser's localStorage and persist across page views.

#### Scenario: Active banner on landing page
- **WHEN** a banner is active and a visitor views `/`
- **THEN** the banner appears at the top of the page

#### Scenario: Active banner on all public pages
- **WHEN** a banner is active and a visitor views `/posts/welcome`
- **THEN** the banner appears at the top of the page

#### Scenario: Banner dismissed
- **WHEN** a visitor clicks the close button on a banner
- **THEN** the banner is hidden and remains hidden on subsequent page views via localStorage

#### Scenario: Dismissal resets per banner
- **WHEN** a visitor dismisses one banner and a new banner becomes active
- **THEN** the new banner is displayed (dismissal is keyed by banner ID)

### Requirement: Banner variant styling
The system SHALL support three banner variants with distinct visual styles: `info` (blue background, white text), `warning` (amber background, dark text), `success` (green background, white text). All variants SHALL meet WCAG 2.1 AA contrast requirements.

#### Scenario: Warning variant renders
- **WHEN** a banner has variant="warning"
- **THEN** the banner renders with an amber background and dark text meeting 4.5:1 contrast ratio

### Requirement: Banner admin management
The admin SHALL provide a banner management page at `/admin/banners` with a list of all banners and an editor form. The editor SHALL include fields for text (required), enabled toggle, start date, end date, and variant selector (info/warning/success). The list SHALL show each banner's active status based on current date and enabled state.

#### Scenario: Enable a banner
- **WHEN** a user toggles a banner from disabled to enabled and saves
- **THEN** the banner's enabled field is updated in draft status

#### Scenario: Active status indicator in admin
- **WHEN** a banner is within its date range, enabled, and published
- **THEN** the admin list shows it as "Active" with a green indicator
