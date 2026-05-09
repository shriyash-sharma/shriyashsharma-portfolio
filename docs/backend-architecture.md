# Backend Architecture

The FastAPI backend is the typed system boundary for platform metadata, public
content delivery, dashboard authentication, editorial operations, and local
media management. It is designed as a product backend with real persistence and
clear extension seams, while still avoiding premature claims about AI systems
that are not implemented yet.

## Principles

- async-first route and service boundaries
- Pydantic v2 request and response schemas
- pydantic-settings for typed configuration
- thin route modules with explicit dependency injection
- repositories own persistence lifecycle behavior
- public and admin API responsibilities stay separate
- future data and AI systems are represented as boundaries, not fake features

## Application Layers

```txt
app/
  api/             route registration, dependencies, route handlers
  core/            config, logging, security helpers
  schemas/         Pydantic contracts
  services/        platform/content/media boundaries
  db/              async SQLAlchemy models, repositories, migrations
  infrastructure/  future database/cache providers
  ai/              future retrieval/generation/evaluation boundaries
  search/          future keyword/vector/hybrid retrieval boundaries
  content/         future CMS/filesystem/ingestion boundaries
  auth/            future dashboard/service-token boundaries
  streaming/       SSE encoding utilities
```

## Why FastAPI

FastAPI fits the current backend well because it provides:

- typed request and response contracts that match the platform's explicit API
  boundary design
- async request handling that aligns with SQLAlchemy async and future streaming
  or retrieval workloads
- straightforward dependency injection for auth and database session control
- a low-ceremony path for growing the platform without carrying a heavy service
  framework

## Persistence Layer

The backend uses SQLAlchemy 2 async with `asyncpg` against Postgres.

- `app/db/session.py` owns engine/session construction.
- `app/api/dependencies/database.py` exposes request-scoped sessions.
- `app/db/models/content.py` defines the content persistence model.
- `app/db/models/admin_user.py` defines internal admin identities.
- `app/db/repositories/*` owns async CRUD and query behavior.
- Alembic migrations live under `app/db/migrations`.

The initial schema uses a single `content_items` table with a `type` column for
projects, case studies, articles, architecture notes, experiments, and research
logs. This keeps dashboard CRUD, publishing, search indexing, and future RAG
ingestion consistent without introducing premature table sprawl.

The admin auth path uses a persisted `admin_users` model rather than in-memory
credentials, which gives the dashboard a real operational identity boundary
without overbuilding a broader user system.

## API Responsibility Separation

- `/content` serves public, published, locale-aware content reads.
- `/admin/content` serves authenticated editorial workflows.
- `/admin/media` serves authenticated upload and asset listing workflows.
- `/auth` handles dashboard session exchange and session introspection.
- `/platform`, `/search`, and `/assistant` expose platform capability and future
  integration boundaries.

This separation keeps the website's read-only contract distinct from the
dashboard's operational contract even when both rely on the same repository
layer.

## Why the Repository Pattern Exists Here

Repositories are used to centralize platform rules that would otherwise leak
across multiple route modules:

- slug normalization
- locale and status filtering
- publish timestamp handling
- query search criteria
- commit and refresh behavior for mutations

This is not abstraction for its own sake. It keeps content lifecycle behavior
consistent across the public site, dashboard list views, and future indexing
pipelines.

## Future Integration Path

1. Keep content persistence in `content_items` until a domain needs a separate table.
2. Add pgvector only when embeddings are actually being stored and queried.
3. Add Redis only when caching, session coordination, or background workflows require it.
4. Keep assistant streaming behind `/assistant/stream` as the stable boundary for future streaming work.
5. Keep retrieval logic in `app/search` and model/provider logic in `app/ai`.
6. Keep the frontend calling typed endpoint wrappers and BFF routes, not backend URLs directly.

## Why Routes Are Placeholders

The backend returns typed contracts for search and assistant requests, but it
does not pretend to perform RAG, embeddings, or generation. This keeps the
system honest while making future integration straightforward.
