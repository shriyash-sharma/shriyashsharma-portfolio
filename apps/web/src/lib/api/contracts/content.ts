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
