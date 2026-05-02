import type { RequestHandler } from './$types';
import { getHours, upsertHours } from '$lib/server/queries';
import { jsonResponse } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ locals }) => {
  const hours = await getHours(locals.siteId, locals.isPreview ? 'draft' : 'published');
  return jsonResponse(hours);
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  const data = await request.json();
  const hours = await upsertHours(locals.siteId, data, 'draft');
  return jsonResponse(hours);
};
