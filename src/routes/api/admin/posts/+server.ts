import { json } from '@sveltejs/kit';
import type { Post } from '$lib/cms-schema';
import { requireAdminUser } from '$lib/server/auth/guard';
import { validatePosts } from '$lib/server/cms/validation';
import { CmsConflictError, readCmsData, writeCmsData } from '$lib/server/cms-store';

type PutBody = {
  items: Post[];
  baseRevision: number;
};

export async function GET(event) {
  requireAdminUser(event);
  const cms = await readCmsData();
  return json({ items: cms.posts, meta: cms.meta });
}

export async function PUT(event) {
  requireAdminUser(event);

  const body = (await event.request.json()) as PutBody;
  const items = Array.isArray(body.items) ? body.items : [];
  const baseRevision = Number(body.baseRevision);

  if (!Number.isFinite(baseRevision)) {
    return json({ ok: false, error: 'baseRevision is required.' }, { status: 400 });
  }

  const validationError = validatePosts(items);
  if (validationError) {
    return json({ ok: false, error: validationError }, { status: 400 });
  }

  const cms = await readCmsData();

  try {
    const saved = await writeCmsData(
      {
        ...cms,
        posts: items
      },
      { expectedRevision: baseRevision }
    );

    return json({ ok: true, items: saved.posts, meta: saved.meta });
  } catch (error) {
    if (error instanceof CmsConflictError) {
      return json({ ok: false, error: error.message }, { status: 409 });
    }
    throw error;
  }
}
