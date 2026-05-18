"""Admin media management routes.

This module supports the current dashboard upload workflow. It keeps media
operations behind authenticated admin routes while delegating storage concerns
to the media service.

Current scope:
- Local image upload and listing only.
- No CDN, transformations, or asset metadata persistence yet.

That constraint is deliberate: the route contract can remain stable if storage
later moves from local disk to an external object store.
"""

from fastapi import APIRouter, File, Form, HTTPException, UploadFile, status

from app.api.dependencies.auth import CurrentAdminUser
from app.schemas.media import MediaAssetRead, MediaListResponse, MediaUploadResponse
from app.services.media_storage import LocalMediaStorage, StoredMediaAsset

router = APIRouter(prefix="/admin/media", tags=["admin-media"])


def _to_media_read(item: StoredMediaAsset) -> MediaAssetRead:
    return MediaAssetRead(
        id=item.id,
        filename=item.filename,
        content_type=item.content_type,
        size=item.size,
        url=item.url,
        alt_text=item.alt_text,
        created_at=item.created_at,
    )


@router.get("", response_model=MediaListResponse)
async def list_media_assets(
    _: CurrentAdminUser,
    limit: int = 60,
) -> MediaListResponse:
    storage = LocalMediaStorage()
    items = storage.list_assets(limit=limit)
    return MediaListResponse(items=[_to_media_read(item) for item in items])


@router.post("", response_model=MediaUploadResponse, status_code=status.HTTP_201_CREATED)
async def upload_media_asset(
    _: CurrentAdminUser,
    file: UploadFile = File(...),
    alt_text: str | None = Form(default=None),
) -> MediaUploadResponse:
    storage = LocalMediaStorage()
    try:
        item = await storage.save_image(file, alt_text=alt_text)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    return MediaUploadResponse(item=_to_media_read(item))