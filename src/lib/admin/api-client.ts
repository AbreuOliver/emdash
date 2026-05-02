const API_BASE = typeof window !== 'undefined' ? window.location.origin : '';

export type PublishPayload =
  | { type: 'all' }
  | { type: 'settings' }
  | { type: 'hours' }
  | { type: 'post'; id: string }
  | { type: 'page'; id: string }
  | { type: 'event'; id: string }
  | { type: 'banner'; id: string };

function getApiKey(): string {
  return localStorage.getItem('emdash-api-key') ?? '';
}

async function request<T>(path: string, options?: { method?: string; body?: Record<string, unknown> | Array<Record<string, unknown>>; headers?: Record<string, string> }): Promise<T> {
  const apiKey = getApiKey();
  if (!apiKey) throw new Error('No API key');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Site-Key': apiKey,
    ...(options?.headers ?? {}),
  };

  const init: RequestInit = { method: options?.method ?? 'GET', headers };
  if (options?.body) init.body = JSON.stringify(options.body);

  const url = path.startsWith('http') ? path : `${API_BASE}${path}`;
  const res = await fetch(url, init);

  if (res.status === 401) {
    window.location.href = '/admin';
    throw new Error('Unauthorized');
  }
  if (res.status === 204) return undefined as T;
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }
  return res.json();
}

export const api = {
  getSettings: (status?: 'draft' | 'published') =>
    request(`/api/settings${status ? `?status=${status}` : ''}`),
  saveSettings: (data: Record<string, unknown>) =>
    request('/api/settings', { method: 'PUT', body: data }),

  getHours: (status?: 'draft' | 'published') =>
    request(`/api/hours${status ? `?status=${status}` : ''}`),
  saveHours: (data: Array<Record<string, unknown>>) =>
    request('/api/hours', { method: 'PUT', body: data as unknown as Record<string, unknown> }),

  getPosts: (status?: 'draft' | 'published') =>
    request(`/api/posts${status ? `?status=${status}` : ''}`),
  getPost: (slug: string, status?: 'draft' | 'published') =>
    request(`/api/posts/${slug}${status ? `?status=${status}` : ''}`),
  createPost: (data: Record<string, unknown>) =>
    request('/api/posts', { method: 'POST', body: data }),
  updatePost: (slug: string, data: Record<string, unknown>) =>
    request(`/api/posts/${slug}`, { method: 'PUT', body: data }),
  deletePost: (slug: string) =>
    request(`/api/posts/${slug}`, { method: 'DELETE' }),

  getPages: (status?: 'draft' | 'published') =>
    request(`/api/pages${status ? `?status=${status}` : ''}`),
  getPage: (slug: string, status?: 'draft' | 'published') =>
    request(`/api/pages/${slug}${status ? `?status=${status}` : ''}`),
  createPage: (data: Record<string, unknown>) =>
    request('/api/pages', { method: 'POST', body: data }),
  updatePage: (slug: string, data: Record<string, unknown>) =>
    request(`/api/pages/${slug}`, { method: 'PUT', body: data }),
  deletePage: (slug: string) =>
    request(`/api/pages/${slug}`, { method: 'DELETE' }),

  getEvents: (status?: 'draft' | 'published', upcoming?: boolean) => {
    const params = new URLSearchParams();
    if (status) params.set('status', status);
    if (upcoming) params.set('upcoming', 'true');
    return request(`/api/events?${params}`);
  },
  getEvent: (id: string, status?: 'draft' | 'published') =>
    request(`/api/events/${id}${status ? `?status=${status}` : ''}`),
  createEvent: (data: Record<string, unknown>) =>
    request('/api/events', { method: 'POST', body: data }),
  updateEvent: (id: string, data: Record<string, unknown>) =>
    request(`/api/events/${id}`, { method: 'PUT', body: data }),
  deleteEvent: (id: string) =>
    request(`/api/events/${id}`, { method: 'DELETE' }),

  getBanners: () => request('/api/banners'),
  createBanner: (data: Record<string, unknown>) =>
    request('/api/banners', { method: 'POST', body: data }),
  updateBanner: (id: string, data: Record<string, unknown>) =>
    request(`/api/banners/${id}`, { method: 'PUT', body: data }),
  deleteBanner: (id: string) =>
    request(`/api/banners/${id}`, { method: 'DELETE' }),

  getImages: () => request('/api/media/upload'),
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/api/media/upload', {
      method: 'POST',
      headers: { 'X-Site-Key': getApiKey() },
      body: formData as unknown as Record<string, unknown>,
    });
  },

  getTemplates: () => request('/api/templates'),

  publish: (payload: PublishPayload) =>
    request('/api/publish', { method: 'POST', body: payload as unknown as Record<string, unknown> }),

  getDiff: () => request('/api/diff'),

  previewUrl: () => {
    const params = new URLSearchParams({ preview: 'true' });
    return `/?${params}`;
  },
};
