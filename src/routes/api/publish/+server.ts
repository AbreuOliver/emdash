import type { RequestHandler } from './$types';
import { publishContent } from '$lib/server/queries';
import { jsonError, jsonResponse } from '$lib/server/api-helpers';

export const POST: RequestHandler = async ({ request, locals }) => {
  try {
    const payload = await request.json();
    await publishContent(locals.siteId, payload);
    return jsonResponse({ published: true });
  } catch (err) {
    return jsonError(`Publish failed: ${err instanceof Error ? err.message : 'unknown'}`, 'PUBLISH_FAILED', 500);
  }
};
