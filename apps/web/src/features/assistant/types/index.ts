/**
 * AI assistant types – future-ready interface.
 * Implement assistantService when FastAPI backend + RAG pipeline is ready.
 */

export type AssistantMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
  /** Source citations from RAG retrieval */
  sources?: AssistantSource[];
};

export type AssistantSource = {
  title: string;
  url?: string;
  excerpt?: string;
};

export type AssistantSession = {
  id: string;
  messages: AssistantMessage[];
  createdAt: Date;
};

export type AssistantQueryPayload = {
  sessionId?: string;
  query: string;
};

export type AssistantStreamChunk = {
  delta: string;
  done: boolean;
  sources?: AssistantSource[];
};
