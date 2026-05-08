from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from app.api.router import api_router
from app.core.config import get_settings
from app.core.logging import configure_logging


def create_app() -> FastAPI:
    configure_logging()
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.api_version,
        description="Backend foundation for the engineering portfolio platform.",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=[str(settings.frontend_origin)],
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
