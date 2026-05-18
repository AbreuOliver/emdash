import { json } from '@sveltejs/kit';
import { dev } from '$app/environment';

import { authConfig } from '$lib/server/auth/config';
import { verifyOtpChallenge } from '$lib/server/auth/store';

export async function POST({ request, cookies }) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email : '';
  const code = typeof body.code === 'string' ? body.code : '';

  const result = verifyOtpChallenge(email, code);

  if (!result.ok) {
    return json({ ok: false, error: result.error }, { status: 400 });
  }

  cookies.set(authConfig.sessionCookieName, result.session.token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: !dev,
    path: '/',
    maxAge: Math.floor(authConfig.sessionTtlMs / 1000)
  });

  return json({ ok: true, user: result.session.user });
}
