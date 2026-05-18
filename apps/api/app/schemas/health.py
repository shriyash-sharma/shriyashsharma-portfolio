from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict


class HealthResponse(BaseModel):
    model_config = ConfigDict(json_schema_extra={"title": "HealthResponse"})

    status: Literal["ok", "degraded"]
    service: str
    environment: str
    version: str
    checked_at: datetime
    detail: str | None = None
