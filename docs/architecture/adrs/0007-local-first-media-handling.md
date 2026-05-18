# ADR 0007: Local-First Media Handling

## Context

The platform already needs image uploads for dashboard workflows, but current
media volume and operational complexity remain modest.

## Decision

Store uploaded media on the local filesystem and serve it through FastAPI.

## Tradeoffs

- simple and easy to inspect during development
- avoids early object-storage and CDN complexity
- is less flexible than dedicated asset storage for larger-scale deployments

## Alternatives Considered

- cloud object storage from the start
- a dedicated media service

## Consequences

The current editorial loop stays simple, while storage remains behind a service
boundary that can evolve later.

## Future Considerations

If media requirements grow materially, the route/service split allows a more
durable storage provider to replace local disk without changing the dashboard contract.