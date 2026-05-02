import type { RequestHandler } from './$types';
import { getPosts, getPostBySlug, createPost, updatePost, deletePost } from '$lib/server/queries';
import { jsonError, jsonResponse } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ url, locals }) => {
  const status = (url.searchParams.get('status') as 'draft' | 'published') || 'published';
  const posts = await getPosts(locals.siteId, status);
  return jsonResponse(posts);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const data = await request.json();
  if (!data.title) return jsonError('Title is required', 'VALIDATION_ERROR', 400, { field: 'title' });
  if (!data.slug) data.slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const post = await createPost(locals.siteId, data);
  return jsonResponse(post, 201);
};
