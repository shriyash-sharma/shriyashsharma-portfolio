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
| `FRONTEND_ORIGIN` | `https://shriyashsharma.com` (scheme + host only, no path or trailing slash) |
| `ADMIN_JWT_SECRET` | long random string (not the example default) |
| `ADMIN_BOOTSTRAP_EMAIL` | your admin email |
| `ADMIN_BOOTSTRAP_PASSWORD` | strong password (not `changeme-admin-password`) |

The API refuses to start in `production` / `staging` if JWT secret, bootstrap password, or email are still defaults.

**Media:** uploads use local disk on Render (ephemeral). Treat uploads as non-durable until object storage is wired.

## 3. Vercel (web)

1. Import the GitHub repo.
2. **Root Directory:** `apps/web` (not `./apps/web`, not repo root).
3. **Include files outside the root directory in the Build Step:** **Enabled** (monorepo access to repo root if needed later).
4. **Framework:** Next.js.
5. **Turn off all build overrides** (Install, Build, Output Directory toggles **gray / off**). Let Vercel use zero-config Next.js defaults. Manual overrides (especially Output Directory left “on” but empty) can produce ~100ms empty builds and `404 NOT_FOUND`.
6. Do **not** set Install to `npm ci` in the dashboard for this app: `apps/web` has its own `package-lock.json`, but forced overrides have caused silent empty builds; defaults work when overrides are off.

**Monorepo tooling in this repo:** [pnpm workspaces](https://pnpm.io/workspaces) at the repo root (`pnpm-workspace.yaml`), [Turborepo](https://turbo.build) for local `pnpm build` / `pnpm dev` (config in `tooling/turbo.json`, not at repo root — so Vercel does not auto-enable Turbo). The Vercel web project deploys **`apps/web` only** with **npm** (`apps/web/package-lock.json`), not pnpm, unless you change that deliberately.

If the build log shows **“Detected Turbo”** and finishes in ~100ms with no `next build`, a `turbo.json` at the repo root was triggering an empty Turbo build. This repo keeps Turbo config in `tooling/turbo.json` to avoid that.

**Environment variables** (required for public pages to load CMS content):

| Variable | Value |
|----------|--------|
| `NEXT_PUBLIC_API_URL` | `https://portfolio-api-0pp2.onrender.com` |
| `API_INTERNAL_URL` | same as public API URL |
| `NEXT_PUBLIC_SITE_URL` | `https://shriyashsharma.com` |

Defaults for these are also committed in `apps/web/vercel.json` so production works after deploy even if the Vercel dashboard env list is empty. You can override them in the dashboard; redeploy after any change.

Local dev: copy `apps/web/.env.local.example` → `.env.local` (same API URLs; `NEXT_PUBLIC_SITE_URL` is usually `http://localhost:3000`).

## 4. CORS and cookies

- `FRONTEND_ORIGIN` on the API must exactly match the browser origin (e.g. `https://shriyashsharma.com`, not `https://shriyashsharma.com/projects`). If both `www` and apex are used, pick one canonical host and redirect the other in Vercel DNS/domain settings.
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
