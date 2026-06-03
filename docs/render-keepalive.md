# Render API keep-alive (GitHub Actions)

The portfolio FastAPI backend on [Render](https://render.com) free tier spins down after inactivity. The first request after idle time pays a **cold start** latency cost.

A lightweight GitHub Actions workflow pings the public **liveness** endpoint on a fixed schedule so the service stays warm and first-page loads feel snappier.

This does **not** change application code paths, SEO, CMS workflows, or the AI assistant. It only issues an outbound `GET` from GitHub-hosted runners.

## Health endpoint

Reuse the existing liveness route (no database, no auth):

| Item | Value |
|------|--------|
| Method | `GET` |
| Path | `/health` |
| Implementation | `apps/api/app/api/routes/health.py` |

Example response (fields may vary by environment):

```json
{
  "status": "ok",
  "service": "Portfolio API",
  "environment": "production",
  "version": "0.1.0",
  "checked_at": "2026-06-03T12:00:00Z"
}
```

Do **not** point keep-alive at `/health/ready` — that route checks the database and is reserved for Render’s own health check (`render.yaml` → `healthCheckPath`).

## Workflow

| Item | Value |
|------|--------|
| File | `.github/workflows/render-keepalive.yml` |
| Schedule | Every ~10 minutes (`3,13,23,33,43,53 * * * *`, UTC) |
| Runner | `ubuntu-latest` (GitHub-hosted) |
| Tool | `curl` (single request, no retries) |

On failure (non-200, timeout, or DNS error) the job logs a warning and exits successfully so GitHub does not retry the job; the next cron run tries again.

## Setup

1. Merge or push `.github/workflows/render-keepalive.yml` to the default branch so Actions picks it up.
2. In GitHub: **Settings → Secrets and variables → Actions → Variables → New repository variable**
3. Name: `RENDER_HEALTH_URL`
4. Value: full URL to the liveness endpoint, for example:

   ```text
   https://portfolio-api-0pp2.onrender.com/health
   ```

   Use your real Render service hostname. Include the `/health` path (no trailing slash required).

5. Confirm manually (optional):

   ```bash
   curl -sS -w "\nHTTP %{http_code}\n" "https://YOUR-RENDER-HOST/health"
   ```

6. In GitHub: **Actions → Render API keep-alive** — use **Run workflow** once, or wait for the next scheduled run. Logs should show `HTTP status: 200`.

No GitHub secrets are required when the health URL is public (same as browser-accessible `GET /health`).

## Scheduled runs not appearing?

GitHub only runs `schedule` on the **default branch** (`main`). Manual **Run workflow** working does not prove cron is registered.

1. **Actions** tab — if you see *“Scheduled workflows are disabled”*, click **Enable workflow** (happens after ~60 days repo inactivity until a new push).
2. Confirm **Settings → Actions → General** allows workflows (not “Disable actions”).
3. Wait for a run whose event is **`schedule`** (not “Manually run”). First run after adding/changing cron can take up to ~1 hour; GitHub also delays or skips runs at `:00` / `:10` UTC under load.
4. After changing `.github/workflows/render-keepalive.yml`, push to `main` so the scheduler picks up the new cron.

## Disable

- **Temporary:** Actions → **Render API keep-alive** → ⋮ → **Disable workflow**
- **Permanent:** delete `.github/workflows/render-keepalive.yml` and remove the `RENDER_HEALTH_URL` variable if no longer needed

## Update

Change the **RENDER_HEALTH_URL** repository variable when the API moves (e.g. Oracle Cloud, a new Render service name). No workflow edit is required unless you change the schedule or behavior.

## Security notes

- Only the public liveness URL is called; no tokens or admin routes.
- The workflow has empty `permissions:` (no repo checkout or secrets beyond the public variable).
- Keep-alive traffic is negligible compared to normal site usage.

## When to remove

Delete the workflow when the API runs on always-on infrastructure (paid Render plan, VPS, Kubernetes, etc.) where cold starts are no longer a concern.
