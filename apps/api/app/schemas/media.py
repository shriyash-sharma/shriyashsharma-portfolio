from datetime import datetime

from pydantic import BaseModel, Field


class MediaAssetRead(BaseModel):
    id: str
    filename: str
    content_type: str
    size: int
    url: str
    alt_text: str | None = None
    created_at: datetime


class MediaListResponse(BaseModel):
    items: list[MediaAssetRead]


class MediaUploadResponse(BaseModel):
    item: MediaAssetRead


class MediaUploadMetadata(BaseModel):
    alt_text: str | None = Field(default=None, max_length=240)