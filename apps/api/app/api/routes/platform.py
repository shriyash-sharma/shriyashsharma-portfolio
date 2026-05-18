from fastapi import APIRouter

from app.api.dependencies.settings import SettingsDep
from app.schemas.platform import PlatformResponse
from app.services.platform_service import get_platform_metadata

router = APIRouter(tags=["platform"])


@router.get("/platform", response_model=PlatformResponse)
async def platform(settings: SettingsDep) -> PlatformResponse:
    return get_platform_metadata(settings)
