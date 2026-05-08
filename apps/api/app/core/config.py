from functools import lru_cache
from typing import Literal

from pydantic import AnyUrl, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Portfolio API"
    app_env: Literal["development", "test", "staging", "production"] = "development"
    api_version: str = "v1"
    frontend_origin: AnyUrl | str = "http://localhost:3000"

    database_url: str | None = None
    redis_url: str | None = None
    ai_provider_api_key: SecretStr | None = None

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
