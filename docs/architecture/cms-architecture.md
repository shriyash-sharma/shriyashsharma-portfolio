# CMS and Content Architecture

The platform currently behaves like a lightweight CMS backed by one structured
content model, an authenticated dashboard, and a local media workflow.

## Content Responsibility Split

There are two distinct API surfaces for content.

- public routes under `/content` expose published, locale-filtered items for the
  website
- admin routes under `/admin/content` expose draft, review, published, and
  archived items for editorial tooling

This separation is important because public delivery and editorial operations
have different safety requirements even when they share the same persistence
model.

## Shared Content Model

`apps/api/app/db/models/content.py` stores multiple collections in one
`content_items` table.

Why this was chosen:

- projects, case studies, articles, architecture notes, experiments, and
  research logs share the same lifecycle semantics
- the dashboard needs one coherent CRUD and filtering model
- future indexing pipelines benefit from a uniform content extraction surface
- locale-aware uniqueness is easier to enforce consistently in one model

Important lifecycle fields:

- `status`: draft, review, published, archived
- `locale`: localization key used in both uniqueness and filtering
- `published_at`: public-release timestamp derived from publishing state
- `ai_indexable`: whether future indexing pipelines should consider the item
- `indexed_at`: reserved bookkeeping for future retrieval/indexing workflows

## Draft and Publish Lifecycle

Content moves through the system with explicit publish-state semantics.

1. editors create or update an item through admin routes
2. the repository normalizes slugs and applies status transitions
3. `published_at` is set when an item becomes published unless an explicit value
   is supplied
4. public routes only read items whose status is `published`
5. archived items stay in the admin view but drop out of public delivery

This keeps the editorial model honest without introducing a heavier workflow
engine prematurely.

## Locale-Aware Content Handling

Locale is not a presentation-only concern in this platform.

- it is stored on each content item
- it participates in uniqueness with content type and slug
- public reads require locale-aware lookup
- admin views can filter by locale without changing route shape
- the Next.js proxy persists the preferred locale so URL behavior and content
  retrieval remain aligned

This prepares the platform for multilingual publishing and future multilingual
retrieval without claiming that translation automation already exists.

## Dashboard Data Flow

The dashboard content workspace is built around two concurrent views of the same
collection.

- a filtered item list for operational work
- an overview count grouped by publishing status

The UI requests both views through same-origin BFF routes, which forward auth to
FastAPI. The backend repository applies filtering once and serves both the list
and status summary from the same underlying model.

## Media Upload Flow

Media is currently local by design.

1. an authenticated dashboard request uploads an image
2. the Next.js BFF forwards the multipart request
3. FastAPI validates the session and file type
4. `LocalMediaStorage` writes the asset under `storage/media`
5. FastAPI serves the file back through `/media`

This keeps the editorial loop simple while preserving a storage boundary that
can be swapped later.

## Repository Boundary and Persistence Lifecycle

`ContentRepository` is the main persistence seam for content operations.

- routes stay thin and HTTP-focused
- repositories own filtering, query construction, slug normalization, and
  publish timestamp behavior
- SQLAlchemy async sessions are injected per request
- commits happen inside repository mutations so item lifecycle rules are applied
  in one place

This repository pattern is less about abstraction for its own sake and more
about keeping operational rules consistent across public and admin surfaces.

## Future Readiness

The current architecture already supports credible next steps for AI-adjacent
features without pretending they exist now.

- indexable content is explicit
- content is already normalized by type, locale, and slug
- research logs and architecture notes can coexist with public content in the
  same retrieval vocabulary
- search and assistant APIs already provide stable contract boundaries

That means semantic search, embeddings, multilingual retrieval, and indexing
pipelines can be added later at the service and pipeline level without needing
to redesign the content model first.