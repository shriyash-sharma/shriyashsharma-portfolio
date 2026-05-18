from app.core.config import Settings
from app.schemas.platform import PlatformCapability, PlatformResponse


def get_platform_metadata(settings: Settings) -> PlatformResponse:
    return PlatformResponse(
        name=settings.app_name,
        version=settings.api_version,
        capabilities=[
            PlatformCapability(
                module="content",
                status="ready",
                boundary="service",
                description=(
                    "Structured content boundaries for projects, writing, "
                    "and architecture notes."
                ),
            ),
            PlatformCapability(
                module="search",
                status="planned",
                boundary="api",
                description=(
                    "Semantic and keyword search contract prepared for "
                    "future pgvector integration."
                ),
            ),
            PlatformCapability(
                module="assistant",
                status="planned",
                boundary="api",
                description="SSE-ready assistant boundary without generation logic.",
            ),
            PlatformCapability(
                module="observability",
                status="planned",
                boundary="external",
                description=(
                    "Future request, retrieval, and assistant quality telemetry."
                ),
            ),
        ],
    )
