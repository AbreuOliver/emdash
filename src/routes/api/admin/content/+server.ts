import { json } from '@sveltejs/kit';
import type { CmsData } from '$lib/cms-schema';
import { requireAdminUser } from '$lib/server/auth/guard';
import { validateCmsPayload } from '$lib/server/cms/validation';

import { CmsConflictError, readCmsData, writeCmsData } from '$lib/server/cms-store';

export async function GET(event) {
  requireAdminUser(event);
  return json(await readCmsData());
}

export async function PUT(event) {
  requireAdminUser(event);
  const { request } = event;
  const payload = (await request.json()) as CmsData;

  const validationError = validateCmsPayload(payload);
  if (validationError) {
    return json({ ok: false, error: validationError }, { status: 400 });
  }

  try {
    const saved = await writeCmsData(payload, { expectedRevision: payload.meta?.revision });
    return json({ ok: true, meta: saved.meta });
  } catch (error) {
    if (error instanceof CmsConflictError) {
      return json({ ok: false, error: error.message }, { status: 409 });
    }
    throw error;
  }
}
