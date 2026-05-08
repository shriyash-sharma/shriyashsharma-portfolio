import type { Locale } from "@/lib/i18n/config";

export type ContentType =
  | "project"
  | "case-study"
  | "article"
  | "architecture-note"
  | "experiment"
  | "research-log";

export type ContentStatus = "draft" | "review" | "published" | "archived";

export type ContentIndexRecord = {
  id: string;
  slug: string;
  type: ContentType;
  locale: Locale;
  title: string;
  description: string;
  tags: string[];
  status: ContentStatus;
  updatedAt: string;
};

export type ContentIngestionJob = {
  id: string;
  source: "filesystem" | "cms" | "api";
  status: "queued" | "running" | "completed" | "failed";
  createdAt: string;
  completedAt?: string;
};

export type ApiContentItem = {
  id: string;
  slug: string;
  type: ContentType;
  status: ContentStatus;
  locale: Locale;
  title: string;
  description: string;
  body?: string | null;
  seo_title?: string | null;
  seo_description?: string | null;
  canonical_url?: string | null;
  tags: string[];
  categories: string[];
  metadata: Record<string, string | number | boolean | null>;
  ai_indexable: boolean;
  indexed_at?: string | null;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
};

export type ApiContentListResponse = {
  items: ApiContentItem[];
  total: number;
};
