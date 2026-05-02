import type { RequestHandler } from './$types';
import { getDraftPublishedDiff } from '$lib/server/queries';
import { jsonResponse } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ locals }) => {
  const changes = await getDraftPublishedDiff(locals.siteId);
  return jsonResponse({ changes });
};
