# Portfolio System Design Interview Guide

This document explains the portfolio application in a system-design style suitable for senior software engineering interviews. It is not a file-by-file code walkthrough. It maps the actual implementation to real-world architecture concepts.

## 1. High Level System Overview

This portfolio is not just a personal site. It is a small product platform that demonstrates content publishing, authenticated administration, semantic search, and an AI assistant over the same source of truth. The public web app renders the portfolio, the backend enforces content visibility and auth, PostgreSQL stores both structured content and retrieval data, and the assistant answers from indexed portfolio material rather than from generic model memory.

The complete flow is:

```text
Browser -> Next.js -> FastAPI -> PostgreSQL -> Knowledge Layer / Vector Retrieval -> AI Assistant
```

The frontend owns presentation and route composition, the backend owns validation and data rules, the database owns persistence, and the AI layer owns retrieval and answer generation.

Main user journeys:

- Public visitors read projects, case studies, blog posts, and architecture notes through server-rendered pages.
- Recruiters use the same public content, then ask follow-up questions through the AI assistant.
- AI assistant users get grounded answers from indexed content and repository docs.
- Dashboard administrators create, edit, publish, reindex, and purge content through protected admin routes.

Why this exists:

- To show engineering depth beyond a static portfolio.
- To demonstrate frontend, backend, storage, AI, SEO, auth, and deployment boundaries.
- To turn the portfolio into a working product surface.

Tradeoffs:

- More operational complexity than a static site.
- More credibility and extensibility than hardcoded pages.
- Compact architecture instead of premature microservices.

How large-scale systems solve the same problem:

- They separate frontend delivery, API services, data storage, search indexing, AI retrieval, and background workers.
- They usually use CDN caching, load balancers, object storage, queues, observability, and separate search/vector infrastructure.

Interviewers may ask:

- Why split the system into Next.js and FastAPI instead of one monolith?
- Why keep content, CMS, and assistant on the same Postgres-backed platform?
- Why is the assistant grounded in your own content instead of general chat?

## 2. Storage Paradigms

The portfolio uses three storage styles.

### Content Storage

Content storage lives in PostgreSQL. The `content_items` table is a shared content model for projects, case studies, blog posts, architecture notes, experiments, and research logs. It uses fields like `type`, `locale`, `slug`, `status`, `published_at`, and a JSONB `metadata` column for flexible per-type fields.

Why it exists:

- One dashboard can manage all content types.
- One public API contract can serve all public content.
- One indexing pipeline can ingest everything into the knowledge layer.

Tradeoffs:

- JSONB gives flexibility but weaker strict schema guarantees.
- One table keeps the system simple, but very different content types may eventually want separate tables or stricter schemas.

### Knowledge Storage

Knowledge storage also lives in PostgreSQL, but with pgvector. The retrieval layer uses two tables:

- `knowledge_documents`: source-level record for an ingested CMS row, markdown file, or manual source.
- `knowledge_chunks`: chunk-level text plus vector embeddings used for similarity search.

Why it exists:

- The assistant needs retrievable, citation-friendly context.
- Chunk-level storage lets the system retrieve precise paragraphs rather than entire documents.
- `content_hash` makes ingestion idempotent, so unchanged content does not need to be embedded again.

### Media Storage

Media is local-first today. FastAPI serves uploaded media from a local directory. This is simple and inspectable for the current stage.

Future object storage strategy:

- Move media to S3, Cloudflare R2, GCS, or another object store.
- Serve media through a CDN.
- Store only metadata and URLs in PostgreSQL.
- Add image transformation and thumbnail generation later if needed.

Mapping to storage concepts:

- Relational database: `content_items`, admin users, `knowledge_documents`, `knowledge_chunks`.
- Object storage: future media storage.
- Search index: content and chunk indexes.
- Vector database: pgvector inside PostgreSQL.

Why PostgreSQL was chosen:

- Strong consistency for publishing and admin workflows.
- Good indexing support.
- JSONB for flexible metadata.
- pgvector keeps semantic retrieval inside the same operational database.
- Easier to inspect and operate at portfolio scale.

When NoSQL might make sense:

