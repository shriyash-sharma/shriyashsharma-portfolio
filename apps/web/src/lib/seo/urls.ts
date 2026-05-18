import { siteConfig } from "@/lib/constants/site";

/** Canonical site origin (no trailing slash). */
export function resolveSiteOrigin(): string {
  const trimmed = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (trimmed) {
    try {
      const url = new URL(trimmed.endsWith("/") ? trimmed.slice(0, -1) : trimmed);
      return url.origin;
    } catch {
      // fall through
    }
  }

  const vercelHost = process.env.VERCEL_URL?.trim();
  if (vercelHost) {
    const host = vercelHost.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return new URL(siteConfig.url).origin;
}

export function resolveMetadataBase(): URL {
  return new URL(`${resolveSiteOrigin()}/`);
}

/** Absolute URL for a site path (e.g. `/projects`). */
export function absoluteUrl(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${resolveSiteOrigin()}${normalized}`;
}
