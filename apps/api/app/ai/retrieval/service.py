"""pgvector-backed semantic retrieval.

Phase 1 is deliberately dense-vector-only. Hybrid (BM25 + dense) retrieval,
reranking, and query rewriting are explicit Phase 2 work — adding them now
would only make it harder to debug retrieval quality on a small corpus.
"""

from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.embeddings.base import EmbeddingProvider
from app.db.models.knowledge import KnowledgeChunk, KnowledgeDocument


@dataclass(frozen=True)
class RetrievedChunk:
    chunk_id: UUID
    document_id: UUID
    document_title: str
    document_url: str | None
    source_type: str
    heading_path: str | None
    content: str
    similarity: float
    tags: list[str]


class RetrievalService:
    def __init__(
        self,
        session: AsyncSession,
        embedding_provider: EmbeddingProvider,
    ) -> None:
        self._session = session
        self._embeddings = embedding_provider

    async def search(
        self,
        query: str,
        *,
        top_k: int = 5,
        min_similarity: float = 0.0,
    ) -> list[RetrievedChunk]:
        if not query.strip():
            return []

        query_vector = await self._embeddings.embed_one(query)

        # pgvector exposes ``<=>`` for cosine distance. Similarity = 1 - distance.
        # We sort ascending on distance and take the top-k.
        distance = KnowledgeChunk.embedding.cosine_distance(query_vector)
        statement = (
            select(
                KnowledgeChunk,
                KnowledgeDocument,
                distance.label("distance"),
            )
            .join(
                KnowledgeDocument,
                KnowledgeDocument.id == KnowledgeChunk.document_id,
            )
            .order_by(distance.asc())
            .limit(top_k)
        )

        rows = (await self._session.execute(statement)).all()

        results: list[RetrievedChunk] = []
        for chunk, document, raw_distance in rows:
            similarity = 1.0 - float(raw_distance)
            if similarity < min_similarity:
                continue
            results.append(
                RetrievedChunk(
                    chunk_id=chunk.id,
                    document_id=document.id,
                    document_title=document.title,
                    document_url=document.url,
                    source_type=str(document.source_type),
                    heading_path=chunk.heading_path,
                    content=chunk.content,
                    similarity=similarity,
                    tags=list(document.tags or []),
                )
            )
        return results
