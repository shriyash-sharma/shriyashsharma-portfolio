import type { Locale } from "@/lib/i18n/config";
import type {
  ContentStatus,
  ContentType,
} from "@/lib/api/contracts/content";

export type ContentFrontmatter = {
  title: string;
  description: string;
  locale: Locale;
  type: ContentType;
  status: ContentStatus;
  tags: string[];
  publishedAt?: string;
  updatedAt: string;
  canonicalSlug: string;
};

export type ProjectFrontmatter = ContentFrontmatter & {
  type: "project";
  stack: string[];
  role: string;
  impact?: string;
};

export type ArticleFrontmatter = ContentFrontmatter & {
  type: "article" | "architecture-note" | "research-log";
  readTime: string;
};

export type CaseStudyFrontmatter = ContentFrontmatter & {
  type: "case-study";
  readTime: string;
  systemArea: string;
};
