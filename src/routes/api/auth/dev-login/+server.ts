import { json } from '@sveltejs/kit';

import { authConfig } from '$lib/server/auth/config';
import { createDevSession } from '$lib/server/auth/store';
import { writeAuditEvent } from '$lib/server/audit/logger';

export async function POST({ cookies, url }) {
  if (!authConfig.allowDevBypass) {
    await writeAuditEvent({
      action: 'auth.dev_login',
      status: 'denied',
      message: 'Dev sign-in is disabled.',
      route: url.pathname
    });
    return json({ ok: false, error: 'Dev sign-in is disabled. Set AUTH_ALLOW_DEV_BYPASS=1.' }, { status: 403 });
  }

  const session = createDevSession();
  cookies.set(authConfig.sessionCookieName, session.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    path: '/',
    maxAge: Math.floor(authConfig.sessionTtlMs / 1000)
  });

  await writeAuditEvent({
    action: 'auth.dev_login',
    status: 'ok',
    route: url.pathname,
    actor: {
      id: session.user.id,
      email: session.user.email,
      role: session.user.role
    }
  });

  return json({ ok: true, user: session.user });
}
