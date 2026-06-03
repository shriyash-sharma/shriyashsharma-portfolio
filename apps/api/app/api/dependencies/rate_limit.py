"""Rate-limit dependencies for expensive public endpoints."""

from fastapi import HTTPException, Request, status

from app.core.config import get_settings
from app.core.rate_limit import get_assistant_rate_limiter


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        client = forwarded.split(",")[0].strip()
        if client:
            return client

    if request.client and request.client.host:
        return request.client.host

    return "unknown"


async def enforce_assistant_rate_limit(request: Request) -> None:
    settings = get_settings()
    if settings.app_env == "test" or settings.assistant_rate_limit_per_minute <= 0:
        return

    allowed, retry_after = await get_assistant_rate_limiter().allow(
        get_client_ip(request),
        limit=settings.assistant_rate_limit_per_minute,
        window_seconds=60.0,
    )
    if allowed:
        return

    raise HTTPException(
        status_code=status.HTTP_429_TOO_MANY_REQUESTS,
        detail=(
            "Too many assistant requests from this address. "
            "Please wait before trying again."
        ),
        headers={"Retry-After": str(retry_after)},
    )
