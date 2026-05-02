import { getDb } from './db';
import { v7 as uuidv7 } from 'uuid';

export type Status = 'draft' | 'published';

export type SiteSettings = {
  id: string;
  siteId: string;
  title: string;
  tagline: string;
  phone: string;
  email: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
};

export type BusinessHour = {
  id: string;
  siteId: string;
  label: string;
  opens: string;
  closes: string;
  closed: boolean;
  sortOrder: number;
  status: Status;
  createdAt: string;
  updatedAt: string;
};

export type Post = {
  id: string;
  siteId: string;
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string | null;
  body: string;
  imageId: string | null;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoNoIndex: boolean;
  status: Status;
  createdAt: string;
  updatedAt: string;
};

export type Page = {
  id: string;
  siteId: string;
  slug: string;
  title: string;
  body: string;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoNoIndex: boolean;
  status: Status;
  createdAt: string;
  updatedAt: string;
};

export type Event = {
  id: string;
  siteId: string;
  title: string;
  description: string;
  startDateTime: string;
  endDateTime: string | null;
  location: string;
  imageId: string | null;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  seoNoIndex: boolean;
  status: Status;
  createdAt: string;
  updatedAt: string;
};

export type Banner = {
  id: string;
  siteId: string;
  text: string;
  enabled: boolean;
  startDate: string | null;
  endDate: string | null;
  variant: 'info' | 'warning' | 'success';
  status: Status;
  createdAt: string;
  updatedAt: string;
};

export type Image = {
  id: string;
  siteId: string;
  imagekitFileId: string;
  imagekitUrl: string;
  originalFilename: string | null;
  width: number | null;
  height: number | null;
  fileSize: number | null;
  mimeType: string | null;
  createdAt: string;
};

