import ImageKit from '@imagekit/nodejs';

let imagekit: ImageKit | null = null;

export function getImageKit(): ImageKit {
  if (!imagekit) {
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    if (!privateKey) {
      throw new Error('ImageKit private key not configured. Set IMAGEKIT_PRIVATE_KEY.');
    }
    imagekit = new ImageKit({ privateKey });
  }
  return imagekit;
}

export function validateImageKitConfig(): boolean {
  try {
    getImageKit();
    return true;
  } catch {
    return false;
  }
}

const URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT || '';

export function transformImageUrl(
  url: string,
  options: { width?: number; height?: number; quality?: number; format?: 'webp' | 'avif' | 'jpeg' | 'png' | 'auto' } = {}
): string {
  if (!url.startsWith(URL_ENDPOINT) && URL_ENDPOINT) {
    const idx = url.indexOf('/tr:');
    if (idx > 0) url = url.substring(idx);
    url = `${URL_ENDPOINT}${url}`;
  }
  const transforms: string[] = [];
  if (options.width) transforms.push(`w-${options.width}`);
  if (options.height) transforms.push(`h-${options.height}`);
  if (options.quality) transforms.push(`q-${options.quality}`);
  if (options.format && options.format !== 'auto') transforms.push(`f-${options.format}`);
  if (transforms.length === 0) return url;
  if (url.includes('/tr:')) {
    return url.replace(/\/tr:([^/]+)\//, `/tr:${transforms.join(',')},$1/`);
  }
  const pathStart = URL_ENDPOINT ? URL_ENDPOINT.length : 0;
  const path = url.substring(pathStart);
  return `${URL_ENDPOINT}/tr:${transforms.join(',')}${path}`;
}

export function generateSrcset(
  url: string,
  widths: number[] = [400, 800, 1200],
  format: 'webp' | 'auto' = 'webp'
): string {
  return widths
    .map((w) => `${transformImageUrl(url, { width: w, format })} ${w}w`)
    .join(', ');
}
