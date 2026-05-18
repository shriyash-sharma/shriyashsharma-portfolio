from dataclasses import dataclass


@dataclass(frozen=True)
class SearchBoundary:
    strategy: str
    description: str


SEARCH_BOUNDARIES = [
    SearchBoundary(
        strategy="keyword",
        description="Future lexical search over structured content metadata.",
    ),
    SearchBoundary(
        strategy="vector",
        description="Future pgvector retrieval over normalized content chunks.",
    ),
    SearchBoundary(
        strategy="hybrid",
        description="Future rank fusion over keyword and vector candidates.",
    ),
]
