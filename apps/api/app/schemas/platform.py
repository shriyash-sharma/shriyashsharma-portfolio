from typing import Literal

from pydantic import BaseModel


class PlatformCapability(BaseModel):
    module: Literal[
        "content",
        "search",
        "assistant",
        "ingestion",
        "analytics",
        "observability",
        "auth",
    ]
    status: Literal["planned", "ready", "disabled"]
    boundary: Literal["api", "service", "data", "external"]
    description: str


class PlatformResponse(BaseModel):
    name: str
    version: str
    capabilities: list[PlatformCapability]
