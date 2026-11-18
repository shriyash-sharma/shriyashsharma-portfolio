import type { MetadataRoute } from "next";
import { isProductionBuildPhase } from "@/lib/build/static-generation";
import {
  defaultLocale,
  getPublicLocales,
  localeLanguageTags,
  localizePath,
} from "@/lib/i18n/config";
import type { ApiContentItem } from "@/lib/api/contracts/content";
import { metadataString } from "@/lib/content/metadata-helpers";
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

/** Deploy timestamp inlined by next.config (`env.BUILD_TIME`); stable between requests. */
function buildDate(): Date | undefined {
  const value = process.env.BUILD_TIME;
  return value ? new Date(value) : undefined;
}

function latest(dates: Array<Date | undefined>): Date | undefined {
  const valid = dates.filter(
    (date): date is Date => date instanceof Date && !Number.isNaN(date.getTime())
  );
  if (valid.length === 0) {
    return undefined;
  }
  return new Date(Math.max(...valid.map((date) => date.getTime())));
}

function validDate(value: string | undefined): Date | undefined {
  if (!value) {
    return undefined;
  }
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

type ContentDates = { updatedAt: string; metadata: ApiContentItem["metadata"] };

/**
 * Last-modified date for a CMS entry: an explicit editorial `updated` date in
 * its metadata (the CMS equivalent of frontmatter) wins, then the record's
 * `updated_at`, then the build date.
 */
function contentLastModified(item: ContentDates): Date | undefined {
  return (
    validDate(
      metadataString(item.metadata, "updated", "updated_date", "updatedDate", "last_modified", "lastModified")
    ) ??
    validDate(item.updatedAt) ??
    buildDate()
  );
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
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

  const updated = (items: ContentDates[]) => latest(items.map(contentLastModified));
  const built = buildDate();

  // Index pages change when their collection does; other static pages change on deploy.
  const collectionLastModified: Record<string, Date | undefined> = {
    "/projects": latest([updated(projects), built]),
    "/case-studies": latest([updated(caseStudies), built]),
    "/architecture": latest([updated(architectureNotes), built]),
    "/blog": latest([updated(posts), built]),
  };
  const siteLastModified = latest([
    built,
    updated(projects),
    updated(caseStudies),
    updated(architectureNotes),
    updated(posts),
  ]);

  const entries: MetadataRoute.Sitemap = staticRoutes
    // Blog is hidden from navigation and the sitemap until it has a post.
    .filter((route) => route.path !== "/blog" || posts.length > 0)
    .flatMap((route) =>
      localizedEntries(
        route.path,
        route.path === "/"
          ? siteLastModified
          : (collectionLastModified[route.path] ?? built),
        route.changeFrequency,
        route.priority
      )
    );

  const dynamicRoutes = [
    ...projects.map((item) => ({
      path: `/projects/${item.slug}`,
      lastModified: contentLastModified(item),
      priority: 0.85,
    })),
    ...posts.map((item) => ({
      path: `/blog/${item.slug}`,
      lastModified: contentLastModified(item),
      priority: 0.8,
    })),
    ...caseStudies.map((item) => ({
      path: `/case-studies/${item.slug}`,
      lastModified: contentLastModified(item),
      priority: 0.85,
    })),
    ...architectureNotes.map((item) => ({
      path: `/architecture/${item.slug}`,
      lastModified: contentLastModified(item),
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
