"""LLM provider factory.

Groq is the preferred provider for cost and latency reasons. We fall back to
OpenAI only when Groq is not configured. A misconfigured environment raises
loudly at first use so the assistant route never silently degrades.
"""

from __future__ import annotations

from functools import lru_cache

from app.ai.llm.base import LLMProvider
from app.ai.llm.openai_compatible import OpenAICompatibleChatProvider
from app.core.config import Settings, get_settings


def build_llm_provider(settings: Settings) -> LLMProvider:
    if settings.llm_provider == "groq":
        if settings.groq_api_key is None:
            raise RuntimeError(
                "GROQ_API_KEY is required when llm_provider='groq'."
            )
        return OpenAICompatibleChatProvider(
            name="groq",
            api_key=settings.groq_api_key.get_secret_value(),
            model=settings.llm_model,
            base_url=settings.groq_base_url,
        )

    if settings.llm_provider == "openai":
        if settings.openai_api_key is None:
            raise RuntimeError(
                "OPENAI_API_KEY is required when llm_provider='openai'."
            )
        return OpenAICompatibleChatProvider(
            name="openai",
            api_key=settings.openai_api_key.get_secret_value(),
            model=settings.llm_model,
            base_url=settings.openai_base_url,
        )

    raise RuntimeError(f"Unsupported LLM provider: {settings.llm_provider}")


@lru_cache
def get_llm_provider() -> LLMProvider:
    return build_llm_provider(get_settings())