- Extremely schemaless content.
- High write throughput with loose consistency needs.
- Document-shaped content with very different structures.
- Multi-region write-heavy workloads.

How vector search differs from relational queries:

- Relational queries answer exact questions: published English projects, content by slug, dashboard item counts.
- Vector search answers meaning-based questions: content semantically close to a user query.

How content indexing works:

1. Take a CMS item or markdown file.
2. Normalize it into a source document.
3. Hash the canonical text.
4. If unchanged, skip ingestion.
5. Chunk the text.
6. Embed chunks.
7. Store chunks and embeddings in PostgreSQL with pgvector.

Interviewers may ask:

- Why store flexible metadata in JSONB instead of separate tables?
- Why combine source tracking and chunk tracking in two knowledge tables?
- Why keep embeddings in Postgres rather than a separate vector service?

## 3. Communication Patterns

The web app uses request/response everywhere, but the shape differs by surface.

### Frontend -> Backend

Public pages are server-rendered. Next.js server components call typed API wrappers, which call FastAPI public content routes. FastAPI queries PostgreSQL and returns published content.

### Dashboard -> API

The dashboard uses a same-origin BFF pattern:

```text
Browser -> Next.js /api/dashboard route -> FastAPI /admin route -> PostgreSQL
```

Why it exists:

- Browser code stays same-origin.
- Backend hostnames stay out of client code.
- HttpOnly cookies can be forwarded safely.
- The backend remains the authority for authorization.

### Public Site -> Content APIs

Public routes call content APIs for projects, case studies, blog posts, and architecture notes. The backend applies publish-state and locale filtering.

### AI Assistant -> Retrieval Pipeline

Assistant flow:

```text
User question
-> Next.js assistant route
-> FastAPI assistant route
-> embed query
-> pgvector retrieval
-> build prompt
-> LLM completion
-> answer + sources
```

Patterns present today:

- REST APIs: yes.
- Request/response: yes.
- Server Components: yes.
- ISR: yes.
- Dynamic Routes: yes.
- Polling: not meaningfully used.
- Streaming: minimal SSE exists, but token-level streaming is not fully implemented.
- Pub/Sub: not present.
- Background Jobs: not present as a separate runtime.

Tradeoffs:

- REST is simple and interview-friendly.
- BFF adds a layer but protects auth and topology.
- Inline assistant calls are easier to reason about but create provider latency.

How large systems evolve this:

- Add queues for async indexing.
- Add event-driven publish workflows.
- Add token streaming for assistant responses.
- Add pub/sub for cache invalidation and reindexing.

Interviewers may ask:

- Why use a BFF instead of direct browser-to-backend calls?
- Why use ISR instead of client-side fetching for public pages?
- Why is streaming only partial today?

## 4. Latency vs Throughput

The portfolio is optimized for low-latency reading, not high-write throughput.

### User requests

Public page reads are cached through ISR and CDN behavior. This gives low perceived latency for visitors.

### Content fetching

Next.js server components fetch published content from FastAPI. If cached by ISR, many requests do not need to hit the backend at all.

### AI retrieval

Assistant requests are slower because they involve:

1. Embedding the query.
2. Searching pgvector.
3. Building a prompt.
4. Calling the LLM provider.

### Publishing

Publishing can be slower because indexing happens inline. The system re-embeds or removes content from the knowledge index during admin create/update/delete flows.

Latency bottlenecks:

- LLM provider response time.
- Embedding provider calls.
- Cold backend starts.
- Database queries under load.
- Inline indexing during content writes.

Throughput bottlenecks:

- PostgreSQL connection pool.
- FastAPI worker count.
- Provider rate limits.
- Synchronous indexing path.

How caching improves performance:

- ISR serves cached HTML.
- Static assets are served by CDN.
- Content hashing prevents re-embedding unchanged content.
- Future retrieval caches can avoid repeated assistant work.

How large systems solve this:

- Queue background work.
- Cache hot reads.
- Add read replicas.
- Use provider-level retry and timeout policies.
- Separate low-latency read paths from expensive write/indexing paths.

Interviewers may ask:

- Which workflow has the worst latency?
- Which workflow has the worst throughput risk?
- How would you protect the database from assistant traffic?

## 5. Scaling Strategy

