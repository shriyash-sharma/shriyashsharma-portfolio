import { httpClient } from "@/lib/api/http-client";
import type { RequestOptions } from "@/lib/api/http-client";
import type {
  ApiContentItem,
  ApiContentListResponse,
  ContentType,
} from "@/lib/api/contracts/content";
import type { Locale } from "@/lib/i18n/config";

type ListContentOptions = {
  type: ContentType;
  locale?: Locale;
  limit?: number;
  offset?: number;
};

export async function listContent({
  type,
  locale = "en",
  limit = 20,
  offset = 0,
}: ListContentOptions, requestOptions?: RequestOptions) {
  const params = new URLSearchParams({
    locale,
    limit: String(limit),
    offset: String(offset),
  });

  return httpClient.get<ApiContentListResponse>(
    `/content/${type}?${params}`,
    requestOptions
  );
}

export async function getContentItem({
  type,
  slug,
  locale = "en",
}: {
  type: ContentType;
  slug: string;
  locale?: Locale;
}, requestOptions?: RequestOptions) {
  const params = new URLSearchParams({ locale });
  return httpClient.get<ApiContentItem>(
    `/content/${type}/${slug}?${params}`,
    requestOptions
  );
}