function rowToSettings(row: Record<string, unknown>): SiteSettings {
  return {
    id: row.id as string,
    siteId: row.site_id as string,
    title: row.title as string,
    tagline: (row.tagline as string) ?? '',
    phone: (row.phone as string) ?? '',
    email: (row.email as string) ?? '',
    address: (row.address as string) ?? '',
    facebookUrl: (row.facebook_url as string) ?? '',
    instagramUrl: (row.instagram_url as string) ?? '',
    status: row.status as Status,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToHour(row: Record<string, unknown>): BusinessHour {
  return {
    id: row.id as string,
    siteId: row.site_id as string,
    label: row.label as string,
    opens: (row.opens as string) ?? '',
    closes: (row.closes as string) ?? '',
    closed: (row.closed as number) === 1,
    sortOrder: row.sort_order as number,
    status: row.status as Status,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToPost(row: Record<string, unknown>): Post {
  return {
    id: row.id as string,
    siteId: row.site_id as string,
    slug: row.slug as string,
    title: row.title as string,
    excerpt: (row.excerpt as string) ?? '',
    publishedAt: (row.published_at as string) ?? null,
    body: (row.body as string) ?? '',
    imageId: (row.image_id as string) ?? null,
    seoTitle: (row.seo_title as string) ?? '',
    seoDescription: (row.seo_description as string) ?? '',
    seoKeywords: (row.seo_keywords as string) ?? '',
    seoNoIndex: (row.seo_no_index as number) === 1,
    status: row.status as Status,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToPage(row: Record<string, unknown>): Page {
  return {
    id: row.id as string,
    siteId: row.site_id as string,
    slug: row.slug as string,
    title: row.title as string,
    body: (row.body as string) ?? '',
    seoTitle: (row.seo_title as string) ?? '',
    seoDescription: (row.seo_description as string) ?? '',
    seoKeywords: (row.seo_keywords as string) ?? '',
    seoNoIndex: (row.seo_no_index as number) === 1,
    status: row.status as Status,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToEvent(row: Record<string, unknown>): Event {
  return {
    id: row.id as string,
    siteId: row.site_id as string,
    title: row.title as string,
    description: (row.description as string) ?? '',
    startDateTime: row.start_datetime as string,
    endDateTime: (row.end_datetime as string) ?? null,
    location: (row.location as string) ?? '',
    imageId: (row.image_id as string) ?? null,
    seoTitle: (row.seo_title as string) ?? '',
    seoDescription: (row.seo_description as string) ?? '',
    seoKeywords: (row.seo_keywords as string) ?? '',
    seoNoIndex: (row.seo_no_index as number) === 1,
    status: row.status as Status,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToBanner(row: Record<string, unknown>): Banner {
  return {
    id: row.id as string,
    siteId: row.site_id as string,
    text: row.text as string,
    enabled: (row.enabled as number) === 1,
    startDate: (row.start_date as string) ?? null,
    endDate: (row.end_date as string) ?? null,
    variant: row.variant as 'info' | 'warning' | 'success',
    status: row.status as Status,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

function rowToImage(row: Record<string, unknown>): Image {
  return {
    id: row.id as string,
    siteId: row.site_id as string,
    imagekitFileId: row.imagekit_file_id as string,
    imagekitUrl: row.imagekit_url as string,
    originalFilename: (row.original_filename as string) ?? null,
    width: (row.width as number) ?? null,
    height: (row.height as number) ?? null,
    fileSize: (row.file_size as number) ?? null,
    mimeType: (row.mime_type as string) ?? null,
    createdAt: row.created_at as string,
  };
}

export async function getSiteByApiKey(apiKey: string) {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM sites WHERE api_key = ?',
    args: [apiKey],
  });
  if (result.rows.length === 0) return null;
  return result.rows[0];
}

// Settings
export async function getSettings(siteId: string, status: Status = 'published') {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM site_settings WHERE site_id = ? AND status = ?',
    args: [siteId, status],
  });
  if (result.rows.length === 0) return null;
  return rowToSettings(result.rows[0]);
}

export async function upsertSettings(siteId: string, data: Partial<SiteSettings>, status: Status = 'draft') {
  const db = getDb();
  const existing = await getSettings(siteId, status);
  const id = existing?.id ?? uuidv7();
  const now = new Date().toISOString();

  await db.execute({
    sql: `INSERT OR REPLACE INTO site_settings
      (id, site_id, title, tagline, phone, email, address, facebook_url, instagram_url, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM site_settings WHERE id = ?), ?), ?)`,
    args: [
      id, siteId,
      data.title ?? '', data.tagline ?? '', data.phone ?? '', data.email ?? '', data.address ?? '',
      data.facebookUrl ?? '', data.instagramUrl ?? '',
      status, id, now, now,
    ],
  });
  return getSettings(siteId, status);
}

// Hours
export async function getHours(siteId: string, status: Status = 'published'): Promise<BusinessHour[]> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM business_hours WHERE site_id = ? AND status = ? ORDER BY sort_order ASC',
    args: [siteId, status],
  });
  return result.rows.map(rowToHour);
}

export async function upsertHours(siteId: string, hours: Omit<BusinessHour, 'id' | 'siteId' | 'status' | 'createdAt' | 'updatedAt'>[], status: Status = 'draft') {
  const db = getDb();
  const existing = await getHours(siteId, status);
  const existingMap = new Map(existing.map((h) => [h.label, h]));
  const now = new Date().toISOString();

  const tx = await db.transaction('write');
  try {
    for (const h of hours) {
      const existingEntry = existingMap.get(h.label);
      const id = existingEntry?.id ?? uuidv7();
      await tx.execute({
        sql: `INSERT OR REPLACE INTO business_hours
          (id, site_id, label, opens, closes, closed, sort_order, status, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, COALESCE((SELECT created_at FROM business_hours WHERE id = ?), ?), ?)`,
        args: [id, siteId, h.label, h.opens, h.closes, h.closed ? 1 : 0, h.sortOrder, status, id, now, now],
      });
    }
    await tx.commit();
  } finally {
    tx.close();
  }
  return getHours(siteId, status);
}

// Posts
export async function getPosts(siteId: string, status: Status = 'published'): Promise<Post[]> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM posts WHERE site_id = ? AND status = ? ORDER BY published_at DESC',
    args: [siteId, status],
  });
  return result.rows.map(rowToPost);
}

export async function getPostBySlug(siteId: string, slug: string, status: Status = 'published'): Promise<Post | null> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM posts WHERE site_id = ? AND slug = ? AND status = ?',
    args: [siteId, slug, status],
  });
  if (result.rows.length === 0) return null;
  return rowToPost(result.rows[0]);
}

