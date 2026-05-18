/**
 * Typed HTTP client boundary for backend access.
 *
 * UI code and server components call through this module instead of touching
 * fetch() directly. That keeps auth propagation, timeout policy, error mapping,
 * and future tracing or streaming behavior concentrated in one place.
 *
 * Boundaries:
 * - Endpoint-specific knowledge belongs in endpoint wrappers.
 * - Session lookup belongs in auth/session or route utilities.
 * - This layer is transport-oriented and intentionally thin.
 */

import { resolveBackendBaseUrl } from "@/lib/api/backend-url";

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly statusText: string,
    message?: string
  ) {
    super(message ?? `HTTP ${status}: ${statusText}`);
    this.name = "ApiError";
  }
}

type RequestOptions = RequestInit & {
  timeoutMs?: number;
  token?: string;
};

function createUrl(path: string): string {
  if (path.startsWith("http")) {
    return path;
  }

  return new URL(path, `${resolveBackendBaseUrl()}/`).toString();
}

async function request<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = 10_000, token, headers, ...init } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  const requestHeaders = new Headers(headers);

  if (token) {
    requestHeaders.set("Authorization", `Bearer ${token}`);
  }

  try {
    const response = await fetch(createUrl(path), {
      ...init,
      headers: requestHeaders,
      signal: controller.signal,
    });

    if (!response.ok) {
      let message: string | undefined;

      try {
        const payload = (await response.json()) as
          | { detail?: string; message?: string }
          | null;
        message = payload?.detail ?? payload?.message;
      } catch {
        message = undefined;
      }

      throw new ApiError(response.status, response.statusText, message);
    }

    if (response.status === 204) {
      return undefined as T;
    }

    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export const httpClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "GET", ...options }),

  post: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(body),
      ...options,
    }),

  put: <T>(path: string, body: unknown, options?: RequestOptions) =>
    request<T>(path, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(body),
      ...options,
    }),

  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { method: "DELETE", ...options }),
};
