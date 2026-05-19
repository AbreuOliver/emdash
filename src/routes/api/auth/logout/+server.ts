import { json } from '@sveltejs/kit';

import { authConfig } from '$lib/server/auth/config';
import { revokeSession } from '$lib/server/auth/store';
import { auditContext, writeAuditEvent } from '$lib/server/audit/logger';

export async function POST(event) {
  const { cookies } = event;
  const token = cookies.get(authConfig.sessionCookieName);
  revokeSession(token);

  cookies.delete(authConfig.sessionCookieName, {
    path: '/'
  });

  await writeAuditEvent({
    action: 'auth.logout',
    status: 'ok',
    ...auditContext(event)
  });

  return json({ ok: true });
}
