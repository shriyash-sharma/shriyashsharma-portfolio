from fastapi import APIRouter

from app.api.routes import assistant, content, health, platform, search
from app.api.routes.admin import content as admin_content

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(platform.router)
api_router.include_router(content.router)
api_router.include_router(search.router)
api_router.include_router(assistant.router)
api_router.include_router(admin_content.router)
