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
from app.ai.ingestion.content_source import (  # noqa: E402
    content_item_to_source_document,
)
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
# Repository markdown sources. Deliberately scoped to *curated* architecture
# writeups and ADRs only. We exclude:
#   - top-level README files (setup / dev-environment instructions)
#   - apps/api/README.md, apps/web/README.md (engineer-facing)
#   - docs/local-development.md, docs/*walkthrough*.{md,txt} (internal notes)
#   - docs/platform-engineering-summary.txt (internal notes)
# These were polluting the index — semantic search ranked phrases like
# "seed_content.py" and "Projects, case studies, articles..." over actual
# portfolio prose. Anything you want the assistant to discuss should live as
# a published CMS architecture-note instead.
DOCS_GLOBS = (
    "docs/architecture/*.md",
    "docs/architecture/adrs/*.md",
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
        document = content_item_to_source_document(row)
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
            # ``content_type`` here mirrors how CMS items are tagged so the
            # retrieval / intent-routing layer can treat curated ADRs as
            # first-class architecture sources without confusing them with
            # CMS-managed architecture notes.
            extra={"path": relative, "content_type": "architecture-doc"},
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
