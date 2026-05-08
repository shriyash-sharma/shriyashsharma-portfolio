/**
 * Typed HTTP client boundary for the future FastAPI backend.
 * Keep UI components away from fetch() so auth, errors, tracing, and
 * streaming concerns can evolve in one place.
 */

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

  const baseUrl = process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL;
  if (!baseUrl) {
    return path;
  }

  return new URL(path, baseUrl).toString();
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
      throw new ApiError(response.status, response.statusText);
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
