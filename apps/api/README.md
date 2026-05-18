# Portfolio API

FastAPI backend foundation for the AI-ready engineering portfolio platform.

This app intentionally implements infrastructure boundaries, not full AI/RAG
features yet. It provides typed route contracts for health, platform metadata,
content collections, semantic search, and assistant streaming.

## Prerequisites

- Python 3.12+
- `uv`

Install `uv`:

```bash
curl -LsSf https://astral.sh/uv/install.sh | sh
```

## Setup

```bash
cd apps/api
cp .env.example .env
uv sync
```

## Development

```bash
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API docs:

- `http://localhost:8000/docs`
- `http://localhost:8000/health`

## Quality Checks

```bash
uv run ruff check .
uv run ruff format .
uv run mypy app tests
uv run pytest
```

## Database

Run migrations:

```bash
uv run alembic upgrade head
```

Seed development content:

```bash
uv run python scripts/seed_content.py
```

## Route Boundaries

- `GET /health` — health and environment response
- `GET /platform` — platform capability metadata
- `GET /content` — structured content collection registry
- `POST /search` — future semantic search contract
- `POST /assistant` — future assistant response contract
- `POST /assistant/stream` — SSE-ready assistant streaming boundary
- `GET /content/{type}` — public published content list
- `GET /content/{type}/{slug}` — public published content detail
- `GET /admin/content/{type}` — dashboard-ready content list
- `POST /admin/content/{type}` — dashboard-ready content create
- `GET /admin/content/items/{id}` — dashboard-ready content detail
- `PUT /admin/content/items/{id}` — dashboard-ready content update
- `DELETE /admin/content/items/{id}` — dashboard-ready content delete

## Future Integration Points

- dashboard authentication on admin routes
- pgvector-backed retrieval
- Redis-backed caching and session state
- authenticated dashboard tooling
- assistant SSE streaming
- AI observability and retrieval evaluation
