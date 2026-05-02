## ADDED Requirements

### Requirement: Industry template registry
The system SHALL maintain a registry of industry-specific templates located in a `templates/` directory. Each template SHALL be identified by a unique kebab-case name (e.g., `restaurant`, `salon`, `shop`, `church`, `service-provider`). The available templates SHALL be exposed via `GET /api/templates`.

#### Scenario: List available templates
- **WHEN** the API is queried for available templates
- **THEN** it returns the list of all template identifiers with display names and descriptions

#### Scenario: Template not found
- **WHEN** a site's template field references a name that does not exist
- **THEN** the system falls back to the default template

### Requirement: Template configuration
Each template SHALL include a `config.json` file defining: the template name, display name, description, landing page sections (ordered list of section identifiers), and default SEO settings. Section identifiers SHALL map to shared or template-specific section components.

#### Scenario: Restaurant template configuration
- **WHEN** the `restaurant` template is loaded
- **THEN** its config specifies sections: hero, about, hours, menu-preview, recent-posts, events-preview, contact, footer

#### Scenario: Salon template configuration
- **WHEN** the `salon` template is loaded
- **THEN** its config specifies sections: hero, services, hours, team, recent-posts, contact, footer

### Requirement: Template Astro layout
Each template SHALL include an Astro layout component that reads the site's template setting, loads the corresponding config, and renders each section in order. Sections SHALL receive CMS data (settings, posts, events, hours) as props. The layout SHALL be the entry point for all public pages.

#### Scenario: Render landing page with template layout
- **WHEN** the Astro build runs with the `restaurant` template selected
- **THEN** the landing page renders all sections defined in the restaurant config in order

#### Scenario: Section receives CMS data
- **WHEN** the hours section renders
- **THEN** it receives the business hours array from the site settings

### Requirement: Template selection
The system SHALL allow the template to be selected via the `template` field in the `sites` table. Changing the template SHALL NOT delete existing content; content that does not map to the new template's sections SHALL be preserved in the database but not rendered on the landing page.

#### Scenario: Switch from restaurant to salon template
- **WHEN** a site's template is changed from `restaurant` to `salon`
- **THEN** all existing posts, pages, and events are preserved and the landing page re-renders with the salon layout

### Requirement: Shared section components
The system SHALL provide reusable section components (Hero, About, Hours, Contact, RecentPosts, EventsPreview, Footer) that all templates can use. Templates MAY override shared components by providing a custom component at `templates/<name>/sections/<SectionName>.astro`.

#### Scenario: Use shared hours component
- **WHEN** a template includes an hours section without a custom override
- **THEN** it renders the shared hours component with the business's hours data

#### Scenario: Override hours component
- **WHEN** the `restaurant` template provides `templates/restaurant/sections/Hours.astro`
- **THEN** the restaurant landing page uses the custom hours component instead of the shared one

### Requirement: Admin template selector
The admin SHALL provide a template selection interface at `/admin/template` showing available templates with preview thumbnails and descriptions. Changing the template SHALL save to draft and require publishing to take effect on the public site.

#### Scenario: Preview template options
- **WHEN** a user opens the template selector
- **THEN** they see all available templates with names, descriptions, and preview images

#### Scenario: Change template to draft
- **WHEN** a user selects a new template and saves
- **THEN** the change is saved to draft status and reflected in preview but not on the live site
