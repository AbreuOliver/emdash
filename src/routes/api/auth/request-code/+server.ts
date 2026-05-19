import { json } from '@sveltejs/kit';

import { authConfig } from '$lib/server/auth/config';
import { createOtpChallenge } from '$lib/server/auth/store';
import { writeAuditEvent } from '$lib/server/audit/logger';

export async function POST({ request, url }) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body.email === 'string' ? body.email : '';

  const result = createOtpChallenge(email);

  if (!result.ok) {
    await writeAuditEvent({
      action: 'auth.request_code',
      status: 'denied',
      message: result.error,
      route: url.pathname,
      details: { email }
    });
    return json({ ok: false, error: result.error }, { status: 400 });
  }

  await writeAuditEvent({
    action: 'auth.request_code',
    status: 'ok',
    route: url.pathname,
    details: { email }
  });

  return json({
    ok: true,
    expiresAt: result.expiresAt,
    ...(authConfig.exposeDevOtp ? { devCode: result.code } : {})
  });
}
