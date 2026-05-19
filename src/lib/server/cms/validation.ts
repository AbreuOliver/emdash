import type { CmsData, Page, Post } from '$lib/cms-schema';

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

  if (!Array.isArray(payload.site?.hours) || payload.site.hours.length < 7) {
    return 'Hours must include at least 7 days.';
  }

  const postError = validatePosts(payload.posts ?? []);
  if (postError) return postError;

  const pageError = validatePages(payload.pages ?? []);
  if (pageError) return pageError;

  return null;
}
