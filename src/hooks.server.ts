import type { Handle } from '@sveltejs/kit';

import { authConfig } from '$lib/server/auth/config';
import { resolveSessionUser } from '$lib/server/auth/session';

export const handle: Handle = async ({ event, resolve }) => {
  const token = event.cookies.get(authConfig.sessionCookieName);
  event.locals.user = resolveSessionUser(token);

  return resolve(event);
};
