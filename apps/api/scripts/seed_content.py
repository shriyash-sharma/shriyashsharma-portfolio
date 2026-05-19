import asyncio
import sys
from pathlib import Path

from sqlalchemy import delete, select

sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.db.models.content import ContentItem, ContentType, PublishingStatus
from app.db.session import AsyncSessionLocal

# Portfolio seed content aligned with public home-page highlights and case studies.
# STALE_ITEMS removes placeholder slugs superseded by the entries below.

SEED_ITEMS = [
    {
        "type": ContentType.PROJECT,
        "slug": "ai-engineering-portfolio-platform",
        "title": "AI-powered engineering portfolio platform",
        "description": (
            "A monorepo portfolio platform that combines Next.js, FastAPI, PostgreSQL, pgvector, and a grounded assistant to turn engineering work into an explorable knowledge system."
        ),
        "body": """
## Overview

This platform is not designed as a static portfolio. It is structured as a small product system with a public web application, a typed backend, a content model, and a retrieval layer that turns engineering writing into an explorable assistant surface.

## What it includes

- Next.js App Router frontend with public pages, content routes, and a same-origin assistant proxy
- FastAPI backend with typed content delivery, admin workflows, and assistant orchestration
- PostgreSQL content store with pgvector-backed retrieval
- markdown and CMS ingestion into a shared knowledge base

## Why it matters

The interesting part is not the technology list. It is the combination of editorial content, architecture notes, public case studies, and retrieval-backed guidance inside one coherent system. That makes the portfolio behave more like an engineering product than a brochure.

## Key decisions

- keep identity, branding, SEO defaults, and navigation static in config
- keep projects, case studies, articles, and experiments in the content system
- use markdown docs for deep architecture material that should feed retrieval
- keep the assistant grounded in indexed project and architecture content instead of generic chat behavior

## Current tradeoffs

- ingestion is still manual rather than event-driven
- media remains local-first
- streaming and retrieval evaluation are deferred until the platform needs them
""".strip(),
        "tags": ["Next.js", "FastAPI", "pgvector", "RAG"],
        "categories": ["project", "ai", "architecture"],
        "extra": {
            "stack": "Next.js, TypeScript, FastAPI, PostgreSQL, pgvector",
            "system_detail": "Config-driven identity + CMS content + markdown ingestion + grounded assistant",
            "featured": True,
            "caseStudy": "/case-studies/building-an-ai-native-engineering-portfolio",
        },
        "seo_title": "AI-powered engineering portfolio platform",
        "seo_description": "How this portfolio combines content systems, architecture docs, and grounded retrieval into an AI-native engineering showcase.",
        "published_at": "2026-05-19",
    },
    {
        "type": ContentType.PROJECT,
        "slug": "enterprise-booking-frontend-systems",
        "title": "Enterprise booking frontend systems",
        "description": (
            "Frontend architecture work for enterprise booking-style workflows where reliability, handoff quality, and incremental change mattered more than novelty."
        ),
        "body": """
## Context

This entry represents the kind of enterprise booking and workflow-heavy systems I have worked on publicly without exposing NDA-sensitive project details.

## Engineering focus

- React and TypeScript implementation across customer-facing flows
- collaboration with backend teams around contract stability and failure states
- incremental UI modernization instead of risky rewrites
- release coordination and delivery quality practices in sprint-based teams

## What made the work meaningful

Booking-style products are rarely impressive because of a single technical trick. They succeed when validation, state transitions, partial failures, and edge cases are handled consistently. The engineering work was about making those flows easier to trust and easier to evolve.
""".strip(),
        "tags": ["React", "TypeScript", "Frontend Systems"],
        "categories": ["project", "enterprise", "frontend"],
        "extra": {
            "stack": "React, TypeScript, REST APIs",
            "system_detail": "Customer-facing workflow architecture with frontend/backend coordination",
            "featured": True,
            "caseStudy": "/case-studies/frontend-architecture-for-enterprise-booking-workflows",
        },
        "seo_title": "Enterprise booking frontend systems",
        "seo_description": "Public-facing summary of frontend architecture work across booking-style enterprise workflows.",
        "published_at": "2026-05-19",
    },
    {
        "type": ContentType.PROJECT,
        "slug": "search-and-data-quality-tooling",
        "title": "Search and data-quality tooling for enterprise product data",
        "description": (
            "Enterprise search, filtering, and data-quality workflows built around product information systems and the daily realities of large structured datasets."
        ),
        "body": """
## Context

At Contentserv I worked on product information and search-heavy workflows where frontend usability depended directly on how well the system handled filtering, search state, and backend integration.

## Publicly shareable scope

- search and filter experience design
- reusable UI functionality around complex data views
- backend integration with Node.js, Express, Python, MySQL, and ElasticSearch-adjacent workflows
- product tooling for data quality and operational correctness

## Why this work matters

Enterprise tooling only feels simple when state, performance, and data integrity have already been handled. That kind of software taught me to value operational clarity over flashy interfaces.
""".strip(),
        "tags": ["Search", "Data Quality", "Enterprise Tooling"],
        "categories": ["project", "search", "enterprise"],
        "extra": {
            "stack": "React, JavaScript, Node.js, Python, MySQL",
            "system_detail": "Search flows, filtering systems, and product data tooling",
            "featured": False,
        },
        "seo_title": "Search and data-quality tooling",
        "seo_description": "Frontend and integration work across enterprise search, filtering, and product data workflows.",
        "published_at": "2026-05-19",
    },
    {
        "type": ContentType.CASE_STUDY,
        "slug": "building-an-ai-native-engineering-portfolio",
        "title": "Building an AI-native engineering portfolio without turning it into a gimmick",
        "description": (
            "How this platform was structured as a real engineering system with CMS content, markdown knowledge sources, and a grounded assistant instead of a static portfolio shell."
        ),
        "body": """
## Problem

Most engineering portfolios show finished screens, list technologies, and stop there. That format hides the interesting work: architecture choices, delivery tradeoffs, and how the system evolved.

## Architecture approach

I treated the portfolio as a compact product platform:

- Next.js App Router for the public experience
- FastAPI for content delivery and assistant orchestration
- PostgreSQL for structured content
- pgvector for semantic retrieval
- markdown architecture docs as the primary long-form knowledge layer

## Implementation decisions

- keep identity, branding, and SEO defaults static in config
- keep projects, articles, and case studies in the CMS-compatible content model
- ingest both CMS records and markdown docs into one retrieval surface
- make the assistant behave like an engineering guide, not a general chatbot

## Tradeoffs

- manual ingestion keeps the system simpler today, but delays real-time freshness
- the assistant is grounded and useful, but intentionally narrow in scope
- local-first media handling is operationally simple, but not the final deployment story

## Why this matters

The platform becomes more trustworthy when the architecture itself is visible. Recruiters can read case studies, inspect decisions, and query the assistant against the same underlying knowledge base.

## Future scope

- streaming responses
- automated reindexing after content changes
- retrieval evaluation and observability
""".strip(),
        "tags": ["RAG", "Portfolio", "Architecture"],
        "categories": ["case-study", "ai", "platform"],
        "extra": {
            "read_time": "9 min",
            "system_area": "AI-native product architecture",
        },
        "seo_title": "AI-native engineering portfolio case study",
        "seo_description": "Case study on turning a portfolio into a CMS-backed engineering knowledge system with grounded retrieval.",
        "published_at": "2026-05-19",
    },
    {
        "type": ContentType.CASE_STUDY,
        "slug": "frontend-architecture-for-enterprise-booking-workflows",
        "title": "Frontend architecture for enterprise booking workflows",
        "description": (
            "A public case study on how to structure booking-style frontend systems for maintainability, predictable releases, and cross-team delivery."
        ),
        "body": """
## Problem

Booking and workflow-heavy applications accumulate state quickly: validation, conditional steps, partial failures, payment or confirmation edges, and coordination with backend availability rules.

## Implementation approach

The frontend work focused on keeping those flows understandable:

- TypeScript-first modeling around UI and API boundaries
- reusable form and validation patterns instead of ad hoc per-screen logic
- explicit handling for loading, retry, and fallback states
- close collaboration with backend teams on contract changes and release timing

## Technical decisions

- prefer incremental refactors to large rewrites
- make component boundaries reflect workflow responsibilities
- use code reviews to keep edge-case handling consistent across the product

## Constraints

The interesting constraint in enterprise systems is rarely raw scale. It is the cost of a broken edge case after release. That pushes the architecture toward predictable change, not novelty.

## Future improvements

- stronger design-system extraction
- more automated contract checks between frontend and backend
- clearer operational feedback for support and QA teams
""".strip(),
        "tags": ["React", "TypeScript", "Enterprise Frontend"],
        "categories": ["case-study", "frontend", "delivery"],
        "extra": {
            "read_time": "8 min",
            "system_area": "workflow architecture",
        },
        "seo_title": "Frontend architecture for enterprise booking workflows",
        "seo_description": "Case study on building resilient frontend architecture for workflow-heavy enterprise applications.",
        "published_at": "2026-05-19",
    },
    {
        "type": ContentType.CASE_STUDY,
        "slug": "same-origin-coordination-between-nextjs-and-fastapi",
        "title": "Same-origin coordination between Next.js and FastAPI",
        "description": (
            "Why the platform uses a same-origin proxy layer between the web app and the API, and what that simplifies for auth, routing, and assistant delivery."
        ),
        "body": """
## Problem

As soon as a frontend product grows beyond static pages, auth, API integration, timeouts, and browser-visible backend URLs start creating friction.

## Architecture choice

The platform uses a same-origin proxy pattern:

- browser requests go to the Next.js app
- Next.js route handlers forward selected requests to FastAPI
- backend URLs and auth-sensitive coordination stay out of the browser layer

## Why this was chosen

- simpler browser integration
- cleaner deployment boundaries
- easier room for stricter gateway behavior later
- assistant requests can be centralized in one route instead of leaking provider-specific behavior to the frontend

## Tradeoffs

- an extra proxy hop adds complexity in the web app
- route handlers need clear ownership to avoid becoming a second backend

## Future scope

- more explicit retry and timeout policies per route class
- better structured observability between proxy and API layers
""".strip(),
        "tags": ["Next.js", "FastAPI", "BFF"],
        "categories": ["case-study", "architecture", "integration"],
        "extra": {
            "read_time": "7 min",
            "system_area": "frontend/backend coordination",
        },
        "seo_title": "Same-origin coordination between Next.js and FastAPI",
        "seo_description": "Case study on using a BFF-style same-origin proxy to simplify a modern web and API stack.",
        "published_at": "2026-05-19",
    },
    {
        "type": ContentType.CASE_STUDY,
        "slug": "search-and-filtering-for-enterprise-product-tooling",
        "title": "Search and filtering for enterprise product tooling",
        "description": (
            "A practical look at building search-heavy UI flows where data quality, filtering behavior, and backend consistency matter as much as raw speed."
        ),
        "body": """
## Problem

Enterprise search interfaces break trust quickly when filters behave unpredictably, results feel inconsistent, or users cannot tell whether the issue is query logic or data quality.

## Implementation approach

- build search and filtering as explicit product workflows, not just reusable widgets
- align frontend state with backend query semantics
- reduce ambiguity around applied filters, empty states, and data quality gaps

## What made the work hard

The hard part was not rendering tables. It was making the system easier to understand for users who depended on it to do operational work every day.

## Why this still matters

That experience translates directly into later work on semantic retrieval and AI systems. Good retrieval starts with disciplined information architecture and honest feedback states.
""".strip(),
        "tags": ["Search", "Filtering", "Enterprise UX"],
        "categories": ["case-study", "search", "tooling"],
        "extra": {
            "read_time": "7 min",
            "system_area": "search workflows",
        },
        "seo_title": "Search and filtering for enterprise product tooling",
        "seo_description": "Case study on building trustworthy search and filtering experiences in enterprise product tooling.",
        "published_at": "2026-05-19",
    },
    {
        "type": ContentType.ARTICLE,
        "slug": "heading-aware-embeddings-improve-rag-quality",
        "title": "A small RAG quality lever: embedding the heading, not just the paragraph",
        "description": (
            "Why short chunks often underperform in semantic retrieval, and how adding document and heading context improved retrieval quality in this platform."
        ),
        "body": """
## The issue

Chunking markdown into short passages is useful, but short passages lose the structural context that often explains what the text is actually about.

## What changed here

Instead of embedding only `chunk.content`, the ingestion pipeline now embeds:

- document title
- heading path
- chunk content

The stored chunk body remains unchanged for display and citation. Only the embedding input is enriched.

## Why this matters

That change improved retrieval for queries like current limitations, vector search, and session revocation because the semantic model could finally see the section title that made the paragraph meaningful.

## Lesson

Many RAG quality issues come from impoverished retrieval inputs, not from the LLM. Fix retrieval first.
""".strip(),
        "tags": ["RAG", "Embeddings", "Retrieval Quality"],
        "categories": ["article", "ai", "engineering-notes"],
        "extra": {"read_time": "5 min"},
        "seo_title": "Heading-aware embeddings for practical RAG",
        "seo_description": "Why embedding document and heading context can materially improve retrieval quality in a manual RAG pipeline.",
        "published_at": "2026-05-19",
    },
    {
        "type": ContentType.ARTICLE,
        "slug": "shipping-frontend-systems-with-clear-boundaries",
        "title": "Shipping frontend systems with clearer boundaries",
        "description": (
            "Notes on where frontend systems usually become hard to maintain, and what boundary decisions help delivery hold up over time."
        ),
        "body": """
## Good frontend systems are mostly boundary work

Most frontend pain is not caused by React itself. It is caused by muddy responsibilities between routes, components, shared utilities, backend contracts, and release ownership.

## What helps

- make shared abstractions earn their existence
- keep workflow-specific logic close to the workflow
- treat API states as first-class UI states
- use review and planning rituals to keep architecture decisions visible

## Why this matters in product teams

The goal is not elegant component trees. The goal is a codebase that can absorb change without making every delivery cycle slower than the last one.
""".strip(),
        "tags": ["Frontend Architecture", "React", "Delivery"],
        "categories": ["article", "frontend", "engineering-notes"],
        "extra": {"read_time": "4 min"},
        "seo_title": "Shipping frontend systems with clearer boundaries",
        "seo_description": "Practical notes on boundary decisions that make frontend systems easier to ship and maintain.",
        "published_at": "2026-05-19",
    },
    {
        "type": ContentType.ARTICLE,
        "slug": "when-ai-belongs-in-product-workflows",
        "title": "When AI belongs in product workflows, and when it does not",
        "description": (
            "A practical view of AI integration from a product engineering perspective: useful where it improves navigation, summarization, or retrieval, and harmful when it weakens trust."
        ),
        "body": """
## The wrong way to add AI

Adding a chatbot to a product without clear boundaries usually produces noise, false confidence, and brittle UX.

## The more useful pattern

AI works better when it has a specific job:

- summarize a body of content
- retrieve relevant information faster
- explain a system using grounded sources
- reduce friction in an otherwise structured workflow

## The engineering constraint

The real job is not to call a model. It is to decide what the system may say, what it must cite, and where it should fail safely instead of improvising.
""".strip(),
        "tags": ["AI Integration", "Product Engineering", "RAG"],
        "categories": ["article", "ai", "product"],
        "extra": {"read_time": "5 min"},
        "seo_title": "When AI belongs in product workflows",
        "seo_description": "A practical engineering view on where AI product features genuinely help and where they erode trust.",
        "published_at": "2026-05-19",
    },
    {
        "type": ContentType.ARCHITECTURE_NOTE,
        "slug": "manual-rag-over-general-frameworks",
        "title": "Manual RAG over general-purpose frameworks",
        "description": (
            "A short architecture note on why this platform uses a small direct RAG implementation instead of reaching for a heavier orchestration layer."
        ),
        "body": """
## Decision

Use a direct retrieval pipeline built from FastAPI, pgvector, explicit prompts, and small provider abstractions.

## Why

- the system behavior stays easy to inspect
- retrieval bugs are easier to diagnose
- the code path from query to embedding to retrieval to generation stays short

## What is deferred

- agents
- memory
- orchestration frameworks
- multi-stage retrieval pipelines

Those tools may become useful later, but they are not necessary to make this platform credible today.
""".strip(),
        "tags": ["Architecture", "RAG", "FastAPI"],
        "categories": ["architecture-note", "ai"],
        "extra": {"read_time": "4 min"},
        "seo_title": "Manual RAG over general-purpose frameworks",
        "seo_description": "Architecture note on choosing a direct, inspectable RAG pipeline over heavier orchestration frameworks.",
        "published_at": "2026-05-19",
    },
    {
        "type": ContentType.EXPERIMENT,
        "slug": "retrieval-tuning-notes",
        "title": "Retrieval tuning notes: chunk context, thresholds, and recall",
        "description": (
            "Short experiment notes from improving retrieval quality in the portfolio assistant by enriching embeddings and adjusting recall thresholds."
        ),
        "body": """
## Change log

1. Enriched embedding input with document title and heading path
2. Lowered minimum similarity threshold
3. Increased top-k retrieval window

## Observed result

Queries about current limitations and architecture sections began retrieving the correct document more consistently instead of only broader summaries.

## Next experiments

- compare retrieval before and after reranking
- add a lightweight evaluation set for known questions
- track source coverage per answer
""".strip(),
        "tags": ["Experiment", "Retrieval", "pgvector"],
        "categories": ["experiment", "ai"],
        "extra": {"read_time": "3 min"},
        "seo_title": "Retrieval tuning notes",
        "seo_description": "Experiment notes from tuning retrieval quality in the portfolio assistant.",
        "published_at": "2026-05-19",
    },
]

