import type { RequestHandler } from './$types';
import { getPages, createPage } from '$lib/server/queries';
import { jsonError, jsonResponse } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ url, locals }) => {
  const status = (url.searchParams.get('status') as 'draft' | 'published') || 'published';
  const pages = await getPages(locals.siteId, status);
  return jsonResponse(pages);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const data = await request.json();
  if (!data.title) return jsonError('Title is required', 'VALIDATION_ERROR', 400, { field: 'title' });
  if (!data.slug) data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const page = await createPage(locals.siteId, data);
  return jsonResponse(page, 201);
};
