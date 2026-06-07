"""Schemas for the AI Lab RAG Explorer.

The RAG Explorer runs a complete retrieval-augmented generation pass over
*user-supplied* text and returns every intermediate artifact so the frontend
can visualize the pipeline step by step:

    query → chunking → embeddings → vector search → retrieved chunks
          → prompt construction → final answer

Unlike the production assistant (which returns only the final message and its
sources), this contract is deliberately verbose for teaching purposes.
"""

from __future__ import annotations

from pydantic import BaseModel, Field


class RagExplorerRequest(BaseModel):
    content: str = Field(min_length=20, max_length=20_000)
    question: str = Field(min_length=3, max_length=500)
    top_k: int | None = Field(default=None, ge=1, le=10)
    # User-tunable chunking. Defaults come from settings when omitted. Overlap
    # is clamped to chunk_size in the service so it can never exceed it.
    chunk_size: int | None = Field(default=None, ge=100, le=2_000)
    chunk_overlap: int | None = Field(default=None, ge=0, le=500)


class ChunkView(BaseModel):
    index: int
    content: str
    char_count: int
    token_estimate: int
    heading_path: str | None = None


class EmbeddingInfo(BaseModel):
    model: str
    dimensions: int
    is_fallback: bool
    generation_ms: float
    chunk_count: int
    query_vector_preview: list[float]
    query_vector_full: list[float]


class VectorSearchInfo(BaseModel):
    top_k: int
    total_chunks: int
    search_ms: float
    query_vector_preview: list[float]


class RetrievedChunkView(BaseModel):
    rank: int
    chunk_index: int
    score: float
    content: str
    char_count: int
    token_estimate: int
    heading_path: str | None = None


class PromptView(BaseModel):
    system_prompt: str
    context_block: str
    user_question: str
    final_prompt: str
    total_chars: int


class AnswerView(BaseModel):
    text: str
    provider: str
    model: str
    response_ms: float
    implemented: bool


class RagExplorerResponse(BaseModel):
    query: str
    chunk_size: int
    chunk_overlap: int
    chunks: list[ChunkView]
    embedding: EmbeddingInfo
    vector_search: VectorSearchInfo
    retrieved: list[RetrievedChunkView]
    prompt: PromptView
    answer: AnswerView
