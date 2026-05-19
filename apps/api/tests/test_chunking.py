"""Tests for the markdown-aware chunker."""

from app.ai.ingestion.chunking import chunk_markdown


def test_chunk_markdown_splits_by_heading() -> None:
    text = """\
# Project Title

Intro paragraph about the project that gives high-level framing.

## Architecture

Backend is FastAPI with async SQLAlchemy. Frontend is Next.js App Router
with TypeScript. Deployment uses Render for the API and Vercel for the web.

## Retrieval Layer

We use pgvector with OpenAI text-embedding-3-small. Cosine similarity is
the ranking signal and chunks carry their heading path for context.
"""
    chunks = chunk_markdown(text, target_chars=300, overlap_chars=0)

    assert len(chunks) >= 2
    headings = {chunk.heading_path for chunk in chunks}
    assert any(h and "Architecture" in h for h in headings)
    assert any(h and "Retrieval Layer" in h for h in headings)
    # Heading paths track the active title hierarchy.
    assert all(
        chunk.heading_path is None or chunk.heading_path.startswith("Project Title")
        for chunk in chunks
    )


def test_chunk_markdown_respects_code_fences() -> None:
    text = """\
# Snippet

Below is a code block that should not be misread as a heading.

```
# This is not a heading
print("hello")
```

Trailing paragraph after the fence.
"""
    chunks = chunk_markdown(text, target_chars=500, overlap_chars=0)
    assert len(chunks) == 1
    assert chunks[0].heading_path == "Snippet"
    assert "# This is not a heading" in chunks[0].content


def test_chunk_markdown_returns_empty_for_blank_input() -> None:
    assert chunk_markdown("   \n\n  \n", target_chars=200) == []
