import type { MetadataRoute } from "next";
import { defaultLocale, locales, localizePath } from "@/lib/i18n/config";
import { pageSeo } from "@/lib/seo/metadata";
import { absoluteUrl } from "@/lib/seo/urls";
import { getArchitectureNotes, getBlogPosts, getCaseStudies } from "@/lib/services/content-service";
import { getProjects } from "@/lib/services/project-service";

type StaticRoute = {
  path: string;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
  priority: number;
};

const staticRoutes: StaticRoute[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  ...(
    Object.values(pageSeo) as Array<{ path: string }>
  ).map((page) => ({
    path: page.path,
    changeFrequency: "monthly" as const,
    priority: page.path === "/projects" || page.path === "/case-studies" ? 0.9 : 0.75,
  })),
];

function localizedEntries(
  path: string,
  lastModified: Date,
  changeFrequency: StaticRoute["changeFrequency"],
  priority: number
): MetadataRoute.Sitemap {
  return locales.map((locale) => ({
    url: absoluteUrl(localizePath(path, locale)),
    lastModified,
    changeFrequency,
    priority: locale === defaultLocale ? priority : Math.max(priority - 0.05, 0.5),
  }));
}

export async function buildSitemapEntries(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = staticRoutes.flatMap((route) =>
    localizedEntries(route.path, now, route.changeFrequency, route.priority)
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
