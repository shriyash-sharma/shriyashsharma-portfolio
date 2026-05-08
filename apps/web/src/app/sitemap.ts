import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants/site";
import { locales, localizePath } from "@/lib/i18n/config";

/**
 * Dynamic sitemap.
 * As blog posts and case studies are added, extend this to fetch and map their slugs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();
  const routes = [
    { path: "/", changeFrequency: "weekly", priority: 1 },
    { path: "/projects", changeFrequency: "weekly", priority: 0.9 },
    { path: "/case-studies", changeFrequency: "weekly", priority: 0.9 },
    { path: "/blog", changeFrequency: "weekly", priority: 0.8 },
    { path: "/about", changeFrequency: "monthly", priority: 0.7 },
    { path: "/contact", changeFrequency: "monthly", priority: 0.6 },
  ] as const;

  return routes.flatMap((route) =>
    locales.map((locale) => ({
      url: `${base}${localizePath(route.path, locale)}`,
      lastModified: now,
      changeFrequency: route.changeFrequency,
      priority: locale === "en" ? route.priority : Math.max(route.priority - 0.05, 0.5),
    }))
  );
}
