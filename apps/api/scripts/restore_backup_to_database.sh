#!/usr/bin/env bash
# Restore a plain SQL backup into any Postgres database via psql.
# Pass DATABASE_URL as the second argument or set it in the environment.
#
# Usage:
#   ./restore_backup_to_database.sh ../../backups/portfolio_data_2026-05-19.sql
#   DATABASE_URL='postgresql://...' ./restore_backup_to_database.sh backup.sql

set -euo pipefail

if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <backup.sql> [DATABASE_URL]" >&2
  exit 1
fi

backup_file="$1"
database_url="${2:-${DATABASE_URL:-}}"

if [[ ! -f "$backup_file" ]]; then
  echo "Backup file not found: $backup_file" >&2
  exit 1
fi

if [[ -z "$database_url" ]]; then
  echo "Provide DATABASE_URL as the second argument or environment variable." >&2
  exit 1
fi

/Library/PostgreSQL/18/bin/psql "$database_url" -f "$backup_file"