Assume the system grows from 100 visitors/month to 100,000 visitors/month.

### What scales automatically

- Static assets.
- ISR pages.
- CDN-served HTML.
- Next.js public rendering on a platform like Vercel.

### What becomes a bottleneck

- FastAPI under dynamic API traffic.
- PostgreSQL under public content and assistant reads.
- AI provider latency and rate limits.
- Inline indexing during content writes.

### What would fail first

Likely failure order:

1. AI assistant latency or provider limits.
2. Backend concurrency if many dynamic requests bypass cache.
3. PostgreSQL connection exhaustion.
4. Inline indexing slowing down admin publishing.
5. Local media storage becoming operationally fragile.

Scaling moves:

- Horizontal scaling: add more FastAPI instances.
- Vertical scaling: bigger database or backend instance.
- Read replicas: offload read-heavy public content queries.
- CDN usage: cache static pages, static assets, and media.
- Queue workers: move indexing and media work out of request path.

Tradeoffs:

- Horizontal scaling needs stateless services and shared storage.
- Read replicas introduce replication lag.
- Queues improve write latency but introduce eventual consistency.
- Separate vector databases improve retrieval scale but increase operational complexity.

Interviewers may ask:

- What scales first without code changes?
- What is the first real bottleneck?
- How would you scale reads without breaking editorial consistency?

## 6. Caching

Caching opportunities exist at multiple layers.

### Browser Cache

Used for static assets, images, fonts, and browser-level reuse.

### CDN Cache

The hosting platform can cache static assets and ISR-generated pages.

### ISR Cache

Next.js public content routes use incremental static regeneration. Pages refresh on a time window rather than on every request.

### Metadata Cache

Metadata is generated server-side. It benefits from the same rendering and caching behavior as the page.

### AI Retrieval Cache

Not fully implemented today, but useful future options include:

- Cache repeated user questions.
- Cache query embeddings.
- Cache retrieval results for common prompts.
- Cache final assistant answers carefully with source-version keys.

Caching patterns:

- Cache-aside: application reads from source, then cache stores the rendered result.
- Write-through: writes update the derived index immediately.
- Cache invalidation: currently mostly time-based through ISR; explicit publish revalidation would be the next step.

How publish/update should trigger revalidation:

1. Admin saves content.
2. Backend persists content.
3. Knowledge index is updated or cleared.
4. A revalidation event tells Next.js to refresh affected paths.
5. Sitemap and listing pages update.

Tradeoffs:

- Time-based ISR is simple but can show stale content briefly.
- Explicit invalidation is fresher but requires more wiring and failure handling.
- AI answer caching is risky unless tied to source versions.

Interviewers may ask:

- Why use time-based ISR instead of explicit invalidation?
- How do you avoid caching empty pages during backend outages?
- How would you cache assistant answers safely?

## 7. Load Balancing and Traffic Flow

Current deployment model:

```text
User -> Vercel / CDN -> Next.js -> FastAPI -> PostgreSQL
```

Potential production model:

```text
User
-> CDN
-> Load Balancer
-> Next.js web tier
-> FastAPI API tier
-> PostgreSQL primary/read replicas
-> Object storage/CDN for media
-> Queue workers for indexing
```

What Vercel does automatically:

- Serves static assets from edge locations.
- Caches static and ISR pages.
- Scales frontend rendering and route handlers.
- Handles TLS and deployment routing.

Reverse proxies:

- Sit in front of services.
- Terminate TLS.
- Route traffic.
- Add compression, caching, auth, or rate limiting.

Load balancing:

- Distributes requests across multiple backend instances.
- Requires stateless app instances or shared session state.
- Works well here because JWT sessions are stateless from the app-instance perspective.

Tradeoffs:

- More load balancers and proxies improve resilience but add debugging complexity.
- Stateless auth scales horizontally but makes revocation harder.

Interviewers may ask:

- Do you need sticky sessions?
- What does the load balancer route to?
- How does Vercel change the traffic model?

## 8. Database Design

### `content_items`

The central table stores all CMS content. Important fields:

