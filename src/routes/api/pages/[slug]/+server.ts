import type { RequestHandler } from './$types';
import { getPageBySlug, updatePage, deletePage } from '$lib/server/queries';
import { jsonError, jsonResponse } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ params, locals, url }) => {
  const status = (url.searchParams.get('status') as 'draft' | 'published') || 'published';
  const page = await getPageBySlug(locals.siteId, params.slug, status);
  if (!page) return jsonError('Page not found', 'NOT_FOUND', 404);
  return jsonResponse(page);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  const page = await getPageBySlug(locals.siteId, params.slug, 'draft');
  if (!page) return jsonError('Page not found', 'NOT_FOUND', 404);
  const data = await request.json();
  const updated = await updatePage(locals.siteId, page.id, data);
  if (!updated) return jsonError('Failed to update page', 'UPDATE_FAILED', 500);
  return jsonResponse(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const page = await getPageBySlug(locals.siteId, params.slug, 'draft');
  if (!page) return jsonError('Page not found', 'NOT_FOUND', 404);
  const deleted = await deletePage(page.id, locals.siteId);
  if (!deleted) return jsonError('Failed to delete page', 'DELETE_FAILED', 500);
  return new Response(null, { status: 204 });
};
