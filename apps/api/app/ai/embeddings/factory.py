"""Embedding provider factory."""

from __future__ import annotations

from functools import lru_cache

from app.ai.embeddings.base import EmbeddingProvider
from app.ai.embeddings.local_provider import LocalEmbeddingProvider
from app.ai.embeddings.openai_provider import OpenAIEmbeddingProvider
from app.core.config import Settings, get_settings


def build_embedding_provider(settings: Settings) -> EmbeddingProvider:
    if settings.embedding_provider == "openai":
        if settings.openai_api_key is None:
            raise RuntimeError(
                "OPENAI_API_KEY is required when embedding_provider='openai'."
            )
        return OpenAIEmbeddingProvider(
            api_key=settings.openai_api_key.get_secret_value(),
            model=settings.embedding_model,
            dimensions=settings.embedding_dimensions,
            base_url=settings.openai_base_url,
        )
    raise RuntimeError(
        f"Unsupported embedding provider: {settings.embedding_provider}"
    )


@lru_cache
def get_embedding_provider() -> EmbeddingProvider:
    return build_embedding_provider(get_settings())


def build_local_embedding_provider(settings: Settings) -> LocalEmbeddingProvider:
    """Open-source local embeddings used by the AI Lab RAG Explorer.

    Kept separate from ``get_embedding_provider`` so the production assistant
    keeps using hosted embeddings while the teaching tool demonstrates a local,
    open-source model without OpenAI.
    """
    return LocalEmbeddingProvider(
        model_name=settings.local_embedding_model,
        dimensions=settings.local_embedding_dimensions,
    )


@lru_cache
def get_local_embedding_provider() -> LocalEmbeddingProvider:
    return build_local_embedding_provider(get_settings())
