"""FastAPI application assembly for the portfolio platform.

This module is the runtime composition root for the backend. It wires global
concerns that must exist before any route executes: logging, typed settings,
CORS for the frontend origin, static media serving, and the shared API router.

Boundaries:
- Domain behavior stays in route, repository, and service modules.
- This file should only compose infrastructure and application-wide middleware.

Design notes:
- Media is served from the same process during the current platform stage to
    keep editorial workflows simple while the dashboard and local storage model
    mature.
- App construction is kept behind create_app() so tests and future startup
    hooks can reuse the same assembly path.
"""

from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import get_settings
from app.core.deployment import validate_deployment_settings
from app.core.logging import configure_logging


def create_app() -> FastAPI:
    configure_logging()
    settings = get_settings()
    validate_deployment_settings(settings)

    app = FastAPI(
        title=settings.app_name,
        version=settings.api_version,
        description="Backend foundation for the engineering portfolio platform.",
    )

    cors_origins = [
        origin.strip()
        for origin in str(settings.frontend_origin).split(",")
        if origin.strip()
    ]
    app.add_middleware(
        CORSMiddleware,
        allow_origins=cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    Path(settings.media_storage_path).mkdir(parents=True, exist_ok=True)
    app.mount(
        settings.media_public_url_base,
        StaticFiles(directory=settings.media_storage_path),
        name="media",
    )
    app.include_router(api_router)

    return app


app = create_app()
