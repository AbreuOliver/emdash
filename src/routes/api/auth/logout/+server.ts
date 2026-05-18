import { json } from '@sveltejs/kit';

import { authConfig } from '$lib/server/auth/config';
import { revokeSession } from '$lib/server/auth/store';

export async function POST({ cookies }) {
  const token = cookies.get(authConfig.sessionCookieName);
  revokeSession(token);

  cookies.delete(authConfig.sessionCookieName, {
    path: '/'
  });

  return json({ ok: true });
}
