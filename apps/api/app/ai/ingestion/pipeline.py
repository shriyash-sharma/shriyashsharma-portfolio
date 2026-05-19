"""Knowledge ingestion pipeline.

Given a logical source document (CMS row, markdown file on disk, …) this
service:

1. Hashes the canonical text. If the hash matches an existing
   ``knowledge_documents`` row the call is a no-op (idempotent ingestion).
2. Chunks the text with the markdown-aware splitter.
3. Embeds all chunks in one provider call.
4. Replaces any prior chunks for the document and inserts the new ones in
   a single transaction.

The service is deliberately framework-agnostic — it accepts an
``AsyncSession`` and an ``EmbeddingProvider`` so it can be reused from the
CLI ingestion script, an admin endpoint later, or tests.
"""

from __future__ import annotations

import hashlib
from dataclasses import dataclass, field
from typing import Any

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.embeddings.base import EmbeddingProvider
from app.ai.ingestion.chunking import chunk_markdown
from app.core.config import get_settings
from app.db.models.knowledge import (
    KnowledgeChunk,
    KnowledgeDocument,
    KnowledgeSourceType,
)


@dataclass(frozen=True)
class SourceDocument:
    """Normalized input to the ingestion pipeline."""

    source_type: KnowledgeSourceType
    source_id: str
    title: str
    text: str
    summary: str | None = None
    url: str | None = None
    tags: list[str] = field(default_factory=list)
    extra: dict[str, Any] = field(default_factory=dict)


@dataclass(frozen=True)
class IngestionResult:
    document_id: str
    chunks_written: int
    skipped: bool


class KnowledgeIngestionService:
    def __init__(
        self,
        session: AsyncSession,
        embedding_provider: EmbeddingProvider,
    ) -> None:
        self._session = session
        self._embeddings = embedding_provider
        self._settings = get_settings()

    async def ingest(self, document: SourceDocument) -> IngestionResult:
        content_hash = _hash(document.text)

        existing = await self._session.scalar(
            select(KnowledgeDocument).where(
                KnowledgeDocument.source_type == document.source_type,
                KnowledgeDocument.source_id == document.source_id,
            )
        )

        if existing and existing.content_hash == content_hash:
            return IngestionResult(
                document_id=str(existing.id),
                chunks_written=0,
                skipped=True,
            )

        chunks = chunk_markdown(
            document.text,
            target_chars=self._settings.rag_chunk_size,
            overlap_chars=self._settings.rag_chunk_overlap,
        )
        if not chunks:
            # Nothing useful to embed – still upsert the document record so
            # operators can see that ingestion was attempted.
            chunks_payload: list[list[float]] = []
        else:
            # Prepend doc title + heading path to the embedded text so semantic
            # similarity considers structural context, not just chunk body.
            # The original `chunk.content` is what we store and show as the
            # citation excerpt — only the embedding input is enriched.
            embed_inputs = [
                _build_embedding_input(document.title, chunk)
                for chunk in chunks
            ]
            chunks_payload = await self._embeddings.embed_many(embed_inputs)

        if existing is None:
            document_row = KnowledgeDocument(
                source_type=document.source_type,
                source_id=document.source_id,
                title=document.title,
                summary=document.summary,
                url=document.url,
                tags=document.tags,
                content_hash=content_hash,
                extra=document.extra,
            )
            self._session.add(document_row)
            await self._session.flush()
        else:
            existing.title = document.title
            existing.summary = document.summary
            existing.url = document.url
            existing.tags = document.tags
            existing.content_hash = content_hash
            existing.extra = document.extra
            document_row = existing
            await self._session.execute(
                delete(KnowledgeChunk).where(
                    KnowledgeChunk.document_id == document_row.id
                )
            )

        for chunk, embedding in zip(chunks, chunks_payload, strict=True):
            self._session.add(
                KnowledgeChunk(
                    document_id=document_row.id,
                    chunk_index=chunk.index,
                    heading_path=chunk.heading_path,
                    content=chunk.content,
                    token_estimate=chunk.token_estimate,
                    embedding=embedding,
                )
            )

        await self._session.commit()
        return IngestionResult(
            document_id=str(document_row.id),
            chunks_written=len(chunks_payload),
            skipped=False,
        )


def _hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()


def _build_embedding_input(title: str, chunk: Any) -> str:
    """Compose the text actually sent to the embedding model.

    We prepend the document title and the chunk's heading path so the
    embedding reflects structural context (e.g. "Current Limitations →
    No vector search yet") rather than only the chunk body. This is a
    standard RAG quality lever — without it, short body chunks under
    descriptive headings rank poorly against natural-language queries.
    """
    parts = [title]
    if chunk.heading_path and chunk.heading_path != title:
        parts.append(chunk.heading_path)
    parts.append(chunk.content)
    return "\n\n".join(parts)