export async function createPost(siteId: string, data: { slug: string; title: string; excerpt?: string; publishedAt?: string; body?: string; imageId?: string | null; seoTitle?: string; seoDescription?: string; seoKeywords?: string; seoNoIndex?: boolean }): Promise<Post> {
  const db = getDb();
  const id = uuidv7();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO posts
      (id, site_id, slug, title, excerpt, published_at, body, image_id, seo_title, seo_description, seo_keywords, seo_no_index, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`,
    args: [id, siteId, data.slug, data.title, data.excerpt ?? '', data.publishedAt ?? null, data.body ?? '', data.imageId ?? null, data.seoTitle ?? '', data.seoDescription ?? '', data.seoKeywords ?? '', data.seoNoIndex ? 1 : 0, now, now],
  });
  const post = await getPostBySlug(siteId, data.slug, 'draft');
  if (!post) throw new Error('Failed to create post');
  return post;
}

export async function updatePost(siteId: string, id: string, data: Partial<Post>): Promise<Post | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const fields: string[] = [];
  const args: Array<string | number | boolean | null> = [];
  if (data.title !== undefined) { fields.push('title = ?'); args.push(data.title); }
  if (data.slug !== undefined) { fields.push('slug = ?'); args.push(data.slug); }
  if (data.excerpt !== undefined) { fields.push('excerpt = ?'); args.push(data.excerpt); }
  if (data.publishedAt !== undefined) { fields.push('published_at = ?'); args.push(data.publishedAt); }
  if (data.body !== undefined) { fields.push('body = ?'); args.push(data.body); }
  if (data.imageId !== undefined) { fields.push('image_id = ?'); args.push(data.imageId); }
  if (data.seoTitle !== undefined) { fields.push('seo_title = ?'); args.push(data.seoTitle); }
  if (data.seoDescription !== undefined) { fields.push('seo_description = ?'); args.push(data.seoDescription); }
  if (data.seoKeywords !== undefined) { fields.push('seo_keywords = ?'); args.push(data.seoKeywords); }
  if (data.seoNoIndex !== undefined) { fields.push('seo_no_index = ?'); args.push(data.seoNoIndex ? 1 : 0); }
  fields.push('updated_at = ?');
  args.push(now);
  args.push(id, siteId);
  await db.execute({
    sql: `UPDATE posts SET ${fields.join(', ')} WHERE id = ? AND site_id = ?`,
    args,
  });
  const result = await db.execute({ sql: 'SELECT * FROM posts WHERE id = ?', args: [id] });
  if (result.rows.length === 0) return null;
  return rowToPost(result.rows[0]);
}

export async function deletePost(id: string, siteId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.execute({ sql: 'DELETE FROM posts WHERE id = ? AND site_id = ?', args: [id, siteId] });
  return result.rowsAffected > 0;
}

// Pages
export async function getPages(siteId: string, status: Status = 'published'): Promise<Page[]> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM pages WHERE site_id = ? AND status = ? ORDER BY title ASC',
    args: [siteId, status],
  });
  return result.rows.map(rowToPage);
}

export async function getPageBySlug(siteId: string, slug: string, status: Status = 'published'): Promise<Page | null> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM pages WHERE site_id = ? AND slug = ? AND status = ?',
    args: [siteId, slug, status],
  });
  if (result.rows.length === 0) return null;
  return rowToPage(result.rows[0]);
}

export async function createPage(siteId: string, data: { slug: string; title: string; body?: string; seoTitle?: string; seoDescription?: string; seoKeywords?: string; seoNoIndex?: boolean }): Promise<Page> {
  const db = getDb();
  const id = uuidv7();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO pages
      (id, site_id, slug, title, body, seo_title, seo_description, seo_keywords, seo_no_index, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`,
    args: [id, siteId, data.slug, data.title, data.body ?? '', data.seoTitle ?? '', data.seoDescription ?? '', data.seoKeywords ?? '', data.seoNoIndex ? 1 : 0, now, now],
  });
  const page = await getPageBySlug(siteId, data.slug, 'draft');
  if (!page) throw new Error('Failed to create page');
  return page;
}

