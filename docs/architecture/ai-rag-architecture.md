# AI / RAG Architecture

This document explains how the assistant in this portfolio works today. The goal is not to present an abstract AI architecture. The goal is to document the actual retrieval flow, the tradeoffs behind it, and the boundaries that keep it useful as an engineering guide.

## Why the assistant exists

The assistant is meant to help recruiters, engineers, and collaborators explore the platform through the same material a human reviewer would use:

- case studies
- architecture notes
- ADRs
- articles
- project summaries
- implementation documentation

It is intentionally narrow in scope. It should explain this portfolio's systems and decisions. It should not behave like a generic chatbot.

## Knowledge sources

The assistant draws from two source families.

### 1. CMS content

Published rows in the content system whose `ai_indexable` flag is true:

- projects
- case studies
- articles
- architecture notes
- experiments

These records are useful for recruiter-facing summaries and shorter engineering narratives.

### 2. Repository markdown

Markdown files under `docs/` plus selected READMEs are ingested into the same knowledge store.

These files hold the deeper technical material:

- backend architecture
- request lifecycle
- CMS architecture
- auth architecture
- frontend/backend coordination
- ADRs
- AI / RAG notes
- deployment notes

This split matters. CMS content is better for public narrative. Markdown docs are better for dense implementation detail.

## Retrieval pipeline

At a high level the flow is:

1. user asks a question
2. the backend embeds the query
3. pgvector retrieves the nearest chunks
4. the backend builds a grounded prompt from those chunks
5. the LLM generates an answer with citations
6. the API returns both answer text and source list

## Ingestion flow

The ingestion script collects content from both source families.

### CMS ingestion

For each published content record:

- concatenate title, description, and body into the canonical text
- preserve content type, locale, and slug as document metadata
- chunk the text
- embed the chunks
- write them into `knowledge_documents` and `knowledge_chunks`

### Markdown ingestion

For each markdown file:

- derive the title from the first heading
- preserve the repository path as document metadata
- chunk the markdown while respecting headings and code fences
- embed the chunks
- write them into the same knowledge tables

## Chunking strategy

The platform uses a markdown-aware chunker instead of fixed-size string slicing.

Important behaviors:

- respects heading boundaries when possible
- avoids breaking inside fenced code blocks
- falls back to sentence-level splitting when needed
- keeps overlap between chunks to avoid losing context at boundaries

This matters because architecture notes often use short explanatory sections. A naive chunker would reduce retrieval quality immediately.

## Embedding strategy

Embeddings are generated with OpenAI `text-embedding-3-small`.

A useful quality improvement in this platform is that the embedding input is not just the chunk body. It includes:

- document title
- heading path
- chunk content

That change improved retrieval quality for queries where the meaning is mostly expressed by the section title rather than the paragraph body.

## Retrieval store

The vector store is PostgreSQL with pgvector.

Why this choice fits the platform:

- operationally simple for a portfolio-scale product
- keeps structured content and vector retrieval in one system
- easy to inspect directly during development
- enough performance for the current corpus size

The index uses cosine similarity through pgvector's ANN support. For this platform, the priority is inspectability and reasonable performance rather than distributed search complexity.

## Prompting strategy

The assistant prompt is scoped to the portfolio domain.

It is designed to:

- answer only from retrieved material
- stay close to engineering content
- cite sources clearly
- avoid broad speculation
- refuse to improvise beyond the portfolio context

This is an important product choice. The assistant should feel like a portfolio guide, not a free-form personality layer.

## API boundaries

The public assistant flow is split across the web and API apps.

### Web app

- renders the assistant UI
- owns the global drawer and entry points
- calls a same-origin API route

### Next.js proxy route

- receives browser requests at `/api/assistant`
- forwards them to FastAPI
- keeps backend URLs out of the browser

### FastAPI backend

- validates the request
- runs retrieval
- constructs grounded messages
- calls the LLM provider
- returns answer + sources

This split keeps the browser surface simple while preserving explicit backend control over retrieval and prompt assembly.

## LLM provider strategy

The current default is Groq for generation, with OpenAI-compatible fallback support.

Why Groq is the default:

- good latency for interactive portfolio use
- cost profile that suits a low-traffic but public-facing assistant
- works through the same OpenAI-compatible chat client abstraction

The code deliberately keeps provider logic behind a small interface so the retrieval system does not depend on one vendor SDK.

## Product tradeoffs

Several things are intentionally deferred.

- no streaming response UI yet
- no reranking layer
- no automated reindex after content changes
- no background worker topology
- no retrieval evaluation dashboard
- no multi-turn server-side memory

These are reasonable omissions at the current stage. The assistant is meant to be grounded and useful first, not overloaded with AI infrastructure complexity.

## Why this architecture is credible

The credibility comes from the restraint:

- small, inspectable code paths
- explicit retrieval source boundaries
- prompt behavior tied to real content
- operational simplicity over fashionable abstraction

That makes the assistant a better engineering showcase. The interesting part is not that it uses an LLM. The interesting part is that retrieval, content architecture, and product UX are treated as one system.
