## ADDED Requirements

### Requirement: Draft/publish status in database
The system SHALL use a `status` column (`draft` or `published`) on all content tables (`site_settings`, `business_hours`, `posts`, `pages`, `events`, `banners`) to manage the draft/publish workflow. The admin SHALL operate on draft rows by default. The public API and Astro build SHALL read only published rows.

#### Scenario: Admin loads draft content
- **WHEN** a user opens the admin panel
- **THEN** the admin fetches content with `?status=draft` from the API

#### Scenario: Public site uses published content
- **WHEN** the Astro build runs
- **THEN** it fetches content with `?status=published` (the default) from the API

#### Scenario: No draft exists
- **WHEN** a user opens the admin and no draft row exists for settings
- **THEN** the admin creates a draft row by copying the published values

### Requirement: Save edits to draft
The API SHALL save all create and update operations to `status=draft` by default. Saving SHALL NOT affect published rows until an explicit publish action transitions the status.

#### Scenario: Edit hours in draft
- **WHEN** a PUT request updates hours via the API
- **THEN** the hours rows are updated with `status=draft`

#### Scenario: Multiple edits accumulate
- **WHEN** a user edits hours, then a post, then a banner
- **THEN** all changes are saved as draft rows without affecting published content

### Requirement: Preview draft content
The admin SHALL provide a "Preview" action that opens the public site rendered with draft content. The preview SHALL be implemented by the API serving draft content when a `X-Preview-Mode: true` header is present, or by a dedicated preview build. A visible "Preview" banner SHALL be displayed at the top of the preview page.

#### Scenario: Preview from admin
- **WHEN** a user clicks "Preview" in the admin
- **THEN** a new tab opens showing the site with draft content and a "Preview" indicator banner

#### Scenario: Preview shows unpublished changes
- **WHEN** hours have been edited in draft but not published
- **THEN** the preview shows the new hours while the live site shows the old hours

### Requirement: Publish action
The API SHALL provide a `POST /api/publish` endpoint that transitions specified content from `draft` to `published`. After successful publishing, the endpoint SHALL trigger an ISR revalidation of affected public pages. The publish action SHALL be transactional — all specified items are published or none.

#### Scenario: Publish changes
- **WHEN** a POST request is made to `/api/publish` with content identifiers
- **THEN** the specified items' status changes from `draft` to `published` and ISR revalidation is triggered

#### Scenario: Publish triggers revalidation
- **WHEN** a post is published
- **THEN** the ISR revalidation endpoint is called for that post's public page

### Requirement: Publish confirmation with change summary
The admin SHALL display a confirmation dialog before publishing that shows a summary of changes since the last publish. The summary SHALL list: settings fields changed, hours entries modified, posts added/edited/deleted, pages added/edited/deleted, events added/edited/deleted, and banner changes.

#### Scenario: Review changes before publish
- **WHEN** a user clicks "Publish"
- **THEN** a dialog shows "Settings: phone updated; Hours: Monday, Tuesday modified; Posts: 1 edited; Banners: 1 enabled"

#### Scenario: Cancel publish
- **WHEN** a user clicks "Cancel" on the publish confirmation
- **THEN** no changes are published and the user returns to the admin

### Requirement: Unpublished changes indicator
The admin SHALL compare draft and published content to determine if there are unpublished changes. When differences exist, the admin header SHALL display "You have unpublished changes" with a "Publish" button. When draft matches published, no indicator is shown.

#### Scenario: Show pending changes indicator
- **WHEN** the draft differs from published content
- **THEN** the admin header shows an unpublished changes indicator with a publish button

#### Scenario: No pending changes
- **WHEN** the draft matches published content exactly
- **THEN** no unpublished changes indicator is shown