- `id`: primary key.
- `type`: project, case study, article, architecture note, experiment, research log.
- `status`: draft, review, published, archived.
- `locale`: content language.
- `slug`: public identifier.
- `title`, `description`, `body`: content fields.
- `seo_title`, `seo_description`, `canonical_url`: SEO fields.
- `tags`, `categories`: JSONB arrays.
- `metadata`: JSONB type-specific fields.
- `ai_indexable`, `indexed_at`: indexing state.

Indexes and constraints:

- Unique `(type, locale, slug)`.
- Index on `(type, status)` for list/filter operations.
- Index on `(locale, slug)` for localized lookup.

### `knowledge_documents`

Stores one row per ingested source.

Fields include:

- source type.
- source id.
- title.
- summary.
- URL.
- tags.
- content hash.
- metadata.

### `knowledge_chunks`

Stores retrieval units.

Fields include:

- document id foreign key.
- chunk index.
- heading path.
- content.
- token estimate.
- vector embedding.

Normalization vs denormalization:

- `content_items` is normalized around common lifecycle fields.
- JSONB metadata is controlled denormalization.
- `knowledge_documents` duplicates source metadata for retrieval and citation.
- `knowledge_chunks` is denormalized for search performance.

Why shared content model:

- Simplifies dashboard CRUD.
- Simplifies public API shape.
- Simplifies ingestion pipeline.
- Avoids duplicating lifecycle logic.

Interviewers may ask:

- Why use one content table?
- Why does metadata live in JSONB?
- Which indexes matter most for public reads?
- How would you handle schema evolution?

## 9. Search and AI Retrieval

How content becomes searchable:

1. CMS content or markdown docs are selected as sources.
2. Source text is normalized.
3. Text is hashed.
4. Text is split into chunks.
5. Chunks are embedded.
6. Embeddings are stored in `knowledge_chunks`.
7. Queries embed the user question and perform nearest-neighbor search.

Chunking:

- Respects headings.
- Avoids splitting inside code fences.
- Uses overlap so context is not lost at boundaries.

Embeddings:

- Convert text into numeric vectors.
- Similar meanings produce nearby vectors.
- Query vectors are compared with chunk vectors.

Retrieval:

- Embed query.
- Search pgvector for nearest chunks.
- Apply top-k and similarity thresholds.
- Pack chunks into prompt context.
- Generate answer with citations.

Difference between search types:

- SQL search: exact structured filters.
- Full-text search: keyword/token matching.
- Semantic search: meaning-based retrieval.
- Vector search: mathematical nearest-neighbor implementation of semantic search.

Portfolio example:

- SQL can find all published architecture notes.
- Full-text search can find pages containing `FastAPI`.
- Semantic search can find relevant auth design notes even if the user says "how do dashboard sessions work?"

Tradeoffs:

- Vector search is powerful but harder to debug.
- Good chunking improves retrieval quality.
- Bad source content leads to bad assistant answers.
- Reranking is not implemented yet but would improve precision.

Interviewers may ask:

- Why chunk by headings?
- Why include title and heading in embedding input?
- How would you evaluate retrieval quality?
- Why not use Elasticsearch first?

## 10. Availability and Reliability

Single points of failure:

- PostgreSQL.
- FastAPI backend.
- AI provider.
- Embedding provider.
- Local media storage.
- Vercel/hosting platform.

Database failures:

- Public dynamic content fetches fail.
- Dashboard cannot save or edit.
- Assistant retrieval cannot run.
- Cached ISR pages may still serve previous content if already generated.

AI provider failures:

- Assistant should degrade gracefully.
- Public content should still work.
- Indexing failures should not block content persistence permanently.

Backend failures:

- Public pages may rely on cached ISR output.
- Dashboard operations fail.
- Assistant fails.

Availability concepts:

- Two nines: about 7.3 hours downtime/month.
- Three nines: about 43 minutes/month.
- Four nines: about 4.3 minutes/month.

Fallback strategies:

- Serve cached public pages.
- Return assistant unavailable messages.
- Log indexing failures and allow manual reindex.
- Keep content writes separate from AI availability where possible.

Tradeoffs:

- Simpler systems have fewer moving parts but fewer failover mechanisms.
- More reliable systems need redundancy, queues, retries, and monitoring.

