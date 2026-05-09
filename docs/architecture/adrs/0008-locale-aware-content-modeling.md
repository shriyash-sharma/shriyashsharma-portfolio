# ADR 0008: Locale-Aware Content Modeling

## Context

The platform supports locale-aware routing in the web app and localized content
filtering in the backend.

## Decision

Treat locale as a first-class content field and part of content identity.

## Tradeoffs

- keeps localized publishing explicit and queryable
- supports locale-aware routing and retrieval cleanly
- requires discipline around uniqueness and per-locale editorial operations

## Alternatives Considered

- treat locale as frontend-only presentation state
- separate localized variants into loosely related records outside the core model

## Consequences

Locale-aware public reads and admin filters remain aligned to the same content
identity model.

## Future Considerations

This model leaves room for multilingual retrieval and indexing without claiming
that those systems are already implemented.