/**
 * Contract for the AI Lab RAG Explorer.
 *
 * The backend returns snake_case fields verbatim (see
 * `apps/api/app/schemas/ai_lab.py`). The same-origin proxy forwards the JSON
 * unchanged, so these types intentionally mirror the snake_case shape rather
 * than introducing a transform layer for this self-contained feature.
 */

export type RagExplorerRequest = {
  content: string;
  question: string;
  top_k?: number;
  chunk_size?: number;
  chunk_overlap?: number;
};

export type RagChunkView = {
  index: number;
  content: string;
  char_count: number;
  token_estimate: number;
  heading_path: string | null;
};

export type RagEmbeddingInfo = {
  model: string;
  dimensions: number;
  is_fallback: boolean;
  generation_ms: number;
  chunk_count: number;
  query_vector_preview: number[];
  query_vector_full?: number[];
};

export type RagVectorSearchInfo = {
  top_k: number;
  total_chunks: number;
  search_ms: number;
  query_vector_preview: number[];
};

export type RagRetrievedChunkView = {
  rank: number;
  chunk_index: number;
  score: number;
  content: string;
  char_count: number;
  token_estimate: number;
  heading_path: string | null;
};

export type RagPromptView = {
  system_prompt: string;
  context_block: string;
  user_question: string;
  final_prompt: string;
  total_chars: number;
};

export type RagAnswerView = {
  text: string;
  provider: string;
  model: string;
  response_ms: number;
  implemented: boolean;
};

export type RagExplorerResponse = {
  query: string;
  chunk_size: number;
  chunk_overlap: number;
  chunks: RagChunkView[];
  embedding: RagEmbeddingInfo;
  vector_search: RagVectorSearchInfo;
  retrieved: RagRetrievedChunkView[];
  prompt: RagPromptView;
  answer: RagAnswerView;
};
