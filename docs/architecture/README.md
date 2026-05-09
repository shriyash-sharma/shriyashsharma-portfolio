# Platform Architecture

This directory captures the engineering shape of the current platform as it
exists today. It is meant for onboarding, maintenance, and architectural
decision context rather than feature marketing.

## Document Map

- `request-lifecycle.md`: end-to-end request flow across the web and API apps
- `frontend-backend-coordination.md`: same-origin proxying, typed API access,
  and dashboard coordination patterns
- `auth-architecture.md`: admin session lifecycle and authorization boundaries
- `cms-architecture.md`: content, publishing, locale, media, and persistence
  workflows

## Current System Shape

The monorepo is intentionally split into a web application, an API application,
shared packages, and infrastructure support directories.

- `apps/web` owns the user experience, dashboard UI, same-origin API routes,
  locale routing, and server-rendered integration with backend contracts.
- `apps/api` owns typed backend contracts, request validation, admin auth,
  content persistence, and local media serving.
- `packages/*` reserve space for shared configuration and utilities without
  forcing the applications into one deployment unit.

## Architectural Intent

The platform is being evolved as a real product foundation rather than a static
portfolio site. That shows up in a few deliberate choices:

- A monorepo keeps frontend and backend contracts close while letting each app
  evolve independently.
- FastAPI provides typed HTTP boundaries and async request handling without
  adding unnecessary framework ceremony.
- SQLAlchemy async repositories provide one persistence seam for content,
  publishing, and future indexing workflows.
- Same-origin Next.js proxy routes keep browser auth and backend integration
  simple while preserving room for stricter gateway behavior later.

## Future Readiness Without Premature Claims

The current model already leaves useful extension points for semantic search,
embedding pipelines, multilingual retrieval, and AI indexing:

- content items carry `ai_indexable` and `indexed_at` metadata
- locale is part of content identity and filtering
- content collections distinguish indexable and non-indexable domains
- search and assistant APIs exist as stable contracts, but their deeper
  implementation is intentionally deferred until the product needs it