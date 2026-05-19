"""LLM provider protocol used by the portfolio assistant.

Phase 1 only needs a single-shot ``complete`` call. Streaming is intentionally
deferred — the chat endpoint returns a full response so we can keep the
frontend integration simple and ship the retrieval surface first.
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Literal, Protocol

ChatRole = Literal["system", "user", "assistant"]


@dataclass(frozen=True)
class ChatMessage:
    role: ChatRole
    content: str


class LLMProvider(Protocol):
    @property
    def name(self) -> str: ...

    @property
    def model(self) -> str: ...

    async def complete(
        self,
        *,
        messages: list[ChatMessage],
        temperature: float,
        max_tokens: int,
    ) -> str:
        """Return the assistant message content for the given chat history."""
