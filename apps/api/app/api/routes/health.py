from datetime import UTC, datetime

from fastapi import APIRouter

from app.api.dependencies.settings import SettingsDep
from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health(settings: SettingsDep) -> HealthResponse:
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        environment=settings.app_env,
        version=settings.api_version,
        checked_at=datetime.now(UTC),
    )
