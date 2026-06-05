"""Local, open-source embedding provider for the AI Lab RAG Explorer.

The RAG Explorer is an *educational* surface. It deliberately avoids the hosted
OpenAI embeddings used by the production assistant and instead demonstrates an
open-source model — ``BAAI/bge-large-en-v1.5`` (1024 dimensions) — running
locally via ``sentence-transformers``.

Two important engineering properties:

1. **Lazy loading.** The transformer model is heavy (~1.3GB) and slow to load.
   We never import or download it at process startup; the model is constructed
   on first use and cached for the lifetime of the provider. Environments that
   never open the RAG Explorer pay zero cost.

2. **Graceful offline fallback.** A teaching tool must never hard-fail. When
   ``sentence-transformers`` (or its weights) is unavailable — for example a
   constrained deploy target without the optional dependency — we fall back to
   a deterministic, dependency-free hashed-bag-of-words embedding at the same
   1024 dimensions. Cosine similarity still tracks lexical overlap, so the
   visualization remains meaningful. The provider reports ``is_fallback`` so the
   UI can be honest about which path produced the vectors.
"""

from __future__ import annotations

import hashlib
import math
import re
import threading

# BGE retrieval works best when queries are prefixed with this instruction.
# Passages (documents/chunks) are embedded without a prefix.
BGE_QUERY_INSTRUCTION = (
    "Represent this sentence for searching relevant passages: "
)

_TOKEN_RE = re.compile(r"[a-z0-9]+")


class LocalEmbeddingProvider:
    """Open-source local embeddings with a deterministic offline fallback."""

    def __init__(self, *, model_name: str, dimensions: int) -> None:
        self._model_name = model_name
        self._dimensions = dimensions
        self._model = None
        self._load_attempted = False
        self._is_fallback = False
        self._lock = threading.Lock()

    @property
    def model(self) -> str:
        return self._model_name

    @property
    def dimensions(self) -> int:
        return self._dimensions

    @property
    def is_fallback(self) -> bool:
        """True once we have decided the hashed fallback is in use."""
        return self._is_fallback

    def _ensure_model(self) -> None:
        """Attempt a one-time lazy load of the sentence-transformers model."""
        if self._load_attempted:
            return
        with self._lock:
            if self._load_attempted:
                return
            self._load_attempted = True
            try:
                from sentence_transformers import SentenceTransformer

                self._model = SentenceTransformer(self._model_name)
                self._is_fallback = False
            except Exception:
                # Missing dependency, no weights, or no network. Fall back to
                # the deterministic embedding so the tool stays usable.
                self._model = None
                self._is_fallback = True

    async def embed_one(self, text: str, *, is_query: bool = False) -> list[float]:
        vectors = await self.embed_many([text], is_query=is_query)
        return vectors[0]

    async def embed_many(
        self, texts: list[str], *, is_query: bool = False
    ) -> list[list[float]]:
        if not texts:
            return []

        self._ensure_model()

        if self._model is not None:
            prepared = (
                [f"{BGE_QUERY_INSTRUCTION}{text}" for text in texts]
                if is_query
                else list(texts)
            )
            # normalize_embeddings=True returns unit vectors so a dot product is
            # the cosine similarity downstream.
            raw = self._model.encode(
                prepared,
                normalize_embeddings=True,
                convert_to_numpy=True,
                show_progress_bar=False,
            )
            return [[float(value) for value in row] for row in raw]

        return [self._hashed_embedding(text) for text in texts]

    def _hashed_embedding(self, text: str) -> list[float]:
        """Deterministic hashed bag-of-words embedding, L2-normalized.

        Each token is hashed into a small number of dimensions with signed
        weights (the hashing trick). The result is reproducible and produces
        cosine similarity that rises with shared vocabulary — enough to make the
        vector-search step illustrative when the real model is unavailable.
        """
        vector = [0.0] * self._dimensions
        tokens = _TOKEN_RE.findall(text.lower())
        if not tokens:
            return vector

        for token in tokens:
            digest = hashlib.sha256(token.encode("utf-8")).digest()
            # Spread each token across a few dimensions for a denser signal.
            for offset in range(0, 16, 4):
                bucket = int.from_bytes(digest[offset : offset + 4], "big")
                index = bucket % self._dimensions
                sign = 1.0 if (bucket >> 31) & 1 else -1.0
                vector[index] += sign

        norm = math.sqrt(sum(value * value for value in vector))
        if norm == 0.0:
            return vector
        return [value / norm for value in vector]
