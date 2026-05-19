# Current Limitations and Deferred Complexity

This document describes the platform's current scope boundaries. The goal is to
make architectural sequencing explicit.

## Runtime and Infrastructure Limits

### Local media storage

Uploaded media is stored on the local filesystem and served directly by the API
process.

Why this is the current choice:

- the dashboard media workflow is already functional with minimal operational overhead
- engineers can inspect stored assets directly during development
- object storage, transformation pipelines, and CDN concerns are deferred until
  they provide real value

### No background workers

Request handling is synchronous from the perspective of application topology.

- no queue-backed processing
- no async job execution layer
- no out-of-band publishing, ingestion, or media processing pipeline

This keeps failure modes and deployment shape straightforward at the current
stage.

### No distributed session revocation

Dashboard sessions are validated through signed JWTs, token expiry, and active
user checks.

What this means operationally:

- session invalidation is not coordinated through a shared revocation store
- stronger revocation semantics would require additional server-side session state

That complexity is deferred until the platform has a stronger need for it.

## Data and Retrieval Limits

### Retrieval exists, but ingestion is still manual

The platform now includes live semantic retrieval through pgvector and a
grounded assistant route. The limitation is not the existence of retrieval. The
limitation is the operational shape around it.

Current constraints:

- content changes do not automatically trigger reindexing
- embeddings are refreshed through an explicit ingestion command
- retrieval quality depends on editorial discipline and curated knowledge sources

This keeps the system understandable, but it is not yet a continuously updated
indexing pipeline.

### No background AI indexing workers

Content items carry `ai_indexable` and `indexed_at`, but there is still no
queue-backed indexing worker or async processing layer behind content writes.

That means:

- no automatic embedding refresh after publish
- no distributed retry strategy for ingestion failures
- no off-request orchestration for large indexing jobs

This is a conscious decision to keep the runtime topology compact.

### No retrieval evaluation or reranking layer yet

The assistant performs semantic retrieval, context packing, and grounded answer
generation, but the system does not yet include:

- an evaluation suite for known good questions
- reranking over retrieved chunks
- query rewriting or multi-stage retrieval
- answer-quality analytics or source coverage dashboards

The assistant is useful and grounded today, but its quality model is still
closer to a carefully implemented product feature than a fully instrumented AI
platform.

### No async ingestion pipeline for external sources

The repository still does not include automated import flows for external
research, uploaded documents, or third-party data sources.

Editorial content enters through dashboard operations, seed data, and markdown
documents checked into the repository.

## Why These Limits Improve Maintainability Right Now

The current architecture chooses simpler operational boundaries because they are
easier to understand, easier to debug, and more honest about the system's stage.

Benefits of the current scope:

- fewer hidden runtime dependencies
- fewer coordination failures between services
- easier onboarding into the real request and persistence paths
- a cleaner base for future changes that are driven by actual product demand