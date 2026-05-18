# ADR 0002: FastAPI Backend Choice

## Context

The backend needs typed HTTP boundaries, async request handling, straightforward
dependency injection, and low-ceremony service composition.

## Decision

Use FastAPI as the backend framework.

## Tradeoffs

- gains typed request and response contracts with minimal framework ceremony
- fits async persistence and future streaming boundaries well
- leaves more architectural structure to the repository than a batteries-included framework

## Alternatives Considered

- Django for a more integrated backend stack
- Flask or Starlette with more manual structure

## Consequences

The backend remains explicit and API-oriented, with route and dependency layers
that are easy to reason about.

## Future Considerations

If the platform later needs heavier framework-provided admin or ORM patterns,
the current FastAPI boundaries still allow those concerns to be added explicitly.