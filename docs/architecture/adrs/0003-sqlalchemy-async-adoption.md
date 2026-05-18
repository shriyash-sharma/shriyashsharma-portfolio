# ADR 0003: SQLAlchemy Async Adoption

## Context

The backend uses Python, FastAPI, and Postgres. Persistence needs to support
request-scoped sessions, explicit query control, and async request handling.

## Decision

Use SQLAlchemy 2 async with asyncpg.

## Tradeoffs

- aligns persistence with the backend's async execution model
- keeps query composition explicit and flexible
- adds ORM and session-management complexity compared with thinner database wrappers

## Alternatives Considered

- synchronous SQLAlchemy in an async app
- simpler direct SQL access patterns
- TypeScript-first ORM tooling

## Consequences

Database access remains explicit, testable, and compatible with the backend's
current runtime model.

## Future Considerations

If specific hot paths later need more direct SQL control, they can be added
without replacing the overall session model.