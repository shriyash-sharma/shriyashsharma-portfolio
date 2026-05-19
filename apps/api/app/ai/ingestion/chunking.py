"""Markdown-aware chunking.

This chunker is intentionally simple and deterministic:

1. Walk the markdown line by line and track the active heading path
   (e.g. ``# Title › ## Section``). Headings are the strongest semantic
   boundary in our content, so each section becomes a candidate chunk.
2. Within a section, accumulate paragraphs until we approach
   ``target_chars``. If a single paragraph is larger than the target we
   split it on sentence boundaries.
3. Apply a small character overlap between adjacent chunks of the same
   section to preserve continuity for retrieval.

Why not use a token-precise splitter or LangChain's text splitter?
- The corpus is portfolio content, not novels. Character-budget chunks
  are good enough and avoid pulling in a tokenizer dependency.
- Heading-aware chunks materially improve retrieval relevance because
  they keep the topical context of each span intact.
"""

from __future__ import annotations

import re
from dataclasses import dataclass

_HEADING_RE = re.compile(r"^(#{1,6})\s+(.*?)\s*$")
_FENCE_RE = re.compile(r"^```")
_SENTENCE_SPLIT_RE = re.compile(r"(?<=[.!?])\s+(?=[A-Z0-9])")


@dataclass(frozen=True)
class Chunk:
    index: int
    content: str
    heading_path: str | None

    @property
    def token_estimate(self) -> int:
        # Rough heuristic: ~4 characters per token for English prose. Good
        # enough for budget tracking and surfacing in the citation payload.
        return max(1, len(self.content) // 4)


def chunk_markdown(
    text: str,
    *,
    target_chars: int = 800,
    overlap_chars: int = 120,
    min_chars: int = 120,
) -> list[Chunk]:
    """Split a markdown document into retrieval-ready chunks."""

    sections = _split_into_sections(text)

    chunks: list[Chunk] = []
    counter = 0
    for heading_path, body in sections:
        normalized = body.strip()
        if not normalized:
            continue
        for piece in _split_section(
            normalized, target_chars=target_chars, overlap_chars=overlap_chars
        ):
            if len(piece) < min_chars and chunks and chunks[-1].heading_path == heading_path:
                # Glue tiny tails onto the previous chunk so we do not embed
                # near-empty fragments that pollute retrieval.
                previous = chunks.pop()
                merged_content = f"{previous.content}\n\n{piece}".strip()
                chunks.append(
                    Chunk(
                        index=previous.index,
                        content=merged_content,
                        heading_path=heading_path,
                    )
                )
                continue
            chunks.append(
                Chunk(index=counter, content=piece, heading_path=heading_path)
            )
            counter += 1
    return chunks


def _split_into_sections(text: str) -> list[tuple[str | None, str]]:
    """Group lines under their active heading path. Respects fenced code."""

    sections: list[tuple[str | None, list[str]]] = [(None, [])]
    heading_stack: list[tuple[int, str]] = []
    in_fence = False

    for line in text.splitlines():
        if _FENCE_RE.match(line):
            in_fence = not in_fence
            sections[-1][1].append(line)
            continue

        if in_fence:
            sections[-1][1].append(line)
            continue

        match = _HEADING_RE.match(line)
        if match:
            level = len(match.group(1))
            title = match.group(2).strip()
            while heading_stack and heading_stack[-1][0] >= level:
                heading_stack.pop()
            heading_stack.append((level, title))
            heading_path = " › ".join(title for _, title in heading_stack)
            sections.append((heading_path, []))
            continue

        sections[-1][1].append(line)

    return [(path, "\n".join(lines)) for path, lines in sections]


def _split_section(
    body: str, *, target_chars: int, overlap_chars: int
) -> list[str]:
    """Split a single section into <= target_chars chunks with overlap."""

    paragraphs = [p.strip() for p in re.split(r"\n\s*\n", body) if p.strip()]
    if not paragraphs:
        return []

    pieces: list[str] = []
    buffer = ""
    for paragraph in paragraphs:
        if len(paragraph) > target_chars:
            if buffer:
                pieces.append(buffer.strip())
                buffer = ""
            pieces.extend(_split_long_paragraph(paragraph, target_chars))
            continue

        candidate = f"{buffer}\n\n{paragraph}".strip() if buffer else paragraph
        if len(candidate) <= target_chars:
            buffer = candidate
        else:
            pieces.append(buffer.strip())
            buffer = paragraph

    if buffer:
        pieces.append(buffer.strip())

    if overlap_chars <= 0 or len(pieces) <= 1:
        return pieces

    overlapped = [pieces[0]]
    for previous, current in zip(pieces, pieces[1:], strict=False):
        tail = previous[-overlap_chars:]
        overlapped.append(f"{tail}\n\n{current}".strip())
    return overlapped


def _split_long_paragraph(paragraph: str, target_chars: int) -> list[str]:
    sentences = _SENTENCE_SPLIT_RE.split(paragraph)
    if len(sentences) <= 1:
        # Hard wrap as a last resort.
        return [
            paragraph[i : i + target_chars]
            for i in range(0, len(paragraph), target_chars)
        ]

    out: list[str] = []
    buffer = ""
    for sentence in sentences:
        candidate = f"{buffer} {sentence}".strip() if buffer else sentence
        if len(candidate) <= target_chars:
            buffer = candidate
        else:
            if buffer:
                out.append(buffer)
            buffer = sentence
    if buffer:
        out.append(buffer)
    return out
