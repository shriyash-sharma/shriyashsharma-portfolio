"""pgvector-backed semantic retrieval.

Phase 1 is deliberately dense-vector-only. Hybrid (BM25 + dense) retrieval,
reranking, and query rewriting are explicit Phase 2 work — adding them now
would only make it harder to debug retrieval quality on a small corpus.
"""

from __future__ import annotations

from dataclasses import dataclass
from uuid import UUID

from sqlalchemy import select, text
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
    # CMS content type when ingested from ContentItem (project, case-study, etc.).
    # Stored in KnowledgeDocument.extra during ingestion for accurate source labels.
    content_type: str | None
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
        max_per_document: int | None = None,
        candidate_multiplier: int = 6,
        ef_search: int | None = None,
        content_types: list[str] | None = None,
    ) -> list[RetrievedChunk]:
        """Return the most relevant chunks for ``query``.

        We over-fetch a candidate pool (``top_k * candidate_multiplier``) and
        then apply a per-document cap so a single long document cannot occupy
        every slot in the final context — this is what previously made the
        assistant answer from one ADR while ignoring more relevant sources.

        ``content_types`` (when provided) biases results toward CMS documents
        of the allowed types. Untyped documents (repository markdown / ADRs,
        which carry no ``content_type``) are cross-cutting general knowledge and
        are always eligible — otherwise an incidental type word in the query
        (e.g. "explain rag in your project") would wrongly hide the entire
        markdown/ADR knowledge base.
        """
        if not query.strip():
            return []

        query_vector = await self._embeddings.embed_one(query)

        # Widen HNSW search breadth for high recall. ``SET LOCAL`` scopes this
        # to the current transaction so it never leaks into other queries.
        # Postgres ``SET`` does not accept bind parameters, so we inline a
        # sanitised integer. A failed SET would poison the transaction, so this
        # must stay valid (the HNSW index registers the ``hnsw.ef_search`` GUC).
        if ef_search and ef_search > 0:
            await self._session.execute(
                text(f"SET LOCAL hnsw.ef_search = {int(ef_search)}")
            )

        candidate_limit = max(top_k, top_k * max(candidate_multiplier, 1))

        # pgvector exposes ``<=>`` for cosine distance. Similarity = 1 - distance.
        # We sort ascending on distance and take the candidate pool.
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
            .limit(candidate_limit)
        )

        rows = (await self._session.execute(statement)).all()

        allowed_types = set(content_types) if content_types else None
        results: list[RetrievedChunk] = []
        per_document: dict[UUID, int] = {}
        for chunk, document, raw_distance in rows:
            if len(results) >= top_k:
                break
            similarity = 1.0 - float(raw_distance)
            if similarity < min_similarity:
                continue
            doc_content_type = (
                document.extra.get("content_type")
                if isinstance(document.extra, dict)
                else None
            )
            # Only exclude CMS items of a *different* type. Untyped docs
            # (markdown / ADRs) stay eligible regardless of the scope.
            if (
                allowed_types is not None
                and doc_content_type is not None
                and doc_content_type not in allowed_types
            ):
                continue
            if max_per_document is not None:
                used = per_document.get(document.id, 0)
                if used >= max_per_document:
                    continue
                per_document[document.id] = used + 1
            results.append(
                RetrievedChunk(
                    chunk_id=chunk.id,
                    document_id=document.id,
                    document_title=document.title,
                    document_url=document.url,
                    source_type=str(document.source_type),
                    content_type=doc_content_type,
                    heading_path=chunk.heading_path,
                    content=chunk.content,
                    similarity=similarity,
                    tags=list(document.tags or []),
                )
            )
        return results
