#!/usr/bin/env python3
"""Generate a precomputed dataset for the Semantic Search Playground.

Usage:
  python scripts/generate-semantic-search-dataset.py
  python scripts/generate-semantic-search-dataset.py --mode openai --api-key "$OPENAI_API_KEY"

Notes:
- Default mode is deterministic (no external API, zero cost, fast).
- OpenAI mode embeds each dataset row once and saves vectors for runtime reuse.
"""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import sys
import urllib.error
import urllib.request
from pathlib import Path
from typing import Iterable

DIMENSION = 64
DEFAULT_OUTPUT = Path("apps/web/src/lib/ai-lab/semantic-search-dataset.json")
OPENAI_URL = "https://api.openai.com/v1/embeddings"

DATASET_TEXTS = [
    "FastAPI is a modern Python framework for building backend APIs with high performance and automatic OpenAPI docs.",
    "Next.js supports server rendering, static generation, and route handlers for production web applications.",
    "PostgreSQL is a relational database known for ACID transactions, reliability, and powerful SQL features.",
    "Redis is an in-memory data store used for caching, pub-sub messaging, and low-latency workloads.",
    "RAG combines retrieval and generation so language models can answer with grounded context.",
    "Embeddings convert semantic meaning into numeric vectors used for similarity search.",
    "Semantic search retrieves content by intent and meaning rather than exact keyword overlap.",
    "Vector databases index embeddings to support nearest-neighbor retrieval for AI applications.",
    "AI agents coordinate planning, tools, and memory to solve multi-step tasks.",
    "TeamShastra builds practical software products focused on engineering quality and delivery speed.",
    "SaaS architecture balances product velocity, reliability, tenancy isolation, and observability.",
    "System design is about scalability, fault tolerance, consistency, and maintainable service boundaries.",
    "FastAPI dependency injection helps structure auth, configuration, and shared services cleanly.",
    "Asynchronous Python endpoints improve throughput for I/O-heavy backend API systems.",
    "PostgreSQL indexing strategies can dramatically improve query latency under production load.",
    "Redis rate limiting protects backend APIs from abuse and burst traffic.",
    "RAG pipelines start with chunking documents into retrievable semantic units.",
    "Embedding models capture related meaning, so synonyms can match even without shared words.",
    "Cosine similarity measures angle between vectors to estimate semantic relatedness.",
    "Keyword search excels when exact identifiers, names, or literal phrases must match.",
    "Hybrid retrieval combines lexical matching and semantic vectors for robust search quality.",
    "Next.js App Router supports nested layouts, server components, and streaming responses.",
    "Backend API development often involves schema validation, auth, logging, and error handling.",
    "A semantic retrieval layer helps assistants find the right evidence before generation.",
    "Vector retrieval enables FAQ matching when users phrase the same question differently.",
    "Production RAG systems typically include ingestion, embedding, indexing, retrieval, and answer synthesis.",
    "Chunk overlap can preserve context continuity between adjacent document segments.",
    "Smaller chunks improve precision while larger chunks preserve broader context windows.",
    "PostgreSQL can support SaaS workloads with partitioning, replicas, and migration discipline.",
    "Redis caches hot responses to reduce database load and improve tail latency.",
    "AI engineering requires balancing model quality, latency, reliability, and cost.",
    "System design interviews often cover queues, backpressure, and eventual consistency tradeoffs.",
    "FastAPI works well with Pydantic models for request parsing and strict typing.",
    "Next.js metadata APIs improve SEO through canonical tags, structured data, and social previews.",
    "Semantic ranking can return relevant content even when queries omit exact domain terminology.",
    "Keyword-only retrieval can miss documents that use alternative wording or abbreviations.",
    "Embeddings are central to recommendation systems, clustering, and semantic document search.",
    "Vector similarity search is useful for support bots, enterprise search, and knowledge assistants.",
    "AI agents call tools, observe outputs, and iteratively refine their plan.",
    "RAG reduces hallucination by grounding model responses in retrieved source passages.",
    "SaaS platforms need observability signals such as logs, metrics, traces, and SLOs.",
    "A robust API layer includes authentication, authorization, validation, and auditability.",
    "PostgreSQL foreign keys enforce relational integrity across connected domain entities.",
    "Redis streams and pub-sub can drive event-driven communication between services.",
    "Context windows are finite, so retrieval helps fit only relevant information into prompts.",
    "Cosine similarity near 1.0 suggests strong semantic alignment between query and document.",
    "Semantic retrieval in RAG often uses top-k ranking with optional re-ranking models.",
    "FastAPI plus PostgreSQL is a common stack for reliable backend API services.",
    "Next.js plus FastAPI is a practical full-stack architecture for modern SaaS products.",
    "Embeddings make it possible to search for conceptually related ideas across a knowledge base.",
    "Vector indexes accelerate nearest-neighbor queries over high-dimensional embeddings.",
    "Keyword matching can work well for codes, IDs, and exact field-value lookups.",
    "Semantic search is better for natural language questions and paraphrased intent.",
    "TeamShastra engineering culture emphasizes shipping useful software with strong fundamentals.",
    "SaaS platform architecture benefits from clear service boundaries and domain ownership.",
    "System design decisions should be driven by measurable constraints and business goals.",
    "RAG retrieval quality depends on chunking strategy, embedding quality, and ranking logic.",
    "Embedding vectors can be normalized before cosine comparison to stabilize similarity scores.",
    "AI search demos can teach retrieval concepts without expensive infrastructure.",
    "A lightweight semantic search playground can run on Vercel plus Render with minimal cost.",
    "Production-friendly AI demos avoid heavyweight GPU dependencies and large local model downloads.",
    "Backend API observability helps debug latency spikes in semantic retrieval pipelines.",
    "PostgreSQL remains a strong default datastore for transactional SaaS backends.",
    "Redis is often paired with PostgreSQL for caching and background coordination.",
    "Next.js route handlers can proxy requests securely without exposing private API keys.",
    "FastAPI background tasks support asynchronous side effects after request completion.",
    "Semantic search can power document retrieval, ticket routing, and support answer suggestion.",
    "Vector search explained simply: find the closest meanings, not just shared words.",
    "Embeddings explained simply: turn text meaning into numbers so math can compare intent.",
    "Keyword search versus semantic search is about literal overlap versus conceptual similarity.",
    "RAG systems use retrieval to feed LLMs relevant context before generating answers.",
]

