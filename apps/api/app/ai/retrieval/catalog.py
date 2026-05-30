"""Catalog retrieval for assistant intent routing.

When the user asks an enumeration-style question ("what projects do you
have?", "list all case studies"), pure dense vector search cannot answer
reliably — it returns the *most similar* chunks, not a complete listing.

This module provides the deterministic CMS-side answer: pull the published
content items (optionally filtered by content_type) directly from Postgres
and render them as a structured CATALOG block the LLM can format.
"""

from __future__ import annotations

from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.models.content import ContentItem, ContentType, PublishingStatus

# Hard cap to keep the context block small even if the CMS grows.
MAX_ITEMS_PER_TYPE = 25


@dataclass(frozen=True)
class CatalogItem:
    """A single published CMS row, rendered for assistant context."""

    content_type: str
    title: str
    slug: str
    description: str
    tags: list[str]


def _coerce_types(content_types: list[str] | None) -> list[ContentType] | None:
    """Filter incoming type strings to known enum values; ignore unknowns."""
    if not content_types:
        return None
    valid: list[ContentType] = []
    for raw in content_types:
        try:
            valid.append(ContentType(raw))
        except ValueError:
            continue
    return valid or None


async def fetch_catalog(
    session: AsyncSession,
    *,
    content_types: list[str] | None,
    locale: str = "en",
) -> list[CatalogItem]:
    """Return published CMS items, optionally scoped to one or more types.

    Sorted by content_type → updated_at desc so types group naturally in the
    rendered context.
    """
    statement = select(ContentItem).where(
        ContentItem.status == PublishingStatus.PUBLISHED,
        ContentItem.locale == locale,
    )

    types = _coerce_types(content_types)
    if types is not None:
        statement = statement.where(ContentItem.type.in_(types))

    statement = statement.order_by(
        ContentItem.type.asc(),
        ContentItem.updated_at.desc(),
    )

    rows = (await session.execute(statement)).scalars().all()

    items: list[CatalogItem] = []
    per_type: dict[str, int] = {}
    for row in rows:
        type_key = row.type.value
        if per_type.get(type_key, 0) >= MAX_ITEMS_PER_TYPE:
            continue
        per_type[type_key] = per_type.get(type_key, 0) + 1
        items.append(
            CatalogItem(
                content_type=type_key,
                title=row.title,
                slug=row.slug,
                description=(row.description or "").strip(),
                tags=list(row.tags or []),
            )
        )
    return items


def render_catalog_block(items: list[CatalogItem]) -> str:
    """Render catalog items as a numbered list grouped by type.

    The output is plain text intended to be injected as CONTEXT for the LLM —
    not shown directly to users.
    """
    if not items:
        return ""

    lines: list[str] = ["CATALOG (authoritative list of published items):", ""]
    current_type: str | None = None
    counter = 0
    for item in items:
        if item.content_type != current_type:
            current_type = item.content_type
            label = current_type.replace("-", " ").title() + "s"
            lines.append(f"## {label}")
        counter += 1
        tag_suffix = f" — tags: {', '.join(item.tags)}" if item.tags else ""
        lines.append(f"[{counter}] {item.title}")
        if item.description:
            lines.append(f"    {item.description}")
        if tag_suffix:
            lines.append(f"   {tag_suffix.strip()}")
    return "\n".join(lines).strip()
