/**
 * Project Service – server-side only.
 * Returns portfolio project data.
 * Swap implementation for API-backed data without changing callers.
 */

import { contentStaticParams } from "@/lib/build/static-generation";
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

function normalizeCaseStudyLink(value: string | undefined): string | undefined {
  if (!value) {
    return undefined;
  }

  const trimmed = value.trim();
  if (!trimmed) {
    return undefined;
  }

  if (trimmed.startsWith("/")) {
    return trimmed;
  }

  try {
    const url = new URL(trimmed);
    // Case study links are internal site routes.
    // If an absolute URL is entered in CMS, keep only path/query/hash so
    // navigation always resolves against the active site origin.
    const internalPath = `${url.pathname}${url.search}${url.hash}`;
    return internalPath.startsWith("/") ? internalPath : `/${internalPath}`;
  } catch {
    // Keep non-URL values as-is for backward compatibility.
  }

  return trimmed;
}

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
  intro?: string;
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
    caseStudy: normalizeCaseStudyLink(
      metadataString(metadata, "caseStudy", "case_study", "caseStudyUrl")
    ),
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
    intro: metadataString(item.metadata, "intro"),
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

/** Returns all published projects, sorted featured first then newest.
 *
 * IMPORTANT: We intentionally do NOT swallow transient backend failures here.
 * Returning `[]` on error would let Next.js ISR cache an "empty homepage" for
 * the full revalidate window after a backend cold start. Throwing instead
 * causes ISR regeneration to fail, so Next.js keeps serving the previous
 * good cached page until the backend recovers.
 */
export async function getProjects(): Promise<Project[]> {
  if (!hasBackendUrl()) {
    return [];
  }

  return fetchProjects();
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
    // Real 404 → genuinely missing; render not-found.
    if (error instanceof ApiError && error.status === 404) {
      return { kind: "missing" };
    }
    // Any other error (network, 5xx, cold start) is a transient failure.
    // Re-throw so ISR keeps the previous good cached detail page instead
    // of replacing it with an "unavailable" render.
    throw error;
  }
}

export async function getProject(slug: string): Promise<Project | null> {
  const result = await getProjectDetail(slug);
  return result.kind === "found" ? result.project : null;
}

export async function getProjectStaticParams(): Promise<Array<{ slug: string }>> {
  return contentStaticParams(getProjects, (project) => project.slug);
}
