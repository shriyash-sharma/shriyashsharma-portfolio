# ADR 0001: Monorepo Architecture

## Context

The platform consists of a Next.js web app, a FastAPI backend, shared package
spaces, and infrastructure configuration. Frontend and backend contracts evolve
closely together.

## Decision

Keep the platform as a monorepo with separate application directories.

## Tradeoffs

- improves cross-application change coordination
- keeps shared documentation and build context close
- increases the need for clear app boundaries inside one repository

## Alternatives Considered

- split frontend and backend into separate repositories
- build the platform as a single full-stack runtime

## Consequences

Engineers can update contracts, docs, and application code in one place, but
must preserve discipline around ownership boundaries.

## Future Considerations

If deployment or team structure changes substantially, repository structure can
be revisited without changing the current runtime boundaries.