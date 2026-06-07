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

    # Local open-source embeddings — used only by the AI Lab RAG Explorer to
    # demonstrate open-source AI infrastructure (never calls OpenAI). Loaded
    # lazily via sentence-transformers with a deterministic offline fallback.
    # Lightweight free local model for constrained deployments.
    # This keeps semantic quality while avoiding the memory footprint of
    # bge-large, and still falls back deterministically if unavailable.
    local_embedding_model: str = "BAAI/bge-small-en-v1.5"
    local_embedding_dimensions: int = 384

    # When true, the AI Lab RAG Explorer uses the hosted OpenAI embedding model
    # instead of the local sentence-transformers model. Set
    # USE_OPENAI_EMBEDDINGS_FOR_LAB=true in the Render dashboard (or any env)
    # to activate this. Requires OPENAI_API_KEY to be set.
    use_openai_embeddings_for_lab: bool = False

    # LLM (Groq preferred; OpenAI fallback)
    llm_provider: Literal["groq", "openai"] = "groq"
    llm_model: str = "llama-3.3-70b-versatile"
    llm_temperature: float = 0.2
    llm_max_tokens: int = 700
    groq_api_key: SecretStr | None = None
    groq_base_url: str = "https://api.groq.com/openai/v1"

    # --- AI Lab / RAG Explorer (educational tool over user-supplied text) ----
    ai_lab_max_content_chars: int = 12000
    ai_lab_max_chunks: int = 40
    ai_lab_default_top_k: int = 4
    ai_lab_vector_preview_dims: int = 8

    # Retrieval / prompting
    rag_top_k: int = 6
    # Reject loosely-similar chunks. 0.15 was too permissive — almost every
    # cosine-similar chunk passed, including off-topic dev docs. 0.25 keeps
    # only chunks that are meaningfully related to the question.
    rag_min_similarity: float = 0.25
    rag_max_context_chars: int = 6000
    rag_chunk_size: int = 800
    rag_chunk_overlap: int = 120
    # Over-fetch this many candidate chunks per requested result before applying
    # the per-document cap, so a single long document cannot crowd out the
    # final top-k. Pool size = rag_top_k * rag_candidate_multiplier.
    rag_candidate_multiplier: int = 6
    # Maximum chunks contributed by any single document to one answer. Keeps
    # the context diverse across sources instead of quoting one document.
    rag_max_chunks_per_document: int = 3
    # HNSW search breadth. Higher = better recall, slightly slower. The corpus
    # is small, so we can afford a high value for near-exact recall.
    rag_hnsw_ef_search: int = 200

    # Public assistant abuse guard — per client IP, sliding 60s window.
    # Set to 0 to disable. Disabled automatically when app_env is "test".
    assistant_rate_limit_per_minute: int = 10

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


@lru_cache
def get_settings() -> Settings:
    return Settings()