export async function updatePage(siteId: string, id: string, data: Partial<Page>): Promise<Page | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const fields: string[] = [];
  const args: Array<string | number | boolean | null> = [];
  if (data.title !== undefined) { fields.push('title = ?'); args.push(data.title); }
  if (data.slug !== undefined) { fields.push('slug = ?'); args.push(data.slug); }
  if (data.body !== undefined) { fields.push('body = ?'); args.push(data.body); }
  if (data.seoTitle !== undefined) { fields.push('seo_title = ?'); args.push(data.seoTitle); }
  if (data.seoDescription !== undefined) { fields.push('seo_description = ?'); args.push(data.seoDescription); }
  if (data.seoKeywords !== undefined) { fields.push('seo_keywords = ?'); args.push(data.seoKeywords); }
  if (data.seoNoIndex !== undefined) { fields.push('seo_no_index = ?'); args.push(data.seoNoIndex ? 1 : 0); }
  fields.push('updated_at = ?');
  args.push(now);
  args.push(id, siteId);
  await db.execute({
    sql: `UPDATE pages SET ${fields.join(', ')} WHERE id = ? AND site_id = ?`,
    args,
  });
  const result = await db.execute({ sql: 'SELECT * FROM pages WHERE id = ?', args: [id] });
  if (result.rows.length === 0) return null;
  return rowToPage(result.rows[0]);
}

export async function deletePage(id: string, siteId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.execute({ sql: 'DELETE FROM pages WHERE id = ? AND site_id = ?', args: [id, siteId] });
  return result.rowsAffected > 0;
}

// Events
export async function getEvents(siteId: string, status: Status = 'published', upcoming = false): Promise<Event[]> {
  const db = getDb();
  const now = new Date().toISOString();
  let sql = 'SELECT * FROM events WHERE site_id = ? AND status = ?';
  const args: Array<string | number | boolean | null> = [siteId, status];
  if (upcoming) {
    sql += ' AND start_datetime >= ?';
    args.push(now);
  }
  sql += ' ORDER BY start_datetime ASC';
  const result = await db.execute({ sql, args });
  return result.rows.map(rowToEvent);
}

export async function getEventById(siteId: string, id: string, status: Status = 'published'): Promise<Event | null> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM events WHERE id = ? AND site_id = ? AND status = ?',
    args: [id, siteId, status],
  });
  if (result.rows.length === 0) return null;
  return rowToEvent(result.rows[0]);
}

