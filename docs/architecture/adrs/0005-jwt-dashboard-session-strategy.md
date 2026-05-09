# ADR 0005: JWT Dashboard Session Strategy

## Context

The dashboard needs authenticated access with a simple operational footprint and
a clear separation between browser session handling and backend authorization.

## Decision

Use signed JWTs with expiration for dashboard access tokens.

## Tradeoffs

- simple to issue and validate
- works well with same-origin cookie storage and backend bearer validation
- does not provide centralized revocation without additional state

## Alternatives Considered

- stateful server-side session storage
- opaque tokens backed by a session database or cache

## Consequences

The current auth path is compact and explicit, but stronger revocation semantics
would require an additional coordination layer.

## Future Considerations

If the platform grows into more complex admin operations, token revocation or
refresh-token patterns may become worthwhile.