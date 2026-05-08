import type { ContentType } from "./content";

export type RetrievalSource = {
  id: string;
  title: string;
  type: ContentType;
  url?: string;
  excerpt?: string;
  score?: number;
};

export type SemanticSearchRequest = {
  query: string;
  limit?: number;
  filters?: {
    types?: ContentType[];
    tags?: string[];
  };
};

export type SemanticSearchResult = {
  query: string;
  sources: RetrievalSource[];
};

export type AssistantRequest = {
  sessionId?: string;
  query: string;
  locale?: string;
};

export type AssistantStreamEvent =
  | { type: "delta"; delta: string }
  | { type: "sources"; sources: RetrievalSource[] }
  | { type: "done" }
  | { type: "error"; message: string };
