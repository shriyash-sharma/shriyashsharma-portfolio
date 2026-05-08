from fastapi import APIRouter

from app.schemas.content import ContentCollectionsResponse
from app.services.content_service import get_content_collections

router = APIRouter(prefix="/content", tags=["content"])


@router.get("", response_model=ContentCollectionsResponse)
async def content_collections() -> ContentCollectionsResponse:
    return get_content_collections()
