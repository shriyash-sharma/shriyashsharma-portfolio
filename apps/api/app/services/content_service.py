"""Static content collection registry.

This service describes the platform's supported content collections without
exposing database details to callers. The registry is consumed by public and
editorial experiences as capability metadata rather than as a persistence API.

The split matters because collection definitions are part of platform contract
design, while individual items remain the repository layer's responsibility.
"""

from app.schemas.content import ContentCollection, ContentCollectionsResponse


def get_content_collections() -> ContentCollectionsResponse:
    return ContentCollectionsResponse(
        collections=[
            ContentCollection(
                type="project",
                route_base="/projects",
                indexable=True,
                description="Shipped work, technical metadata, architecture decisions.",
            ),
            ContentCollection(
                type="case-study",
                route_base="/case-studies",
                indexable=True,
                description="Long-form engineering breakdowns and production outcomes.",
            ),
            ContentCollection(
                type="article",
                route_base="/blog",
                indexable=True,
                description="Engineering writing and implementation notes.",
            ),
            ContentCollection(
                type="architecture-note",
                route_base="/architecture",
                indexable=True,
                description="System topology and ADR-style platform decisions.",
            ),
            ContentCollection(
                type="experiment",
                route_base="/experiments",
                indexable=False,
                description="Prototype logs and early investigations.",
            ),
            ContentCollection(
                type="research-log",
                route_base="/research",
                indexable=True,
                description="AI/RAG evaluation notes and retrieval experiments.",
            ),
        ]
    )
