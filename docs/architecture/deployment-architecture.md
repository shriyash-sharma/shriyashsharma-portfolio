# Deployment Architecture

This document explains how the platform is expected to run outside local development. It focuses on the actual deployment shape implied by the repository, not an idealized future platform.

## Deployment shape

The platform is intentionally split into two deployable applications.

### Web application

- Next.js application
- public pages and content routes
- same-origin proxy routes for selected backend integration points
- suitable for deployment on Vercel

### API application

- FastAPI service
- content delivery
- admin/auth workflows
- assistant orchestration
- media serving in the current model
- suitable for deployment on Render or another Python-capable container platform

### Database

- PostgreSQL for content and admin data
- pgvector extension for retrieval

This is not a microservices platform. It is a compact full-stack product split along clear frontend/backend concerns.

## Why this shape is useful

The split gives the platform a few practical benefits:

- frontend deployment stays optimized for Next.js routing and rendering
- backend deployment stays optimized for typed Python service behavior
- browser traffic can remain simple through same-origin proxy routes
- content and retrieval data stay in one Postgres system

## Local development parity

The repository supports a local development flow through Docker and per-app runtime commands.

That matters because the platform includes more than static rendering:

- CMS-backed content
- authentication flows
- local media handling
- retrieval ingestion
- assistant orchestration

If those systems cannot be run locally with reasonable parity, the architecture stops being trustworthy very quickly.

## Production caveats

A few production realities matter here.

### pgvector must exist in the database

The retrieval system depends on the `vector` extension. A deployment that provisions ordinary Postgres without pgvector support will fail to apply the knowledge-base migration.

### Assistant keys are runtime config

The assistant depends on provider credentials at runtime.

That means production needs:

- `OPENAI_API_KEY` for embeddings
- `GROQ_API_KEY` or an alternative LLM provider configuration
- RAG tuning variables where appropriate

### Knowledge ingestion is a deployment concern

The assistant is only as useful as the indexed content available in the knowledge store.

Today that means deployment must include a step to:

1. run migrations
2. seed content if needed
3. run the ingestion command

Without that, the assistant routes exist but cannot answer from meaningful sources.

## Current limitations in the deployment story

The current deployment shape is intentionally simple, but that simplicity has consequences.

- media storage is local-first rather than object-storage-backed
- ingestion is manual rather than event-driven
- no background workers exist for indexing or media processing
- no dedicated observability layer exists for retrieval quality or assistant usage

These are reasonable constraints for the platform stage. They would become problematic only if the product scope grew significantly.

## Why the deployment model is still credible

The platform does not pretend to be more distributed than it is.

That credibility matters. The stack is small enough to understand, but structured enough to support:

- real content workflows
- real backend contracts
- real semantic retrieval
- real deployment concerns

For a portfolio platform that also wants to act as an engineering showcase, that is the right level of ambition.
