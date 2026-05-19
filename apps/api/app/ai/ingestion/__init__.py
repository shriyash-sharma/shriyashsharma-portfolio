"""Knowledge ingestion pipeline (chunking + embedding + persistence)."""

from app.ai.ingestion.chunking import Chunk, chunk_markdown
from app.ai.ingestion.pipeline import (
    IngestionResult,
    KnowledgeIngestionService,
    SourceDocument,
)

__all__ = [
    "Chunk",
    "chunk_markdown",
    "IngestionResult",
    "KnowledgeIngestionService",
    "SourceDocument",
]
