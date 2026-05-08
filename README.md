# Shriyash Sharma Engineering Platform

Premium engineering portfolio evolving into an AI-ready product ecosystem.

The repository is organized as a monorepo with a Next.js frontend and a
FastAPI backend foundation. The backend currently exposes production-oriented
boundaries for health, platform metadata, content, search, and assistant
streaming without implementing premature RAG or AI generation.

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

See `docs/backend-architecture.md` and `docs/local-development.md`.
