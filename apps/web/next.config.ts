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

const nextConfig: NextConfig = {
  ...(lanDevOrigins() ? { allowedDevOrigins: lanDevOrigins() } : {}),
  turbopack: {
    // pnpm hoists `next` to the monorepo root; Turbopack must resolve from there.
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;
