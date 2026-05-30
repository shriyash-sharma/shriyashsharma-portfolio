import type { MetadataRoute } from "next";
import { buildSitemapEntries } from "@/lib/seo/sitemap-data";

// Regenerate the sitemap every 5 minutes so newly-published CMS content
// (projects, case studies, blog posts, architecture notes) appears
// without requiring a redeploy. Matches the ISR cadence of content pages.
export const revalidate = 300;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  return buildSitemapEntries();
}
