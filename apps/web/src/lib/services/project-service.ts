/**
 * Project Service – server-side only.
 * Returns portfolio project data.
 * Swap implementation for API-backed data without changing callers.
 */

import { ApiError } from "@/lib/api/http-client";
import { hasBackendUrl } from "@/lib/api/backend-url";
import { listContent, getContentItem } from "@/lib/api/endpoints/content-api";
import type { ApiContentItem } from "@/lib/api/contracts/content";
import {
  metadataBoolean,
  metadataStack,
  metadataString,
} from "@/lib/content/metadata-helpers";

export const PROJECTS_REVALIDATE_SECONDS = 300;

const PROJECT_REQUEST_OPTIONS = {
  next: {
    revalidate: PROJECTS_REVALIDATE_SECONDS,
    tags: ["content:project"],
  },
};

function normalizeSlug(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-|-$/g, "");
}

type ProjectStatus = "production" | "open-source" | "in-progress" | "archived";

type ProjectLinks = {
  github?: string;
  live?: string;
  caseStudy?: string;
};

export type ProjectLookupResult =
  | { kind: "found"; project: Project }
  | { kind: "missing" }
  | { kind: "unavailable" };

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
  status: ProjectStatus;
  featured: boolean;
  aiIndexable: boolean;
  stack: string[];
  keyDecision?: string;
  architectureSummary?: string;
  systemDetail?: string;
  cardLabel?: string;
  visualLabel?: string;
  homeVisual?: string;
  heroImage?: string;
  ogImage?: string;
  applicationCategory?: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  metadata: ApiContentItem["metadata"];
  links: ProjectLinks;
};

function resolveProjectStatus(item: ApiContentItem): ProjectStatus {
  const metadataStatus = metadataString(
    item.metadata,
    "project_status",
    "projectStatus",
    "status_label",
    "statusLabel"
  );

  if (metadataStatus === "open-source") {
    return "open-source";
  }

  if (item.status === "published") {
    return "production";
  }

  if (item.status === "archived") {
    return "archived";
  }

  return "in-progress";
}

function resolveProjectLinks(metadata: ApiContentItem["metadata"]): ProjectLinks {
  return {
    github: metadataString(metadata, "github", "github_url", "githubUrl"),
    live: metadataString(metadata, "live", "live_url", "liveUrl"),
    caseStudy: metadataString(metadata, "caseStudy", "case_study", "caseStudyUrl"),
  };
}

function mapProject(item: ApiContentItem): Project {
  const stack = metadataStack(item.metadata);
  const heroImage = metadataString(
    item.metadata,
    "heroImageUrl",
    "hero_image_url",
    "coverImageUrl",
    "cover_image_url"
  );
  const ogImage = metadataString(
    item.metadata,
    "ogImage",
    "og_image",
    "socialImage",
    "social_image"
  );

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
    status: resolveProjectStatus(item),
    featured: metadataBoolean(item.metadata, "featured"),
    aiIndexable: item.ai_indexable,
    stack,
    keyDecision: metadataString(item.metadata, "key_decision", "keyDecision"),
    architectureSummary: metadataString(
      item.metadata,
      "architecture_summary",
      "architectureSummary"
    ),
    systemDetail: metadataString(item.metadata, "system_detail", "systemDetail"),
    cardLabel: metadataString(item.metadata, "card_label", "cardLabel"),
    visualLabel: metadataString(item.metadata, "visual_label", "visualLabel"),
    homeVisual: metadataString(item.metadata, "home_visual", "homeVisual"),
    heroImage,
    ogImage,
    applicationCategory: metadataString(
      item.metadata,
      "application_category",
      "applicationCategory"
    ),
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    canonicalUrl: item.canonical_url,
    metadata: item.metadata,
    links: resolveProjectLinks(item.metadata),
  };
}

function sortProjects(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    if (a.featured !== b.featured) {
      return a.featured ? -1 : 1;
    }
    return (
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    );
  });
}

async function fetchProjects(): Promise<Project[]> {
  const response = await listContent(
    { type: "project", limit: 50 },
    PROJECT_REQUEST_OPTIONS
  );
  return sortProjects(response.items.map(mapProject));
}

/** Returns all published projects, sorted featured first then newest. */
export async function getProjects(): Promise<Project[]> {
  if (!hasBackendUrl()) {
    return [];
  }

  try {
    return await fetchProjects();
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.error("[getProjects] failed to load from API:", error);
    }
    return [];
  }
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((p) => p.featured);
}

export async function getProjectDetail(
  slug: string
): Promise<ProjectLookupResult> {
  if (!hasBackendUrl()) {
    return { kind: "unavailable" };
  }

  const normalizedSlug = normalizeSlug(slug);
  if (!normalizedSlug) {
    return { kind: "missing" };
  }

  try {
    const item = await getContentItem(
      { type: "project", slug: normalizedSlug },
      PROJECT_REQUEST_OPTIONS
    );
    return { kind: "found", project: mapProject(item) };
  } catch (error) {
    if (!(error instanceof ApiError) || error.status !== 404) {
      if (process.env.NODE_ENV === "production") {
        console.error("[getProjectDetail] failed to load project:", error);
      }
      return { kind: "unavailable" };
    }
  }

  try {
    const projects = await fetchProjects();
    const project = projects.find((entry) => entry.slug === normalizedSlug);
    return project ? { kind: "found", project } : { kind: "missing" };
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.error("[getProjectDetail] fallback lookup failed:", error);
    }
    return { kind: "unavailable" };
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  const result = await getProjectDetail(slug);
  return result.kind === "found" ? result.project : null;
}

export async function getProjectStaticParams(): Promise<Array<{ slug: string }>> {
  const projects = await getProjects();
  return projects.map((project) => ({ slug: project.slug }));
}
