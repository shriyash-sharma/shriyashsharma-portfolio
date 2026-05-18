# ADR 0006: Same-Origin Auth Proxy Architecture

## Context

The dashboard runs in Next.js, while protected operational APIs run in FastAPI.
Browser clients need authenticated access without owning backend topology or raw
token handling details.

## Decision

Route authenticated browser traffic through same-origin Next.js API handlers.

## Tradeoffs

- keeps browser calls same-origin and hides backend URL concerns
- centralizes token forwarding and request shaping
- adds one more request hop for dashboard operations

## Alternatives Considered

- direct browser calls to backend admin routes
- backend-issued cross-origin cookie flows

## Consequences

The web app becomes the BFF layer for dashboard transport concerns, while the
backend remains the source of truth for authorization.

## Future Considerations

If stricter gateway behavior is needed later, the same-origin BFF layer provides
a natural place to introduce it.