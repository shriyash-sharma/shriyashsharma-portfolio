import type { ApiContentItem, ContentStatus } from "@/lib/api/contracts/content";

export type DashboardSession = {
  id: string;
  email: string;
  name: string;
  roles: string[];
  last_login_at?: string | null;
};

export type AdminAuthResponse = {
  access_token: string;
  expires_in: number;
  user: DashboardSession;
};

export type ContentStatusCount = {
  status: ContentStatus;
  total: number;
};

export type AdminContentOverviewResponse = {
  counts: ContentStatusCount[];
  total: number;
};

export type MediaAsset = {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  url: string;
  alt_text?: string | null;
  created_at: string;
};

export type MediaListResponse = {
  items: MediaAsset[];
};

export type MediaUploadResponse = {
  item: MediaAsset;
};

export type AdminContentItem = ApiContentItem;