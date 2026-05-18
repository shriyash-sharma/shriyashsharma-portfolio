# Tooling

## `turbo.json`

Turbo config lives here (not at the repo root) so Vercel does not auto-detect Turborepo and skip the Next.js `npm ci` / `next build` in `apps/web`. Root `package.json` scripts pass `--config tooling/turbo.json`.
