"""Keep the RAG knowledge base in sync with CMS content writes.

The editorial dashboard calls into this service after every create / update /
delete so the assistant's retrieval index reflects published content within the
same request — no separate cron or manual ``ingest_knowledge.py`` run required.

Sync rules for a single content item:

- ``published`` **and** ``ai_indexable``  → (re)embed and upsert into the index.
- anything else (draft, review, archived, ``ai_indexable=False``, deleted)
  → remove it from the index so the assistant never quotes unpublished work.

Design constraints:

- **Never break an editorial save.** Embedding needs network + API keys; if
  that fails or is unconfigured we log and move on. The content row is already
  persisted, and the item can be re-indexed later via the reindex endpoint or
  the CLI script. Failures set/keep ``indexed_at`` unchanged.
- Idempotent: ingestion is hash-guarded, so repeated syncs of unchanged text
  are no-ops.
"""

from __future__ import annotations

import logging
from datetime import UTC, datetime
from uuid import UUID

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.embeddings.base import EmbeddingProvider
from app.ai.embeddings.factory import get_embedding_provider
from app.ai.ingestion.content_source import content_item_to_source_document
from app.ai.ingestion.pipeline import KnowledgeIngestionService
from app.db.models.content import ContentItem, PublishingStatus
from app.db.models.knowledge import KnowledgeDocument, KnowledgeSourceType

logger = logging.getLogger(__name__)


def _is_indexable(item: ContentItem) -> bool:
    return item.status == PublishingStatus.PUBLISHED and bool(item.ai_indexable)


async def _remove_content_from_index(session: AsyncSession, content_id: UUID | str) -> bool:
    """Delete the knowledge document (and, via cascade, its chunks) for a
    content item. Returns ``True`` if a document was removed."""
    document = await session.scalar(
        select(KnowledgeDocument).where(
            KnowledgeDocument.source_type == KnowledgeSourceType.CONTENT_ITEM,
            KnowledgeDocument.source_id == str(content_id),
        )
    )
    if document is None:
        return False
    await session.delete(document)
    await session.commit()
    return True


async def sync_content_item_index(
    session: AsyncSession,
    item: ContentItem,
    *,
    embeddings: EmbeddingProvider | None = None,
) -> None:
    """Make the knowledge base match the current state of ``item``.

    Swallows and logs all errors so it is safe to call from request handlers.
    """
    try:
        if not _is_indexable(item):
            removed = await _remove_content_from_index(session, item.id)
            if item.indexed_at is not None:
                item.indexed_at = None
                await session.commit()
            if removed:
                logger.info("Removed content %s from knowledge index", item.id)
            return

        provider = embeddings or get_embedding_provider()
        service = KnowledgeIngestionService(session, provider)
        document = content_item_to_source_document(item)
        result = await service.ingest(document)

        item.indexed_at = datetime.now(UTC).isoformat()
        await session.commit()
        logger.info(
            "Indexed content %s (%s) — %s",
            item.id,
            item.slug,
            "unchanged" if result.skipped else f"{result.chunks_written} chunks",
        )
    except RuntimeError as exc:
        # Provider not configured (missing OPENAI_API_KEY etc.).
        logger.warning("Skipping live index for %s: %s", item.id, exc)
    except Exception:
        logger.exception("Live indexing failed for content %s", item.id)


async def remove_content_item_index(
    session: AsyncSession, content_id: UUID | str
) -> None:
    """Remove a content item from the index (used on delete). Error-safe."""
    try:
        removed = await _remove_content_from_index(session, content_id)
        if removed:
            logger.info("Removed content %s from knowledge index", content_id)
    except Exception:
        logger.exception("Failed to remove content %s from index", content_id)


async def reindex_all_content(
    session: AsyncSession,
    *,
    embeddings: EmbeddingProvider | None = None,
) -> dict[str, int]:
    """Rebuild the CMS portion of the index from scratch-of-truth content rows.

    Walks every content item, (re)indexing publishable ones and removing the
    rest. Returns counts for an operator-facing summary. Raises ``RuntimeError``
    if the embedding provider is unconfigured (the caller surfaces a 503).
    """
    provider = embeddings or get_embedding_provider()
    service = KnowledgeIngestionService(session, provider)

    items = (await session.execute(select(ContentItem))).scalars().all()

    indexed = 0
    skipped = 0
    removed = 0
    for item in items:
        if _is_indexable(item):
            document = content_item_to_source_document(item)
            result = await service.ingest(document)
            if result.skipped:
                skipped += 1
            else:
                indexed += 1
            item.indexed_at = datetime.now(UTC).isoformat()
            await session.commit()
        else:
            if await _remove_content_from_index(session, item.id):
                removed += 1
            if item.indexed_at is not None:
                item.indexed_at = None
                await session.commit()

    return {
        "total": len(items),
        "indexed": indexed,
        "unchanged": skipped,
        "removed": removed,
    }


async def purge_orphan_index_documents(session: AsyncSession) -> dict[str, int]:
    """Remove knowledge documents that no longer correspond to a live source.

    Two failure modes are cleaned up:

    1. ``CONTENT_ITEM`` knowledge rows whose ``source_id`` doesn't match any
       ``content_items.id`` (item was hard-deleted while indexing was offline,
       or the schema migrated).
    2. ``MARKDOWN_FILE`` knowledge rows from a prior ingestion scope (e.g.
       README files, walkthroughs) that the current ingestion script no
       longer includes. Operators trigger this after narrowing the corpus.

    Returns counts for an operator-facing summary. Safe to run repeatedly.
    """
    removed_cms = 0
    removed_docs = 0

    # 1. Orphaned CMS-sourced documents (content row no longer exists).
    cms_docs = (
        await session.execute(
            select(KnowledgeDocument).where(
                KnowledgeDocument.source_type == KnowledgeSourceType.CONTENT_ITEM
            )
        )
    ).scalars().all()
    for doc in cms_docs:
        exists = await session.scalar(
            select(ContentItem.id).where(ContentItem.id == doc.source_id)
        )
        if exists is None:
            await session.delete(doc)
            removed_cms += 1
    if removed_cms:
        await session.commit()

    # 2. Markdown-file documents are caller-managed: anything currently
    #    present is fair game to purge so the operator can re-ingest from
    #    the narrowed scope. The CLI script remains the only writer of
    #    ``MARKDOWN_FILE`` rows, so this is safe to delete here.
    md_docs = (
        await session.execute(
            select(KnowledgeDocument).where(
                KnowledgeDocument.source_type == KnowledgeSourceType.MARKDOWN_FILE
            )
        )
    ).scalars().all()
    for doc in md_docs:
        await session.delete(doc)
        removed_docs += 1
    if removed_docs:
        await session.commit()

    return {
        "removed_cms_orphans": removed_cms,
        "removed_doc_sources": removed_docs,
    }
