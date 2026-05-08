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
  infrastructure/  future database/cache providers
  ai/              future retrieval/generation/evaluation boundaries
  search/          future keyword/vector/hybrid retrieval boundaries
  content/         future CMS/filesystem/ingestion boundaries
  auth/            future dashboard/service-token boundaries
  streaming/       SSE encoding utilities
```

## Future Integration Path

1. Add SQLAlchemy/SQLModel and Alembic only when persistence is needed.
2. Add pgvector extension/migrations only when real embeddings exist.
3. Add Redis only when caching, sessions, or background coordination requires it.
4. Keep assistant streaming behind `/assistant/stream`.
5. Keep retrieval logic in `app/search` and model/provider logic in `app/ai`.
6. Keep the frontend calling typed endpoint wrappers, not backend URLs directly.

## Why Routes Are Placeholders

The backend returns typed contracts for search and assistant requests, but it
does not pretend to perform RAG, embeddings, or generation. This keeps the
system honest while making future integration straightforward.
