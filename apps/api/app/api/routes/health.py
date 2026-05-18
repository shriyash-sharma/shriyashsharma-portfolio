from datetime import UTC, datetime
from typing import Literal

from fastapi import APIRouter
from sqlalchemy import text

from app.api.dependencies.database import DbSessionDep
from app.api.dependencies.settings import SettingsDep
from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/health", response_model=HealthResponse)
async def health(settings: SettingsDep) -> HealthResponse:
    """Liveness probe — does not require database connectivity."""
    return HealthResponse(
        status="ok",
        service=settings.app_name,
        environment=settings.app_env,
        version=settings.api_version,
        checked_at=datetime.now(UTC),
    )


@router.get("/health/ready", response_model=HealthResponse)
async def readiness(
    settings: SettingsDep,
    session: DbSessionDep,
) -> HealthResponse:
    """Readiness probe — verifies database connectivity."""
    status: Literal["ok", "degraded"] = "ok"
    try:
        await session.execute(text("SELECT 1"))
    except Exception:
        status = "degraded"

    return HealthResponse(
        status=status,
        service=settings.app_name,
        environment=settings.app_env,
        version=settings.api_version,
        checked_at=datetime.now(UTC),
    )