Interviewers may ask:

- How does the system degrade when AI is down?
- What happens if Postgres is unavailable?
- How do you avoid losing content when indexing fails?

## 11. Security Architecture

Authentication:

- Admin login uses email/password.
- Passwords are hashed.
- Backend returns a signed JWT.
- Next.js stores it in an HttpOnly cookie.

Authorization:

- Admin routes require the current admin user.
- Public content routes only expose published content.
- Dashboard pages are gated by the Next.js proxy, but backend auth remains the real authority.

Admin routes:

- `/admin/content` for CRUD.
- `/admin/media` for media.
- `/auth/login` and `/auth/session` for admin session flow.

Dashboard protection:

- Browser cannot access token from JavaScript.
- Same-origin BFF forwards auth to backend.
- Backend validates signature, expiry, and active user.

Rate limiting:

- Not a major visible feature today.
- Should be added for login, assistant, and admin mutation routes.

Input validation:

- FastAPI and Pydantic validate request bodies.
- SQLAlchemy repositories centralize persistence rules.

Prompt injection risks:

- Malicious indexed content could try to override the assistant prompt.
- User queries could ask the assistant to ignore instructions.
- The assistant should answer only from retrieved context and avoid arbitrary tool execution.

RAG security risks:

- Leaking draft/private content if indexing filters are wrong.
- Citing untrusted sources.
- Prompt injection from content itself.
- Over-trusting generated answers.

HTTPS, secrets, and env vars:

- TLS should be handled by hosting platforms.
- Secrets belong in environment variables.
- API keys and JWT secrets must never be committed.

Interviewers may ask:

- Why HttpOnly cookies?
- How do you protect admin routes?
- What is prompt injection in RAG?
- How would you rate-limit the assistant?

## 12. Hashing

Places hashing exists:

### Password Hashing

Admin passwords are hashed with PBKDF2-HMAC-SHA256 using a salt and many iterations. This protects stored passwords if the database is leaked.

### Content Hashing

The ingestion pipeline hashes canonical source text. If the hash matches an existing document, ingestion is skipped. This avoids unnecessary re-embedding and makes ingestion idempotent.

### Cache Keys

Not heavily exposed as explicit application code today, but cache keys are conceptually used by ISR, CDN caches, and future retrieval caches.

### ETags

Not a clear first-class implementation today. Future API responses and media responses could use ETags for conditional requests.

Tradeoffs:

- PBKDF2 is acceptable, though Argon2 or bcrypt are also common choices.
- Content hashes are useful for idempotency, not security.
- Cache keys must include source version or updated timestamp to avoid stale AI answers.

Interviewers may ask:

- Why do passwords need salts?
- Why hash content before indexing?
- How would you design cache keys for assistant answers?

## 13. Configuration Management

Configuration is environment-driven.

Examples:

- Site URL.
- Backend API URL.
- Database URL.
- JWT secret.
- Admin bootstrap credentials.
- Media path.
- OpenAI and Groq keys.
- RAG tuning values.

Why config should not be hardcoded:

- Local, staging, and production have different URLs.
- Secrets cannot live in code.
- Model settings and retrieval thresholds may need tuning without redeploying business logic.
- Hardcoded localhost URLs break production.

Boundaries:

- Frontend public config: safe browser-visible values.
- Backend secret config: keys, database, JWT signing.
- Feature config: RAG top-k, chunk size, thresholds, provider choice.

Tradeoffs:

- Env vars are simple but can become hard to manage at scale.
- Larger systems use secret managers and typed config validation.

Interviewers may ask:

- Which config can be public?
- Which config must fail fast in production?
- How do you avoid leaking local URLs into production?

## 14. Logging and Monitoring

Current observability is basic. The backend configures logging and logs assistant/indexing failures. There is not yet a full observability platform.

What should be logged:

- Request ID.
- Route name.
- Status code.
- Latency.
- Admin user id for admin mutations.
- Content publish/update/delete events.
- Indexing success/failure.
- Assistant retrieval and LLM failures.

What should not be logged:

- Passwords.
- JWTs.
- API keys.
- Full secrets.
- Sensitive prompts or private unpublished content.

Recommended monitoring architecture:

