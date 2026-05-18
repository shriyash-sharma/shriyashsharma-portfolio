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

### No vector search yet

Search and assistant routes exist as explicit boundaries, but there is no live
vector search or semantic retrieval implementation behind them.

The codebase does contain fields and structural seams that prepare for future
indexing work. That should be read as readiness, not as an existing subsystem.

### No AI indexing pipeline yet

Content items carry `ai_indexable` and `indexed_at`, but content writes do not
trigger background indexing, embedding generation, or retrieval updates.

This preserves a stable content model without prematurely adding infrastructure.

### No async ingestion pipeline

The repository does not currently include automated import flows for external
research, documents, or project artifacts.

Editorial content enters the system through dashboard operations and seed data.

## Why These Limits Improve Maintainability Right Now

The current architecture chooses simpler operational boundaries because they are
easier to understand, easier to debug, and more honest about the system's stage.

Benefits of the current scope:

- fewer hidden runtime dependencies
- fewer coordination failures between services
- easier onboarding into the real request and persistence paths
- a cleaner base for future changes that are driven by actual product demand