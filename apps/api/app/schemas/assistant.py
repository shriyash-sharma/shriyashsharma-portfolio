from pydantic import BaseModel, Field

from app.schemas.search import SearchSource


class AssistantRequest(BaseModel):
    query: str = Field(min_length=2, max_length=2_000)
    session_id: str | None = None
    locale: str | None = None


class AssistantResponse(BaseModel):
    message: str
    sources: list[SearchSource] = Field(default_factory=list)
    implemented: bool = False


class AssistantStreamEvent(BaseModel):
    event: str
    data: dict[str, str | bool]
