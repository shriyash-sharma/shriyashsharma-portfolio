from functools import lru_cache
from typing import Literal

from pydantic import AnyUrl, SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    app_name: str = "Portfolio API"
    app_env: Literal["development", "test", "staging", "production"] = "development"
    api_version: str = "v1"
    frontend_origin: AnyUrl | str = "http://localhost:3000"
    admin_jwt_secret: SecretStr = SecretStr("change-me-before-production")
    admin_session_ttl_minutes: int = 60 * 12
    admin_bootstrap_email: str = "admin@localhost"
    admin_bootstrap_password: SecretStr = SecretStr("changeme-admin-password")
    admin_bootstrap_name: str = "Platform Admin"
    media_storage_path: str = "./storage/media"
    media_public_url_base: str = "/media"

    database_url: str = (
        "postgresql+asyncpg://portfolio:portfolio@localhost:5433/portfolio"
    )
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
