import type { NextConfig } from "next";
import path from "path";

/** Allow phone/LAN access to dev HMR when NEXT_PUBLIC_SITE_URL uses a non-localhost host. */
function lanDevOrigins(): string[] | undefined {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (!siteUrl) return undefined;
  try {
    const { hostname } = new URL(siteUrl);
    if (hostname !== "localhost" && hostname !== "127.0.0.1") {
      return [hostname];
    }
  } catch {
    /* ignore invalid URL */
  }
  return undefined;
}

function originOf(value: string | undefined): string | undefined {
  if (!value?.trim()) return undefined;
  try {
    return new URL(value.trim()).origin;
  } catch {
    return undefined;
  }
}

/**
 * Report-only CSP: violations are logged in the browser console without
 * blocking anything. Promote to `Content-Security-Policy` once it runs clean.
 * 'unsafe-inline' is required for the inline locale/JSON-LD scripts (no nonces).
 */
function contentSecurityPolicy(): string {
  const apiOrigin = originOf(process.env.NEXT_PUBLIC_API_URL) ?? "";
  const isDev = process.env.NODE_ENV === "development";
  const directives: Record<string, string[]> = {
    "default-src": ["'self'"],
    "script-src": [
      "'self'",
      "'unsafe-inline'",
      ...(isDev ? ["'unsafe-eval'"] : []),
      "https://www.googletagmanager.com",
      "https://va.vercel-scripts.com",
      "https://vercel.live",
    ],
    "style-src": ["'self'", "'unsafe-inline'", "https://vercel.live"],
    "img-src": [
      "'self'",
      "data:",
      "blob:",
      "https://*.google-analytics.com",
      "https://*.googletagmanager.com",
      "https://*.supabase.co",
      "https://*.supabase.in",
      "https://vercel.live",
      "https://vercel.com",
      apiOrigin,
    ],
    "font-src": ["'self'", "data:", "https://vercel.live", "https://assets.vercel.com"],
    "connect-src": [
      "'self'",
      "https://*.google-analytics.com",
      "https://*.analytics.google.com",
      "https://*.googletagmanager.com",
      "https://vitals.vercel-insights.com",
      "https://vercel.live",
      "wss://ws-us3.pusher.com",
      apiOrigin,
      ...(isDev ? ["ws:"] : []),
    ],
    "frame-src": ["https://vercel.live"],
    "frame-ancestors": ["'self'"],
    "object-src": ["'none'"],
    "base-uri": ["'self'"],
    "form-action": ["'self'"],
  };

  return Object.entries(directives)
    .map(([name, values]) => [name, ...values.filter(Boolean)].join(" "))
    .join("; ");
}

const nextConfig: NextConfig = {
  ...(lanDevOrigins() ? { allowedDevOrigins: lanDevOrigins() } : {}),
  poweredByHeader: false,
  env: {
    // Deploy timestamp used for sitemap <lastmod> on static routes.
    BUILD_TIME: new Date().toISOString(),
  },
  turbopack: {
    // pnpm hoists `next` to the monorepo root; Turbopack must resolve from there.
    root: path.resolve(__dirname, "../.."),
  },
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    // Optimized variants of /public images are cached for 31 days (default 4h).
    minimumCacheTTL: 2678400,
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "**.supabase.in" },
    ],
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
          {
            key: "Content-Security-Policy-Report-Only",
            value: contentSecurityPolicy(),
          },
        ],
      },
      {
        // Unhashed /public images: cache for a day, then revalidate in the background.
        // Hashed build assets (/_next/static) keep Next.js's non-overridable
        // `public, max-age=31536000, immutable`.
        source: "/:all*(png|jpg|jpeg|webp|avif|svg|ico)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=86400, stale-while-revalidate=604800",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
