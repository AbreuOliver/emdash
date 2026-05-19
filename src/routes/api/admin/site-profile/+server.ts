import { json } from '@sveltejs/kit';
import type { SiteSettings } from '$lib/cms-schema';
import { requireAdminUser } from '$lib/server/auth/guard';
import { validateSiteProfile } from '$lib/server/cms/validation';
import { CmsConflictError, readCmsData, writeCmsData } from '$lib/server/cms-store';
import { auditContext, writeAuditEvent } from '$lib/server/audit/logger';

type PutBody = {
  item: SiteSettings;
  baseRevision: number;
};

export async function GET(event) {
  requireAdminUser(event);
  const cms = await readCmsData();
  return json({ item: cms.site, meta: cms.meta });
}

export async function PUT(event) {
  const user = requireAdminUser(event);

  const body = (await event.request.json()) as PutBody;
  const item = body.item;
  const baseRevision = Number(body.baseRevision);

  if (!Number.isFinite(baseRevision)) {
    await writeAuditEvent({ action: 'admin.site_profile.put', status: 'error', message: 'baseRevision is required.', ...auditContext(event) });
    return json({ ok: false, error: 'baseRevision is required.' }, { status: 400 });
  }

  const validationError = validateSiteProfile(item);
  if (validationError) {
    await writeAuditEvent({ action: 'admin.site_profile.put', status: 'error', message: validationError, ...auditContext(event) });
    return json({ ok: false, error: validationError }, { status: 400 });
  }

  const cms = await readCmsData();

  try {
    const saved = await writeCmsData(
      {
        ...cms,
        site: {
          ...item,
          hours: cms.site.hours
        }
      },
      { expectedRevision: baseRevision }
    );

    await writeAuditEvent({ action: 'admin.site_profile.put', status: 'ok', ...auditContext(event), actor: { id: user.id, email: user.email, role: user.role }, details: { revision: saved.meta.revision } });

    return json({ ok: true, item: saved.site, meta: saved.meta });
  } catch (error) {
    if (error instanceof CmsConflictError) {
      await writeAuditEvent({ action: 'admin.site_profile.put', status: 'error', message: error.message, ...auditContext(event), actor: { id: user.id, email: user.email, role: user.role }, details: { baseRevision } });
      return json({ ok: false, error: error.message }, { status: 409 });
    }
    throw error;
  }
}
