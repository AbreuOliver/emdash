import { json } from '@sveltejs/kit';

import { authConfig } from '$lib/server/auth/config';
import { createOtpChallenge } from '$lib/server/auth/store';

export async function POST({ request }) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email : '';

  const result = createOtpChallenge(email);

  if (!result.ok) {
    return json({ ok: false, error: result.error }, { status: 400 });
  }

  return json({
    ok: true,
    expiresAt: result.expiresAt,
    ...(authConfig.exposeDevOtp ? { devCode: result.code } : {})
  });
}
