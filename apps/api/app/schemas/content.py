from datetime import datetime
from typing import Literal

from pydantic import BaseModel


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
    id: str
    slug: str
    type: ContentType
    title: str
    description: str
    tags: list[str]
    updated_at: datetime


class ContentCollectionsResponse(BaseModel):
    collections: list[ContentCollection]
