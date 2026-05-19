"""Ingest portfolio knowledge sources into the pgvector store.

Two source families are supported in Phase 1:

1. **CMS content** — published rows in ``content_items`` whose
   ``ai_indexable`` flag is true. Title + description + body are concatenated
   into the canonical text used for chunking.
2. **Repository markdown** — every ``.md`` / ``.mdx`` file under ``docs/``
   plus the top-level ``README.md``. The first heading becomes the title.

The script is idempotent: re-running it only re-embeds documents whose
content hash changed since the last ingestion.

Usage:

    cd apps/api
    uv run python scripts/ingest_knowledge.py
    uv run python scripts/ingest_knowledge.py --cms-only
    uv run python scripts/ingest_knowledge.py --docs-only
"""

from __future__ import annotations

import argparse
import asyncio
import logging
import re
import sys
from pathlib import Path

from sqlalchemy import select

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.ai.embeddings.factory import get_embedding_provider  # noqa: E402
from app.ai.ingestion.pipeline import (  # noqa: E402
    KnowledgeIngestionService,
    SourceDocument,
)
from app.db.models.content import (  # noqa: E402
    ContentItem,
    PublishingStatus,
)
from app.db.models.knowledge import KnowledgeSourceType  # noqa: E402
from app.db.session import AsyncSessionLocal  # noqa: E402

logger = logging.getLogger("ingest_knowledge")

REPO_ROOT = Path(__file__).resolve().parents[3]
DOCS_GLOBS = (
    "docs/**/*.md",
    "docs/**/*.mdx",
    "README.md",
    "apps/api/README.md",
    "apps/web/README.md",
)
MAX_FILE_SIZE_BYTES = 200_000  # Skip oversized files; not portfolio prose.
_HEADING_RE = re.compile(r"^#\s+(.*?)\s*$", re.MULTILINE)


async def ingest_cms(service: KnowledgeIngestionService) -> int:
    async with AsyncSessionLocal() as session:
        rows = (
            await session.execute(
                select(ContentItem).where(
                    ContentItem.status == PublishingStatus.PUBLISHED,
                    ContentItem.ai_indexable.is_(True),
                )
            )
        ).scalars().all()

    written = 0
    for row in rows:
        body = row.body or ""
        canonical = "\n\n".join(
            block for block in (row.title, row.description, body) if block
        )
        document = SourceDocument(
            source_type=KnowledgeSourceType.CONTENT_ITEM,
            source_id=str(row.id),
            title=row.title,
            text=canonical,
            summary=row.description,
            url=row.canonical_url,
            tags=list(row.tags or []),
            extra={
                "content_type": row.type.value,
                "locale": row.locale,
                "slug": row.slug,
            },
        )
        result = await service.ingest(document)
        status = "skipped" if result.skipped else f"{result.chunks_written} chunks"
        logger.info("cms[%s] %s — %s", row.type.value, row.slug, status)
        if not result.skipped:
            written += result.chunks_written
    return written


async def ingest_docs(service: KnowledgeIngestionService) -> int:
    files: list[Path] = []
    seen: set[Path] = set()
    for pattern in DOCS_GLOBS:
        for path in REPO_ROOT.glob(pattern):
            resolved = path.resolve()
            if resolved in seen or not resolved.is_file():
                continue
            if resolved.stat().st_size > MAX_FILE_SIZE_BYTES:
                logger.warning("skipping oversized file: %s", resolved)
                continue
            seen.add(resolved)
            files.append(resolved)

    written = 0
    for path in sorted(files):
        text = path.read_text(encoding="utf-8")
        if not text.strip():
            continue
        relative = str(path.relative_to(REPO_ROOT))
        title_match = _HEADING_RE.search(text)
        title = title_match.group(1).strip() if title_match else path.stem
        document = SourceDocument(
            source_type=KnowledgeSourceType.MARKDOWN_FILE,
            source_id=relative,
            title=title,
            text=text,
            summary=None,
            url=None,
            tags=[],
            extra={"path": relative},
        )
        result = await service.ingest(document)
        status = "skipped" if result.skipped else f"{result.chunks_written} chunks"
        logger.info("doc %s — %s", relative, status)
        if not result.skipped:
            written += result.chunks_written
    return written


async def main(*, include_cms: bool, include_docs: bool) -> None:
    embeddings = get_embedding_provider()
    async with AsyncSessionLocal() as session:
        service = KnowledgeIngestionService(session, embeddings)
        total = 0
        if include_cms:
            total += await ingest_cms(service)
        if include_docs:
            total += await ingest_docs(service)
    logger.info("ingestion complete — %d new chunks written", total)


def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--cms-only", action="store_true")
    parser.add_argument("--docs-only", action="store_true")
    return parser.parse_args()


if __name__ == "__main__":
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )
    args = _parse_args()
    include_cms = not args.docs_only
    include_docs = not args.cms_only
    asyncio.run(main(include_cms=include_cms, include_docs=include_docs))
