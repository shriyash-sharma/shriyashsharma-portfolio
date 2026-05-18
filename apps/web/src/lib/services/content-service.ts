/**
 * Content Service – server-side only.
 * Abstracts content retrieval so the implementation can swap between
 * filesystem (now), headless CMS, or API backend (future) without
 * touching feature components.
 */

import type {
  ContentIndexRecord,
  ApiContentItem,
  ContentType,
} from "@/lib/api/contracts/content";
import { hasBackendUrl } from "@/lib/api/backend-url";
import { getContentItem, listContent } from "@/lib/api/endpoints/content-api";
import { contentCollections } from "@/lib/content/registry";

export type PublicContentEntry = {
  id: string;
  slug: string;
  type: ContentType;
  title: string;
  description: string;
  body: string;
  publishedAt: string;
  updatedAt: string;
  tags: string[];
  categories: string[];
  readTime: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
  canonicalUrl?: string | null;
  metadata: ApiContentItem["metadata"];
};

export type BlogPost = PublicContentEntry;

export type CaseStudy = PublicContentEntry;

export type ArchitectureNote = PublicContentEntry;

function readTimeFrom(item: ApiContentItem) {
  return typeof item.metadata.read_time === "string"
    ? item.metadata.read_time
    : "5 min";
}

function mapPublicContentEntry(item: ApiContentItem): PublicContentEntry {
  return {
    id: item.id,
    slug: item.slug,
    type: item.type,
    title: item.title,
    description: item.description,
    body: item.body ?? "",
    publishedAt: item.published_at ?? item.updated_at,
    updatedAt: item.updated_at,
    tags: item.tags,
    categories: item.categories,
    readTime: readTimeFrom(item),
    seoTitle: item.seo_title,
    seoDescription: item.seo_description,
    canonicalUrl: item.canonical_url,
    metadata: item.metadata,
  };
}

/** Filesystem implementation – returns empty arrays until content is added. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!hasBackendUrl()) {
    return [];
  }

  try {
    const response = await listContent({ type: "article", limit: 50 });
    return response.items.map(mapPublicContentEntry);
  } catch {
    return [];
  }
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  if (!hasBackendUrl()) {
    return null;
  }

  try {
    const item = await getContentItem({ type: "article", slug });
    return mapPublicContentEntry(item);
  } catch {
    return null;
  }
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  if (!hasBackendUrl()) {
    return [];
  }

  try {
    const response = await listContent({ type: "case-study", limit: 50 });
    return response.items.map(mapPublicContentEntry);
  } catch {
    return [];
  }
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  if (!hasBackendUrl()) {
    return null;
  }

  try {
    const item = await getContentItem({ type: "case-study", slug });
    return mapPublicContentEntry(item);
  } catch {
    return null;
  }
}

export async function getArchitectureNotes(): Promise<ArchitectureNote[]> {
  if (!hasBackendUrl()) {
    return [];
  }

  try {
    const response = await listContent({ type: "architecture-note", limit: 50 });
    return response.items.map(mapPublicContentEntry);
  } catch {
    return [];
  }
}

export async function getArchitectureNote(
  slug: string
): Promise<ArchitectureNote | null> {
  if (!hasBackendUrl()) {
    return null;
  }

  try {
    const item = await getContentItem({ type: "architecture-note", slug });
    return mapPublicContentEntry(item);
  } catch {
    return null;
  }
}

export async function getContentIndex(): Promise<ContentIndexRecord[]> {
  // TODO: aggregate from filesystem collections, CMS, or FastAPI /content/index
  void contentCollections;
  return [];
}
