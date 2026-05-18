from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.schemas.assistant import AssistantRequest, AssistantResponse
from app.services.assistant_service import (
    answer_assistant_query,
    stream_assistant_events,
)
from app.streaming.sse import to_event_stream

router = APIRouter(prefix="/assistant", tags=["assistant"])


@router.post("", response_model=AssistantResponse)
async def assistant(payload: AssistantRequest) -> AssistantResponse:
    return await answer_assistant_query(payload)


@router.post("/stream")
async def assistant_stream(payload: AssistantRequest) -> StreamingResponse:
    return StreamingResponse(
        to_event_stream(stream_assistant_events(payload)),
        media_type="text/event-stream",
    )
