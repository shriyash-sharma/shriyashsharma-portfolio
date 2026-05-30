import type { MetadataRoute } from "next";
import {
  defaultLocale,
  locales,
  localeLanguageTags,
  localizePath,
} from "@/lib/i18n/config";
import { pageSeo } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";
import { getArchitectureNotes, getBlogPosts, getCaseStudies } from "@/lib/services/content-service";
import { getProjects } from "@/lib/services/project-service";

type StaticRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

/** Routes that should not appear in the public sitemap. */
const EXCLUDED_PATHS = new Set<string>([
  // Interactive tool with no indexable content; better discovered via internal links.
  "/assistant",
]);

const staticRoutes: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  ...(
    Object.values(pageSeo) as Array<{ path: string }>
  )
    .filter((page) => !EXCLUDED_PATHS.has(page.path))
    .map((page) => ({
      path: page.path,
      changeFrequency: "monthly" as const,
      priority: page.path === "/projects" || page.path === "/case-studies" ? 0.9 : 0.75,
    })),
];

/** Build the hreflang map for a canonical path across all supported locales. */
function buildLanguageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[localeLanguageTags[locale]] = absoluteUrl(localizePath(path, locale));
  }
  languages["x-default"] = absoluteUrl(localizePath(path, defaultLocale));
  return languages;
}

function localizedEntries(
  path: string,
  lastModified: Date | undefined,
  changeFrequency: StaticRoute["changeFrequency"],
  priority: number
): MetadataRoute.Sitemap {
  const alternates = { languages: buildLanguageAlternates(path) };
  return locales.map((locale) => ({
    url: absoluteUrl(localizePath(path, locale)),
    ...(lastModified ? { lastModified } : {}),
    changeFrequency,
    priority: locale === defaultLocale ? priority : Math.max(priority - 0.05, 0.5),
    alternates,
  }));
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  // Static routes: omit lastModified so crawlers don't see fake per-request churn.
  const entries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    localizedEntries(route.path, undefined, route.changeFrequency, route.priority)
  );

  const [projects, posts, caseStudies, architectureNotes] = await Promise.all([
    getProjects(),
    getBlogPosts(),
    getCaseStudies(),
    getArchitectureNotes(),
  ]);

  const dynamicRoutes = [
    ...projects.map((item) => ({
      path: `/projects/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      priority: 0.85,
    })),
    ...posts.map((item) => ({
      path: `/blog/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      priority: 0.8,
    })),
    ...caseStudies.map((item) => ({
      path: `/case-studies/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      priority: 0.85,
    })),
    ...architectureNotes.map((item) => ({
      path: `/architecture/${item.slug}`,
      lastModified: new Date(item.updatedAt),
      priority: 0.8,
    })),
  ];

  for (const route of dynamicRoutes) {
    entries.push(
      ...localizedEntries(route.path, route.lastModified, "weekly", route.priority)
    );
  }

  return entries;
}
