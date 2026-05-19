import type { BusinessHoursEntry, CmsData, Page, Post, SiteSettings } from '$lib/cms-schema';

const slugPattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidDate(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function validatePosts(posts: Post[]): string | null {
  const postSlugs = new Set<string>();

  for (const post of posts ?? []) {
    if (!isNonEmptyString(post.title)) return 'Post title is required.';
    if (!isNonEmptyString(post.slug)) return `Post slug is required for "${post.title}".`;
    if (!slugPattern.test(post.slug)) return `Invalid post slug "${post.slug}". Use lowercase letters, numbers, and hyphens.`;
    if (postSlugs.has(post.slug)) return `Duplicate post slug "${post.slug}".`;
    postSlugs.add(post.slug);

    if (!isValidDate(post.publishedAt)) {
      return `Post published date must use YYYY-MM-DD for "${post.title || post.slug}".`;
    }

    if (!post.bannerEnabled) continue;

    if (!post.bannerStartDate || !post.bannerEndDate) {
      return `Banner dates are required for "${post.title || post.slug}".`;
    }

    if (!isValidDate(post.bannerStartDate) || !isValidDate(post.bannerEndDate)) {
      return `Banner dates must use YYYY-MM-DD for "${post.title || post.slug}".`;
    }

    if (post.bannerEndDate < post.bannerStartDate) {
      return `Banner end date must be on or after start date for "${post.title || post.slug}".`;
    }
  }

  return null;
}

export function validatePages(pages: Page[]): string | null {
  const pageSlugs = new Set<string>();

  for (const page of pages ?? []) {
    if (!isNonEmptyString(page.title)) return 'Page title is required.';
    if (!isNonEmptyString(page.slug)) return `Page slug is required for "${page.title}".`;
    if (!slugPattern.test(page.slug)) return `Invalid page slug "${page.slug}". Use lowercase letters, numbers, and hyphens.`;
    if (pageSlugs.has(page.slug)) return `Duplicate page slug "${page.slug}".`;
    pageSlugs.add(page.slug);
  }

  return null;
}

export function validateCmsPayload(payload: CmsData): string | null {
  if (!payload || typeof payload !== 'object') return 'Invalid payload.';

  const siteError = validateSiteProfile(payload.site);
  if (siteError) return siteError;

  const hoursError = validateHours(payload.site.hours);
  if (hoursError) return hoursError;

  const postError = validatePosts(payload.posts ?? []);
  if (postError) return postError;

  const pageError = validatePages(payload.pages ?? []);
  if (pageError) return pageError;

  return null;
}

export function validateSiteProfile(site: SiteSettings): string | null {
  if (!site || typeof site !== 'object') return 'Invalid site profile.';
  if (!isNonEmptyString(site.title)) return 'Business name is required.';
  if (!isNonEmptyString(site.tagline)) return 'Tagline is required.';
  if (!isNonEmptyString(site.email)) return 'Email is required.';
  return null;
}

export function validateHours(hours: BusinessHoursEntry[]): string | null {
  if (!Array.isArray(hours) || hours.length < 7) {
    return 'Hours must include at least 7 days.';
  }

  for (const row of hours) {
    if (!isNonEmptyString(row.label)) return 'Each hours row needs a day label.';
    if (row.closed) continue;
    if (!isNonEmptyString(row.opens) || !isNonEmptyString(row.closes)) {
      return `Open and close time are required for "${row.label}".`;
    }
  }

  return null;
}
