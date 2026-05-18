# Production Deployment (Vercel + Render + Supabase)

First integrated deploy: Next.js on Vercel, FastAPI on Render, Postgres on Supabase.

## 1. Supabase (database)

1. Create a project in [Supabase](https://supabase.com).
2. **Settings → Database → Connection string → URI** (transaction pooler, port `6543`).
3. Convert to async SQLAlchemy URL:

```text
postgresql+asyncpg://postgres.[project-ref]:[PASSWORD]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require
```

4. Run migrations once (from your machine or Render pre-deploy):

```bash
cd apps/api
export DATABASE_URL="postgresql+asyncpg://..."
uv run alembic upgrade head
```

5. Optional seed (development content only — skip for production unless intended):

```bash
uv run python scripts/seed_content.py
```

## 2. Render (API)

Use the repo `render.yaml` blueprint or create a **Web Service** manually:

| Setting | Value |
|--------|--------|
| Root Directory | `apps/api` |
| Build Command | `pip install uv && uv sync --frozen --no-dev` |
| Pre-Deploy Command | `uv run alembic upgrade head` |
| Start Command | `uv run uvicorn app.main:app --host 0.0.0.0 --port $PORT` |
| Health Check Path | `/health/ready` |

**Environment variables** (required):

| Variable | Example |
|----------|---------|
| `APP_ENV` | `production` |
| `DATABASE_URL` | Supabase async URL above |
| `FRONTEND_ORIGIN` | `https://your-site.vercel.app` |
| `ADMIN_JWT_SECRET` | long random string (not the example default) |
| `ADMIN_BOOTSTRAP_EMAIL` | your admin email |
| `ADMIN_BOOTSTRAP_PASSWORD` | strong password (not `changeme-admin-password`) |

The API refuses to start in `production` / `staging` if JWT secret, bootstrap password, or email are still defaults.

**Media:** uploads use local disk on Render (ephemeral). Treat uploads as non-durable until object storage is wired.

## 3. Vercel (web)

1. Import the GitHub repo.
2. **Root Directory:** `apps/web` (required — do not deploy from repo root).
3. Framework: Next.js; Install `npm ci`, Build `npm run build` (see `apps/web/vercel.json`).

If the build log shows **“Detected Turbo”** and finishes in ~100ms with no `npm ci` / `next build`, either Root Directory is wrong or a `turbo.json` at the repo root is triggering an empty Turbo build. This repo keeps Turbo config in `tooling/turbo.json` so Vercel runs the Next.js install/build instead.

**Environment variables:**

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://your-api.onrender.com` |
| `API_INTERNAL_URL` | same as public API URL (unless using private networking) |
| `NEXT_PUBLIC_SITE_URL` | `https://your-site.vercel.app` |

Copy `apps/web/.env.example` for local parity.

## 4. CORS and cookies

- `FRONTEND_ORIGIN` on the API must exactly match the Vercel URL (scheme + host, no trailing slash mismatch).
- Dashboard auth uses an httpOnly cookie on the web origin; the browser never calls Render admin routes directly.

## 5. Smoke test checklist

After deploy:

- [ ] `GET https://api.../health` → `status: ok`
- [ ] `GET https://api.../health/ready` → `status: ok` (database up)
- [ ] Public site loads; `/blog`, `/projects`, `/case-studies` show published content
- [ ] `https://site.../login` → sign in with bootstrap credentials
- [ ] CMS: create draft → publish → visible on public route
- [ ] Media preview URLs use `NEXT_PUBLIC_API_URL` + `/media/...`

## 6. Root `vercel.json`

The root `vercel.json` only gates deploys on `main`. Vercel project **Root Directory** must still be set to `apps/web`.
