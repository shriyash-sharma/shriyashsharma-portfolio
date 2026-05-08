# Backend Architecture

The FastAPI backend is designed as a real platform foundation while avoiding
premature AI or infrastructure complexity.

## Principles

- async-first route and service boundaries
- Pydantic v2 request and response schemas
- pydantic-settings for typed configuration
- service modules own business boundaries
- route modules stay thin
- future data/AI systems are represented as boundaries, not fake features

## Application Layers

```txt
app/
  api/             route registration, dependencies, route handlers
  core/            config, logging, security helpers
  schemas/         Pydantic contracts
  services/        platform/content/search/assistant boundaries
  db/              async SQLAlchemy models, repositories, migrations
  infrastructure/  future database/cache providers
  ai/              future retrieval/generation/evaluation boundaries
  search/          future keyword/vector/hybrid retrieval boundaries
  content/         future CMS/filesystem/ingestion boundaries
  auth/            future dashboard/service-token boundaries
  streaming/       SSE encoding utilities
```

## Future Integration Path

1. Keep content persistence in `content_items` until a domain needs a separate table.
2. Add pgvector extension/migrations only when real embeddings exist.
3. Add Redis only when caching, sessions, or background coordination requires it.
4. Keep assistant streaming behind `/assistant/stream`.
5. Keep retrieval logic in `app/search` and model/provider logic in `app/ai`.
6. Keep the frontend calling typed endpoint wrappers, not backend URLs directly.

## Persistence Layer

The backend uses SQLAlchemy 2 async with `asyncpg`.

- `app/db/session.py` owns engine/session construction.
- `app/api/dependencies/database.py` exposes request-scoped sessions.
- `app/db/models/content.py` defines the content persistence model.
- `app/db/repositories/*` owns async CRUD and query behavior.
- Alembic migrations live under `app/db/migrations`.

The initial schema uses a single `content_items` table with a `type` column for
projects, case studies, articles, architecture notes, experiments, and research
logs. This keeps dashboard CRUD, publishing, search indexing, and future RAG
ingestion consistent without introducing premature table sprawl.

## Why Routes Are Placeholders

The backend returns typed contracts for search and assistant requests, but it
does not pretend to perform RAG, embeddings, or generation. This keeps the
system honest while making future integration straightforward.
