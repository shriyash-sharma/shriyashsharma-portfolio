import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/constants/site";

/**
 * Dynamic sitemap.
 * As blog posts and case studies are added, extend this to fetch and map their slugs.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const now = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/hi`, lastModified: now, changeFrequency: "weekly", priority: 0.95 },
    { url: `${base}/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/hi/projects`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/hi/case-studies`, lastModified: now, changeFrequency: "weekly", priority: 0.85 },
    { url: `${base}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/hi/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.75 },
    { url: `${base}/about`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/hi/about`, lastModified: now, changeFrequency: "monthly", priority: 0.65 },
    { url: `${base}/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${base}/hi/contact`, lastModified: now, changeFrequency: "monthly", priority: 0.55 },
  ];

  return staticRoutes;
}
