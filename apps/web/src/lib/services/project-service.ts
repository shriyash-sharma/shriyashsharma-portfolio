/**
 * Project Service – server-side only.
 * Returns portfolio project data.
 * Swap implementation for API-backed data without changing callers.
 */

import { listContent, getContentItem } from "@/lib/api/endpoints/content-api";
import type { ApiContentItem } from "@/lib/api/contracts/content";

export type Project = {
  id: string;
  slug: string;
  title: string;
  description: string;
  body: string;
  tags: string[];
  categories: string[];
  publishedAt: string;
  updatedAt: string;
  status: "production" | "open-source" | "in-progress" | "archived";
  featured: boolean;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  metadata: ApiContentItem["metadata"];
  links: {
    github?: string;
    live?: string;
    caseStudy?: string;
  };
};

function hasBackendUrl() {
  return Boolean(process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL);
}

function mapProject(item: ApiContentItem): Project {
  return {
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    body: item.body ?? "",
    tags: item.tags,
    categories: item.categories,
    publishedAt: item.published_at ?? item.updated_at,
    updatedAt: item.updated_at,
    status:
      item.status === "published"
        ? "production"
        : item.status === "archived"
          ? "archived"
          : "in-progress",
    featured: Boolean(item.metadata.featured),
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    canonicalUrl: item.canonical_url,
    metadata: item.metadata,
    links: {
      github:
        typeof item.metadata.github === "string"
          ? item.metadata.github
          : undefined,
      live: typeof item.metadata.live === "string" ? item.metadata.live : undefined,
      caseStudy:
        typeof item.metadata.caseStudy === "string"
          ? item.metadata.caseStudy
          : undefined,
    },
  };
}

/** Returns all projects, sorted by featured first. */
export async function getProjects(): Promise<Project[]> {
  if (!hasBackendUrl()) {
    return [];
  }

  try {
    const response = await listContent({ type: "project", limit: 50 });
    return response.items.map(mapProject);
  } catch {
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

export async function getProject(slug: string): Promise<Project | null> {
  if (!hasBackendUrl()) {
    return null;
  }

  try {
    const item = await getContentItem({ type: "project", slug });
    return mapProject(item);
  } catch {
    return null;
  }
}
