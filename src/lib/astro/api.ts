const API_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:4321';

export async function fetchFromApi(path: string): Promise<unknown> {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText} at ${path}`);
  return res.json();
}

export async function getSettings() {
  return fetchFromApi('/api/settings') as Promise<Record<string, unknown>>;
}

export async function getHours() {
  return fetchFromApi('/api/hours') as Promise<Array<Record<string, unknown>>>;
}

export async function getPosts() {
  return fetchFromApi('/api/posts') as Promise<Array<Record<string, unknown>>>;
}

export async function getPages() {
  return fetchFromApi('/api/pages') as Promise<Array<Record<string, unknown>>>;
}

export async function getEvents() {
  return fetchFromApi('/api/events?upcoming=true') as Promise<Array<Record<string, unknown>>>;
}

export async function getBanners() {
  return fetchFromApi('/api/banners') as Promise<Array<Record<string, unknown>>>;
}

export async function getTemplates() {
  return fetchFromApi('/api/templates') as Promise<Array<Record<string, unknown>>>;
}
