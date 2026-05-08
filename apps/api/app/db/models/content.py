from enum import StrEnum
from typing import Any

from sqlalchemy import Boolean, Enum, Index, String, Text, UniqueConstraint
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base, TimestampMixin, UUIDPrimaryKeyMixin


class ContentType(StrEnum):
    PROJECT = "project"
    CASE_STUDY = "case-study"
    ARTICLE = "article"
    ARCHITECTURE_NOTE = "architecture-note"
    EXPERIMENT = "experiment"
    RESEARCH_LOG = "research-log"


class PublishingStatus(StrEnum):
    DRAFT = "draft"
    REVIEW = "review"
    PUBLISHED = "published"
    ARCHIVED = "archived"


class ContentItem(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "content_items"
    __table_args__ = (
        UniqueConstraint("type", "locale", "slug", name="uq_content_type_locale_slug"),
        Index("ix_content_type_status", "type", "status"),
        Index("ix_content_locale_slug", "locale", "slug"),
    )

    type: Mapped[ContentType] = mapped_column(Enum(ContentType), nullable=False)
    status: Mapped[PublishingStatus] = mapped_column(
        Enum(PublishingStatus),
        default=PublishingStatus.DRAFT,
        nullable=False,
    )
    locale: Mapped[str] = mapped_column(String(8), default="en", nullable=False)
    slug: Mapped[str] = mapped_column(String(160), nullable=False)
    title: Mapped[str] = mapped_column(String(240), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    body: Mapped[str | None] = mapped_column(Text)
    seo_title: Mapped[str | None] = mapped_column(String(240))
    seo_description: Mapped[str | None] = mapped_column(Text)
    canonical_url: Mapped[str | None] = mapped_column(String(500))
    tags: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    categories: Mapped[list[str]] = mapped_column(JSONB, default=list, nullable=False)
    extra: Mapped[dict[str, Any]] = mapped_column(
        "metadata",
        JSONB,
        default=dict,
        nullable=False,
    )
    ai_indexable: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    indexed_at: Mapped[str | None] = mapped_column(String(64))
    published_at: Mapped[str | None] = mapped_column(String(64))
