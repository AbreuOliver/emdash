import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';

import { authConfig } from '$lib/server/auth/config';
import { verifyOtpChallenge } from '$lib/server/auth/store';
import { writeAuditEvent } from '$lib/server/audit/logger';

export async function POST({ request, cookies, url }) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email : '';
  const code = typeof body.code === 'string' ? body.code : '';

  const result = verifyOtpChallenge(email, code);

  if (!result.ok) {
    await writeAuditEvent({
      action: 'auth.verify_code',
      status: 'denied',
      message: result.error,
      route: url.pathname,
      details: { email }
    });
    return json({ ok: false, error: result.error }, { status: 400 });
  }

  cookies.set(authConfig.sessionCookieName, result.session.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !dev,
    path: '/',
    maxAge: Math.floor(authConfig.sessionTtlMs / 1000)
  });

  await writeAuditEvent({
    action: 'auth.verify_code',
    status: 'ok',
    route: url.pathname,
    actor: {
      id: result.session.user.id,
      email: result.session.user.email,
      role: result.session.user.role
    }
  });

  return json({ ok: true, user: result.session.user });
}
