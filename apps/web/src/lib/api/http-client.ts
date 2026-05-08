/**
 * Typed HTTP client.
 * All external API calls should go through this client for consistent
 * error handling, retries, and timeout management.
 *
 * When the FastAPI backend is ready, create endpoint wrappers in
 * lib/api/endpoints/ that use this client.
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
};

async function request<T>(
  url: string,
  options: RequestOptions = {}
): Promise<T> {
  const { timeoutMs = 10_000, ...init } = options;

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { ...init, signal: controller.signal });

    if (!response.ok) {
      throw new ApiError(response.status, response.statusText);
    }

    return response.json() as Promise<T>;
  } finally {
    clearTimeout(timer);
  }
}

export const httpClient = {
  get: <T>(url: string, options?: RequestOptions) =>
    request<T>(url, { method: "GET", ...options }),

  post: <T>(url: string, body: unknown, options?: RequestOptions) =>
    request<T>(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...options?.headers },
      body: JSON.stringify(body),
      ...options,
    }),
};
