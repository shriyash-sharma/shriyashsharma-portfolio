from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

ContentType = Literal[
    "project",
    "case-study",
    "article",
    "architecture-note",
    "experiment",
    "research-log",
]


class ContentCollection(BaseModel):
    type: ContentType
    route_base: str
    indexable: bool
    description: str


class ContentIndexRecord(BaseModel):
    id: UUID
    slug: str
    type: ContentType
    title: str
    description: str
    tags: list[str]
    updated_at: datetime


class ContentCollectionsResponse(BaseModel):
    collections: list[ContentCollection]


PublishingStatus = Literal["draft", "review", "published", "archived"]


class ContentItemBase(BaseModel):
    type: ContentType
    status: PublishingStatus = "draft"
    locale: str = Field(default="en", min_length=2, max_length=8)
    slug: str = Field(min_length=2, max_length=160)
    title: str = Field(min_length=2, max_length=240)
    description: str = Field(min_length=2)
    body: str | None = None
    seo_title: str | None = Field(default=None, max_length=240)
    seo_description: str | None = None
    canonical_url: str | None = Field(default=None, max_length=500)
    tags: list[str] = Field(default_factory=list)
    categories: list[str] = Field(default_factory=list)
    metadata: dict[str, str | int | float | bool | None] = Field(default_factory=dict)
    ai_indexable: bool = True
    published_at: str | None = None


class ContentItemCreate(ContentItemBase):
    pass


class ContentItemUpdate(BaseModel):
    status: PublishingStatus | None = None
    title: str | None = Field(default=None, min_length=2, max_length=240)
    description: str | None = Field(default=None, min_length=2)
    body: str | None = None
    seo_title: str | None = Field(default=None, max_length=240)
    seo_description: str | None = None
    canonical_url: str | None = Field(default=None, max_length=500)
    tags: list[str] | None = None
    categories: list[str] | None = None
    metadata: dict[str, str | int | float | bool | None] | None = None
    ai_indexable: bool | None = None
    published_at: str | None = None


class ContentItemRead(ContentItemBase):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    indexed_at: str | None = None
    created_at: datetime
    updated_at: datetime


class ContentListResponse(BaseModel):
    items: list[ContentItemRead]
    total: int


class ContentStatusCount(BaseModel):
    status: PublishingStatus
    total: int


class AdminContentOverviewResponse(BaseModel):
    counts: list[ContentStatusCount]
    total: int


class ContentReindexResponse(BaseModel):
    total: int
    indexed: int
    unchanged: int
    removed: int


class ContentIndexPurgeResponse(BaseModel):
    """Result of purging orphaned/stale knowledge-index documents."""

    removed_cms_orphans: int
    removed_doc_sources: int
