"""Portfolio assistant service.

This is the application-tier orchestrator for the RAG flow:

    embed(query) → pgvector search → build grounded prompt → LLM completion

Route handlers depend on this service so the transport layer stays thin and
the AI subsystem stays composable from tests and scripts.
"""

from __future__ import annotations

import logging
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.embeddings.factory import get_embedding_provider
from app.ai.llm.factory import get_llm_provider
from app.ai.prompts.portfolio_assistant import build_chat_messages
from app.ai.retrieval.catalog import fetch_catalog, render_catalog_block
from app.ai.retrieval.intent import detect_intent
from app.ai.retrieval.service import RetrievalService, RetrievedChunk
from app.core.config import get_settings
from app.schemas.assistant import AssistantRequest, AssistantResponse
from app.schemas.content import ContentType
from app.schemas.search import SearchSource

logger = logging.getLogger(__name__)

_SOURCE_TYPE_TO_CONTENT_TYPE: dict[str, ContentType] = {
    "content_item": "article",
    "markdown_file": "architecture-note",
    "manual": "article",
}


async def answer_assistant_query(
    payload: AssistantRequest, session: AsyncSession
) -> AssistantResponse:
    settings = get_settings()

    # Provider construction is lazy and cached. If keys are missing we surface
    # a structured, non-implemented response rather than 500-ing — keeps the
    # frontend chat surface usable in pre-prod environments without secrets.
    try:
        embeddings = get_embedding_provider()
        llm = get_llm_provider()
    except RuntimeError as exc:
        logger.warning("Assistant provider not configured: %s", exc)
        return AssistantResponse(
            message=(
                "The assistant is not configured in this environment yet. "
                "Set OPENAI_API_KEY and GROQ_API_KEY (or switch llm_provider) "
                "to enable answers."
            ),
            sources=[],
            implemented=False,
        )

    retrieval = RetrievalService(session, embeddings)

    # Intent routing: cheap regex classifier distinguishes "explain X" from
    # "list/enumerate" questions. Catalog intent gets a deterministic CMS
    # listing prepended; scoped intent narrows vector search to the relevant
    # content types. Both can fire together (e.g. "list your case studies").
    intent = detect_intent(payload.query)

    catalog_block: str | None = None
    if intent.is_catalog:
        try:
            catalog_items = await fetch_catalog(
                session, content_types=intent.content_types
            )
            catalog_block = render_catalog_block(catalog_items) or None
        except Exception:
            logger.exception("Catalog fetch failed; falling back to vector-only")
            catalog_block = None

    try:
        chunks = await retrieval.search(
            payload.query,
            top_k=settings.rag_top_k,
            min_similarity=settings.rag_min_similarity,
            max_per_document=settings.rag_max_chunks_per_document,
            candidate_multiplier=settings.rag_candidate_multiplier,
            ef_search=settings.rag_hnsw_ef_search,
            content_types=intent.content_types,
        )
    except Exception:
        logger.exception("Semantic retrieval failed for assistant query")
        return AssistantResponse(
            message=(
                "Sorry — the retrieval layer is currently unavailable. "
                "Please try again in a moment."
            ),
            sources=[],
            implemented=False,
        )

    messages, used_chunks = build_chat_messages(
        question=payload.query,
        chunks=chunks,
        max_context_chars=settings.rag_max_context_chars,
        catalog_block=catalog_block,
    )

    try:
        answer = await llm.complete(
            messages=messages,
            temperature=settings.llm_temperature,
            max_tokens=settings.llm_max_tokens,
        )
    except Exception:
        logger.exception("LLM completion failed for assistant query")
        return AssistantResponse(
            message=(
                "I retrieved relevant portfolio context but the model call "
                "failed. Please try again in a moment."
            ),
            sources=_to_sources(used_chunks),
            implemented=True,
        )

    return AssistantResponse(
        message=answer,
        sources=_to_sources(used_chunks),
        implemented=True,
    )


async def stream_assistant_events(
    payload: AssistantRequest,
    session: AsyncSession,
) -> AsyncGenerator[dict[str, str | bool], None]:
    """Minimal SSE adapter around the non-streaming completion.

    Phase 1 streams the final answer as a single ``delta`` event followed by a
    ``done`` event. Token-level streaming is a Phase 2 concern — implementing
    it requires per-provider stream parsing and is best added after the
    retrieval quality is solid.
    """

    response = await answer_assistant_query(payload, session)

    yield {
        "type": "sources",
        "message": "Retrieved portfolio context",
        "implemented": response.implemented,
    }
    yield {
        "type": "delta",
        "message": response.message,
        "implemented": response.implemented,
    }
    yield {
        "type": "done",
        "message": "complete",
        "implemented": response.implemented,
    }


def _to_sources(chunks: list[RetrievedChunk]) -> list[SearchSource]:
    sources: list[SearchSource] = []
    seen: set[str] = set()
    for chunk in chunks:
        document_key = str(chunk.document_id)
        if document_key in seen:
            continue
        seen.add(document_key)
        sources.append(
            SearchSource(
                id=document_key,
                title=chunk.document_title,
                type=_resolve_source_type(chunk),
                excerpt=_excerpt(chunk.content),
                score=round(chunk.similarity, 4),
            )
        )
    return sources


def _resolve_source_type(chunk: RetrievedChunk) -> ContentType:
    """Prefer CMS content_type over knowledge source_type for citation labels."""
    if chunk.content_type in {
        "project",
        "case-study",
        "article",
        "architecture-note",
        "experiment",
        "research-log",
    }:
        return chunk.content_type
    return _SOURCE_TYPE_TO_CONTENT_TYPE.get(chunk.source_type, "article")


def _excerpt(text: str, *, max_chars: int = 240) -> str:
    cleaned = " ".join(text.split())
    if len(cleaned) <= max_chars:
        return cleaned
    return cleaned[: max_chars - 1].rstrip() + "…"
