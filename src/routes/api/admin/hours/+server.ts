import { json } from '@sveltejs/kit';
import type { BusinessHoursEntry } from '$lib/cms-schema';
import { requireAdminUser } from '$lib/server/auth/guard';
import { validateHours } from '$lib/server/cms/validation';
import { CmsConflictError, readCmsData, writeCmsData } from '$lib/server/cms-store';
import { auditContext, writeAuditEvent } from '$lib/server/audit/logger';

type PutBody = {
  items: BusinessHoursEntry[];
  baseRevision: number;
};

export async function GET(event) {
  requireAdminUser(event);
  const cms = await readCmsData();
  return json({ items: cms.site.hours, meta: cms.meta });
}

export async function PUT(event) {
  const user = requireAdminUser(event);

  const body = (await event.request.json()) as PutBody;
  const items = Array.isArray(body.items) ? body.items : [];
  const baseRevision = Number(body.baseRevision);

  if (!Number.isFinite(baseRevision)) {
    await writeAuditEvent({ action: 'admin.hours.put', status: 'error', message: 'baseRevision is required.', ...auditContext(event) });
    return json({ ok: false, error: 'baseRevision is required.' }, { status: 400 });
  }

  const validationError = validateHours(items);
  if (validationError) {
    await writeAuditEvent({ action: 'admin.hours.put', status: 'error', message: validationError, ...auditContext(event), details: { count: items.length } });
    return json({ ok: false, error: validationError }, { status: 400 });
  }

  const cms = await readCmsData();

  try {
    const saved = await writeCmsData(
      {
        ...cms,
        site: {
          ...cms.site,
          hours: items
        }
      },
      { expectedRevision: baseRevision }
    );

    await writeAuditEvent({ action: 'admin.hours.put', status: 'ok', ...auditContext(event), actor: { id: user.id, email: user.email, role: user.role }, details: { count: items.length, revision: saved.meta.revision } });

    return json({ ok: true, items: saved.site.hours, meta: saved.meta });
  } catch (error) {
    if (error instanceof CmsConflictError) {
      await writeAuditEvent({ action: 'admin.hours.put', status: 'error', message: error.message, ...auditContext(event), actor: { id: user.id, email: user.email, role: user.role }, details: { count: items.length, baseRevision } });
      return json({ ok: false, error: error.message }, { status: 409 });
    }
    throw error;
  }
}
