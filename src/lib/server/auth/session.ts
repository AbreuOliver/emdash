import { dev } from '$app/environment';

import { authConfig } from './config';
import { getSessionByToken } from './store';
import type { SessionUser } from './types';

export function resolveSessionUser(sessionToken: string | undefined): SessionUser | null {
  const session = getSessionByToken(sessionToken);

  if (session) {
    return session.user;
  }

  if (dev && authConfig.allowDevBypass) {
    const fallback = authConfig.allowedAdminEmails[0] ?? 'owner@example.com';
    return {
      id: fallback,
      email: fallback,
      role: 'owner'
    };
  }

  return null;
}