SYNONYM_BUCKETS = {
    "api": {"api", "apis", "backend", "service", "services", "endpoint", "endpoints"},
    "semantic": {"semantic", "meaning", "intent", "concept", "conceptual"},
    "search": {"search", "retrieval", "retrieve", "find", "ranking", "rank"},
    "embedding": {"embedding", "embeddings", "vector", "vectors"},
    "rag": {"rag", "grounded", "retrievalaugmented", "retrieval-augmented"},
    "database": {"postgresql", "postgres", "database", "sql", "redis"},
    "frontend": {"nextjs", "next", "frontend", "ui", "web"},
    "backend": {"fastapi", "python", "backend", "server"},
    "agent": {"agent", "agents", "tool", "tools", "planning"},
    "saas": {"saas", "tenant", "multitenant", "architecture", "system", "design"},
}


def tokenize(text: str) -> list[str]:
    return re.findall(r"[a-z0-9]+", text.lower())


def canonical_tokens(tokens: Iterable[str]) -> list[str]:
    expanded: list[str] = []
    bucket_lookup = {}
    for canonical, variants in SYNONYM_BUCKETS.items():
        for variant in variants:
            bucket_lookup[variant] = canonical

    for token in tokens:
        expanded.append(token)
        canonical = bucket_lookup.get(token)
        if canonical and canonical != token:
            expanded.append(canonical)

    return expanded


def deterministic_embedding(text: str, dimension: int = DIMENSION) -> list[float]:
    tokens = canonical_tokens(tokenize(text))
    vector = [0.0] * dimension

    if not tokens:
        return vector

    for index, token in enumerate(tokens):
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        slot = digest[0] % dimension
        sign = 1.0 if digest[1] % 2 == 0 else -1.0
        weight = 1.0 + ((len(token) % 5) * 0.12)
        vector[slot] += sign * weight

        if index < len(tokens) - 1:
            bigram = f"{token}:{tokens[index + 1]}"
            bdigest = hashlib.sha256(bigram.encode("utf-8")).digest()
            bslot = bdigest[0] % dimension
            bsign = 1.0 if bdigest[1] % 2 == 0 else -1.0
            vector[bslot] += bsign * 0.55

    norm = math.sqrt(sum(value * value for value in vector))
    if norm <= 1e-12:
        return vector

    return [round(value / norm, 8) for value in vector]


def embed_with_openai(texts: list[str], api_key: str, model: str) -> list[list[float]]:
    payload = json.dumps({"model": model, "input": texts}).encode("utf-8")
    request = urllib.request.Request(
        OPENAI_URL,
        data=payload,
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(request, timeout=120) as response:
            parsed = json.loads(response.read().decode("utf-8"))
    except urllib.error.HTTPError as exc:
        details = exc.read().decode("utf-8", "ignore")
        raise RuntimeError(f"OpenAI embedding request failed: {details}") from exc

    data = parsed.get("data")
    if not isinstance(data, list):
        raise RuntimeError("Invalid OpenAI embedding response format")

    vectors: list[list[float]] = []
    for item in data:
        embedding = item.get("embedding") if isinstance(item, dict) else None
        if not isinstance(embedding, list):
            raise RuntimeError("Missing embedding vector in OpenAI response")
        vectors.append([float(value) for value in embedding])

    return vectors


def build_records(mode: str, api_key: str | None, model: str) -> list[dict[str, object]]:
    texts = [text.strip() for text in DATASET_TEXTS if text.strip()]
    if mode == "openai":
        if not api_key:
            raise RuntimeError("--api-key (or OPENAI_API_KEY env) is required in openai mode")
        vectors = embed_with_openai(texts, api_key=api_key, model=model)
    else:
        vectors = [deterministic_embedding(text) for text in texts]

    return [
        {"id": index + 1, "text": text, "embedding": vector}
        for index, (text, vector) in enumerate(zip(texts, vectors, strict=True))
    ]


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--output", type=Path, default=DEFAULT_OUTPUT)
    parser.add_argument(
        "--mode",
        choices=["deterministic", "openai"],
        default="deterministic",
        help="deterministic is zero-cost local generation, openai uses Embeddings API",
    )
    parser.add_argument("--api-key", default=None)
    parser.add_argument("--model", default="text-embedding-3-small")
    return parser.parse_args()


def main() -> int:
    args = parse_args()
    api_key = args.api_key or None

    try:
        records = build_records(mode=args.mode, api_key=api_key, model=args.model)
    except Exception as exc:  # noqa: BLE001 - surface a clean CLI error
        print(f"[semantic-search] failed: {exc}", file=sys.stderr)
        return 1

    args.output.parent.mkdir(parents=True, exist_ok=True)
    args.output.write_text(json.dumps(records, indent=2), encoding="utf-8")

    vector_dim = len(records[0]["embedding"]) if records else 0
    print(
        f"[semantic-search] wrote {len(records)} records to {args.output} "
        f"(mode={args.mode}, dim={vector_dim})"
    )
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
