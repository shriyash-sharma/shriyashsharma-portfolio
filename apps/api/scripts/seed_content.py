import asyncio
import sys
from pathlib import Path

from sqlalchemy import select

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.db.models.content import ContentItem, ContentType, PublishingStatus
from app.db.session import AsyncSessionLocal

SEED_ITEMS = [
    {
        "type": ContentType.PROJECT,
        "slug": "platform-infrastructure-rewrite",
        "title": "Platform infrastructure rewrite",
        "description": (
            "Next.js App Router migration with hybrid rendering and edge-aware caching."
        ),
        "tags": ["Next.js", "TypeScript", "Platform"],
        "categories": ["frontend", "architecture"],
        "extra": {
            "stack": "Next.js, TypeScript, Redis",
            "system_detail": "ISR + SSR hybrid, cache warming, 12 edge regions",
        },
    },
    {
        "type": ContentType.CASE_STUDY,
        "slug": "monorepo-scaling",
        "title": "Scaling a frontend monorepo",
        "description": (
            "Feature-owned package boundaries and affected graph builds for "
            "multi-team delivery."
        ),
        "tags": ["Monorepo", "DX", "Architecture"],
        "categories": ["case-study"],
        "extra": {
            "read_time": "8 min",
            "system_area": "developer experience",
        },
    },
    {
        "type": ContentType.ARTICLE,
        "slug": "retrieval-ready-content",
        "title": "Designing retrieval-ready content",
        "description": (
            "How structured content contracts prepare a product for semantic "
            "indexing later."
        ),
        "tags": ["Content", "AI Readiness"],
        "categories": ["writing"],
        "extra": {"read_time": "6 min"},
    },
]


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        for item in SEED_ITEMS:
            exists = await session.scalar(
                select(ContentItem).where(
                    ContentItem.type == item["type"],
                    ContentItem.locale == "en",
                    ContentItem.slug == item["slug"],
                )
            )
            if exists:
                continue

            session.add(
                ContentItem(
                    **item,
                    locale="en",
                    status=PublishingStatus.PUBLISHED,
                    body=None,
                    seo_title=None,
                    seo_description=None,
                    canonical_url=None,
                    ai_indexable=True,
                    published_at="2026-05-08",
                )
            )

        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
