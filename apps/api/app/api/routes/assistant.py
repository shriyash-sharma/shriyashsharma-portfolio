from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse

from app.api.dependencies.database import DbSessionDep
from app.api.dependencies.rate_limit import enforce_assistant_rate_limit
from app.schemas.assistant import AssistantRequest, AssistantResponse
from app.services.assistant_service import (
    answer_assistant_query,
    stream_assistant_events,
)
from app.streaming.sse import to_event_stream

router = APIRouter(prefix="/assistant", tags=["assistant"])


@router.post("", response_model=AssistantResponse)
async def assistant(
    payload: AssistantRequest,
    session: DbSessionDep,
    _: None = Depends(enforce_assistant_rate_limit),
) -> AssistantResponse:
    return await answer_assistant_query(payload, session)


@router.post("/stream")
async def assistant_stream(
    payload: AssistantRequest,
    session: DbSessionDep,
    _: None = Depends(enforce_assistant_rate_limit),
) -> StreamingResponse:
    return StreamingResponse(
        to_event_stream(stream_assistant_events(payload, session)),
        media_type="text/event-stream",
    )
