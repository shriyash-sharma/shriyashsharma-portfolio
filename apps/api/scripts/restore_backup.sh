#!/usr/bin/env bash
# Restore a local or remote Postgres database from a .dump (pg_restore) or .sql (psql) backup.
# Requires Postgres 18 client tools at /Library/PostgreSQL/18/bin (macOS install path).
#
# Usage:
#   ./restore_backup.sh '<database_url>' ../../backups/supabase_post_sync_2026-05-19.dump
set -euo pipefail

if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <database_url> <backup_file>"
  echo "Example: $0 'postgresql://user:pass@host:6543/postgres' ../../backups/supabase_post_sync_2026-05-19.dump"
  exit 1
fi

DATABASE_URL="$1"
BACKUP_FILE="$2"

if [[ ! -f "$BACKUP_FILE" ]]; then
  echo "Backup file not found: $BACKUP_FILE"
  exit 1
fi

PG_CLIENT_DIR="/Library/PostgreSQL/18/bin"
PG_RESTORE_BIN="$PG_CLIENT_DIR/pg_restore"
PSQL_BIN="$PG_CLIENT_DIR/psql"

if [[ ! -x "$PG_RESTORE_BIN" || ! -x "$PSQL_BIN" ]]; then
  echo "Postgres client tools not found under $PG_CLIENT_DIR"
  exit 1
fi

SCHEME_AND_REST="${DATABASE_URL#postgresql://}"
SCHEME_AND_REST="${SCHEME_AND_REST#postgresql+asyncpg://}"
USERINFO="${SCHEME_AND_REST%@*}"
HOST_AND_DB="${SCHEME_AND_REST##*@}"
USER_PART="${USERINFO%%:*}"
PASSWORD_PART="${USERINFO#*:}"
HOST_PART="${HOST_AND_DB%%/*}"
DB_AND_QUERY="${HOST_AND_DB#*/}"
DB_NAME="${DB_AND_QUERY%%\?*}"
HOST_NAME="${HOST_PART%%:*}"
PORT_PART="${HOST_PART##*:}"

if [[ "$HOST_NAME" == "$HOST_PART" ]]; then
  PORT_PART="5432"
fi

export PGPASSWORD="$PASSWORD_PART"

if [[ "$BACKUP_FILE" == *.dump ]]; then
  "$PG_RESTORE_BIN" \
    --clean \
    --if-exists \
    --no-owner \
    --no-privileges \
    -h "$HOST_NAME" \
    -p "$PORT_PART" \
    -U "$USER_PART" \
    -d "$DB_NAME" \
    "$BACKUP_FILE"
else
  "$PSQL_BIN" \
    -h "$HOST_NAME" \
    -p "$PORT_PART" \
    -U "$USER_PART" \
    -d "$DB_NAME" \
    -f "$BACKUP_FILE"
fi

echo "Restore complete: $BACKUP_FILE -> $HOST_NAME/$DB_NAME"
