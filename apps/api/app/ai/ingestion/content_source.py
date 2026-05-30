"""Map a CMS ``ContentItem`` to an ingestion ``SourceDocument``.

This is the single source of truth for how content rows are turned into
knowledge-base documents. Both the bulk ingestion script and the live
auto-indexing service use it so the canonical text, metadata, and source
identity stay identical regardless of how ingestion is triggered.
"""

from __future__ import annotations

from app.ai.ingestion.pipeline import SourceDocument
from app.db.models.content import ContentItem
from app.db.models.knowledge import KnowledgeSourceType


def content_item_to_source_document(item: ContentItem) -> SourceDocument:
    body = item.body or ""
    canonical = "\n\n".join(
        block for block in (item.title, item.description, body) if block
    )
    return SourceDocument(
        source_type=KnowledgeSourceType.CONTENT_ITEM,
        source_id=str(item.id),
        title=item.title,
        text=canonical,
        summary=item.description,
        url=item.canonical_url,
        tags=list(item.tags or []),
        extra={
            "content_type": item.type.value,
            "locale": item.locale,
            "slug": item.slug,
        },
    )
