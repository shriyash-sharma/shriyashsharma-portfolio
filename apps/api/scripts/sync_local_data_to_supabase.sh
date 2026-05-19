#!/usr/bin/env bash
# Push local portfolio seed data to Supabase: run Alembic migrations, then load the SQL backup.
# Expects backups/portfolio_data_2026-05-19.sql at the repo root (gitignored).
#
# Usage:
#   ./sync_local_data_to_supabase.sh 'postgresql://postgres.[ref]:[password]@...supabase.com:6543/postgres'
#   SUPABASE_DATABASE_URL='postgresql://...' ./sync_local_data_to_supabase.sh

set -euo pipefail

supabase_url="${1:-${SUPABASE_DATABASE_URL:-${DATABASE_URL:-}}}"
repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
backup_file="$repo_root/backups/portfolio_data_2026-05-19.sql"

if [[ -z "$supabase_url" ]]; then
  echo "Provide the Supabase DATABASE_URL as the first argument or SUPABASE_DATABASE_URL env var." >&2
  exit 1
fi

if [[ ! -f "$backup_file" ]]; then
  echo "Expected backup file not found: $backup_file" >&2
  exit 1
fi

cd "$repo_root/apps/api"
source .venv/bin/activate

DATABASE_URL="$supabase_url" alembic upgrade head
/Library/PostgreSQL/18/bin/psql "$supabase_url" -f "$backup_file"