STALE_ITEMS = [
    (ContentType.PROJECT, "platform-infrastructure-rewrite"),
    (ContentType.CASE_STUDY, "monorepo-scaling"),
    (ContentType.CASE_STUDY, "testing-case-study"),
    (ContentType.ARTICLE, "retrieval-ready-content"),
]


def _upsert_fields(item: dict) -> dict:
    return {
        **item,
        "locale": "en",
        "status": PublishingStatus.PUBLISHED,
        "body": item.get("body"),
        "seo_title": item.get("seo_title"),
        "seo_description": item.get("seo_description"),
        "canonical_url": item.get("canonical_url"),
        "ai_indexable": item.get("ai_indexable", True),
        "published_at": item.get("published_at", "2026-05-19"),
    }


async def upsert_item(session, item: dict) -> None:
    exists = await session.scalar(
        select(ContentItem).where(
            ContentItem.type == item["type"],
            ContentItem.locale == "en",
            ContentItem.slug == item["slug"],
        )
    )

    fields = _upsert_fields(item)
    if exists:
        for key, value in fields.items():
            setattr(exists, key, value)
        return

    session.add(ContentItem(**fields))


async def seed() -> None:
    async with AsyncSessionLocal() as session:
        for content_type, slug in STALE_ITEMS:
            await session.execute(
                delete(ContentItem).where(
                    ContentItem.type == content_type,
                    ContentItem.locale == "en",
                    ContentItem.slug == slug,
                )
            )

        for item in SEED_ITEMS:
            await upsert_item(session, item)

        await session.commit()


if __name__ == "__main__":
    asyncio.run(seed())
