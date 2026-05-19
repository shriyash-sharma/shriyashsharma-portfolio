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
    # Local-only escape hatch when a corporate proxy breaks SSL verification.
    database_ssl_insecure: bool = False
    redis_url: str | None = None
    ai_provider_api_key: SecretStr | None = None

    # --- RAG / AI assistant configuration -----------------------------------
    # Embeddings
    embedding_provider: Literal["openai"] = "openai"
    embedding_model: str = "text-embedding-3-small"
    embedding_dimensions: int = 1536
    openai_api_key: SecretStr | None = None
    openai_base_url: str = "https://api.openai.com/v1"

    # LLM (Groq preferred; OpenAI fallback)
    llm_provider: Literal["groq", "openai"] = "groq"
    llm_model: str = "llama-3.3-70b-versatile"
    llm_temperature: float = 0.2
    llm_max_tokens: int = 700
    groq_api_key: SecretStr | None = None
    groq_base_url: str = "https://api.groq.com/openai/v1"

    # Retrieval / prompting
    rag_top_k: int = 5
    rag_min_similarity: float = 0.15
    rag_max_context_chars: int = 6000
    rag_chunk_size: int = 800
    rag_chunk_overlap: int = 120

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
