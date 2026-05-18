from pydantic import BaseModel, Field

from app.schemas.content import ContentType


class SearchRequest(BaseModel):
    query: str = Field(min_length=2, max_length=500)
    limit: int = Field(default=8, ge=1, le=20)
    types: list[ContentType] | None = None


class SearchSource(BaseModel):
    id: str
    title: str
    type: ContentType
    excerpt: str | None = None
    score: float | None = None


class SearchResponse(BaseModel):
    query: str
    sources: list[SearchSource]
    implemented: bool = False
