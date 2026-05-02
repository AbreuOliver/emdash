import type { Handle } from '@sveltejs/kit';
import { getSiteByApiKey } from '$lib/server/queries';

export const handle: Handle = async ({ event, resolve }) => {
  if (!event.url.pathname.startsWith('/api/')) {
    return resolve(event);
  }

  const apiKey = event.request.headers.get('X-Site-Key');
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'Missing X-Site-Key header', code: 'AUTH_REQUIRED' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const site = await getSiteByApiKey(apiKey);
  if (!site) {
    return new Response(
      JSON.stringify({ error: 'Invalid site key', code: 'INVALID_KEY' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    );
  }

  event.locals.siteId = site.id as string;
  event.locals.siteKey = site.api_key as string;
  event.locals.isPreview = event.request.headers.get('X-Preview-Mode') === 'true';

  return resolve(event);
};
