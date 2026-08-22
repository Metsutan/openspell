/**
 * API Service for Astro OpenSpell Web App
 * Handles HTTP requests to the backend API server
 */

export function getResolvedApiUrl(): string {
  if (process.env.API_USE_LOCALHOST === 'true') {
    return process.env.API_LOCAL_URL || `http://localhost:${process.env.API_PORT || '3002'}`;
  }
  return process.env.API_URL || 'http://api:3002';
}

const WEB_SECRET_HEADER = 'X-OpenSpell-Web-Secret';

export interface ApiRequestOptions extends RequestInit {
  body?: any;
  token?: string | null;
}

/**
 * Makes HTTP request to the API server
 */
export async function makeApiRequest<T = any>(path: string, options: ApiRequestOptions = {}): Promise<T> {
  const baseUrl = getResolvedApiUrl();
  const url = new URL(path, baseUrl).toString();
  const apiWebSecret = process.env.API_WEB_SECRET || null;
  const timeoutMs = parseInt(process.env.API_REQUEST_TIMEOUT_MS || '30000', 10);

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(apiWebSecret ? { [WEB_SECRET_HEADER]: apiWebSecret } : {}),
    ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
    ...(options.headers as Record<string, string> || {})
  };

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const fetchOptions: RequestInit = {
      method: options.method || 'GET',
      headers,
      signal: controller.signal,
      ...(options.body ? { body: typeof options.body === 'string' ? options.body : JSON.stringify(options.body) } : {})
    };

    const response = await fetch(url, fetchOptions);
    const text = await response.text();

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${text}`);
    }

    try {
      return JSON.parse(text) as T;
    } catch {
      return text as unknown as T;
    }
  } finally {
    clearTimeout(timeoutId);
  }
}

/**
 * Extracts human-readable error message from API error response
 */
export function extractApiErrorMessage(error: any): string {
  if (!error || !error.message) {
    return 'Internal server error';
  }

  const errorMessage = String(error.message);

  const jsonMatch = errorMessage.match(/\{.*\}/);
  if (jsonMatch) {
    try {
      const errorObj = JSON.parse(jsonMatch[0]);
      if (errorObj.error) {
        return errorObj.error;
      }
      if (errorObj.message) {
        return errorObj.message;
      }
    } catch (_) {}
  }

  if (errorMessage.includes('timeout') || errorMessage.includes('aborted')) {
    return 'Request timeout. Please try again.';
  }

  return errorMessage.replace(/^API request failed: \d+\s*/, '') || 'Internal server error';
}
