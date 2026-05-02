## ADDED Requirements

### Requirement: ImageKit service configuration
The system SHALL connect to ImageKit using credentials provided via environment variables (`IMAGEKIT_PUBLIC_KEY`, `IMAGEKIT_PRIVATE_KEY`, `IMAGEKIT_URL_ENDPOINT`). The system SHALL validate the configuration on startup and fail fast if any credential is missing.

#### Scenario: Valid ImageKit configuration
- **WHEN** all three ImageKit environment variables are set
- **THEN** the ImageKit client initializes successfully

#### Scenario: Missing ImageKit credentials
- **WHEN** the `IMAGEKIT_PRIVATE_KEY` is not set
- **THEN** startup fails with a clear error indicating the missing credential

### Requirement: Image upload via API
The API SHALL provide `POST /api/media/upload` that accepts a multipart form with an image file. The server SHALL forward the file to ImageKit's upload API and return the ImageKit file ID, CDN URL, and metadata (dimensions, file size, format). Uploaded images SHALL be stored in a site-specific folder within ImageKit (e.g., `/sites/{site-id}/`).

#### Scenario: Upload an image
- **WHEN** a POST request is made to `/api/media/upload` with a JPEG file
- **THEN** the file is uploaded to ImageKit and the response includes the CDN URL and file ID

#### Scenario: Reject non-image file
- **WHEN** a POST request is made to `/api/media/upload` with a PDF file
- **THEN** the API returns 400 with an error indicating only image files are accepted

### Requirement: Image URL transformation
The system SHALL support ImageKit URL transformations for resizing, format conversion, and quality adjustment. Public pages SHALL reference images using ImageKit CDN URLs with transformation parameters (e.g., `tr:w-800,f-webp,q-80`).

#### Scenario: Generate responsive image URL
- **WHEN** the system generates a URL for a hero image
- **THEN** the URL includes `tr:w-1200,h-600,c-at_max,f-webp` transformation parameters

#### Scenario: Generate thumbnail URL
- **WHEN** the system generates a URL for a post thumbnail
- **THEN** the URL includes `tr:w-400,h-300,c-at_max,f-webp` transformation parameters

### Requirement: Image metadata storage
The system SHALL store image metadata in an `images` table with columns: `id` (UUID), `site_id`, `imagekit_file_id`, `imagekit_url`, `original_filename`, `width`, `height`, `file_size`, `mime_type`, `created_at`. Posts, pages, events, and banners SHALL reference images by their `id` in this table.

#### Scenario: Associate image with a post
- **WHEN** a post is created with an uploaded image
- **THEN** the image is stored in the `images` table and the post references it by ID

#### Scenario: Query images for a site
- **WHEN** the API requests all images for a site
- **THEN** only images belonging to that site are returned

### Requirement: Image validation
The API SHALL validate uploaded images: maximum file size of 10MB, allowed formats (JPEG, PNG, WebP, GIF, AVIF), and maximum dimensions of 8000x8000 pixels. Invalid uploads SHALL be rejected with a 400 error before being sent to ImageKit.

#### Scenario: Reject oversized image
- **WHEN** a POST request uploads a 15MB image
- **THEN** the API returns 400 with an error indicating the file exceeds the 10MB limit

#### Scenario: Reject unsupported format
- **WHEN** a POST request uploads a BMP file
- **THEN** the API returns 400 with an error listing allowed formats
