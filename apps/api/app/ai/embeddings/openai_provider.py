"""OpenAI embeddings provider.

We talk to the OpenAI REST API directly with ``httpx`` instead of pulling in
the official SDK. The surface we use (one POST per batch) is small and stable,
and keeping the dependency footprint tight matters for Render's free tier
cold-start budget.
"""

from __future__ import annotations

import httpx

from app.ai.embeddings.base import EmbeddingProvider


class OpenAIEmbeddingProvider(EmbeddingProvider):
    """OpenAI ``/embeddings`` client."""

    def __init__(
        self,
        *,
        api_key: str,
        model: str,
        dimensions: int,
        base_url: str = "https://api.openai.com/v1",
        timeout_seconds: float = 90.0,
    ) -> None:
        self._api_key = api_key
        self._model = model
        self._dimensions = dimensions
        self._base_url = base_url.rstrip("/")
        self._timeout = timeout_seconds

    @property
    def model(self) -> str:
        return self._model

    @property
    def dimensions(self) -> int:
        return self._dimensions

    async def embed_one(self, text: str) -> list[float]:
        vectors = await self.embed_many([text])
        return vectors[0]

    async def embed_many(self, texts: list[str]) -> list[list[float]]:
        if not texts:
            return []

        payload: dict[str, object] = {
            "model": self._model,
            "input": texts,
        }
        # text-embedding-3-* supports the ``dimensions`` parameter for
        # output truncation. Older models (ada-002) silently ignore it.
        if self._model.startswith("text-embedding-3"):
            payload["dimensions"] = self._dimensions

        async with httpx.AsyncClient(timeout=self._timeout) as client:
            response = await client.post(
                f"{self._base_url}/embeddings",
                headers={
                    "Authorization": f"Bearer {self._api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )

        if response.status_code >= 400:
            raise RuntimeError(
                f"OpenAI embeddings request failed ({response.status_code}): "
                f"{response.text[:300]}"
            )

        data = response.json()
        # Preserve input order. OpenAI returns objects with an ``index`` field
        # but is normally already ordered; we sort defensively.
        items = sorted(data["data"], key=lambda item: item["index"])
        return [item["embedding"] for item in items]
