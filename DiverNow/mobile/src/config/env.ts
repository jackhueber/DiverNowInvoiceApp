export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://192.168.0.100:5000';

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');

export const buildApiUrl = (path: string) => {
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${trimTrailingSlash(API_BASE_URL)}${path.startsWith('/') ? path : `/${path}`}`;
};

