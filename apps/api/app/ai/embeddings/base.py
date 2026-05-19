"""Embedding provider protocol.

A provider takes one or many text inputs and returns dense vectors. We
deliberately keep this interface tiny so swapping providers (OpenAI today,
Voyage or a local model tomorrow) does not ripple through the codebase.
"""

from __future__ import annotations

from typing import Protocol


class EmbeddingProvider(Protocol):
    """Minimal embedding contract used by ingestion and retrieval."""

    @property
    def model(self) -> str: ...

    @property
    def dimensions(self) -> int: ...

    async def embed_one(self, text: str) -> list[float]:
        """Embed a single string. Convenience over ``embed_many``."""

    async def embed_many(self, texts: list[str]) -> list[list[float]]:
        """Embed a batch of strings preserving order."""
