import { httpClient } from "@/lib/api/http-client";
import type {
  SemanticSearchRequest,
  SemanticSearchResult,
} from "@/lib/api/contracts/ai";
import type { ApiEnvelope } from "@/lib/api/contracts/platform";

export async function semanticSearch(payload: SemanticSearchRequest) {
  return httpClient.post<ApiEnvelope<SemanticSearchResult>>(
    "/ai/search",
    payload,
    { timeoutMs: 15_000 }
  );
}
