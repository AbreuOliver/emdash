import type { RequestHandler } from './$types';
import { getBanners, updateBanner, deleteBanner, isBannerActive } from '$lib/server/queries';
import { jsonError, jsonResponse } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ params, locals }) => {
  const banners = await getBanners(locals.siteId, 'published');
  const banner = banners.find((b) => b.id === params.id);
  if (!banner) return jsonError('Banner not found', 'NOT_FOUND', 404);
  return jsonResponse({ ...banner, isActive: isBannerActive(banner) });
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  const data = await request.json();
  const updated = await updateBanner(locals.siteId, params.id, data);
  if (!updated) return jsonError('Banner not found', 'NOT_FOUND', 404);
  return jsonResponse({ ...updated, isActive: isBannerActive(updated) });
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const deleted = await deleteBanner(params.id, locals.siteId);
  if (!deleted) return jsonError('Banner not found', 'NOT_FOUND', 404);
  return new Response(null, { status: 204 });
};
