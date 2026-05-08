from dataclasses import dataclass


@dataclass(frozen=True)
class AiBoundary:
    name: str
    responsibility: str
    implemented: bool = False


AI_BOUNDARIES = [
    AiBoundary(
        name="retrieval",
        responsibility="Fetch and rank source chunks for semantic search and assistant answers.",
    ),
    AiBoundary(
        name="generation",
        responsibility="Call model providers and stream assistant deltas.",
    ),
    AiBoundary(
        name="evaluation",
        responsibility="Track citation coverage, latency, and retrieval quality.",
    ),
]
