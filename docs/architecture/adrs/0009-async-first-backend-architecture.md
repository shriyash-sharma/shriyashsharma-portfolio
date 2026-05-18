# ADR 0009: Async-First Backend Architecture

## Context

The backend uses FastAPI, SQLAlchemy async, and future-facing streaming and
search boundaries. Mixing sync-first and async-first execution models would
create avoidable complexity.

## Decision

Keep backend route and persistence boundaries async-first.

## Tradeoffs

- aligns HTTP handling, session management, and database access
- reduces future migration pressure around I/O-heavy workflows
- requires developers to remain disciplined about async-safe libraries and boundaries

## Alternatives Considered

- synchronous route and persistence model
- mixed sync and async data access depending on module

## Consequences

The runtime model stays coherent even as the backend grows beyond simple CRUD.

## Future Considerations

If background workers or streaming features expand later, the async-first choice
reduces architectural friction.