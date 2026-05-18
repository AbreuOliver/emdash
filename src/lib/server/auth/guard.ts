import { error, type RequestEvent } from '@sveltejs/kit';

import type { SessionUser } from './types';

export function requireAdminUser(event: RequestEvent): SessionUser {
  const user = event.locals.user;

  if (!user) {
    throw error(401, 'Admin authentication required.');
  }

  return user;
}
