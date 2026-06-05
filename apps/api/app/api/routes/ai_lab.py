"""AI Lab routes — interactive, educational AI engineering tools.

These endpoints back the ``/ai-lab`` product area in the web app. They are
separate from the production assistant: the RAG Explorer operates over
user-supplied text and returns every intermediate step for visualization.
"""

from fastapi import APIRouter, Depends

from app.api.dependencies.rate_limit import enforce_assistant_rate_limit
from app.schemas.ai_lab import RagExplorerRequest, RagExplorerResponse
from app.services.ai_lab_service import run_rag_explorer

router = APIRouter(prefix="/ai-lab", tags=["ai-lab"])


@router.post("/rag-explorer", response_model=RagExplorerResponse)
async def rag_explorer(
    payload: RagExplorerRequest,
    _: None = Depends(enforce_assistant_rate_limit),
) -> RagExplorerResponse:
    return await run_rag_explorer(payload)
