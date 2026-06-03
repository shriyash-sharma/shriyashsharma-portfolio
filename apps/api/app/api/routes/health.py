import re
from datetime import UTC, datetime
from typing import Literal

from fastapi import APIRouter
from sqlalchemy import text

from app.api.dependencies.database import DbSessionDep
from app.api.dependencies.settings import SettingsDep
from app.schemas.health import HealthResponse

router = APIRouter(tags=["health"])


def _sanitize_db_error(exc: Exception) -> str:
    message = re.sub(
        r"postgresql(\+asyncpg)?://[^\s]+",
        "postgresql://***",
        str(exc),
    )
    return f"{type(exc).__name__}: {message[:240]}"


@router.api_route(
    "/health",
    methods=["GET", "HEAD"],
    response_model=HealthResponse,
)
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
    detail: str | None = None
    try:
        await session.execute(text("SELECT 1"))
    except Exception as exc:
        status = "degraded"
        detail = _sanitize_db_error(exc)

    return HealthResponse(
        status=status,
        service=settings.app_name,
        environment=settings.app_env,
        version=settings.api_version,
        checked_at=datetime.now(UTC),
        detail=detail,
    )
