import type { RequestHandler } from './$types';
import { getImageKit } from '$lib/server/imagekit';
import { createImage, getImagesBySite } from '$lib/server/queries';
import { jsonError, jsonResponse } from '$lib/server/api-helpers';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif'];
const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export const POST: RequestHandler = async ({ request, locals }) => {
  const formData = await request.formData();
  const file = formData.get('file') as File | null;
  if (!file) return jsonError('No file provided', 'VALIDATION_ERROR', 400);
  if (!ALLOWED_TYPES.includes(file.type)) {
    return jsonError(`Invalid file type. Allowed: ${ALLOWED_TYPES.join(', ')}`, 'VALIDATION_ERROR', 400);
  }
  if (file.size > MAX_SIZE) {
    return jsonError('File exceeds 10MB limit', 'VALIDATION_ERROR', 400);
  }

  const ik = getImageKit();

  try {
    const arrayBuf = await file.arrayBuffer();
    const result = await ik.files.upload({
      file: new File([arrayBuf], file.name, { type: file.type }),
      fileName: file.name,
      folder: `/sites/${locals.siteId}`,
    } as never);

    const res = result as Record<string, unknown>;
    const fileId = (res.fileId as string) ?? '';
    const url = (res.url as string) ?? '';

    const image = await createImage(locals.siteId, {
      imagekitFileId: fileId,
      imagekitUrl: url,
      originalFilename: file.name,
      width: (res.width as number) ?? undefined,
      height: (res.height as number) ?? undefined,
      fileSize: (res.size as number) ?? undefined,
      mimeType: file.type,
    });

    return jsonResponse(image, 201);
  } catch (err) {
    return jsonError(`Upload failed: ${err instanceof Error ? err.message : 'unknown'}`, 'UPLOAD_FAILED', 500);
  }
};

export const GET: RequestHandler = async ({ locals }) => {
  const images = await getImagesBySite(locals.siteId);
  return jsonResponse(images);
};
