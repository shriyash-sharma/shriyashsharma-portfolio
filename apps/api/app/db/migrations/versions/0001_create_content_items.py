"""create content items

Revision ID: 0001_create_content_items
Revises:
Create Date: 2026-05-08
"""

from collections.abc import Sequence

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0001_create_content_items"
down_revision: str | None = None
branch_labels: str | Sequence[str] | None = None
depends_on: str | Sequence[str] | None = None

content_type = postgresql.ENUM(
    "PROJECT",
    "CASE_STUDY",
    "ARTICLE",
    "ARCHITECTURE_NOTE",
    "EXPERIMENT",
    "RESEARCH_LOG",
    name="contenttype",
    create_type=False,
)
publishing_status = postgresql.ENUM(
    "DRAFT",
    "REVIEW",
    "PUBLISHED",
    "ARCHIVED",
    name="publishingstatus",
    create_type=False,
)


def upgrade() -> None:
    content_type.create(op.get_bind(), checkfirst=True)
    publishing_status.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "content_items",
        sa.Column("type", content_type, nullable=False),
        sa.Column("status", publishing_status, nullable=False),
        sa.Column("locale", sa.String(length=8), nullable=False),
        sa.Column("slug", sa.String(length=160), nullable=False),
        sa.Column("title", sa.String(length=240), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("body", sa.Text(), nullable=True),
        sa.Column("seo_title", sa.String(length=240), nullable=True),
        sa.Column("seo_description", sa.Text(), nullable=True),
        sa.Column("canonical_url", sa.String(length=500), nullable=True),
        sa.Column("tags", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column(
            "categories",
            postgresql.JSONB(astext_type=sa.Text()),
            nullable=False,
        ),
        sa.Column("metadata", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("ai_indexable", sa.Boolean(), nullable=False),
        sa.Column("indexed_at", sa.String(length=64), nullable=True),
        sa.Column("published_at", sa.String(length=64), nullable=True),
        sa.Column("created_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("id", postgresql.UUID(as_uuid=True), nullable=False),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint(
            "type",
            "locale",
            "slug",
            name="uq_content_type_locale_slug",
        ),
    )
    op.create_index("ix_content_locale_slug", "content_items", ["locale", "slug"])
    op.create_index("ix_content_type_status", "content_items", ["type", "status"])


def downgrade() -> None:
    op.drop_index("ix_content_type_status", table_name="content_items")
    op.drop_index("ix_content_locale_slug", table_name="content_items")
    op.drop_table("content_items")
    publishing_status.drop(op.get_bind(), checkfirst=True)
    content_type.drop(op.get_bind(), checkfirst=True)
