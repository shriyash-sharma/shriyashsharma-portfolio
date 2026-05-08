from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.api.dependencies.database import DbSessionDep
from app.db.repositories.content_repository import ContentRepository, to_content_read
from app.schemas.content import (
    ContentItemCreate,
    ContentItemRead,
    ContentItemUpdate,
    ContentListResponse,
    ContentType,
    PublishingStatus,
)

router = APIRouter(prefix="/admin/content", tags=["admin-content"])


@router.get("/{content_type}", response_model=ContentListResponse)
async def admin_content_list(
    content_type: ContentType,
    session: DbSessionDep,
    status_filter: PublishingStatus | None = None,
    locale: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> ContentListResponse:
    repository = ContentRepository(session)
    items, total = await repository.list(
        content_type=content_type,
        status=status_filter,
        locale=locale,
        limit=limit,
        offset=offset,
    )
    return ContentListResponse(
        items=[to_content_read(item) for item in items],
        total=total,
    )


@router.post(
    "/{content_type}",
    response_model=ContentItemRead,
    status_code=status.HTTP_201_CREATED,
)
async def admin_content_create(
    content_type: ContentType,
    payload: ContentItemCreate,
    session: DbSessionDep,
) -> ContentItemRead:
    if payload.type != content_type:
        raise HTTPException(status_code=400, detail="Path type and body type differ")

    repository = ContentRepository(session)
    try:
        item = await repository.create(payload)
    except IntegrityError as exc:
        await session.rollback()
        raise HTTPException(
            status_code=409,
            detail="Content item already exists for this type, locale, and slug",
        ) from exc
    return to_content_read(item)


@router.get("/items/{item_id}", response_model=ContentItemRead)
async def admin_content_detail(
    item_id: UUID,
    session: DbSessionDep,
) -> ContentItemRead:
    repository = ContentRepository(session)
    item = await repository.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    return to_content_read(item)


@router.put("/items/{item_id}", response_model=ContentItemRead)
async def admin_content_update(
    item_id: UUID,
    payload: ContentItemUpdate,
    session: DbSessionDep,
) -> ContentItemRead:
    repository = ContentRepository(session)
    item = await repository.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    updated = await repository.update(item, payload)
    return to_content_read(updated)


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_content_delete(
    item_id: UUID,
    session: DbSessionDep,
) -> None:
    repository = ContentRepository(session)
    item = await repository.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    await repository.delete(item)
