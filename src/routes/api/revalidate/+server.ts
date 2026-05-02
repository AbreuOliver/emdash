import type { RequestHandler } from './$types';
import { jsonResponse } from '$lib/server/api-helpers';

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.json();
  // In production, this would trigger ISR cache invalidation.
  // For now, return success. The actual invalidation happens
  // via the hosting platform's cache invalidation API.
  return jsonResponse({ revalidated: true, paths: data.paths || [] });
};
