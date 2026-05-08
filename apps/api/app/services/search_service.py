from app.schemas.search import SearchRequest, SearchResponse


async def semantic_search(payload: SearchRequest) -> SearchResponse:
    # Future implementation boundary:
    # 1. normalize query
    # 2. execute keyword + vector retrieval
    # 3. rerank and return source citations
    return SearchResponse(query=payload.query, sources=[], implemented=False)
