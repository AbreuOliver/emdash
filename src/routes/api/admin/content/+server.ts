import { json } from '@sveltejs/kit';
import type { CmsData } from '$lib/cms-schema';
import { requireAdminUser } from '$lib/server/auth/guard';
import { validateCmsPayload } from '$lib/server/cms/validation';

import { auditContext, writeAuditEvent } from '$lib/server/audit/logger';
import { CmsConflictError, readCmsData, writeCmsData } from '$lib/server/cms-store';

export async function GET(event) {
  requireAdminUser(event);
  return json(await readCmsData());
}

export async function PUT(event) {
  const user = requireAdminUser(event);
  const { request } = event;
  const payload = (await request.json()) as CmsData;

  const validationError = validateCmsPayload(payload);
  if (validationError) {
    await writeAuditEvent({
      action: 'admin.content.put',
      status: 'error',
      message: validationError,
      ...auditContext(event)
    });
    return json({ ok: false, error: validationError }, { status: 400 });
  }

  try {
    const saved = await writeCmsData(payload, { expectedRevision: payload.meta?.revision });

    await writeAuditEvent({
      action: 'admin.content.put',
      status: 'ok',
      ...auditContext(event),
      actor: { id: user.id, email: user.email, role: user.role },
      details: { revision: saved.meta.revision }
    });

    return json({ ok: true, meta: saved.meta });
  } catch (error) {
    if (error instanceof CmsConflictError) {
      await writeAuditEvent({
        action: 'admin.content.put',
        status: 'error',
        message: error.message,
        ...auditContext(event),
        actor: { id: user.id, email: user.email, role: user.role },
        details: { baseRevision: payload.meta?.revision }
      });
      return json({ ok: false, error: error.message }, { status: 409 });
    }
    throw error;
  }
}
