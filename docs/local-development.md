# Local Development

The platform runs as two applications in one repository: a Next.js web app and
a FastAPI backend backed by Postgres for persisted content and admin identity.

## Subsystem Summary

- `apps/web`: pages, dashboard UI, locale routing, same-origin `/api` layer
- `apps/api`: typed backend routes, auth, persistence, media serving
- Postgres: admin users and content items
- local filesystem: uploaded media storage

## Frontend

```bash
cd apps/web
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`.

## Backend

```bash
cd apps/api
cp .env.example .env
uv sync
uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Backend runs on `http://localhost:8000`.

The backend expects a working Postgres database. Current core persistence uses:

- `admin_users` for dashboard identity
- `content_items` for localized editorial content

Run database migrations:

```bash
cd apps/api
uv run alembic upgrade head
```

Seed development content:

```bash
cd apps/api
uv run python scripts/seed_content.py
```

Useful endpoints:

- `GET /health`
- `GET /platform`
- `GET /content`
- `GET /content/{type}`
- `GET /content/{type}/{slug}`
- `POST /auth/login`
- `GET /auth/session`
- `POST /admin/content/{type}`
- `GET /admin/content/{type}`
- `GET /admin/content/{type}/overview`
- `POST /admin/media`
- `GET /admin/media`
- `POST /search`
- `POST /assistant`
- `POST /assistant/stream`

## Docker

```bash
docker compose up --build
```

Services:

- `web` on `http://localhost:3000`
- `api` on `http://localhost:8000`
- `postgres` on `localhost:5433` (mapped to container port `5432`)

The backend actively uses Postgres through SQLAlchemy async and `asyncpg`.
If the database is unavailable, auth and content routes will fail even if the
web app still starts.

## Request Topology

- public page requests enter the Next.js app first
- dashboard page requests are gated by the Next.js proxy and cookie presence
- authenticated dashboard data requests flow through same-origin `/api` routes
- those routes proxy to the FastAPI backend with the dashboard token attached

This same-origin BFF pattern is the intended development topology, so prefer
using the web app for dashboard workflows instead of calling backend admin
routes directly from the browser.

## Local Startup Order

1. Start Postgres or run `docker compose up`.
2. Run backend migrations.
3. Start the FastAPI app.
4. Start the Next.js app.
5. Access dashboard and public flows through the web app.

This order reflects actual service dependencies: the backend depends on the
database, and the dashboard flow depends on both web and API applications.

## Additional Architecture Docs

See `docs/architecture/` for request lifecycle, auth, and CMS architecture
documentation.

## Backend Quality

```bash
cd apps/api
uv run ruff check .
uv run ruff format --check .
uv run mypy app tests
uv run pytest
```

## Frontend Quality

```bash
cd apps/web
npm run lint
npm run typecheck
npm run build
```
