"""SQLAlchemy models for the portfolio RAG knowledge base.

Two tables back the assistant's retrieval layer:

- ``knowledge_documents`` is the canonical record of an ingested source
  (a published `ContentItem`, a markdown architecture note, a case study,
  etc.). It owns metadata that is useful for citation and re-ingestion.
- ``knowledge_chunks`` stores the embedding-ready text spans and their
  pgvector embeddings. Retrieval queries operate on this table.

Design notes:
- ``source_type`` / ``source_id`` form a logical foreign key into either the
  ``content_items`` table or an external file path. We intentionally do not
  add a hard FK so ingestion can also pull from disk-only markdown sources
  (architecture notes, ADRs) without requiring CMS rows.
- ``content_hash`` makes re-ingestion idempotent: if the hash matches an
  existing document, ingestion is a no-op.
- The vector dimension is configurable via settings to allow swapping
  embedding models without code changes (only a migration).
"""

from __future__ import annotations

from enum import StrEnum
from typing import Any
from uuid import UUID

from pgvector.sqlalchemy import Vector
from sqlalchemy import ForeignKey, Index, Integer, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.config import get_settings
from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin

_EMBEDDING_DIMENSIONS = get_settings().embedding_dimensions


class KnowledgeSourceType(StrEnum):
    """Origin of an ingested document."""

    CONTENT_ITEM = "content_item"
    MARKDOWN_FILE = "markdown_file"
    MANUAL = "manual"


class KnowledgeDocument(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "knowledge_documents"
    __table_args__ = (
        UniqueConstraint(
            "source_type",
            "source_id",
            name="uq_knowledge_source",
        ),
        Index("ix_knowledge_documents_source_type", "source_type"),
    )

    source_type: Mapped[KnowledgeSourceType] = mapped_column(
        String(32), nullable=False
    )
    # For CONTENT_ITEM: stringified UUID. For MARKDOWN_FILE: repo-relative path.
    source_id: Mapped[str] = mapped_column(String(500), nullable=False)
    title: Mapped[str] = mapped_column(String(300), nullable=False)
    summary: Mapped[str | None] = mapped_column(Text)
    url: Mapped[str | None] = mapped_column(String(500))
    tags: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    content_hash: Mapped[str] = mapped_column(String(64), nullable=False)
    extra: Mapped[dict[str, Any]] = mapped_column(
        "metadata", JSONB, default=dict, nullable=False
    )

    chunks: Mapped[list["KnowledgeChunk"]] = relationship(
        back_populates="document",
        cascade="all, delete-orphan",
        passive_deletes=True,
    )


class KnowledgeChunk(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "knowledge_chunks"
    __table_args__ = (
        Index("ix_knowledge_chunks_document_id", "document_id"),
    )

    document_id: Mapped[UUID] = mapped_column(
        ForeignKey("knowledge_documents.id", ondelete="CASCADE"),
        nullable=False,
    )
    chunk_index: Mapped[int] = mapped_column(Integer, nullable=False)
    heading_path: Mapped[str | None] = mapped_column(String(500))
    content: Mapped[str] = mapped_column(Text, nullable=False)
    token_estimate: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    embedding: Mapped[list[float]] = mapped_column(
        Vector(_EMBEDDING_DIMENSIONS), nullable=False
    )

    document: Mapped[KnowledgeDocument] = relationship(back_populates="chunks")
