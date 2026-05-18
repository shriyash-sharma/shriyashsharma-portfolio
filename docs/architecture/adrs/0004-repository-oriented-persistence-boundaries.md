# ADR 0004: Repository-Oriented Persistence Boundaries

## Context

Public content delivery and dashboard operations share one persistence model but
need consistent rules around filtering, slug normalization, publish-state logic,
and mutation lifecycle.

## Decision

Use repository modules as the main persistence boundary.

## Tradeoffs

- centralizes operational rules and query behavior
- keeps route handlers focused on HTTP concerns
- introduces an additional abstraction layer that must stay pragmatic

## Alternatives Considered

- direct ORM access in route handlers
- heavier service-only orchestration with thin repositories

## Consequences

Shared content behavior remains consistent across public reads and admin writes.

## Future Considerations

If specific domains need richer orchestration, services can grow around the
repository layer without removing the boundary.