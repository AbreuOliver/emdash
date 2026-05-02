import type { RequestHandler } from './$types';
import { getEvents, createEvent } from '$lib/server/queries';
import { jsonError, jsonResponse } from '$lib/server/api-helpers';

export const GET: RequestHandler = async ({ url, locals }) => {
  const status = (url.searchParams.get('status') as 'draft' | 'published') || 'published';
  const upcoming = url.searchParams.get('upcoming') === 'true';
  const events = await getEvents(locals.siteId, status, upcoming);
  return jsonResponse(events);
};

export const POST: RequestHandler = async ({ request, locals }) => {
  const data = await request.json();
  if (!data.title) return jsonError('Title is required', 'VALIDATION_ERROR', 400, { field: 'title' });
  if (!data.startDateTime) return jsonError('Start date/time is required', 'VALIDATION_ERROR', 400, { field: 'startDateTime' });
  const event = await createEvent(locals.siteId, data);
  return jsonResponse(event, 201);
};
