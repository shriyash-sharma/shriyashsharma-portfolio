from dataclasses import dataclass


@dataclass(frozen=True)
class DatabaseReadiness:
    configured: bool
    migration_ready: bool
    pgvector_ready: bool


def get_database_readiness(database_url: str | None) -> DatabaseReadiness:
    return DatabaseReadiness(
        configured=bool(database_url),
        migration_ready=False,
        pgvector_ready=False,
    )
