# Shriyash Sharma Engineering Platform

Engineering portfolio platform with a Next.js frontend, FastAPI backend,
Postgres persistence, authenticated dashboard CMS, locale-aware routing, and
same-origin operational proxying.

The repository is organized as a monorepo with separate web and API
applications. The current system already includes public content delivery,
editorial content management, dashboard authentication, media handling, and
typed backend boundaries. Search and assistant APIs exist as explicit platform
boundaries, but they do not yet claim deep retrieval or AI infrastructure.

## Structure

```txt
apps/
  web/   Next.js App Router frontend
  api/   FastAPI backend foundation
packages/
  shared-types/
  config/
  utilities/
infrastructure/
  docker/
  scripts/
  deployment/
docs/
```

## Prerequisites

- Node.js 22+
- pnpm 9+
- Python 3.12+
- uv
- Docker, optional for local full-stack development

Install `uv`:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Local Development

Frontend:

```bash
cd apps/web
npm install
npm run dev
```

Backend:

```bash
cd apps/api
cp .env.example .env
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Docker:

```bash
docker compose up --build
```

For architecture-oriented onboarding, start with:

- `docs/architecture/onboarding.md`
- `docs/architecture/request-lifecycle.md`
- `docs/architecture/auth-architecture.md`
- `docs/architecture/cms-architecture.md`
- `docs/architecture/adrs/`

## Quality Checks

Frontend:

```bash
cd apps/web
npm run lint
npm run typecheck
npm run build
```

Backend:

```bash
cd apps/api
uv run ruff check .
uv run ruff format --check .
uv run mypy app tests
uv run pytest
```

## Backend Boundaries

- `GET /health` — service health and environment metadata
- `GET /platform` — product/platform capability metadata
- `GET /content` — structured content collection registry
- `GET /content/{type}` — public published content list
- `GET /content/{type}/{slug}` — public published content detail
- `POST /admin/content/{type}` — dashboard-ready content create
- `PUT /admin/content/items/{id}` — dashboard-ready content update
- `DELETE /admin/content/items/{id}` — dashboard-ready content delete
- `POST /search` — semantic search contract, not yet implemented
- `POST /assistant` — assistant response contract, not yet implemented
- `POST /assistant/stream` — SSE-ready assistant stream boundary

## Database Workflow

```bash
cd apps/api
uv run alembic upgrade head
uv run python scripts/seed_content.py
```

## Roadmap Readiness

Prepared but intentionally not implemented yet:

- pgvector semantic retrieval
- Redis caching/session coordination
- authenticated dashboard tooling
- AI assistant streaming
- content ingestion and chunking
- retrieval and AI observability

See `docs/backend-architecture.md`, `docs/local-development.md`, and
`docs/architecture/`.
