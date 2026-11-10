const apiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim().replace(/\/+$/, '') ?? '';

export function apiUrl(path: string): string {
  if (!apiBaseUrl && window.location.hostname.endsWith('.github.io')) {
    throw new Error('M-Pesa is not configured for this website yet. Please try again later.');
  }

  return `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;
}
