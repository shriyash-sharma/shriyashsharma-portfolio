/**
 * Content Service – server-side only.
 * Abstracts content retrieval so the implementation can swap between
 * filesystem (now), headless CMS, or API backend (future) without
 * touching feature components.
 */

import type { ContentIndexRecord } from "@/lib/api/contracts/content";
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

/** Filesystem implementation – returns empty arrays until content is added. */
export async function getBlogPosts(): Promise<BlogPost[]> {
  // TODO: read from content/blog/*.mdx using gray-matter or next-mdx-remote
  return [];
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  // TODO: read individual post file
  void slug;
  return null;
}

export async function getCaseStudies(): Promise<CaseStudy[]> {
  // TODO: read from content/case-studies/*.mdx
  return [];
}

export async function getCaseStudy(slug: string): Promise<CaseStudy | null> {
  void slug;
  return null;
}

export async function getContentIndex(): Promise<ContentIndexRecord[]> {
  // TODO: aggregate from filesystem collections, CMS, or FastAPI /content/index
  void contentCollections;
  return [];
}
