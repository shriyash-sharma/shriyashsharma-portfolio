"""Lightweight intent routing for the portfolio assistant.

Dense vector search is great for "explain X" / "how does Y work", but it
struggles with *catalog* questions like "what projects do you have?" or
"list the case studies". For those, the right answer is to enumerate the
relevant CMS rows directly — not to ask an embedding model to guess.

This module:

1. Detects catalog intent from the raw query (cheap regex, no LLM).
2. Optionally infers a content-type scope ("blog posts about X" → blog).
3. Returns a structured ``QueryIntent`` the assistant orchestrator uses to
   either pull catalog rows from Postgres or scope the vector search.

Why keep this in pure Python instead of an LLM router: it costs zero tokens,
runs in microseconds, is deterministic, and is trivial to extend. We can
upgrade to an LLM classifier later without breaking the calling contract.
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from typing import Literal

ContentTypeLiteral = Literal[
    "project",
    "case-study",
    "article",
    "blog",
    "architecture-note",
    "experiment",
    "research-log",
]


# Canonical singular CMS types (matches ContentType in schemas/content.py).
CANONICAL_TYPES: tuple[str, ...] = (
    "project",
    "case-study",
    "article",
    "architecture-note",
    "experiment",
    "research-log",
)


# Keywords that signal the user wants an enumeration, not an explanation.
_CATALOG_RE = re.compile(
    r"\b("
    r"list|show( me)?|enumerate|what are|which|how many|give me( all)?|"
    r"all (of )?(your|the)|tell me about( your)?( published)?|what projects|"
    r"what case studies|what articles|what blog posts|what architecture|"
    r"do you have"
    r")\b",
    re.IGNORECASE,
)


# Aliases → canonical singular content_type. Order matters: longer phrases
# first so "case studies" matches before "case".
_TYPE_ALIASES: tuple[tuple[str, str], ...] = (
    (r"\b(case[- ]?stud(y|ies))\b", "case-study"),
    (
        r"\b(architecture (note|notes)|adrs?|architectural decisions?)\b",
        "architecture-note",
    ),
    (r"\b(blog ?posts?|articles?|writings?|essays?)\b", "article"),
    (r"\b(projects?|builds?|portfolio items?)\b", "project"),
    (r"\b(experiments?|prototypes?)\b", "experiment"),
    (r"\b(research( logs?)?|research notes?)\b", "research-log"),
)


@dataclass(frozen=True)
class QueryIntent:
    """Resolved query intent used by the assistant orchestrator."""

    # True when the user wants an enumeration of CMS items (not an explanation).
    is_catalog: bool
    # Subset of content_types to scope retrieval / catalog listing to.
    # ``None`` means "no scope — search across everything".
    content_types: list[str] | None


def detect_intent(query: str) -> QueryIntent:
    """Classify a user query for routing.

    Pure function, no IO. Safe to call on every assistant request.
    """
    if not query or not query.strip():
        return QueryIntent(is_catalog=False, content_types=None)

    is_catalog = bool(_CATALOG_RE.search(query))

    # Detect type-scoping phrases regardless of catalog intent — even
    # "explain your case studies" benefits from a case-study-only context.
    matched: list[str] = []
    for pattern, canonical in _TYPE_ALIASES:
        if re.search(pattern, query, re.IGNORECASE) and canonical not in matched:
            matched.append(canonical)

    return QueryIntent(
        is_catalog=is_catalog,
        content_types=matched or None,
    )
