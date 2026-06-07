import type { MetadataRoute } from "next";
import { isProductionBuildPhase } from "@/lib/build/static-generation";
import {
  defaultLocale,
  getPublicLocales,
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

/** Build the hreflang map for a canonical path across indexable locales. */
function buildLanguageAlternates(path: string): Record<string, string> {
  const publicLocales = getPublicLocales();
  const languages: Record<string, string> = {};
  for (const locale of publicLocales) {
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
  const publicLocales = getPublicLocales();
  const alternates =
    publicLocales.length > 1
      ? { languages: buildLanguageAlternates(path) }
      : undefined;

  return publicLocales.map((locale) => {
    const rawPriority =
      locale === defaultLocale ? priority : Math.max(priority - 0.05, 0.5);
    // Round to 2 decimals to avoid IEEE-754 artifacts like 0.7999999999999999.
    const cleanPriority = Math.round(rawPriority * 100) / 100;
    return {
      url: absoluteUrl(localizePath(path, locale)),
      ...(lastModified ? { lastModified } : {}),
      changeFrequency,
      priority: cleanPriority,
      ...(alternates ? { alternates } : {}),
    };
  });
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  // Static routes: omit lastModified so crawlers don't see fake per-request churn.
  const entries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    localizedEntries(route.path, undefined, route.changeFrequency, route.priority)
  );

  let projects: Awaited<ReturnType<typeof getProjects>> = [];
  let posts: Awaited<ReturnType<typeof getBlogPosts>> = [];
  let caseStudies: Awaited<ReturnType<typeof getCaseStudies>> = [];
  let architectureNotes: Awaited<ReturnType<typeof getArchitectureNotes>> = [];

  try {
    [projects, posts, caseStudies, architectureNotes] = await Promise.all([
      getProjects(),
      getBlogPosts(),
      getCaseStudies(),
      getArchitectureNotes(),
    ]);
  } catch (error) {
    // During deploy the backend may be cold; static routes are enough to pass
    // the build. Runtime ISR revalidation will retry with the full sitemap.
    if (!isProductionBuildPhase()) {
      throw error;
    }
  }

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
