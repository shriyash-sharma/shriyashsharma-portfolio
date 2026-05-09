"""Public content delivery routes.

These handlers expose published content to the public web experience while
keeping authoring and moderation operations on separate admin routes. Locale
and publish-state filtering are applied at the repository boundary so the
frontend can request localized public content through one consistent contract.

Design notes:
- Public routes never expose drafts or review items.
- Collection metadata is served separately so the frontend can discover the
    platform's supported content types without coupling to database details.
"""

from fastapi import APIRouter, HTTPException

from app.api.dependencies.database import DbSessionDep
from app.db.repositories.content_repository import ContentRepository, to_content_read
from app.schemas.content import (
    ContentCollectionsResponse,
    ContentItemRead,
    ContentListResponse,
    ContentType,
)
from app.services.content_service import get_content_collections

router = APIRouter(prefix="/content", tags=["content"])


@router.get("", response_model=ContentCollectionsResponse)
async def content_collections() -> ContentCollectionsResponse:
    return get_content_collections()


@router.get("/{content_type}", response_model=ContentListResponse)
async def public_content_list(
    content_type: ContentType,
    session: DbSessionDep,
    locale: str = "en",
    limit: int = 20,
    offset: int = 0,
) -> ContentListResponse:
    repository = ContentRepository(session)
    items, total = await repository.list(
        content_type=content_type,
        status="published",
        locale=locale,
        limit=limit,
        offset=offset,
    )
    return ContentListResponse(
        items=[to_content_read(item) for item in items],
        total=total,
    )


@router.get("/{content_type}/{slug}", response_model=ContentItemRead)
async def public_content_detail(
    content_type: ContentType,
    slug: str,
    session: DbSessionDep,
    locale: str = "en",
) -> ContentItemRead:
    repository = ContentRepository(session)
    item = await repository.get_by_slug(
        content_type=content_type,
        slug=slug,
        locale=locale,
        status="published",
    )
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")

    return to_content_read(item)
