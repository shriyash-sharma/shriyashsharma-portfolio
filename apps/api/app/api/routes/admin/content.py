"""Admin content management routes.

This module is the operational backend for the editorial dashboard. It exposes
filtered listing, per-status overview counts, item CRUD, and locale-aware
content retrieval over the shared content_items persistence model.

Architectural role:
- Keep admin workflows explicit and authenticated under /admin/content.
- Reuse the repository layer for both dashboard listings and publishing
    transitions so public and admin reads stay aligned.
- Preserve room for richer workflow states without changing the route shape.
"""

from uuid import UUID

from fastapi import APIRouter, HTTPException, status
from sqlalchemy.exc import IntegrityError

from app.api.dependencies.auth import CurrentAdminUser
from app.api.dependencies.database import DbSessionDep
from app.db.repositories.content_repository import ContentRepository, to_content_read
from app.schemas.content import (
    AdminContentOverviewResponse,
    ContentIndexPurgeResponse,
    ContentItemCreate,
    ContentItemRead,
    ContentItemUpdate,
    ContentListResponse,
    ContentReindexResponse,
    ContentStatusCount,
    ContentType,
    PublishingStatus,
)
from app.services.content_indexing import (
    purge_orphan_index_documents,
    reindex_all_content,
    remove_content_item_index,
    sync_content_item_index,
)

router = APIRouter(prefix="/admin/content", tags=["admin-content"])


@router.get("/{content_type}", response_model=ContentListResponse)
async def admin_content_list(
    content_type: ContentType,
    _: CurrentAdminUser,
    session: DbSessionDep,
    status_filter: PublishingStatus | None = None,
    locale: str | None = None,
    query: str | None = None,
    limit: int = 50,
    offset: int = 0,
) -> ContentListResponse:
    repository = ContentRepository(session)
    items, total = await repository.list(
        content_type=content_type,
        status=status_filter,
        locale=locale,
        query=query,
        limit=limit,
        offset=offset,
    )
    return ContentListResponse(
        items=[to_content_read(item) for item in items],
        total=total,
    )


@router.get("/{content_type}/overview", response_model=AdminContentOverviewResponse)
async def admin_content_overview(
    content_type: ContentType,
    _: CurrentAdminUser,
    session: DbSessionDep,
    locale: str | None = None,
    query: str | None = None,
) -> AdminContentOverviewResponse:
    repository = ContentRepository(session)
    counts = await repository.count_by_status(
        content_type=content_type,
        locale=locale,
        query=query,
    )
    normalized_counts = [
        ContentStatusCount(status=status_key, total=counts.get(status_key, 0))
        for status_key in ("draft", "review", "published", "archived")
    ]
    return AdminContentOverviewResponse(
        counts=normalized_counts,
        total=sum(item.total for item in normalized_counts),
    )


@router.post(
    "/{content_type}",
    response_model=ContentItemRead,
    status_code=status.HTTP_201_CREATED,
)
async def admin_content_create(
    content_type: ContentType,
    payload: ContentItemCreate,
    _: CurrentAdminUser,
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
    # Reflect the new item in the assistant's retrieval index immediately.
    await sync_content_item_index(session, item)
    return to_content_read(item)


@router.get("/items/{item_id}", response_model=ContentItemRead)
async def admin_content_detail(
    item_id: UUID,
    _: CurrentAdminUser,
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
    _: CurrentAdminUser,
    session: DbSessionDep,
) -> ContentItemRead:
    repository = ContentRepository(session)
    item = await repository.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    updated = await repository.update(item, payload)
    # Re-embed (or remove, if unpublished / not indexable) on every edit so the
    # assistant always answers from the latest published content.
    await sync_content_item_index(session, updated)
    return to_content_read(updated)


@router.post("/index/reindex", response_model=ContentReindexResponse)
async def admin_content_reindex(
    _: CurrentAdminUser,
    session: DbSessionDep,
) -> ContentReindexResponse:
    """Rebuild the CMS portion of the knowledge index from current content rows.

    Useful for first-time backfill or recovering from a failed live index.
    """
    try:
        summary = await reindex_all_content(session)
    except RuntimeError as exc:
        raise HTTPException(
            status_code=503,
            detail=f"Embedding provider not configured: {exc}",
        ) from exc
    return ContentReindexResponse(**summary)


@router.post("/index/purge", response_model=ContentIndexPurgeResponse)
async def admin_content_purge_index(
    _: CurrentAdminUser,
    session: DbSessionDep,
) -> ContentIndexPurgeResponse:
    """Remove stale/orphaned knowledge documents from the index.

    Use after deleting CMS items while indexing was offline, or after
    narrowing the ingestion script's document scope (e.g. dropping README
    files from the corpus). Safe to run repeatedly — idempotent.
    """
    summary = await purge_orphan_index_documents(session)
    return ContentIndexPurgeResponse(**summary)


@router.delete("/items/{item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def admin_content_delete(
    item_id: UUID,
    _: CurrentAdminUser,
    session: DbSessionDep,
) -> None:
    repository = ContentRepository(session)
    item = await repository.get(item_id)
    if not item:
        raise HTTPException(status_code=404, detail="Content item not found")
    # Drop it from the retrieval index before the row disappears.
    await remove_content_item_index(session, item.id)
    await repository.delete(item)
