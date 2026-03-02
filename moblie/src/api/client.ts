import { buildApiUrl } from '../config/env';

export class ApiError extends Error {
  status: number;
  body: unknown;

  constructor(message: string, status: number, body: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const url = buildApiUrl(path);

  const { headers, credentials, ...rest } = options;
  const response = await fetch(url, {
    ...rest,
    credentials: credentials ?? 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(headers ?? {}),
    },
  });

  const text = await response.text();

  let data: unknown = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }
  }

  // #region agent log
  const isAuth = path.includes('/api/auth/login') || path.includes('/api/me');
  if (isAuth) {
    fetch('http://127.0.0.1:7560/ingest/82f2bf8a-9ac4-4883-ada6-a8bf4ed2a875', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Debug-Session-Id': '02097f' },
      body: JSON.stringify({
        sessionId: '02097f',
        location: 'client.ts:request',
        message: 'API auth request',
        data: { path, url, status: response.status, ok: response.ok },
        timestamp: Date.now(),
        hypothesisId: 'B',
      }),
    }).catch(() => {});
  }
  // #endregion

  if (!response.ok) {
    throw new ApiError('Request failed', response.status, data);
  }

  return data as T;
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown, options: RequestInit = {}) =>
    request<T>(path, {
      ...options,
      method: 'POST',
      body: body !== undefined ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) =>
    request<T>(path, {
      method: 'DELETE',
    }),
};

