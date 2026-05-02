import type { RequestHandler } from './$types';
import { getBanners, createBanner, isBannerActive } from '$lib/server/queries';
import { jsonResponse } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ locals }) => {
  const banners = await getBanners(locals.siteId, locals.isPreview ? 'draft' : 'published');
  return jsonResponse(banners.map((b) => ({ ...b, isActive: isBannerActive(b) })));
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const data = await request.json();
  const banner = await createBanner(locals.siteId, data);
  return jsonResponse({ ...banner, isActive: isBannerActive(banner) }, 201);
};
