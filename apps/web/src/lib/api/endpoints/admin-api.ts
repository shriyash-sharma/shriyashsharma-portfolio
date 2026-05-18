import "server-only";

import type {
  AdminContentOverviewResponse,
  DashboardSession,
  MediaListResponse,
} from "@/lib/api/contracts/admin";
import type {
  ApiContentItem,
  ApiContentListResponse,
  ContentStatus,
  ContentType,
} from "@/lib/api/contracts/content";
import { ApiError, httpClient } from "@/lib/api/http-client";

function buildQuery(params: Record<string, string | undefined>) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      searchParams.set(key, value);
    }
  }

  const result = searchParams.toString();
  return result ? `?${result}` : "";
}

export async function getAdminSession(token: string) {
  return httpClient.get<DashboardSession>("/auth/session", {
    token,
    cache: "no-store",
  });
}

export async function getAdminContentOverview({
  token,
  type,
  locale,
}: {
  token: string;
  type: ContentType;
  locale?: string;
}) {
  const query = buildQuery({ locale });
  return httpClient.get<AdminContentOverviewResponse>(
    `/admin/content/${type}/overview${query}`,
    {
      token,
      cache: "no-store",
    }
  );
}

export async function getAdminContentItem({
  token,
  itemId,
}: {
  token: string;
  itemId: string;
}) {
  return httpClient.get<ApiContentItem>(`/admin/content/items/${itemId}`, {
    token,
    cache: "no-store",
  });
}

export async function listAdminContent({
  token,
  type,
  locale,
  query,
  status,
}: {
  token: string;
  type: ContentType;
  locale?: string;
  query?: string;
  status?: ContentStatus;
}) {
  const search = buildQuery({ locale, query, status_filter: status });
  return httpClient.get<ApiContentListResponse>(`/admin/content/${type}${search}`, {
    token,
    cache: "no-store",
  });
}

export async function listAdminMedia({ token }: { token: string }) {
  return httpClient.get<MediaListResponse>("/admin/media", {
    token,
    cache: "no-store",
  });
}

export function isUnauthorizedApiError(error: unknown) {
  return error instanceof ApiError && error.status === 401;
}