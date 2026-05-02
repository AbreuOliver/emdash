import type { RequestHandler } from './$types';
import { getPostBySlug, updatePost, deletePost } from '$lib/server/queries';
import { jsonError, jsonResponse } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ params, locals, url }) => {
  const status = (url.searchParams.get('status') as 'draft' | 'published') || 'published';
  const post = await getPostBySlug(locals.siteId, params.slug, status);
  if (!post) return jsonError('Post not found', 'NOT_FOUND', 404);
  return jsonResponse(post);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  const post = await getPostBySlug(locals.siteId, params.slug, 'draft');
  if (!post) return jsonError('Post not found', 'NOT_FOUND', 404);
  const data = await request.json();
  const updated = await updatePost(locals.siteId, post.id, data);
  if (!updated) return jsonError('Failed to update post', 'UPDATE_FAILED', 500);
  return jsonResponse(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const post = await getPostBySlug(locals.siteId, params.slug, 'draft');
  if (!post) return jsonError('Post not found', 'NOT_FOUND', 404);
  const deleted = await deletePost(post.id, locals.siteId);
  if (!deleted) return jsonError('Failed to delete post', 'DELETE_FAILED', 500);
  return new Response(null, { status: 204 });
};