export async function createEvent(siteId: string, data: { title: string; description?: string; startDateTime: string; endDateTime?: string | null; location?: string; imageId?: string | null; seoTitle?: string; seoDescription?: string; seoKeywords?: string; seoNoIndex?: boolean }): Promise<Event> {
  const db = getDb();
  const id = uuidv7();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO events
      (id, site_id, title, description, start_datetime, end_datetime, location, image_id, seo_title, seo_description, seo_keywords, seo_no_index, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`,
    args: [id, siteId, data.title, data.description ?? '', data.startDateTime, data.endDateTime ?? null, data.location ?? '', data.imageId ?? null, data.seoTitle ?? '', data.seoDescription ?? '', data.seoKeywords ?? '', data.seoNoIndex ? 1 : 0, now, now],
  });
  const event = await getEventById(siteId, id, 'draft');
  if (!event) throw new Error('Failed to create event');
  return event;
}

export async function updateEvent(siteId: string, id: string, data: Partial<Event>): Promise<Event | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const fields: string[] = [];
  const args: Array<string | number | boolean | null> = [];
  if (data.title !== undefined) { fields.push('title = ?'); args.push(data.title); }
  if (data.description !== undefined) { fields.push('description = ?'); args.push(data.description); }
  if (data.startDateTime !== undefined) { fields.push('start_datetime = ?'); args.push(data.startDateTime); }
  if (data.endDateTime !== undefined) { fields.push('end_datetime = ?'); args.push(data.endDateTime); }
  if (data.location !== undefined) { fields.push('location = ?'); args.push(data.location); }
  if (data.imageId !== undefined) { fields.push('image_id = ?'); args.push(data.imageId); }
  if (data.seoTitle !== undefined) { fields.push('seo_title = ?'); args.push(data.seoTitle); }
  if (data.seoDescription !== undefined) { fields.push('seo_description = ?'); args.push(data.seoDescription); }
  if (data.seoKeywords !== undefined) { fields.push('seo_keywords = ?'); args.push(data.seoKeywords); }
  if (data.seoNoIndex !== undefined) { fields.push('seo_no_index = ?'); args.push(data.seoNoIndex ? 1 : 0); }
  fields.push('updated_at = ?');
  args.push(now);
  args.push(id, siteId);
  await db.execute({
    sql: `UPDATE events SET ${fields.join(', ')} WHERE id = ? AND site_id = ?`,
    args,
  });
  const result = await db.execute({ sql: 'SELECT * FROM events WHERE id = ?', args: [id] });
  if (result.rows.length === 0) return null;
  return rowToEvent(result.rows[0]);
}

export async function deleteEvent(id: string, siteId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.execute({ sql: 'DELETE FROM events WHERE id = ? AND site_id = ?', args: [id, siteId] });
  return result.rowsAffected > 0;
}

// Banners
export async function getBanners(siteId: string, status: Status = 'published'): Promise<Banner[]> {
  const db = getDb();
  const result = await db.execute({
    sql: 'SELECT * FROM banners WHERE site_id = ? AND status = ? ORDER BY created_at DESC',
    args: [siteId, status],
  });
  return result.rows.map(rowToBanner);
}

export function isBannerActive(banner: Banner): boolean {
  if (!banner.enabled) return false;
  const now = new Date();
  if (banner.startDate) {
    if (now < new Date(banner.startDate)) return false;
  }
  if (banner.endDate) {
    if (now > new Date(banner.endDate)) return false;
  }
  return true;
}

export async function createBanner(siteId: string, data: { text: string; enabled?: boolean; startDate?: string | null; endDate?: string | null; variant?: 'info' | 'warning' | 'success' }): Promise<Banner> {
  const db = getDb();
  const id = uuidv7();
  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO banners
      (id, site_id, text, enabled, start_date, end_date, variant, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, 'draft', ?, ?)`,
    args: [id, siteId, data.text, data.enabled ? 1 : 0, data.startDate ?? null, data.endDate ?? null, data.variant ?? 'info', now, now],
  });
  const banner = await db.execute({ sql: 'SELECT * FROM banners WHERE id = ?', args: [id] });
  return rowToBanner(banner.rows[0]);
}

export async function updateBanner(siteId: string, id: string, data: Partial<Banner>): Promise<Banner | null> {
  const db = getDb();
  const now = new Date().toISOString();
  const fields: string[] = [];
  const args: Array<string | number | boolean | null> = [];
  if (data.text !== undefined) { fields.push('text = ?'); args.push(data.text); }
  if (data.enabled !== undefined) { fields.push('enabled = ?'); args.push(data.enabled ? 1 : 0); }
  if (data.startDate !== undefined) { fields.push('start_date = ?'); args.push(data.startDate); }
  if (data.endDate !== undefined) { fields.push('end_date = ?'); args.push(data.endDate); }
  if (data.variant !== undefined) { fields.push('variant = ?'); args.push(data.variant); }
  fields.push('updated_at = ?');
  args.push(now);
  args.push(id, siteId);
  await db.execute({
    sql: `UPDATE banners SET ${fields.join(', ')} WHERE id = ? AND site_id = ?`,
    args,
  });
  const result = await db.execute({ sql: 'SELECT * FROM banners WHERE id = ?', args: [id] });
  if (result.rows.length === 0) return null;
  return rowToBanner(result.rows[0]);
}

export async function deleteBanner(id: string, siteId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.execute({ sql: 'DELETE FROM banners WHERE id = ? AND site_id = ?', args: [id, siteId] });
  return result.rowsAffected > 0;
}

