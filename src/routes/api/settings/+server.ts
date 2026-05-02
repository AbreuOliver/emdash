import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getSettings, upsertSettings } from '$lib/server/queries';
import { jsonResponse } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ locals }) => {
  const settings = await getSettings(locals.siteId, locals.isPreview ? 'draft' : 'published');
  if (!settings) return jsonResponse({});
  return jsonResponse(settings);
};

export const PUT: RequestHandler = async ({ request, locals }) => {
  const data = await request.json();
  const settings = await upsertSettings(locals.siteId, data, 'draft');
  return jsonResponse(settings);
};
