from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field


class AdminLoginRequest(BaseModel):
    email: str = Field(min_length=3, max_length=320)
    password: str = Field(min_length=8, max_length=256)


class AdminSessionUser(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str
    name: str
    roles: list[str]
    last_login_at: datetime | None = None


class AdminSessionResponse(BaseModel):
    access_token: str
    expires_in: int
    user: AdminSessionUser