// Images
export async function createImage(siteId: string, data: { imagekitFileId: string; imagekitUrl: string; originalFilename?: string; width?: number; height?: number; fileSize?: number; mimeType?: string }): Promise<Image> {
  const db = getDb();
  const id = uuidv7();
  await db.execute({
    sql: `INSERT INTO images (id, site_id, imagekit_file_id, imagekit_url, original_filename, width, height, file_size, mime_type)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [id, siteId, data.imagekitFileId, data.imagekitUrl, data.originalFilename ?? null, data.width ?? null, data.height ?? null, data.fileSize ?? null, data.mimeType ?? null],
  });
  const result = await db.execute({ sql: 'SELECT * FROM images WHERE id = ?', args: [id] });
  return rowToImage(result.rows[0]);
}

export async function getImageById(id: string, siteId: string): Promise<Image | null> {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM images WHERE id = ? AND site_id = ?', args: [id, siteId] });
  if (result.rows.length === 0) return null;
  return rowToImage(result.rows[0]);
}

export async function getImagesBySite(siteId: string): Promise<Image[]> {
  const db = getDb();
  const result = await db.execute({ sql: 'SELECT * FROM images WHERE site_id = ? ORDER BY created_at DESC', args: [siteId] });
  return result.rows.map(rowToImage);
}

export async function deleteImage(id: string, siteId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.execute({ sql: 'DELETE FROM images WHERE id = ? AND site_id = ?', args: [id, siteId] });
  return result.rowsAffected > 0;
}

// Publish
export type PublishPayload =
  | { type: 'all' }
  | { type: 'settings' }
  | { type: 'hours' }
  | { type: 'post'; id: string }
  | { type: 'page'; id: string }
  | { type: 'event'; id: string }
  | { type: 'banner'; id: string };

export async function publishContent(siteId: string, payload: PublishPayload): Promise<void> {
  const db = getDb();
  const tx = await db.transaction('write');
  try {
    const now = new Date().toISOString();
    if (payload.type === 'all') {
      await tx.execute({ sql: "UPDATE site_settings SET status = 'published', updated_at = ? WHERE site_id = ? AND status = 'draft'", args: [now, siteId] });
      await tx.execute({ sql: "UPDATE business_hours SET status = 'published', updated_at = ? WHERE site_id = ? AND status = 'draft'", args: [now, siteId] });
      await tx.execute({ sql: "UPDATE posts SET status = 'published', updated_at = ? WHERE site_id = ? AND status = 'draft'", args: [now, siteId] });
      await tx.execute({ sql: "UPDATE pages SET status = 'published', updated_at = ? WHERE site_id = ? AND status = 'draft'", args: [now, siteId] });
      await tx.execute({ sql: "UPDATE events SET status = 'published', updated_at = ? WHERE site_id = ? AND status = 'draft'", args: [now, siteId] });
      await tx.execute({ sql: "UPDATE banners SET status = 'published', updated_at = ? WHERE site_id = ? AND status = 'draft'", args: [now, siteId] });
    } else if (payload.type === 'settings') {
      await tx.execute({ sql: "UPDATE site_settings SET status = 'published', updated_at = ? WHERE site_id = ? AND status = 'draft'", args: [now, siteId] });
    } else if (payload.type === 'hours') {
      await tx.execute({ sql: "UPDATE business_hours SET status = 'published', updated_at = ? WHERE site_id = ? AND status = 'draft'", args: [now, siteId] });
    } else {
      const table = payload.type === 'post' ? 'posts' : payload.type === 'page' ? 'pages' : payload.type === 'event' ? 'events' : 'banners';
      await tx.execute({
        sql: `UPDATE ${table} SET status = 'published', updated_at = ? WHERE id = ? AND site_id = ? AND status = 'draft'`,
        args: [now, payload.id, siteId],
      });
    }
    await tx.commit();
  } finally {
    tx.close();
  }
}

// Diff utility
export async function getDraftPublishedDiff(siteId: string) {
  const draftSettings = await getSettings(siteId, 'draft');
  const publishedSettings = await getSettings(siteId, 'published');
  const draftHours = await getHours(siteId, 'draft');
  const publishedHours = await getHours(siteId, 'published');
  const draftPosts = await getPosts(siteId, 'draft');
  const publishedPosts = await getPosts(siteId, 'published');
  const draftPages = await getPages(siteId, 'draft');
  const publishedPages = await getPages(siteId, 'published');
  const draftEvents = await getEvents(siteId, 'draft');
  const publishedEvents = await getEvents(siteId, 'published');
  const draftBanners = await getBanners(siteId, 'draft');
  const publishedBanners = await getBanners(siteId, 'published');

  const changes: string[] = [];

  if (draftSettings && publishedSettings) {
    const fields: (keyof SiteSettings)[] = ['title', 'tagline', 'phone', 'email', 'address', 'facebookUrl', 'instagramUrl'];
    const changedFields = fields.filter((f) => draftSettings[f] !== publishedSettings[f]);
    if (changedFields.length > 0) {
      changes.push(`Settings: ${changedFields.join(', ')} updated`);
    }
  } else if (draftSettings && !publishedSettings) {
    changes.push('Settings: created');
  }

  if (draftHours.length !== publishedHours.length) {
    changes.push(`Hours: ${draftHours.length} entries (was ${publishedHours.length})`);
  } else {
    const hourChanges = draftHours.filter((dh) => {
      const ph = publishedHours.find((p) => p.label === dh.label);
      return !ph || ph.opens !== dh.opens || ph.closes !== dh.closes || ph.closed !== dh.closed;
    });
    if (hourChanges.length > 0) {
      changes.push(`Hours: ${hourChanges.map((h) => h.label).join(', ')} modified`);
    }
  }

  const publishedPostIds = new Set(publishedPosts.map((p) => p.id));
  const newPosts = draftPosts.filter((p) => !publishedPostIds.has(p.id));
  const editedPosts = draftPosts.filter((p) => {
    const pp = publishedPosts.find((pp) => pp.id === p.id);
    return pp && (pp.title !== p.title || pp.body !== p.body || pp.excerpt !== p.excerpt);
  });
  const deletedPosts = publishedPosts.filter((p) => !draftPosts.find((dp) => dp.id === p.id));
  if (newPosts.length) changes.push(`Posts: ${newPosts.length} added`);
  if (editedPosts.length) changes.push(`Posts: ${editedPosts.length} edited`);
  if (deletedPosts.length) changes.push(`Posts: ${deletedPosts.length} deleted`);

  const publishedPageIds = new Set(publishedPages.map((p) => p.id));
  const newPages = draftPages.filter((p) => !publishedPageIds.has(p.id));
  const editedPages = draftPages.filter((p) => {
    const pp = publishedPages.find((pp) => pp.id === p.id);
    return pp && (pp.title !== p.title || pp.body !== p.body);
  });
  const deletedPages = publishedPages.filter((p) => !draftPages.find((dp) => dp.id === p.id));
  if (newPages.length) changes.push(`Pages: ${newPages.length} added`);
  if (editedPages.length) changes.push(`Pages: ${editedPages.length} edited`);
  if (deletedPages.length) changes.push(`Pages: ${deletedPages.length} deleted`);

  const publishedEventIds = new Set(publishedEvents.map((e) => e.id));
  const newEvents = draftEvents.filter((e) => !publishedEventIds.has(e.id));
  const editedEvents = draftEvents.filter((e) => {
    const pe = publishedEvents.find((pe) => pe.id === e.id);
    return pe && (pe.title !== e.title || pe.description !== e.description);
  });
  const deletedEvents = publishedEvents.filter((e) => !draftEvents.find((de) => de.id === e.id));
  if (newEvents.length) changes.push(`Events: ${newEvents.length} added`);
  if (editedEvents.length) changes.push(`Events: ${editedEvents.length} edited`);
  if (deletedEvents.length) changes.push(`Events: ${deletedEvents.length} deleted`);

  const publishedBannerIds = new Set(publishedBanners.map((b) => b.id));
  const newBanners = draftBanners.filter((b) => !publishedBannerIds.has(b.id));
  const editedBanners = draftBanners.filter((b) => {
    const pb = publishedBanners.find((pb) => pb.id === b.id);
    return pb && (pb.text !== b.text || pb.enabled !== b.enabled);
  });
  const deletedBanners = publishedBanners.filter((b) => !draftBanners.find((db) => db.id === b.id));
  if (newBanners.length) changes.push(`Banners: ${newBanners.length} added`);
  if (editedBanners.length) changes.push(`Banners: ${editedBanners.length} edited`);
  if (deletedBanners.length) changes.push(`Banners: ${deletedBanners.length} deleted`);

  return changes;
}