```text
Next.js logs
FastAPI structured logs
PostgreSQL metrics
AI provider latency/cost metrics
Error tracker
Tracing system
Dashboard alerts
```

Correlation IDs:

- A request ID should be generated at the edge or web layer.
- It should be passed to FastAPI.
- FastAPI should include it in DB and AI logs.

Metrics:

- Page render latency.
- Backend request latency.
- Database query duration.
- Assistant answer success rate.
- Retrieval empty-result rate.
- Embedding/LLM cost.
- Indexing failures.

Interviewers may ask:

- What logs are useful during an outage?
- How would you trace a user request end-to-end?
- How do you monitor AI answer quality?

## 15. Background Processing

Current state:

- Content writes happen through admin routes.
- AI indexing runs inline on content create/update/delete.
- Bulk reindexing is available through admin endpoints or scripts.
- There is no separate queue-backed worker runtime yet.

Why this exists:

- Simpler operational model.
- Easier to debug.
- Good enough for low content volume.

Tradeoffs:

- Saves can wait on embedding calls.
- Failures need manual retry or reindex.
- Large reindexing jobs are not isolated from request-serving infrastructure.

How large systems handle indexing:

```text
Content saved
-> publish event emitted
-> queue message created
-> worker processes content
-> embeddings generated
-> search/vector index updated
-> status recorded
```

Job queue concepts:

- Retry policy.
- Dead-letter queue.
- Idempotent job keys.
- Backoff.
- Worker concurrency limits.

What should move to background first:

- Embedding generation.
- Full reindex jobs.
- Media processing.
- Sitemap refresh and cache revalidation.

Interviewers may ask:

- Which operations belong in the request path?
- Which operations should be queued?
- How do you make indexing idempotent?

## 16. SEO Architecture

The SEO layer includes:

- Metadata generation.
- Structured data / JSON-LD.
- Canonical URLs.
- Locale alternates.
- Sitemap generation.
- Robots rules.
- ISR for crawlable content.

Why metadata generation matters:

- Search engines need titles, descriptions, canonical URLs, and Open Graph tags.
- Recruiters and social links need good previews.
- Dynamic content pages need per-item metadata.

Canonical URLs:

- The system resolves a site origin from configuration.
- It builds absolute URLs for metadata, sitemap, and robots.

Sitemap:

- Includes static routes.
- Includes dynamic projects, case studies, blog posts, and architecture notes.
- Uses `lastModified` values from content.
- Excludes routes like the assistant that are interactive rather than indexable content.

Robots:

- Allows public site crawling.
- Disallows dashboard, login, and API routes.

Why ISR was chosen:

- Crawlers get real HTML.
- Visitors get fast pages.
- Content can update without full redeploy.
- Build time stays controlled as content grows.

SEO tradeoffs:

- ISR can show stale content briefly.
- Dynamic routes depend on backend availability during generation.
- Canonical misconfiguration can create wrong production URLs.

Google crawling behavior:

- Google prefers stable, crawlable HTML.
- Sitemaps help discovery but do not guarantee indexing.
- Canonical URLs help avoid duplicate content across locales and paths.

Interviewers may ask:

- Why is ISR good for SEO?
- How do canonical URLs work?
- How does the sitemap discover CMS content?

## 17. System Design Interview Questions

### Public Web and Rendering

Beginner:

- Why use Next.js for this portfolio?
- What is server-side rendering?
- What is ISR?

Mid-level:

- Why use server components for content fetching?
- What happens when the backend is down during regeneration?
- How do dynamic routes get generated?

Senior:

- How would you choose between static generation, ISR, SSR, and CSR?
- How would you scale this to 100,000 visitors/month?
- How would you protect SEO during backend failures?

### CMS and Content Model

Beginner:

- What is a CMS?
- Why store content in a database?
- What is a slug?

Mid-level:

- Why use `status` and `published_at`?
- Why use a shared `content_items` table?
- How do locale and slug uniqueness work?

Senior:

- How would you migrate from shared table to per-type tables?
- How would you design content versioning?
- How would you support scheduled publishing?

### Auth and Dashboard

Beginner:

- What is authentication?
- What is authorization?
- Why not store tokens in localStorage?

