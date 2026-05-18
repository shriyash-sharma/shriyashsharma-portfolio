/**
 * Resolves backend base URLs for server routes, RSC data loaders, and client media.
 *
 * In production, missing env vars fail fast instead of falling back to localhost.
 */

const LOCAL_API_URL = "http://localhost:8000";

function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production";
}

function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith("/") ? baseUrl.slice(0, -1) : baseUrl;
}

/** Server-side BFF and RSC calls (prefers internal URL when set). */
export function resolveBackendBaseUrl(): string {
  const baseUrl =
    process.env.API_INTERNAL_URL?.trim() ||
    process.env.NEXT_PUBLIC_API_URL?.trim();

  if (baseUrl) {
    return normalizeBaseUrl(baseUrl);
  }

  if (isProductionRuntime()) {
    throw new Error(
      "Set API_INTERNAL_URL or NEXT_PUBLIC_API_URL for production deployments."
    );
  }

  return LOCAL_API_URL;
}

/** Browser-reachable API origin (media previews, public asset URLs). */
export function resolvePublicApiBaseUrl(): string {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

  if (baseUrl) {
    return normalizeBaseUrl(baseUrl);
  }

  if (isProductionRuntime()) {
    throw new Error("Set NEXT_PUBLIC_API_URL for production deployments.");
  }

  return LOCAL_API_URL;
}

export function createBackendUrl(path: string): string {
  return new URL(path, `${resolveBackendBaseUrl()}/`).toString();
}

export function hasBackendUrl(): boolean {
  return Boolean(
    process.env.API_INTERNAL_URL?.trim() || process.env.NEXT_PUBLIC_API_URL?.trim()
  );
}
