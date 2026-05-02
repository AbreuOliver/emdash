import type { RequestHandler } from './$types';
import { getEventById, updateEvent, deleteEvent } from '$lib/server/queries';
import { jsonError, jsonResponse } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ params, locals, url }) => {
  const status = (url.searchParams.get('status') as 'draft' | 'published') || 'published';
  const event = await getEventById(locals.siteId, params.id, status);
  if (!event) return jsonError('Event not found', 'NOT_FOUND', 404);
  return jsonResponse(event);
};

export const PUT: RequestHandler = async ({ params, request, locals }) => {
  const event = await getEventById(locals.siteId, params.id, 'draft');
  if (!event) return jsonError('Event not found', 'NOT_FOUND', 404);
  const data = await request.json();
  const updated = await updateEvent(locals.siteId, event.id, data);
  if (!updated) return jsonError('Failed to update event', 'UPDATE_FAILED', 500);
  return jsonResponse(updated);
};

export const DELETE: RequestHandler = async ({ params, locals }) => {
  const event = await getEventById(locals.siteId, params.id, 'draft');
  if (!event) return jsonError('Event not found', 'NOT_FOUND', 404);
  const deleted = await deleteEvent(event.id, locals.siteId);
  if (!deleted) return jsonError('Failed to delete event', 'DELETE_FAILED', 500);
  return new Response(null, { status: 204 });
};
