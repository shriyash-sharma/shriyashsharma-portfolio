import type { Locale } from "@/lib/i18n/config";

export type ApiEnvelope<T> = {
  data: T;
  meta?: {
    requestId?: string;
    cached?: boolean;
    locale?: Locale;
  };
};

export type ApiPage<T> = {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
};

export type PlatformHealth = {
  status: "ok" | "degraded" | "offline";
  version?: string;
  region?: string;
  checkedAt: string;
};

export type PlatformModule =
  | "projects"
  | "content"
  | "assistant"
  | "search"
  | "ingestion"
  | "analytics"
  | "observability";

export type PlatformCapability = {
  module: PlatformModule;
  status: "planned" | "ready" | "disabled";
  description: string;
};
