"""Top-level API router registration.

This module defines the backend surface area by composing public, protected,
and future-facing route groups into one router. It is intentionally declarative:
responsibility for behavior remains inside the individual route modules.

Routing intent:
- Public read paths live beside platform metadata and capability boundaries.
- Authenticated dashboard operations are isolated under /admin.
- Search and assistant routes can expose stable contracts before their deeper
	implementations exist.
"""

from fastapi import APIRouter

from app.api.routes import (
    ai_lab,
    assistant,
    auth,
    content,
    health,
    platform,
    search,
)
from app.api.routes.admin import content as admin_content
from app.api.routes.admin import media as admin_media

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(platform.router)
api_router.include_router(content.router)
api_router.include_router(search.router)
api_router.include_router(assistant.router)
api_router.include_router(ai_lab.router)
api_router.include_router(auth.router)
api_router.include_router(admin_content.router)
api_router.include_router(admin_media.router)
