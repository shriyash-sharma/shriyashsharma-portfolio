# ADR 0010: Manual RAG Over Heavier Orchestration Frameworks

- Status: Accepted
- Date: 2026-05-19

## Context

The platform needed a retrieval-backed assistant that could explain projects, architecture notes, case studies, and engineering decisions.

A framework-heavy approach would have added:

- more abstraction around retrieval and prompt assembly
- more moving parts to debug when answers were weak
- more conceptual overhead for a portfolio-scale system

At the same time, the platform already had the pieces needed for a direct implementation:

- FastAPI for typed backend orchestration
- PostgreSQL with pgvector for retrieval
- markdown and CMS content sources
- a small amount of prompt construction logic

## Decision

Implement the assistant as a direct manual RAG pipeline using:

- explicit ingestion code
- explicit chunking logic
- explicit provider abstractions
- explicit retrieval queries
- explicit prompt assembly

Do not introduce a larger orchestration framework at this stage.

## Consequences

### Positive

- easier to inspect the full path from query to answer
- retrieval bugs are easier to reason about
- the system stays small enough to document credibly
- provider swaps remain possible without framework lock-in

### Negative

- fewer prebuilt utilities for advanced retrieval flows
- streaming, memory, reranking, and evaluation need to be added manually later
- more implementation detail stays in the repository code

## Why this fits the platform

The assistant is part of an engineering portfolio. That makes transparency a feature, not a cost. A smaller manual implementation is more aligned with that goal than a broader but more opaque framework layer.
