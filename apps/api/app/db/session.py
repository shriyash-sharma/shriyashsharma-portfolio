"""Async SQLAlchemy session factory.

This module owns backend database connectivity. It exposes one shared engine
and a request-scoped AsyncSession generator that FastAPI dependencies can use
without leaking connection management into routes or repositories.

Why async here:
- The backend is structured around async request handling.
- Using asyncpg and AsyncSession keeps persistence aligned with that execution
    model and avoids blocking the event loop as the platform grows.
"""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings
from app.db.database_url import prepare_asyncpg_database_url

settings = get_settings()
database_url, connect_args = prepare_asyncpg_database_url(settings.database_url)

engine = create_async_engine(
    database_url,
    connect_args=connect_args,
    pool_pre_ping=True,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
)


async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
