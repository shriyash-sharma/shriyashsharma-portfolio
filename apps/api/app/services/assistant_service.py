from collections.abc import AsyncGenerator

from app.schemas.assistant import AssistantRequest, AssistantResponse


async def answer_assistant_query(payload: AssistantRequest) -> AssistantResponse:
    return AssistantResponse(
        message=(
            "Assistant generation is not implemented yet. "
            "The API contract and streaming boundary are ready."
        ),
        sources=[],
        implemented=False,
    )


async def stream_assistant_events(
    payload: AssistantRequest,
) -> AsyncGenerator[dict[str, str | bool], None]:
    yield {
        "type": "status",
        "message": "Assistant streaming boundary is ready.",
        "implemented": False,
    }
    yield {
        "type": "done",
        "message": f"Received query with {len(payload.query)} characters.",
        "implemented": False,
    }
