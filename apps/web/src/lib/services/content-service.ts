/**
 * Content Service – server-side only.
 * Abstracts content retrieval so the implementation can swap between
 * filesystem (now), headless CMS, or API backend (future) without
 * touching feature components.
 */

import type { ContentIndexRecord } from "@/lib/api/contracts/content";
import type { ApiContentItem } from "@/lib/api/contracts/content";
import { getContentItem, listContent } from "@/lib/api/endpoints/content-api";
import { contentCollections } from "@/lib/content/registry";

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  readTime: string;
};

export type CaseStudy = {
  slug: string;
  title: string;
  description: string;
  publishedAt: string;
  tags: string[];
  readTime: string;
};

function hasBackendUrl() {
  return Boolean(process.env.API_INTERNAL_URL ?? process.env.NEXT_PUBLIC_API_URL);
}

function readTimeFrom(item: ApiContentItem) {
  return typeof item.metadata.read_time === "string"
    ? item.metadata.read_time
    : "5 min";
}

function mapBlogPost(item: ApiContentItem): BlogPost {
  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    publishedAt: item.published_at ?? item.updated_at,
    tags: item.tags,
    readTime: readTimeFrom(item),
  };
}

function mapCaseStudy(item: ApiContentItem): CaseStudy {
  return {
    slug: item.slug,
    title: item.title,
    description: item.description,
    publishedAt: item.published_at ?? item.updated_at,
    tags: item.tags,
    readTime: readTimeFrom(item),
  };
}

/** Filesystem implementation – returns empty arrays until content is added. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!hasBackendUrl()) {
    return [];
  }

  try {
    const response = await listContent({ type: "article", limit: 50 });
    return response.items.map(mapBlogPost);
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
    return mapBlogPost(item);
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
    return response.items.map(mapCaseStudy);
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
    return mapCaseStudy(item);
  } catch {
    return null;
  }
}

export async function getContentIndex(): Promise<ContentIndexRecord[]> {
  // TODO: aggregate from filesystem collections, CMS, or FastAPI /content/index
  void contentCollections;
  return [];
}
