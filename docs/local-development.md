# Local Development

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

Useful endpoints:

- `GET /health`
- `GET /platform`
- `GET /content`
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
- `postgres` on `localhost:5432`

Postgres is available for future persistence work. The backend does not yet
open a database connection.

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
