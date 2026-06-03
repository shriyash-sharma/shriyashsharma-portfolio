# Deployment

Production runbook: **[PRODUCTION.md](./PRODUCTION.md)** (Vercel web + Render API + Supabase).

Provider config in repo root:

- `render.yaml` — Render blueprint for `apps/api`
- `vercel.json` — deploy gate on `main` (set Vercel **Root Directory** to `apps/web`)

Optional Render free-tier warm-up: **[docs/render-keepalive.md](../../docs/render-keepalive.md)** (GitHub Actions + `RENDER_HEALTH_URL` variable).
