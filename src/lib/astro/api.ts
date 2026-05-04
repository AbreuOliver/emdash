const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4321';

async function safeFetch<T>(path: string, fallback: T): Promise<T> {
  try {
    const res = await fetch(`${API_URL}${path}`);
    if (!res.ok) return fallback;
    return res.json() as Promise<T>;
  } catch {
    return fallback;
  }
}

export async function getSettings() {
  return safeFetch<Record<string, string> | null>('/api/settings', null);
}

export async function getHours() {
  return safeFetch<Array<Record<string, unknown>>>('/api/hours', []);
}

export async function getPosts() {
  return safeFetch<Array<Record<string, unknown>>>('/api/posts', []);
}

export async function getPages() {
  return safeFetch<Array<Record<string, unknown>>>('/api/pages', []);
}

export async function getEvents() {
  return safeFetch<Array<Record<string, unknown>>>('/api/events?upcoming=true', []);
}

export async function getBanners() {
  return safeFetch<Array<Record<string, unknown>>>('/api/banners', []);
}

export async function getTemplates() {
  return safeFetch<Array<Record<string, unknown>>>('/api/templates', []);
}
