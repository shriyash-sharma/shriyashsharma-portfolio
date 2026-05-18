import json
from collections.abc import AsyncGenerator, AsyncIterable


def encode_sse(event: str, data: dict[str, str | bool]) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"


async def to_event_stream(
    events: AsyncIterable[dict[str, str | bool]],
) -> AsyncGenerator[str, None]:
    async for event in events:
        event_name = str(event.get("type", "message"))
        yield encode_sse(event_name, event)
