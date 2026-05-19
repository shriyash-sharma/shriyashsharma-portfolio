"""OpenAI-compatible chat completions client.

Groq's API is a drop-in clone of OpenAI's ``/chat/completions``, so a single
implementation parameterised on base URL + API key handles both providers.
"""

from __future__ import annotations

import httpx

from app.ai.llm.base import ChatMessage, LLMProvider


class OpenAICompatibleChatProvider(LLMProvider):
    def __init__(
        self,
        *,
        name: str,
        api_key: str,
        model: str,
        base_url: str,
        timeout_seconds: float = 45.0,
    ) -> None:
        self._name = name
        self._api_key = api_key
        self._model = model
        self._base_url = base_url.rstrip("/")
        self._timeout = timeout_seconds

    @property
    def name(self) -> str:
        return self._name

    @property
    def model(self) -> str:
        return self._model

    async def complete(
        self,
        *,
        messages: list[ChatMessage],
        temperature: float,
        max_tokens: int,
    ) -> str:
        payload = {
            "model": self._model,
            "temperature": temperature,
            "max_tokens": max_tokens,
            "messages": [
                {"role": message.role, "content": message.content}
                for message in messages
            ],
        }
        async with httpx.AsyncClient(timeout=self._timeout) as client:
            response = await client.post(
                f"{self._base_url}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self._api_key}",
                    "Content-Type": "application/json",
                },
                json=payload,
            )

        if response.status_code >= 400:
            raise RuntimeError(
                f"{self._name} chat completion failed "
                f"({response.status_code}): {response.text[:300]}"
            )

        data = response.json()
        try:
            return str(data["choices"][0]["message"]["content"]).strip()
        except (KeyError, IndexError, TypeError) as exc:
            raise RuntimeError(
                f"{self._name} returned an unexpected response shape: {data}"
            ) from exc
