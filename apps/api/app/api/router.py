from fastapi import APIRouter

from app.api.routes import assistant, content, health, platform, search

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(platform.router)
api_router.include_router(content.router)
api_router.include_router(search.router)
api_router.include_router(assistant.router)
