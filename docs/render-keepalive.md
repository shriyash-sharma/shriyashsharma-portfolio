# Render API keep-alive (GitHub Actions + in-app pinger)

The portfolio FastAPI backend on [Render](https://render.com) free tier spins down after inactivity. The first request after idle time pays a **cold start** latency cost.

Two layers keep it (and related services) warm:

1. **GitHub Actions** (external, described below) — pings this API's own `/health` on a fixed schedule. This is the mechanism that can actually wake this process back up from a full stop, since nothing running *inside* a stopped process can restart it.
2. **In-app pinger** (`app/services/keepalive_ping.py`) — a background loop started from this process's own lifespan, active only while the process is already running. Since GitHub Actions already guarantees regular wake-ups, this loop piggybacks extra ping duty onto that: it also pings the **FieldFlow staging** and **FieldFlow production** health endpoints (and this API's own `/health` again, redundantly with #1) every `KEEPALIVE_PING_INTERVAL_SECONDS` (default 720s / 12 min). See `KEEPALIVE_PING_ENABLED` / `KEEPALIVE_PING_URLS` in `render.yaml` and `.env.example`.

Neither layer changes application code paths, SEO, CMS workflows, or the AI assistant — both only issue outbound `GET` requests.

## Why not just an in-app self-ping?

A background task inside this process cannot rescue itself once the process has actually stopped — Render fully stops the container, so there is nothing left to run the loop. The in-app pinger only ever prevents future spin-downs while already alive; it relies on GitHub Actions (external, runs independently of this app) to guarantee the process gets a chance to be alive at all. That's also why this API pings itself in `KEEPALIVE_PING_URLS`: it's redundant with the GitHub Actions ping, not a replacement for it.

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

## In-app pinger: cross-project targets

`KEEPALIVE_PING_URLS` in `render.yaml` currently also targets two services
from the separate **FieldFlow** repo (`fieldflow-api-staging` and
`api.teamshastra.com`, both on Render). This is a one-way dependency: this
project pings FieldFlow, not the reverse. If FieldFlow's health path, host,
or `TRUSTED_HOSTS` config changes, or that project is decommissioned, update
or trim `KEEPALIVE_PING_URLS` here — a stale target only logs a warning
(`keepalive_ping failed ...`) each cycle, it doesn't fail this service.

## When to remove

Delete the GitHub Actions workflow when this API runs on always-on
infrastructure (paid Render plan, VPS, Kubernetes, etc.) where cold starts
are no longer a concern. Also disable the in-app pinger at that point
(`KEEPALIVE_PING_ENABLED=false`) — an always-on service pinging other
free-tier services no longer needs the "wake itself first" workflow, but if
FieldFlow (or another peer) still needs keep-alive, keep it enabled and
targeted at just those peers.
