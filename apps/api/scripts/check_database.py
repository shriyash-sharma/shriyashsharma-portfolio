#!/usr/bin/env python3
"""Print DATABASE_URL target (no password) and verify DNS + DB connectivity."""

from __future__ import annotations

import asyncio
import sys

from sqlalchemy import text
from sqlalchemy.ext.asyncio import create_async_engine

from app.core.config import get_settings
from app.db.database_url import describe_database_target, prepare_asyncpg_database_url


async def main() -> int:
    settings = get_settings()
    print(describe_database_target(settings.database_url))

    database_url, connect_args = prepare_asyncpg_database_url(settings.database_url)
    engine = create_async_engine(database_url, connect_args=connect_args)

    try:
        async with engine.connect() as connection:
            result = await connection.execute(text("SELECT 1"))
            print("connection ok:", result.scalar_one())
    except Exception as exc:
        print("connection failed:", exc, file=sys.stderr)
        return 1
    finally:
        await engine.dispose()

    return 0


if __name__ == "__main__":
    raise SystemExit(asyncio.run(main()))
