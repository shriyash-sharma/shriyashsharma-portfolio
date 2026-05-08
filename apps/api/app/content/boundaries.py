from dataclasses import dataclass


@dataclass(frozen=True)
class ContentSource:
    name: str
    description: str
    active: bool = False


CONTENT_SOURCES = [
    ContentSource(
        name="filesystem",
        description="Local MDX/metadata collections for early platform content.",
        active=True,
    ),
    ContentSource(
        name="cms",
        description=(
            "Future editorial backend for drafts, previews, and publishing workflow."
        ),
    ),
    ContentSource(
        name="ingestion-api",
        description="Future project/research ingestion pipeline for AI indexing.",
    ),
]
