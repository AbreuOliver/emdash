import { json } from "@sveltejs/kit";
import { r as requireAdminUser, v as validateCmsPayload } from "../../../../../chunks/validation.js";
import { r as readCmsData, w as writeCmsData, C as CmsConflictError } from "../../../../../chunks/cms-store.js";
async function GET(event) {
  requireAdminUser(event);
  return json(await readCmsData());
}
async function PUT(event) {
  requireAdminUser(event);
  const { request } = event;
  const payload = await request.json();
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
export {
  GET,
  PUT
};
