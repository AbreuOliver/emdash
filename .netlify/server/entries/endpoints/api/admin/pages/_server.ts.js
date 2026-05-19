import { json } from "@sveltejs/kit";
import { r as requireAdminUser, a as validatePages } from "../../../../../chunks/validation.js";
import { r as readCmsData, w as writeCmsData, C as CmsConflictError } from "../../../../../chunks/cms-store.js";
async function GET(event) {
  requireAdminUser(event);
  const cms = await readCmsData();
  return json({ items: cms.pages, meta: cms.meta });
}
async function PUT(event) {
  requireAdminUser(event);
  const body = await event.request.json();
  const items = Array.isArray(body.items) ? body.items : [];
  const baseRevision = Number(body.baseRevision);
  if (!Number.isFinite(baseRevision)) {
    return json({ ok: false, error: "baseRevision is required." }, { status: 400 });
  }
  const validationError = validatePages(items);
  if (validationError) {
    return json({ ok: false, error: validationError }, { status: 400 });
  }
  const cms = await readCmsData();
  try {
    const saved = await writeCmsData(
      {
        ...cms,
        pages: items
      },
      { expectedRevision: baseRevision }
    );
    return json({ ok: true, items: saved.pages, meta: saved.meta });
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