Mid-level:

- Why use HttpOnly cookies?
- Why does the backend validate every admin request?
- How does the BFF pattern improve security?

Senior:

- How would you add session revocation?
- How would you add RBAC?
- How would you support SSO?

### Search and AI Retrieval

Beginner:

- What is an embedding?
- What is semantic search?
- What is RAG?

Mid-level:

- Why chunk documents?
- Why use pgvector?
- How are citations produced?

Senior:

- How would you evaluate retrieval quality?
- How would you handle prompt injection?
- How would you design multi-stage retrieval with reranking?

### Deployment and Reliability

Beginner:

- Why separate frontend and backend deployments?
- What is a CDN?
- What is a database migration?

Mid-level:

- What happens if the database is down?
- What happens if the AI provider is down?
- How do environment variables affect deployment?

Senior:

- How would you build multi-region read scaling?
- How would you design a background worker topology?
- How would you define SLOs for this system?

## 18. Architectural Strengths and Weaknesses

### Strengths

- Clear frontend/backend split.
- Same-origin BFF keeps browser auth simple.
- Shared content model reduces duplication.
- PostgreSQL + JSONB + pgvector is pragmatic.
- Assistant is grounded in real content.
- SEO is treated as architecture, not decoration.
- Deployment model is compact and realistic.

### Weaknesses

- Inline indexing increases write latency.
- Local media storage is not durable enough for larger production use.
- No queue-backed background workers.
- No full retrieval evaluation system.
- No explicit rate limiting layer is obvious.
- No token-level assistant streaming yet.
- Cache invalidation is mostly time-based.

### Technical Debt

- Add explicit publish-triggered revalidation.
- Move media to object storage.
- Introduce a worker queue.
- Add structured observability.
- Add rate limiting.
- Add assistant quality evaluation.

### Scalability Risks

- PostgreSQL connection pressure.
- AI provider rate limits.
- Large reindex jobs blocking request handling.
- Local media not scaling across instances.

### Security Risks

- Prompt injection through indexed content.
- Missing or weak rate limiting.
- JWT revocation limitations.
- Misconfigured production secrets.

### Operational Risks

- Manual or inline indexing can fail silently without strong alerts.
- Build or ISR failures can hide behind cached content.
- Provider outages can degrade assistant behavior.

What should be improved next:

1. Add explicit Next.js revalidation after publish.
2. Move indexing to a queue-backed worker.
3. Move media to object storage.
4. Add structured logs, tracing, and alerts.
5. Add assistant retrieval evaluation.
6. Add rate limiting for login and assistant endpoints.

## 19. Final Architecture Diagram

```text
Users
  |-- Public visitors
  |-- Recruiters
  |-- AI assistant users
  |-- Dashboard admins

                 +--------------------------+
                 |        CDN / Edge        |
                 |  static assets, ISR HTML |
                 +------------+-------------+
                              |
                              v
                     +----------------+
                     |    Next.js     |
                     |    apps/web    |
                     |                |
                     | Public pages   |
                     | Content RSC    |
                     | SEO layer      |
                     | BFF / proxy    |
                     | Dashboard UI   |
                     +-------+--------+
                             |
                             | same-origin /api
                             v
                     +----------------+
                     |    FastAPI     |
                     |    apps/api    |
                     |                |
                     | /content       |
                     | /admin         |
                     | /auth          |
                     | /assistant     |
                     | /search        |
                     +---+-------+----+
                         |       |
                         |       |
                         v       v
                +-------------+  +------------------+
                | PostgreSQL  |  | Local media      |
                | content_*   |  | storage /media   |
                | admin users |  +------------------+
                | knowledge_* |
                +------+------+ 
                       |
                       v
             +---------------------+
             | Knowledge / Vector  |
             | pgvector chunks     |
             | content_hash sync   |
             +---------+-----------+
                       |
                       v
             +---------------------+
             | AI Assistant Layer  |
             | embed -> retrieve   |
             | prompt -> generate  |
             +---------------------+

Background workers: not a separate runtime today; indexing is inline now and should become queued if the system grows.
SEO layer: metadata, canonical URLs, sitemap, robots, ISR, JSON-LD.
```
