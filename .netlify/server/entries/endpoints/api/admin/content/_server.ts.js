import { error, json } from "@sveltejs/kit";
import { r as readCmsData, w as writeCmsData } from "../../../../../chunks/cms-store.js";
function requireAdminUser(event) {
  const user = event.locals.user;
  if (!user) {
    throw error(401, "Admin authentication required.");
  }
  return user;
}
async function GET(event) {
  requireAdminUser(event);
  return json(await readCmsData());
}
async function PUT(event) {
  requireAdminUser(event);
  const { request } = event;
  const payload = await request.json();
  if (!Array.isArray(payload.site?.hours) || payload.site.hours.length < 7) {
    return json({ ok: false, error: "Hours must include at least 7 days." }, { status: 400 });
  }
  for (const post of payload.posts ?? []) {
    if (!post.bannerEnabled) continue;
    if (!post.bannerStartDate || !post.bannerEndDate) {
      return json({ ok: false, error: `Banner dates are required for "${post.title || post.slug}".` }, { status: 400 });
    }
    if (post.bannerEndDate < post.bannerStartDate) {
      return json({ ok: false, error: `Banner end date must be on or after start date for "${post.title || post.slug}".` }, { status: 400 });
    }
  }
  await writeCmsData(payload);
  return json({ ok: true });
}
export {
  GET,
  PUT
};
