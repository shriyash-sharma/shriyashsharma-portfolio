# Backend Architecture — Complete Engineering Walkthrough

> This document is a comprehensive, technically accurate walkthrough of the FastAPI backend in `apps/api/`. It covers architecture decisions, implementation details, request lifecycles, and operational workflows. Written for both senior engineers joining the platform and junior developers learning the codebase.

---

## Table of Contents

1. [System Overview and Design Philosophy](#1-system-overview-and-design-philosophy)
2. [Technology Stack and Why Each Choice Was Made](#2-technology-stack-and-why-each-choice-was-made)
3. [Folder Structure and Module Responsibilities](#3-folder-structure-and-module-responsibilities)
4. [Application Lifecycle — How the Server Starts](#4-application-lifecycle--how-the-server-starts)
5. [Configuration Management](#5-configuration-management)
6. [Database Architecture](#6-database-architecture)
7. [SQLAlchemy 2 Async Setup](#7-sqlalchemy-2-async-setup)
8. [Alembic Migration System](#8-alembic-migration-system)
9. [Domain Models and Schema Design](#9-domain-models-and-schema-design)
10. [Repository Pattern and Persistence Boundaries](#10-repository-pattern-and-persistence-boundaries)
11. [Pydantic Schema Architecture](#11-pydantic-schema-architecture)
12. [API Architecture and Route Organization](#12-api-architecture-and-route-organization)
13. [Dependency Injection System](#13-dependency-injection-system)
14. [Authentication and Authorization](#14-authentication-and-authorization)
15. [JWT Implementation and Security Boundaries](#15-jwt-implementation-and-security-boundaries)
16. [Admin / Public API Separation](#16-admin--public-api-separation)
17. [Content Modeling and CMS Workflow](#17-content-modeling-and-cms-workflow)
18. [Media Upload and Storage](#18-media-upload-and-storage)
19. [Service Layer Responsibilities](#19-service-layer-responsibilities)
20. [Boundary Modules — Feature Planning Architecture](#20-boundary-modules--feature-planning-architecture)
21. [SSE Streaming Architecture](#21-sse-streaming-architecture)
22. [Request Lifecycle — End-to-End Data Flow](#22-request-lifecycle--end-to-end-data-flow)
23. [Locale-Aware Content Handling](#23-locale-aware-content-handling)
24. [Draft/Publish Workflow](#24-draftpublish-workflow)
25. [Frontend/Backend Coordination and Same-Origin Proxy](#25-frontendbackend-coordination-and-same-origin-proxy)
26. [Error Handling Strategy](#26-error-handling-strategy)
27. [Logging and Observability](#27-logging-and-observability)
28. [Async Architecture and Concurrency Model](#28-async-architecture-and-concurrency-model)
29. [Testing Strategy](#29-testing-strategy)
30. [Docker and Local Development Infrastructure](#30-docker-and-local-development-infrastructure)
31. [Build System and Developer Workflow](#31-build-system-and-developer-workflow)
32. [Security Considerations](#32-security-considerations)
33. [Performance Characteristics](#33-performance-characteristics)
34. [Coding Standards and Conventions](#34-coding-standards-and-conventions)
35. [Current Architectural Limitations](#35-current-architectural-limitations)
36. [Future Extensibility Boundaries](#36-future-extensibility-boundaries)
37. [What a Senior Engineer Should Review](#37-what-a-senior-engineer-should-review)
38. [What a Junior Developer Must Understand](#38-what-a-junior-developer-must-understand)

---

## 1. System Overview and Design Philosophy

The backend is a **FastAPI application** serving as the API layer for an engineering portfolio platform. It provides:

- **Public content delivery** — published projects, articles, case studies served to the frontend
- **Admin dashboard API** — authenticated CRUD for content management
- **Media management** — image upload and serving for editorial workflows
- **Future-facing API boundaries** — search and assistant endpoints with stable contracts but placeholder implementations

### Core Design Philosophy

**Boundary-first architecture.** The codebase doesn't build features bottom-up. Instead, it defines API contracts, persistence boundaries, and service interfaces first — then fills in implementations. This is visible in how search and assistant endpoints exist with `implemented: false` responses, and how boundary modules (`ai/boundaries.py`, `search/boundaries.py`) document planned capabilities without faking them.

**Simplicity over premature complexity.** The system deliberately avoids:
- Distributed caching (no Redis dependency for core flows)
- Background task queues (no Celery/ARQ)
- External object storage (local filesystem for media)
- Third-party JWT libraries (hand-rolled HMAC-SHA256 tokens)

Each of these is a conscious tradeoff documented in the codebase comments and architecture decision records.

**Single-table content model.** All content types (projects, articles, case studies, etc.) share one `content_items` table with a type discriminator. This avoids premature table fragmentation and keeps the dashboard, API contracts, and future indexing surface uniform.

---

## 2. Technology Stack and Why Each Choice Was Made

| Technology | Version | Purpose | Why This Choice |
|---|---|---|---|
| **FastAPI** | ≥0.116 | Web framework | Native async, automatic OpenAPI docs, Pydantic integration, dependency injection system |
| **Python** | ≥3.12 | Runtime | Latest type syntax (`X | Y`), `StrEnum`, performance improvements |
| **SQLAlchemy** | ≥2.0.36 | ORM | SQLAlchemy 2.0 mapped_column style, native async support, type-safe column definitions |
| **asyncpg** | ≥0.30 | PostgreSQL driver | Fastest async PostgreSQL driver, required by SQLAlchemy async |
| **Alembic** | ≥1.14 | Migrations | Standard SQLAlchemy migration tool, async-compatible |
| **Pydantic** | v2 (via FastAPI) | Validation/serialization | Request/response validation, settings management, `model_dump(exclude_unset=True)` for partial updates |
| **pydantic-settings** | ≥2.7 | Configuration | `.env` file loading, typed settings with `SecretStr` for sensitive values |
| **uvicorn** | ≥0.32 | ASGI server | Standard production-grade ASGI server for FastAPI |
| **httpx** | ≥0.28 | HTTP client | Async HTTP client (dependency present for future service-to-service calls) |
| **python-multipart** | ≥0.0.20 | File uploads | Required by FastAPI for `UploadFile` / `Form` parameter parsing |
| **PostgreSQL** | 16 | Database | JSONB for flexible metadata, robust indexing, future pgvector support |

### Dev Dependencies

| Tool | Purpose |
|---|---|
| **ruff** | Linting + formatting (replaces flake8, isort, black) |
| **mypy** | Static type checking with strict mode and Pydantic plugin |
| **pytest** | Test framework |
| **pytest-asyncio** | Async test support with `asyncio_mode = "auto"` |

### What's Intentionally Absent

- **No `python-jose` or `PyJWT`** — JWT creation/validation is hand-implemented using `hmac` + `hashlib`. This avoids a dependency for a small, well-understood operation.
- **No `passlib` or `bcrypt`** — Password hashing uses PBKDF2-SHA256 via stdlib's `hashlib.pbkdf2_hmac`. 600,000 iterations. No external dependency needed.
- **No `celery` or task queue** — No background processing requirements exist yet.
- **No `redis`** — `redis_url` is defined in settings but not consumed by any active code path.

---

## 3. Folder Structure and Module Responsibilities

```
apps/api/
├── alembic.ini                  # Alembic configuration, points to app/db/migrations
├── Dockerfile                   # Production container (Python 3.12-slim + uv)
├── pyproject.toml               # Dependencies, tool config (ruff, mypy, pytest)
├── app/
│   ├── __init__.py
│   ├── main.py                  # Application factory — the composition root
│   │
│   ├── core/                    # Cross-cutting infrastructure
│   │   ├── config.py            # Typed settings (Pydantic BaseSettings)
│   │   ├── logging.py           # Logging bootstrap
│   │   └── security.py          # Password hashing, JWT create/decode, token extraction
│   │
│   ├── db/                      # Everything database
│   │   ├── base.py              # DeclarativeBase, UUID mixin, Timestamp mixin
│   │   ├── session.py           # Async engine + session factory
│   │   ├── models/              # SQLAlchemy ORM models
│   │   │   ├── __init__.py      # Re-exports ContentItem, AdminUser
│   │   │   ├── content.py       # ContentItem model + ContentType/PublishingStatus enums
│   │   │   └── admin_user.py    # AdminUser model
│   │   ├── repositories/        # Data access layer
│   │   │   ├── __init__.py
│   │   │   ├── content_repository.py     # Main content CRUD + filtering + slug normalization
│   │   │   ├── admin_user_repository.py  # Admin identity + bootstrap + authentication
│   │   │   ├── project_repository.py     # Thin subclass of ContentRepository
│   │   │   ├── article_repository.py     # Thin subclass of ContentRepository
│   │   │   └── case_study_repository.py  # Thin subclass of ContentRepository
│   │   └── migrations/          # Alembic migration scripts
│   │       ├── env.py           # Async migration runner
│   │       ├── script.py.mako   # Migration template
│   │       └── versions/
│   │           ├── 0001_create_content_items.py
│   │           └── 0002_create_admin_users.py
│   │
│   ├── api/                     # HTTP transport layer
│   │   ├── router.py            # Top-level router assembly
│   │   ├── routes/              # Route handlers
│   │   │   ├── health.py        # GET /health
│   │   │   ├── platform.py      # GET /platform (capability metadata)
│   │   │   ├── content.py       # GET /content, /content/{type}, /content/{type}/{slug}
│   │   │   ├── search.py        # POST /search (placeholder)
│   │   │   ├── assistant.py     # POST /assistant, /assistant/stream (placeholder)
│   │   │   ├── auth.py          # POST /auth/login, GET /auth/session, POST /auth/logout
│   │   │   └── admin/
│   │   │       ├── content.py   # Admin CRUD: list, overview, create, detail, update, delete
│   │   │       └── media.py     # Admin media: upload, list
│   │   └── dependencies/        # FastAPI Depends() factories
│   │       ├── auth.py          # require_admin_user, CurrentAdminUser type alias
│   │       ├── database.py      # DbSessionDep type alias
│   │       └── settings.py      # SettingsDep type alias
│   │
│   ├── schemas/                 # Pydantic models (request/response contracts)
│   │   ├── content.py           # ContentItemCreate/Update/Read, ContentListResponse, etc.
│   │   ├── auth.py              # AdminLoginRequest, AdminSessionResponse
│   │   ├── search.py            # SearchRequest/Response, SearchSource
│   │   ├── assistant.py         # AssistantRequest/Response, AssistantStreamEvent
│   │   ├── media.py             # MediaAssetRead, MediaListResponse, MediaUploadResponse
│   │   ├── health.py            # HealthResponse
│   │   └── platform.py          # PlatformCapability, PlatformResponse
│   │
│   ├── services/                # Business logic layer
│   │   ├── content_service.py   # Content collection registry (static metadata)
│   │   ├── search_service.py    # Search stub (returns implemented=false)
│   │   ├── assistant_service.py # Assistant stub + streaming stub
│   │   ├── media_storage.py     # LocalMediaStorage (filesystem read/write)
│   │   └── platform_service.py  # Platform capability metadata builder
│   │
│   ├── streaming/               # SSE encoding
│   │   └── sse.py               # encode_sse(), to_event_stream() async generator
│   │
│   ├── ai/                      # Feature boundary definitions
│   │   └── boundaries.py        # AI_BOUNDARIES dataclass list (retrieval, generation, evaluation)
│   ├── auth/
│   │   └── boundaries.py        # AUTH_BOUNDARIES (dashboard-session, service-token)
│   ├── content/
│   │   └── boundaries.py        # CONTENT_SOURCES (filesystem, cms, ingestion-api)
│   ├── search/
│   │   └── boundaries.py        # SEARCH_BOUNDARIES (keyword, vector, hybrid)
│   └── infrastructure/
│       └── database.py          # DatabaseReadiness check helper
│
├── scripts/
│   └── seed_content.py          # Database seeder for development content
├── storage/
│   └── media/                   # Local media file storage directory
└── tests/
    └── test_routes.py           # Synchronous route-level smoke tests
```

### Why This Layout

The structure follows a **layered architecture** with clear dependency direction:

```
routes → dependencies → repositories → models
  ↓          ↓              ↓
schemas    services       session/base
  ↓          ↓
core (config, security, logging)
```

Routes never import models directly for writes — they go through repositories. Routes never construct sessions — they receive them via dependency injection. This keeps each layer testable and replaceable independently.

---

## 4. Application Lifecycle — How the Server Starts

**Entry point:** `app/main.py`

```python
def create_app() -> FastAPI:
    configure_logging()
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.api_version,
        description="Backend foundation for the engineering portfolio platform.",
    )

    # CORS for frontend origin
    app.add_middleware(CORSMiddleware, ...)

    # Ensure media directory exists
    Path(settings.media_storage_path).mkdir(parents=True, exist_ok=True)

    # Mount static file serving for uploaded media
    app.mount(settings.media_public_url_base, StaticFiles(...), name="media")

    # Register all API routes
    app.include_router(api_router)

    return app

app = create_app()
```

### Startup sequence:

1. **`configure_logging()`** — Sets up stdlib logging with INFO level and timestamped format
2. **`get_settings()`** — Loads settings from environment variables / `.env` file (cached via `@lru_cache`)
3. **FastAPI instance creation** — Title, version, description from settings
4. **CORS middleware** — Allows the `frontend_origin` (default: `http://localhost:3000`) with credentials
5. **Media directory** — Creates `./storage/media` if it doesn't exist
6. **Static files mount** — Serves uploaded media at `/media/*` from the local filesystem
7. **Router registration** — All route groups attached to the app

### Why `create_app()` is a factory

The app is constructed inside a function rather than at module level so that:
- Tests can create isolated app instances
- Future startup hooks (e.g., database connection pools, warmup) can be added without restructuring
- The same assembly path works for both `uvicorn app.main:app` and test client instantiation

### Runtime: Uvicorn

**Development:** `uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
**Production (Docker):** `uv run uvicorn app.main:app --host 0.0.0.0 --port 8000`

---

## 5. Configuration Management

**File:** `app/core/config.py`

```python
class Settings(BaseSettings):
    app_name: str = "Portfolio API"
    app_env: Literal["development", "test", "staging", "production"] = "development"
    api_version: str = "v1"
    frontend_origin: AnyUrl | str = "http://localhost:3000"
    admin_jwt_secret: SecretStr = SecretStr("change-me-before-production")
    admin_session_ttl_minutes: int = 60 * 12    # 12 hours
    admin_bootstrap_email: str = "admin@localhost"
    admin_bootstrap_password: SecretStr = SecretStr("changeme-admin-password")
    admin_bootstrap_name: str = "Platform Admin"
    media_storage_path: str = "./storage/media"
    media_public_url_base: str = "/media"
    database_url: str = "postgresql+asyncpg://portfolio:portfolio@localhost:5433/portfolio"
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
```

### Key design decisions:

- **`SecretStr`** for `admin_jwt_secret`, `admin_bootstrap_password`, `ai_provider_api_key` — these never appear in logs, serialization, or repr output. You must call `.get_secret_value()` explicitly.
- **`@lru_cache`** on `get_settings()` — Settings are parsed once and reused for the process lifetime. This avoids repeated `.env` file reads.
- **`extra="ignore"`** — Unknown environment variables don't cause validation errors. This is important in Docker/CI environments where extra env vars may be present.
- **All fields have defaults** — The application can start with zero configuration for local development. Every default is overridable via environment variables.
- **`Literal` for `app_env`** — Only four valid environments. Typos in `APP_ENV` cause a startup validation error rather than silent misconfiguration.

### Environment variable mapping

Pydantic-settings automatically maps:
- `APP_NAME` → `app_name`
- `ADMIN_JWT_SECRET` → `admin_jwt_secret`
- `DATABASE_URL` → `database_url`
- etc.

Case-insensitive, underscore-separated.

---

## 6. Database Architecture

### Tables

The database has two tables:

#### `content_items`
The core content model. Stores all content types in a single table with a type discriminator.

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` (PK) | Auto-generated UUIDv4 |
| `type` | `ENUM(contenttype)` | project, case-study, article, architecture-note, experiment, research-log |
| `status` | `ENUM(publishingstatus)` | draft, review, published, archived |
| `locale` | `VARCHAR(8)` | Default: "en" |
| `slug` | `VARCHAR(160)` | URL-safe identifier, normalized on write |
| `title` | `VARCHAR(240)` | |
| `description` | `TEXT` | |
| `body` | `TEXT` (nullable) | Full content body |
| `seo_title` | `VARCHAR(240)` (nullable) | |
| `seo_description` | `TEXT` (nullable) | |
| `canonical_url` | `VARCHAR(500)` (nullable) | |
| `tags` | `JSONB` | Array of strings |
| `categories` | `JSONB` | Array of strings |
| `metadata` | `JSONB` | Flexible key-value store (mapped as `extra` in ORM to avoid Python keyword conflict) |
| `ai_indexable` | `BOOLEAN` | Opt-in for future AI indexing |
| `indexed_at` | `VARCHAR(64)` (nullable) | Timestamp of last AI indexing run |
| `published_at` | `VARCHAR(64)` (nullable) | ISO timestamp, auto-set on publish |
| `created_at` | `TIMESTAMP WITH TZ` | |
| `updated_at` | `TIMESTAMP WITH TZ` | Auto-updated on write |

**Constraints:**
- `uq_content_type_locale_slug` — UNIQUE on `(type, locale, slug)` — prevents duplicate content per locale
- `ix_content_type_status` — Composite index for filtered listings by type + status
- `ix_content_locale_slug` — Composite index for public content lookups by locale + slug

#### `admin_users`

| Column | Type | Notes |
|---|---|---|
| `id` | `UUID` (PK) | |
| `email` | `VARCHAR(320)` | UNIQUE, indexed |
| `name` | `VARCHAR(160)` | |
| `password_hash` | `VARCHAR(512)` | PBKDF2-SHA256 |
| `roles` | `JSONB` | Array of role strings (e.g., `["owner"]`) |
| `is_active` | `BOOLEAN` | Soft-disable without deletion |
| `last_login_at` | `TIMESTAMP WITH TZ` (nullable) | |
| `created_at` | `TIMESTAMP WITH TZ` | |
| `updated_at` | `TIMESTAMP WITH TZ` | |

### Why Single-Table Content

Instead of separate `projects`, `articles`, `case_studies` tables:

1. **Uniform dashboard** — One query surface for all content types in the admin UI
2. **Uniform API contract** — Same create/read/update/delete shape for every content type
3. **Uniform indexing surface** — Future search/vector indexing doesn't need type-specific adapters
4. **Lifecycle consistency** — Draft → review → published → archived works the same way for everything
5. **Simpler migrations** — Schema changes apply to all content types at once

The tradeoff: type-specific fields live in the `metadata` JSONB column rather than dedicated columns. This is acceptable because type-specific data is display-level (e.g., `stack`, `read_time`) rather than query-critical.

---

## 7. SQLAlchemy 2 Async Setup

**File:** `app/db/session.py`

```python
engine = create_async_engine(
    settings.database_url,
    pool_pre_ping=True,
    future=True,
)

AsyncSessionLocal = async_sessionmaker(
    bind=engine,
    expire_on_commit=False,
    autoflush=False,
)

async def get_db_session() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        yield session
```

### Design decisions:

- **`pool_pre_ping=True`** — Tests connections before using them from the pool. Prevents "connection closed" errors after PostgreSQL restarts or idle timeouts.
- **`expire_on_commit=False`** — After `commit()`, attributes on ORM objects remain accessible without triggering lazy loads. This is essential in async code where implicit I/O in attribute access would fail.
- **`autoflush=False`** — Prevents SQLAlchemy from automatically flushing pending changes before queries. Repositories control when commits happen explicitly.
- **`future=True`** — Enables SQLAlchemy 2.0 style engine behavior.

### Session lifecycle

Each HTTP request gets its own `AsyncSession` via FastAPI's dependency injection:

```
Request arrives
  → get_db_session() creates AsyncSession
    → Repository uses session for queries/mutations
      → Session is committed in repository methods
  → AsyncSession.__aexit__() closes session automatically
Request completes
```

The session is scoped to the request via Python's `async with` context manager, yielded through FastAPI's `Depends()` system.

**File:** `app/db/base.py`

```python
class Base(DeclarativeBase):
    pass

class TimestampMixin:
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )

class UUIDPrimaryKeyMixin:
    id: Mapped[UUID] = mapped_column(
        PostgresUUID(as_uuid=True),
        primary_key=True,
        default=uuid4,
    )
```

- **`DeclarativeBase`** — SQLAlchemy 2.0 style base class (replaces `declarative_base()`)
- **Mixins** — Shared column definitions used via multiple inheritance. `ContentItem` uses both; `AdminUser` uses only `UUIDPrimaryKeyMixin` (it defines its own timestamps because it doesn't use `TimestampMixin` — it has `last_login_at` as an extra field)
- **`lambda` defaults** — Server-side Python defaults using `datetime.now(UTC)`. These run at insert/update time, not at class definition time.

---

## 8. Alembic Migration System

**Config:** `alembic.ini` → `script_location = app/db/migrations`

**Migration runner:** `app/db/migrations/env.py`

The migration environment is configured for **async execution**:

```python
async def run_migrations_online() -> None:
    connectable = async_engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)
    await connectable.dispose()

if context.is_offline_mode():
    run_migrations_offline()
else:
    asyncio.run(run_migrations_online())
```

Key detail: `connection.run_sync(do_run_migrations)` bridges async and sync — Alembic's migration operations run synchronously inside the async connection's thread.

The `env.py` explicitly imports both models to ensure they're registered with `Base.metadata` before Alembic inspects the schema:

```python
from app.db.models import AdminUser, ContentItem
_ = ContentItem
_ = AdminUser
```

### Current migrations:

1. **`0001_create_content_items`** — Creates `content_items` table, ENUM types, composite indexes
2. **`0002_create_admin_users`** — Creates `admin_users` table, email index

### Migration workflow:

```bash
# Apply all migrations
cd apps/api
uv run alembic upgrade head

# Generate a new migration from model changes
uv run alembic revision --autogenerate -m "description"

# Downgrade one step
uv run alembic downgrade -1
```

### Design notes:

- Migration filenames use `0001_`, `0002_` prefixed numbering for readability and ordering
- PostgreSQL ENUM types are created explicitly with `create_type=False` in the model and `checkfirst=True` in migrations to prevent conflicts
- Downgrade functions always exist and properly drop indexes, tables, and enum types

---

## 9. Domain Models and Schema Design

### ContentItem Model (`app/db/models/content.py`)

The model uses Python `StrEnum` for type-safe enum values:

```python
class ContentType(StrEnum):
    PROJECT = "project"
    CASE_STUDY = "case-study"
    ARTICLE = "article"
    ARCHITECTURE_NOTE = "architecture-note"
    EXPERIMENT = "experiment"
    RESEARCH_LOG = "research-log"

class PublishingStatus(StrEnum):
    DRAFT = "draft"
    REVIEW = "review"
    PUBLISHED = "published"
    ARCHIVED = "archived"
```

Using `StrEnum` means enum values serialize as strings naturally, avoiding the `.value` ceremony in most contexts.

The `extra` column is mapped from the database column named `metadata`:

```python
extra: Mapped[dict[str, Any]] = mapped_column(
    "metadata",          # DB column name
    JSONB,
    default=dict,
    nullable=False,
)
```

This avoids Python keyword conflict with `metadata` (which is a SQLAlchemy `Base` attribute) while keeping the database column name semantic.

### AdminUser Model (`app/db/models/admin_user.py`)

A straightforward identity model with:
- `roles` as JSONB (flexible role list without a separate roles table)
- `is_active` for soft-disable
- `last_login_at` tracking

The model defines its own `created_at`/`updated_at` rather than using `TimestampMixin` — functionally identical but independent.

---

## 10. Repository Pattern and Persistence Boundaries

### Why Repositories

The backend enforces a rule: **route handlers never execute raw SQLAlchemy queries.** All database operations go through repository classes. This provides:

1. **Centralized query logic** — Filtering, slug normalization, and publish timestamp rules live in one place
2. **Testability** — Repositories can be mocked or replaced with in-memory implementations
3. **Consistency** — Public routes and admin routes use the same filtering logic through the same repository

### ContentRepository (`app/db/repositories/content_repository.py`)

This is the primary repository. It provides:

- **`list()`** — Filtered, paginated content listing with type/status/locale/query filters
- **`get()`** — Single item by UUID
- **`get_by_slug()`** — Single item by type + slug + locale (+ optional status filter)
- **`create()`** — Insert with slug normalization and publish timestamp resolution
- **`update()`** — Partial update using `model_dump(exclude_unset=True)` pattern
- **`delete()`** — Hard delete
- **`count_by_status()`** — Aggregated counts grouped by publishing status

**Slug normalization:**

```python
def _normalize_slug(value: str) -> str:
    slug = re.sub(r"[^a-z0-9]+", "-", value.strip().lower())
    slug = re.sub(r"-{2,}", "-", slug).strip("-")
    return slug or "untitled"
```

Every slug is lowercased, non-alphanumeric characters replaced with hyphens, multiple hyphens collapsed. Applied on both create and update.

**Publish timestamp resolution:**

```python
def _resolve_published_at(*, status, provided, current) -> str | None:
    if provided is not None:
        return provided                          # Explicit override always wins
    if status == ModelPublishingStatus.PUBLISHED:
        return current or datetime.now(UTC).isoformat()  # Auto-set on first publish
    return current if status == ModelPublishingStatus.ARCHIVED else None
```

Logic:
- If caller provides an explicit `published_at`, use it
- If status is "published" and no timestamp exists, auto-stamp with current time
- If status is "archived", preserve existing timestamp
- Otherwise (draft/review), clear the timestamp

**Search/filter implementation:**

The `_filtered_select()` private method builds a composable SQLAlchemy `Select` statement:

```python
def _filtered_select(self, *, content_type, status, locale, query) -> Select:
    statement = select(ContentItem)
    if content_type:
        statement = statement.where(ContentItem.type == ModelContentType(content_type))
    if status:
        statement = statement.where(ContentItem.status == ModelPublishingStatus(status))
    if locale:
        statement = statement.where(ContentItem.locale == locale)
    if query:
        pattern = f"%{query.strip()}%"
        statement = statement.where(
            or_(
                ContentItem.title.ilike(pattern),
                ContentItem.description.ilike(pattern),
                ContentItem.slug.ilike(pattern),
                cast(ContentItem.tags, String).ilike(pattern),
                cast(ContentItem.categories, String).ilike(pattern),
            )
        )
    return statement
```

The query search performs case-insensitive `ILIKE` across title, description, slug, tags, and categories. JSONB arrays are cast to String for the `ILIKE` match.

**Mapper function:**

```python
def to_content_read(item: ContentItem) -> ContentItemRead:
```

This standalone function (not a method) converts an ORM `ContentItem` to a Pydantic `ContentItemRead`. It's used by both public and admin routes. The mapping is explicit field-by-field rather than using `from_attributes=True` auto-mapping, because the ORM column `extra` maps to the schema field `metadata`.

### Type-Specific Repositories

```python
class ProjectRepository(ContentRepository):
    def __init__(self, session: AsyncSession) -> None:
        super().__init__(session)
        self.content_type = "project"
```

`ProjectRepository`, `ArticleRepository`, and `CaseStudyRepository` are thin subclasses that set a default content type. They exist as extension points but are **not currently used by any route** — all routes use `ContentRepository` directly with an explicit `content_type` parameter. These subclasses are ready for when type-specific query logic is needed.

### AdminUserRepository (`app/db/repositories/admin_user_repository.py`)

Handles:
- **`get_by_email()`** — Case-insensitive lookup
- **`get_by_id()`** — UUID lookup
- **`ensure_bootstrap_user()`** — Creates the initial admin user from config if not present
- **`authenticate()`** — Email/password verification, returns user or None, updates `last_login_at`

The bootstrap pattern means the first admin user is created lazily on the first login attempt, using credentials from environment variables. This avoids requiring a separate seed command for admin setup.

---

## 11. Pydantic Schema Architecture

**Directory:** `app/schemas/`

### Design principles:

1. **Separate schemas for Create, Update, and Read** — Never reuse the same model for input and output
2. **`exclude_unset=True` for partial updates** — `ContentItemUpdate` has all optional fields; `model_dump(exclude_unset=True)` only returns fields the client actually sent
3. **Literal types instead of Enums for API contracts** — `ContentType = Literal["project", "case-study", ...]` rather than Python enums. This keeps the API contract simple string-based.
4. **Field constraints at the schema level** — `min_length`, `max_length`, `ge`, `le` validated before hitting the database

### Schema breakdown:

**`content.py`:**
- `ContentItemBase` — Shared fields for create/read
- `ContentItemCreate(ContentItemBase)` — Input for POST, inherits all base fields
- `ContentItemUpdate(BaseModel)` — All fields optional for PATCH-style updates
- `ContentItemRead(ContentItemBase)` — Output with `id`, `indexed_at`, `created_at`, `updated_at` added, `from_attributes=True`
- `ContentListResponse` — Paginated list: `items` + `total`
- `ContentStatusCount`, `AdminContentOverviewResponse` — Dashboard aggregation

**`auth.py`:**
- `AdminLoginRequest` — Email + password with length constraints
- `AdminSessionUser` — User profile (id, email, name, roles), `from_attributes=True` for ORM conversion
- `AdminSessionResponse` — Token + expiry + user profile

**`search.py`:**
- `SearchRequest` — Query string + limit + optional type filter
- `SearchSource` — Individual result with title, type, excerpt, score
- `SearchResponse` — Query echo + sources list + `implemented: bool`

**`assistant.py`:**
- `AssistantRequest` — Query + optional session_id + locale
- `AssistantResponse` — Message + sources + `implemented: bool`
- `AssistantStreamEvent` — SSE event structure

**`media.py`:**
- `MediaAssetRead` — File metadata (id, filename, content_type, size, url, alt_text)
- `MediaListResponse`, `MediaUploadResponse` — Wrappers

**`health.py`:**
- `HealthResponse` — Status literal ("ok" | "degraded"), service name, environment, version, timestamp

**`platform.py`:**
- `PlatformCapability` — Module name, status ("planned" | "ready" | "disabled"), boundary type, description
- `PlatformResponse` — Name + version + capabilities list

### The `implemented` flag pattern

Search and assistant responses include `implemented: bool = False`. This is an explicit API contract that tells the frontend:
- The endpoint exists and returns valid JSON
- The data structure is stable
- The underlying functionality is not yet active

The frontend can conditionally render UI elements based on this flag.

---

## 12. API Architecture and Route Organization

**File:** `app/api/router.py`

```python
api_router = APIRouter()
api_router.include_router(health.router)        # /health
api_router.include_router(platform.router)       # /platform
api_router.include_router(content.router)        # /content/**
api_router.include_router(search.router)         # /search
api_router.include_router(assistant.router)      # /assistant/**
api_router.include_router(auth.router)           # /auth/**
api_router.include_router(admin_content.router)  # /admin/content/**
api_router.include_router(admin_media.router)    # /admin/media/**
```

### Route groups:

#### Public Routes (no authentication)

| Method | Path | Handler | Purpose |
|---|---|---|---|
| GET | `/health` | `health.health()` | Liveness check with environment info |
| GET | `/platform` | `platform.platform()` | Capability metadata for frontend feature flags |
| GET | `/content` | `content.content_collections()` | Collection definitions (types, routes, descriptions) |
| GET | `/content/{type}` | `content.public_content_list()` | Published items for a content type, paginated |
| GET | `/content/{type}/{slug}` | `content.public_content_detail()` | Single published item by slug |
| POST | `/search` | `search.search()` | Search boundary (not implemented) |
| POST | `/assistant` | `assistant.assistant()` | Assistant boundary (not implemented) |
| POST | `/assistant/stream` | `assistant.assistant_stream()` | SSE streaming boundary (not implemented) |

#### Auth Routes

| Method | Path | Handler | Purpose |
|---|---|---|---|
| POST | `/auth/login` | `auth.admin_login()` | Exchange credentials for JWT |
| GET | `/auth/session` | `auth.admin_session()` | Validate current session, return user profile |
| POST | `/auth/logout` | `auth.admin_logout()` | No-op server-side (cookie cleared by frontend) |

#### Admin Routes (require `CurrentAdminUser`)

| Method | Path | Handler | Purpose |
|---|---|---|---|
| GET | `/admin/content/{type}` | `admin_content.admin_content_list()` | All items (any status), filtered, paginated |
| GET | `/admin/content/{type}/overview` | `admin_content.admin_content_overview()` | Status counts for dashboard summary |
| POST | `/admin/content/{type}` | `admin_content.admin_content_create()` | Create new content item |
| GET | `/admin/content/items/{id}` | `admin_content.admin_content_detail()` | Single item by UUID (any status) |
| PUT | `/admin/content/items/{id}` | `admin_content.admin_content_update()` | Update item fields |
| DELETE | `/admin/content/items/{id}` | `admin_content.admin_content_delete()` | Delete item |
| GET | `/admin/media` | `admin_media.list_media_assets()` | List uploaded media |
| POST | `/admin/media` | `admin_media.upload_media_asset()` | Upload image |

### Key architectural note: Public routes enforce `status="published"`

Public content routes **always** filter by `status="published"`. Admin content routes allow all statuses. This is enforced at the route level, not at the repository level — the repository's `list()` and `get_by_slug()` accept status as a parameter, and the caller decides what to pass.

---

## 13. Dependency Injection System

FastAPI's `Depends()` system is used to inject three core dependencies:

### Database Session (`app/api/dependencies/database.py`)

```python
DbSessionDep = Annotated[AsyncSession, Depends(get_db_session)]
```

Used in route signatures as:
```python
async def some_route(session: DbSessionDep) -> ...:
```

`get_db_session()` is an async generator that yields an `AsyncSession` and cleans up after the request.

### Settings (`app/api/dependencies/settings.py`)

```python
SettingsDep = Annotated[Settings, Depends(get_settings)]
```

Injects the cached `Settings` instance. Used by health and platform routes.

### Authentication (`app/api/dependencies/auth.py`)

```python
AdminTokenDep = Annotated[str | None, Depends(get_optional_admin_token)]

async def require_admin_user(session: DbSessionDep, token: AdminTokenDep) -> AdminUser:
    # Validate token → decode JWT → look up user → check is_active
    ...

CurrentAdminUser = Annotated[AdminUser, Depends(require_admin_user)]
```

Admin routes use `CurrentAdminUser` in their signature:
```python
async def admin_content_list(_: CurrentAdminUser, session: DbSessionDep, ...) -> ...:
```

The `_` parameter name signals that the route doesn't use the user object directly — it's there only for the authentication side effect.

### Dependency chain:

```
CurrentAdminUser
  → require_admin_user()
    → DbSessionDep (get_db_session)
    → AdminTokenDep (get_optional_admin_token)
      → authorization header OR dashboard_access_token cookie
```

This chain means every admin route automatically:
1. Opens a database session
2. Extracts the token from header or cookie
3. Decodes and validates the JWT
4. Looks up the admin user
5. Verifies the user is active
6. Returns 401 if any step fails

---

## 14. Authentication and Authorization

### Authentication Flow

```
Frontend                         Backend
   │                                │
   │  POST /auth/login              │
   │  {email, password}             │
   │───────────────────────────────>│
   │                                │── ensure_bootstrap_user()
   │                                │── authenticate(email, password)
   │                                │   ├── get_by_email()
   │                                │   ├── verify_password()
   │                                │   └── update last_login_at
   │                                │── create_admin_access_token()
   │  {access_token, expires_in,    │
   │   user: {id, email, name, ...}}│
   │<───────────────────────────────│
   │                                │
   │  Store token in cookie         │
   │  (client-side, httpOnly)       │
   │                                │
   │  GET /admin/content/project    │
   │  Authorization: Bearer <token> │
   │  OR Cookie: dashboard_access_  │
   │  token=<token>                 │
   │───────────────────────────────>│
   │                                │── get_optional_admin_token()
   │                                │── decode_admin_access_token()
   │                                │── get_by_id(subject)
   │                                │── check is_active
   │  {items: [...], total: N}      │
   │<───────────────────────────────│
```

### Bootstrap user

On the first `POST /auth/login`, the `AdminUserRepository.ensure_bootstrap_user()` creates the initial admin user from environment variables:

```python
admin_bootstrap_email: str = "admin@localhost"
admin_bootstrap_password: SecretStr = SecretStr("changeme-admin-password")
admin_bootstrap_name: str = "Platform Admin"
```

This is called **on every login attempt** (idempotent — returns existing user if already created). The tradeoff: no separate bootstrap CLI command needed, but the bootstrap credentials are checked on every login.

### Role-based authorization

```python
def require_admin_role(user: AdminUser, role: str) -> AdminUser:
    roles = cast(list[str], user.roles)
    if role not in roles:
        raise HTTPException(status_code=403, detail="Insufficient permissions")
    return user
```

This function exists but is **not currently used by any route**. All admin routes only check that the user is authenticated and active. Role enforcement is prepared but not yet applied.

---

## 15. JWT Implementation and Security Boundaries

**File:** `app/core/security.py`

### Password Hashing

**Algorithm:** PBKDF2-SHA256 with 600,000 iterations

```python
def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)    # 128-bit random salt
    digest = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, 600_000)
    return f"pbkdf2_sha256$600000${b64url(salt)}${b64url(digest)}"
```

The hash format is `algorithm$iterations$salt$digest`, making it self-describing and verifiable without external config.

`verify_password()` uses `hmac.compare_digest()` for constant-time comparison, preventing timing attacks.

### JWT Implementation

The backend implements JWT **without any third-party library**. This is a deliberate choice for a small token surface area.

**Token creation:**

```python
def create_admin_access_token(*, user_id, email, roles) -> str:
    payload = {
        "sub": str(user_id),
        "email": email,
        "roles": list(roles),
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    # Manual JWT assembly: base64url(header) + "." + base64url(payload)
    # Signature: HMAC-SHA256(message, secret)
    return f"{header}.{payload}.{signature}"
```

**Token validation:**

```python
def decode_admin_access_token(token: str) -> dict | None:
    # 1. Split into header.payload.signature
    # 2. Recompute HMAC-SHA256 signature
    # 3. Constant-time compare signatures
    # 4. Decode payload
    # 5. Check expiration
    # Returns None for any validation failure (no error differentiation to callers)
```

### Token extraction

```python
async def get_optional_admin_token(
    authorization: Annotated[str | None, Header()] = None,
    dashboard_access_token: Annotated[str | None, Cookie()] = None,
) -> str | None:
    bearer_token = await get_optional_bearer_token(authorization)
    return bearer_token or dashboard_access_token
```

The backend accepts tokens from **two sources**:
1. `Authorization: Bearer <token>` header — for direct API clients
2. `dashboard_access_token` cookie — for the Next.js BFF proxy

Bearer header takes priority. This dual-source design supports both the same-origin dashboard (cookies) and external API consumers (bearer tokens).

---

## 16. Admin / Public API Separation

The separation is enforced at three levels:

### 1. Route prefix isolation
- Public: `/content/`, `/search`, `/assistant`
- Admin: `/admin/content/`, `/admin/media/`
- Auth: `/auth/` (mixed — login is public, session check is protected)

### 2. Dependency injection
- Public routes have no auth dependency
- Admin routes include `_: CurrentAdminUser` which triggers the full auth chain

### 3. Data filtering
- Public `content.public_content_list()` always passes `status="published"`
- Admin `admin_content.admin_content_list()` passes `status_filter` from query params (any status visible)

The `ContentRepository` itself is **status-agnostic** — it applies whatever filter the caller specifies. The security boundary lives in the routes, not the repository.

This design means a repository bug won't accidentally expose draft content through public routes (because the route itself enforces the published filter), and an admin route can always see everything.

---

## 17. Content Modeling and CMS Workflow

### Content lifecycle states:

```
DRAFT → REVIEW → PUBLISHED → ARCHIVED
  ↑        ↑         │           │
  └────────┴─────────-┘           │
  (can go back to draft)          │
  (can go back to review)        │
  (archived is terminal unless   │
   manually moved back)          │
```

States are stored as a PostgreSQL ENUM. State transitions are **not enforced by the backend** — any admin can set any status on any item. The states exist as a workflow convention, not as a state machine.

### Content collections

The platform defines six content types as a static registry:

```python
collections = [
    {"type": "project",           "route_base": "/projects",      "indexable": True},
    {"type": "case-study",        "route_base": "/case-studies",   "indexable": True},
    {"type": "article",           "route_base": "/blog",           "indexable": True},
    {"type": "architecture-note", "route_base": "/architecture",   "indexable": True},
    {"type": "experiment",        "route_base": "/experiments",    "indexable": False},
    {"type": "research-log",      "route_base": "/research",       "indexable": True},
]
```

The `indexable` flag signals to future AI/search systems which content types should be included in indexing pipelines. `experiment` is excluded by default.

The collection registry is served at `GET /content` so the frontend can discover available content types and their route mappings without hardcoding them.

### CMS workflow

1. Admin creates content via `POST /admin/content/{type}` with `status: "draft"`
2. Content is edited via `PUT /admin/content/items/{id}`
3. Admin changes status to "review" then "published"
4. When status becomes "published", `published_at` is auto-stamped
5. Public routes now return this item in listings and by slug
6. Setting status to "archived" hides from public but preserves `published_at`

---

## 18. Media Upload and Storage

**Service:** `app/services/media_storage.py`
**Route:** `app/api/routes/admin/media.py`

### Architecture

Media storage is **local filesystem only**. No external object storage, CDN, or database tracking.

```python
class LocalMediaStorage:
    def __init__(self):
        self.base_path = Path(settings.media_storage_path)   # ./storage/media
        self.public_base = settings.media_public_url_base     # /media

    async def save_image(self, upload: UploadFile, *, alt_text=None) -> StoredMediaAsset:
        # 1. Validate content_type starts with "image/"
        # 2. Generate UUID-based filename
        # 3. Organize in YYYY/MM subdirectories
        # 4. Write bytes to disk
        # 5. Return StoredMediaAsset with public URL

    def list_assets(self, *, limit=60) -> list[StoredMediaAsset]:
        # Walk filesystem, sort by mtime descending, return metadata
```

### File organization

```
storage/media/
  2026/05/
    a1b2c3d4-my-image.png
    e5f6g7h8-screenshot.jpg
  2026/06/
    ...
```

### URL serving

Media files are served by FastAPI's `StaticFiles` middleware, mounted at `/media`:

```python
app.mount(
    settings.media_public_url_base,    # "/media"
    StaticFiles(directory=settings.media_storage_path),
    name="media",
)
```

A file at `storage/media/2026/05/abc-photo.jpg` is accessible at `http://localhost:8000/media/2026/05/abc-photo.jpg`.

### Design tradeoff

Serving media from the application process is intentionally simple. The comment in `main.py`:

> Media is served from the same process during the current platform stage to keep editorial workflows simple while the dashboard and local storage model mature.

When the platform needs CDN, image transformations, or large-scale storage, the `LocalMediaStorage` class can be replaced with an S3/R2 implementation behind the same interface.

---

## 19. Service Layer Responsibilities

The `services/` directory contains business logic that doesn't belong in routes (transport) or repositories (persistence).

### `content_service.py` — Collection Registry

Returns the static list of content collections. This is a **pure function** with no database access. The registry is platform configuration, not dynamic data.

### `platform_service.py` — Capability Metadata

Returns platform capabilities with their implementation status:

```python
capabilities = [
    {"module": "content",       "status": "ready",    "boundary": "service"},
    {"module": "search",        "status": "planned",  "boundary": "api"},
    {"module": "assistant",     "status": "planned",  "boundary": "api"},
    {"module": "observability", "status": "planned",  "boundary": "external"},
]
```

This is consumed by the frontend to conditionally enable/disable UI features.

### `search_service.py` — Search Stub

```python
async def semantic_search(payload: SearchRequest) -> SearchResponse:
    return SearchResponse(query=payload.query, sources=[], implemented=False)
```

The contract is ready. The implementation would add: query normalization, keyword + vector retrieval, reranking, and source citation.

### `assistant_service.py` — Assistant Stub

Provides both synchronous and streaming response stubs:

```python
async def answer_assistant_query(payload) -> AssistantResponse:
    return AssistantResponse(message="Not implemented yet.", sources=[], implemented=False)

async def stream_assistant_events(payload) -> AsyncGenerator[dict, None]:
    yield {"type": "status", "message": "Streaming boundary is ready.", "implemented": False}
    yield {"type": "done", "message": f"Received query with {len(payload.query)} characters."}
```

### `media_storage.py` — File System Storage

Covered in section 18. The only service with actual I/O logic (filesystem reads/writes).

---

## 20. Boundary Modules — Feature Planning Architecture

The `ai/`, `auth/`, `content/`, `search/`, and `infrastructure/` directories each contain a `boundaries.py` file. These are **not runtime code** — they are structured documentation of planned feature boundaries.

### Purpose

These frozen dataclasses define what the platform intends to build, without pretending any of it exists:

```python
# ai/boundaries.py
AI_BOUNDARIES = [
    AiBoundary(name="retrieval",  responsibility="Fetch and rank source chunks...", implemented=False),
    AiBoundary(name="generation", responsibility="Call model providers...",          implemented=False),
    AiBoundary(name="evaluation", responsibility="Track citation coverage...",       implemented=False),
]

# search/boundaries.py
SEARCH_BOUNDARIES = [
    SearchBoundary(strategy="keyword", description="Future lexical search..."),
    SearchBoundary(strategy="vector",  description="Future pgvector retrieval..."),
    SearchBoundary(strategy="hybrid",  description="Future rank fusion..."),
]
```

### Why this pattern matters

1. **No accidental scope creep** — Features are documented as planned, not faked as implemented
2. **Onboarding clarity** — New engineers can read boundary files to understand the platform roadmap
3. **Architecture-first** — Boundaries are defined before implementation, ensuring the system's shape is intentional
4. **Grep-friendly** — `implemented=False` across the codebase shows exactly what's real vs planned

---

## 21. SSE Streaming Architecture

**File:** `app/streaming/sse.py`

```python
def encode_sse(event: str, data: dict) -> str:
    return f"event: {event}\ndata: {json.dumps(data)}\n\n"

async def to_event_stream(events: AsyncIterable[dict]) -> AsyncGenerator[str, None]:
    async for event in events:
        event_name = str(event.get("type", "message"))
        yield encode_sse(event_name, event)
```

Used by the assistant streaming endpoint:

```python
@router.post("/stream")
async def assistant_stream(payload: AssistantRequest) -> StreamingResponse:
    return StreamingResponse(
        to_event_stream(stream_assistant_events(payload)),
        media_type="text/event-stream",
    )
```

### Design:

- Events are async generators — the service yields events as they're produced
- `to_event_stream()` wraps any async iterable into SSE format
- FastAPI's `StreamingResponse` sends events as they arrive, keeping the connection open
- Event type comes from the `type` key in each yielded dict

This is the exact pattern needed for future LLM streaming: the assistant service would yield tokens/chunks as async events, and the SSE layer would format and stream them to the frontend.

---

## 22. Request Lifecycle — End-to-End Data Flow

### Example: `GET /content/project/platform-infrastructure-rewrite`

```
1. HTTP request arrives at Uvicorn
   ↓
2. FastAPI routing matches /content/{content_type}/{slug}
   → content_type = "project", slug = "platform-infrastructure-rewrite"
   ↓
3. Dependency injection:
   → get_db_session() opens AsyncSession
   → locale defaults to "en" (query param)
   ↓
4. Route handler: public_content_detail()
   ↓
5. ContentRepository(session) constructed
   ↓
6. repository.get_by_slug(
       content_type="project",
       slug="platform-infrastructure-rewrite",
       locale="en",
       status="published"      ← enforced by public route
   )
   ↓
7. _filtered_select() builds:
   SELECT * FROM content_items
   WHERE type = 'project'
     AND status = 'published'
     AND locale = 'en'
     AND slug = 'platform-infrastructure-rewrite'
   ↓
8. await session.execute(statement)
   → asyncpg sends query to PostgreSQL
   → result returned as ContentItem ORM object
   ↓
9. result.scalar_one_or_none()
   → returns ContentItem or None
   ↓
10. If None → raise HTTPException(404)
    If found → to_content_read(item) converts to Pydantic model
    ↓
11. FastAPI serializes ContentItemRead to JSON
    ↓
12. AsyncSession.__aexit__() closes/returns session to pool
    ↓
13. HTTP 200 response with JSON body
```

### Example: `POST /admin/content/article` (authenticated)

```
1. HTTP request with Authorization: Bearer <token>
   Body: {"type": "article", "slug": "My New Article", ...}
   ↓
2. FastAPI routing matches /admin/content/{content_type}
   ↓
3. Dependency resolution:
   a. get_db_session() → AsyncSession
   b. get_optional_admin_token()
      → reads Authorization header → extracts Bearer token
      → (or reads dashboard_access_token cookie)
   c. require_admin_user()
      → decode_admin_access_token(token)
        → split header.payload.signature
        → recompute HMAC-SHA256
        → constant-time compare
        → check expiration
        → return payload dict
      → AdminUserRepository(session).get_by_id(payload["sub"])
      → check user.is_active
      → return AdminUser
   ↓
4. Pydantic validates request body as ContentItemCreate
   → slug, title, description field constraints checked
   ↓
5. Route handler: admin_content_create()
   → Checks payload.type == content_type (path vs body consistency)
   ↓
6. ContentRepository(session).create(payload)
   → _normalize_slug("My New Article") → "my-new-article"
   → _resolve_published_at(status=draft, provided=None, current=None) → None
   → ContentItem(**fields) constructed
   → session.add(item)
   → await session.commit()
   → await session.refresh(item)     ← reloads server-generated fields (id, timestamps)
   ↓
7. If IntegrityError (duplicate type+locale+slug):
   → session.rollback()
   → HTTP 409 "Content item already exists..."
   ↓
8. to_content_read(item) → ContentItemRead
   ↓
9. HTTP 201 response with JSON body
```

---

## 23. Locale-Aware Content Handling

### Database level

The `content_items` table has:
- `locale` column (`VARCHAR(8)`, default `"en"`)
- `UNIQUE(type, locale, slug)` constraint — same slug can exist in different locales

This means you can have:
- `(project, en, platform-rewrite)` — English version
- `(project, ja, platform-rewrite)` — Japanese version

These are separate rows, not linked by a foreign key. They share a slug by convention.

### API level

Public routes accept `locale` as a query parameter (default: `"en"`):

```python
@router.get("/{content_type}")
async def public_content_list(
    content_type: ContentType,
    session: DbSessionDep,
    locale: str = "en",
    ...
):
```

Admin routes also accept `locale` as a filter. The repository applies locale filtering in `_filtered_select()`.

### Frontend coordination

The Next.js frontend's middleware (`proxy.ts`) handles locale detection and routing:
1. Detects locale from URL path, cookie, or `Accept-Language` header
2. Default locale (`en`) stays unprefixed in URLs
3. Non-default locales get path-prefixed (`/ja/projects`) but are rewritten to the same route tree
4. Locale is passed to API calls as a query parameter

---

## 24. Draft/Publish Workflow

### Status transitions and their effects:

| From | To | `published_at` behavior |
|---|---|---|
| draft | review | Cleared to `None` |
| review | published | Auto-set to current ISO timestamp (if not already set) |
| published | archived | Preserved (keeps original publish date) |
| any | draft | Cleared to `None` |
| any | published (with explicit date) | Uses provided date |

### How published_at resolution works:

The `_resolve_published_at()` function in the content repository:

```python
def _resolve_published_at(*, status, provided, current):
    if provided is not None:        return provided           # Explicit always wins
    if status == PUBLISHED:         return current or now()   # First publish auto-stamps
    if status == ARCHIVED:          return current            # Preserve date
    return None                                               # Draft/review: clear
```

### Public visibility:

Only items with `status = "published"` appear in public API responses. The public routes pass `status="published"` to the repository, which adds `WHERE status = 'published'` to every query.

---

## 25. Frontend/Backend Coordination and Same-Origin Proxy

### Architecture

The Next.js frontend and FastAPI backend run as separate services:

```
Browser ──→ Next.js (:3000) ──→ FastAPI (:8000) ──→ PostgreSQL (:5432)
```

### Same-origin session management

The dashboard uses cookie-based sessions. The flow:

1. User logs in through the Next.js login page
2. Next.js calls `POST /auth/login` on the FastAPI backend
3. Backend returns `{access_token, expires_in, user}`
4. Next.js stores the token in a `dashboard_access_token` cookie (httpOnly, same-site)
5. Subsequent requests to the backend include this cookie automatically
6. The backend's `get_optional_admin_token()` reads the cookie OR bearer header

### Why same-origin

From the Next.js middleware (`proxy.ts`):

```typescript
if (normalizedPath.startsWith("/dashboard") && !hasDashboardSession) {
    // Redirect to /login
}
if (normalizedPath === "/login" && hasDashboardSession) {
    // Redirect to /dashboard
}
```

Same-origin cookies avoid:
- Cross-origin CORS complexity for auth flows
- Third-party cookie restrictions in browsers
- Token management in JavaScript (XSS risk)

The backend supports both cookie and bearer token for flexibility: the dashboard uses cookies, direct API clients (curl, Postman, future integrations) use bearer tokens.

### CORS configuration

```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(settings.frontend_origin)],  # http://localhost:3000
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

Only the configured frontend origin is allowed. `allow_credentials=True` enables cookie transmission.

---

## 26. Error Handling Strategy

### HTTP error pattern

The backend uses FastAPI's `HTTPException` for all error responses:

```python
raise HTTPException(status_code=404, detail="Content item not found")
raise HTTPException(status_code=401, detail="Authentication required")
raise HTTPException(status_code=409, detail="Content item already exists...")
raise HTTPException(status_code=400, detail="Path type and body type differ")
raise HTTPException(status_code=400, detail="Only image uploads are supported")
```

### Key patterns:

1. **No custom exception classes** — `HTTPException` with descriptive `detail` strings covers all current needs
2. **Repository errors bubble up** — `IntegrityError` from SQLAlchemy is caught at the route level, rolled back, and converted to HTTP 409
3. **Auth failures are uniform** — All auth issues return 401 with generic messages. No differentiation between "invalid token", "expired token", or "user not found" — this prevents information leakage
4. **Validation errors are automatic** — Pydantic validation failures return 422 with field-level error details (handled by FastAPI, not custom code)
5. **No global exception handler** — Unhandled exceptions become 500 Internal Server Error via FastAPI's default behavior

### What's intentionally missing:

- No structured error codes (e.g., `ERR_CONTENT_NOT_FOUND`) — the `detail` string is sufficient for the current frontend
- No error logging middleware — errors are logged by uvicorn's default access log
- No retry logic — the API is stateless, clients can retry on failure

---

## 27. Logging and Observability

**File:** `app/core/logging.py`

```python
def configure_logging() -> None:
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(name)s %(message)s",
    )
```

### Current state:

- **Minimal stdlib logging** — INFO level, console output, timestamped format
- **No structured logging** (no JSON log format)
- **No request ID tracking**
- **No APM integration**
- **No metrics collection**

### Planned (from platform capabilities):

```python
PlatformCapability(
    module="observability",
    status="planned",
    boundary="external",
    description="Future request, retrieval, and assistant quality telemetry.",
)
```

### What's observable today:

- Uvicorn access logs (method, path, status, response time)
- Python INFO/WARNING/ERROR logs from any module using stdlib logging
- PostgreSQL query logs (if enabled at database level)
- Docker container stdout/stderr

---

## 28. Async Architecture and Concurrency Model

### Why async everywhere

The entire backend stack is async:
- FastAPI route handlers are `async def`
- SQLAlchemy uses `AsyncSession` and `AsyncEngine`
- The PostgreSQL driver is `asyncpg` (native async, not wrapped sync)
- File I/O in media storage uses `await upload.read()` (FastAPI's async file handling)

### Concurrency model

Uvicorn runs a single-process, single-thread event loop (by default). Concurrency comes from async I/O:

```
Request A (waiting for DB query)  ← event loop switches away
Request B (processing response)   ← event loop runs this
Request A (DB result ready)       ← event loop resumes this
```

No threading, no multiprocessing by default. For production scale, uvicorn's `--workers N` flag or a process manager (gunicorn with uvicorn workers) adds parallelism.

### Key async details:

1. **`expire_on_commit=False`** — Without this, accessing ORM attributes after commit would trigger lazy loads, which are synchronous operations that would block the event loop
2. **`autoflush=False`** — Prevents implicit I/O during attribute access
3. **No `run_in_executor`** — No CPU-bound operations that need thread pool offloading (yet)
4. **Media file write is synchronous** — `target_path.write_bytes(content)` in `media_storage.py` is a blocking call. For small image uploads this is acceptable; for large files it would need `aiofiles` or executor offloading

---

## 29. Testing Strategy

**File:** `apps/api/tests/test_routes.py`

### Current test coverage:

```python
def test_health_route()                          # GET /health → 200
def test_platform_route()                        # GET /platform → 200, has capabilities
def test_content_route()                         # GET /content → 200, has collections
def test_search_boundary()                       # POST /search → 200, implemented=false
def test_assistant_boundary()                    # POST /assistant → 200, implemented=false
def test_admin_content_requires_authentication() # GET /admin/content/project → 401
def test_admin_media_requires_authentication()   # GET /admin/media → 401
```

### Test architecture:

- **Synchronous `TestClient`** — Uses FastAPI's sync test client, not async. This works because TestClient internally runs the ASGI app in a thread.
- **No database** — Tests hit routes that don't require database access (health, platform, content collections) or verify auth rejection (which fails before DB access)
- **Smoke tests** — These verify route registration, response shapes, and auth enforcement. They don't test database operations.

### Configuration:

```toml
[tool.pytest.ini_options]
asyncio_mode = "auto"      # Async tests don't need @pytest.mark.asyncio
testpaths = ["tests"]
pythonpath = ["."]          # Import app as a package
```

### What's missing:

- No database integration tests (would need test database setup/teardown)
- No repository unit tests
- No auth flow integration tests (login → token → protected route)
- No media upload tests
- No factory/fixture library for test data

---

## 30. Docker and Local Development Infrastructure

### Docker Compose (`docker-compose.yml`)

Three services:

```yaml
services:
  web:        # Next.js frontend
    ports: ["3000:3000"]
    environment:
      API_INTERNAL_URL: http://api:8000    # Backend URL (Docker network)
      NEXT_PUBLIC_API_URL: http://localhost:8000
    depends_on: [api]

  api:        # FastAPI backend
    command: uv run uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
    ports: ["8000:8000"]
    environment:
      DATABASE_URL: postgresql+asyncpg://portfolio:portfolio@postgres:5432/portfolio
      FRONTEND_ORIGIN: http://localhost:3000
    volumes: ["./apps/api:/app"]    # Live reload via volume mount
    depends_on: [postgres]

  postgres:   # PostgreSQL 16
    ports: ["5433:5432"]     # Host port 5433 to avoid conflicts
    environment:
      POSTGRES_DB: portfolio
      POSTGRES_USER: portfolio
      POSTGRES_PASSWORD: portfolio
```

### Key details:

- **Volume mounts** — `./apps/api:/app` enables hot reload. Code changes on the host are reflected immediately via uvicorn's `--reload`.
- **Port mapping** — PostgreSQL is exposed on host port **5433** (not 5432) to avoid conflicts with locally installed PostgreSQL.
- **Network** — All services communicate via Docker's internal network. The API connects to PostgreSQL at `postgres:5432` (Docker hostname), not `localhost:5433`.
- **Named volumes** — `postgres_data` persists database data across container restarts. `web_node_modules` caches frontend dependencies.

### Dockerfile (`apps/api/Dockerfile`)

```dockerfile
FROM python:3.12-slim AS base
ENV PYTHONDONTWRITEBYTECODE=1 PYTHONUNBUFFERED=1 UV_LINK_MODE=copy
WORKDIR /app
RUN pip install --no-cache-dir uv
COPY pyproject.toml README.md ./
RUN uv sync --no-dev           # Install production dependencies only
COPY app ./app
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

- **`python:3.12-slim`** — Minimal base image
- **`uv`** — Used instead of pip for fast, deterministic dependency resolution
- **Layer ordering** — `pyproject.toml` is copied before source code so dependency installation is cached unless dependencies change
- **`--no-dev`** — Production image excludes dev tools (ruff, mypy, pytest)

---

## 31. Build System and Developer Workflow

### Package management: `uv`

```bash
cd apps/api
uv sync              # Install all dependencies (dev + prod)
uv sync --no-dev     # Production only
uv run uvicorn ...   # Run with uv's managed environment
uv run pytest        # Run tests
uv run alembic ...   # Run migrations
```

### Linting and formatting: `ruff`

```toml
[tool.ruff]
line-length = 88
target-version = "py312"

[tool.ruff.lint]
select = ["E", "F", "I", "B", "UP", "ASYNC"]
# E = pycodestyle errors
# F = pyflakes
# I = isort (import sorting)
# B = bugbear (common pitfalls)
# UP = pyupgrade (modern Python syntax)
# ASYNC = async-specific rules
```

```bash
uv run ruff check .       # Lint
uv run ruff format .      # Format
```

### Type checking: `mypy`

```toml
[tool.mypy]
python_version = "3.12"
strict = true
warn_return_any = true
warn_unused_configs = true
plugins = ["pydantic.mypy"]
```

Strict mode means: all functions need type annotations, no implicit `Any`, no untyped definitions.

### Seed data

```bash
cd apps/api
uv run python scripts/seed_content.py
```

Seeds three sample items (project, case study, article) with published status.

### Typical workflow:

```bash
# Start infrastructure
docker compose up postgres -d

# Run migrations
cd apps/api && uv run alembic upgrade head

# Seed data
uv run python scripts/seed_content.py

# Start API server with hot reload
uv run uvicorn app.main:app --reload --port 8000

# Or run everything together
docker compose up
```

---

## 32. Security Considerations

### What's implemented:

| Area | Implementation |
|---|---|
| **Password storage** | PBKDF2-SHA256, 600K iterations, 128-bit random salt |
| **Token signing** | HMAC-SHA256, constant-time signature comparison |
| **Token expiration** | Bounded TTL (12 hours default), checked on every request |
| **CORS** | Restricted to single frontend origin |
| **Input validation** | Pydantic enforces field lengths, types, and constraints |
| **SQL injection** | SQLAlchemy parameterized queries (no raw SQL) |
| **Auth uniformity** | All auth failures return same 401 (no info leakage) |
| **Secret handling** | `SecretStr` for passwords and keys (excluded from logs/repr) |
| **File upload validation** | Content-type whitelist (images only) |
| **Slug normalization** | Prevents path traversal via slug injection |

### What should be added for production:

| Area | Recommendation |
|---|---|
| **Rate limiting** | No request rate limiting. Add per-IP and per-user limits. |
| **CSRF protection** | Cookie-based auth without CSRF tokens. The `SameSite` cookie attribute mitigates but doesn't eliminate. |
| **File size limits** | No max upload size enforcement in code (uvicorn has a default body limit). |
| **Content Security Policy** | No CSP headers. Add via middleware or reverse proxy. |
| **Secrets rotation** | JWT secret is static. No rotation mechanism. |
| **Audit logging** | No admin action logging. Add for compliance/debugging. |
| **Token revocation** | No token blocklist. Logout is client-side only. A compromised token is valid until expiration. |
| **HTTPS** | No TLS termination. Assumed to be handled by reverse proxy in production. |

---

## 33. Performance Characteristics

### What's optimized:

- **Connection pooling** — SQLAlchemy's `create_async_engine` maintains a connection pool with `pool_pre_ping`
- **Async I/O** — No thread blocking on database queries or network I/O
- **Composite indexes** — `(type, status)` and `(locale, slug)` cover the primary query patterns
- **Paginated responses** — All list endpoints accept `limit` and `offset`
- **Single query pattern** — Repository methods execute one query per operation (no N+1)
- **Settings caching** — `@lru_cache` prevents repeated config parsing

### What's not optimized (and doesn't need to be yet):

- **No response caching** — Every request hits the database. Acceptable for the current scale.
- **No query result caching** — No Redis or in-memory cache layer.
- **No database read replicas** — Single PostgreSQL instance.
- **Media serving from app process** — Would need CDN/nginx for production scale.
- **Synchronous file writes** — `path.write_bytes()` blocks the event loop briefly. Acceptable for small images.
- **Full table scans for text search** — `ILIKE` queries don't use indexes. Acceptable for small datasets; would need full-text search or trigram indexes at scale.

---

## 34. Coding Standards and Conventions

### Python style:

- **Type annotations everywhere** — mypy strict mode enforced
- **Modern Python syntax** — `X | Y` union types, `StrEnum`, `Mapped[]` column types
- **Ruff-enforced formatting** — 88 char line length, double quotes, space indentation
- **Import ordering** — stdlib → third-party → local (enforced by ruff `I` rules)
- **Docstrings on modules** — Every `.py` file has a module-level docstring explaining purpose and boundaries
- **No `# type: ignore`** — Code is written to satisfy strict mypy without escape hatches

### Architectural conventions:

- **Dependencies flow inward** — Routes → Services → Repositories → Models → Base
- **No circular imports** — Strict layering prevents cycles
- **Repository methods commit** — Each repository write method calls `commit()` + `refresh()`. The caller doesn't manage transactions.
- **Schemas separate from models** — Pydantic schemas in `schemas/`, SQLAlchemy models in `db/models/`. Never mixed.
- **`Annotated` type aliases for dependencies** — `DbSessionDep`, `CurrentAdminUser`, `SettingsDep` provide readable, reusable dependency declarations
- **Route prefixes in module** — Each route module declares its own prefix (`/content`, `/admin/content`, etc.)
- **Tags for OpenAPI grouping** — Each router has a `tags=["..."]` for automatic API doc organization

---

## 35. Current Architectural Limitations

These are **intentional simplifications**, not bugs:

| Limitation | Why It Exists | When to Address |
|---|---|---|
| **No background tasks** | No features require async processing yet | When AI indexing, email, or heavy media processing is added |
| **No caching layer** | Dataset is small, queries are fast | When response latency matters at scale |
| **No token revocation** | Simple session model, logout is client-side | When compliance requires server-side session management |
| **No state machine for content status** | Workflow flexibility > enforcement | When editorial errors become a real problem |
| **No file metadata in database** | Filesystem listing is sufficient | When media needs search, tagging, or CDN URLs |
| **Local media storage** | Simple editorial loop > infrastructure complexity | When storage exceeds local disk or CDN is needed |
| **Hand-rolled JWT** | Small surface area, no dependency needed | If JWT complexity grows (refresh tokens, JWK rotation) |
| **No pagination cursors** | Offset pagination is simple and sufficient | When deep pagination performance matters |
| **ILIKE text search** | Works for small datasets | When content volume requires full-text or vector search |
| **Single database** | No read/write split needed | When read traffic justifies replicas |
| **No API versioning** | Single consumer (own frontend) | When external API consumers exist |
| **Bootstrap user on every login** | Avoids CLI setup step | When user management has proper admin flows |

---

## 36. Future Extensibility Boundaries

The codebase explicitly reserves space for future features without implementing them:

### AI/RAG Preparation

- `ai_indexable` field on ContentItem — opt-in flag for content indexing
- `indexed_at` field — tracks when content was last indexed
- `ai/boundaries.py` — documents retrieval, generation, and evaluation boundaries
- `search/boundaries.py` — documents keyword, vector, and hybrid search strategies
- `SearchResponse.implemented` flag — tells frontend when real search arrives
- `AssistantResponse.implemented` flag — same for assistant
- `ai_provider_api_key` in settings — ready for model provider integration

### Infrastructure Readiness

- `redis_url` in settings — ready for caching/sessions
- `infrastructure/database.py` — `pgvector_ready: False` flag
- SSE streaming — ready for real-time LLM token streaming
- Service layer separation — search and assistant services can be swapped without route changes

### Content Extensibility

- `metadata` JSONB column — type-specific fields without schema changes
- Content type enum — adding a new type requires one enum value, not a new table
- Collection registry — frontend discovers content types dynamically

---

## 37. What a Senior Engineer Should Review

1. **JWT without a library** — The hand-rolled JWT in `core/security.py` is correct but non-standard. Verify the HMAC-SHA256 implementation handles edge cases (empty payloads, Unicode, etc.). Consider whether adding `PyJWT` reduces risk.

2. **Transaction boundaries** — Repositories call `commit()` internally. If a future flow needs atomic operations across multiple repositories, the transaction model needs rethinking (unit-of-work pattern or explicit session management at the service layer).

3. **Bootstrap user idempotency** — `ensure_bootstrap_user()` runs on every login attempt. Under concurrent requests, there's a potential race condition on first bootstrap. The UNIQUE constraint on email would catch it, but the error handling path isn't tested.

4. **Media storage scalability** — `list_assets()` does `rglob("*")` on the filesystem. For thousands of files, this becomes slow. Needs database tracking or manifest file.

5. **Sync file I/O in async context** — `path.write_bytes()` in `media_storage.py` blocks the event loop. For production, wrap in `asyncio.to_thread()` or use `aiofiles`.

6. **ILIKE search without indexes** — The search filter casts JSONB to String for ILIKE. This triggers full table scans. At scale, add GIN indexes on tags/categories and trigram indexes on title/description.

7. **No request-scoped logging** — No request ID or correlation ID. When debugging production issues across multiple concurrent requests, logs will be interleaved without context.

8. **Settings singleton** — `@lru_cache` on `get_settings()` means settings cannot be changed without process restart. This is fine for 12-factor apps but prevents runtime configuration updates.

---

## 38. What a Junior Developer Must Understand

### Before touching any code:

1. **Dependency injection** — Understand how `Depends()` and `Annotated` work in FastAPI. Every route parameter that uses a type alias like `DbSessionDep` or `CurrentAdminUser` is injected by the framework, not passed by the caller.

2. **Async/await** — Every `async def` function must be `await`ed. Database operations use `await session.execute()`. Never call blocking I/O without `await`.

3. **The layering rule** — Routes call repositories (or services). Repositories call the database. Never query the database directly in a route handler.

4. **Pydantic models vs SQLAlchemy models** — They look similar but serve different purposes:
   - `ContentItemCreate` (Pydantic) = what the client sends
   - `ContentItem` (SQLAlchemy) = what the database stores
   - `ContentItemRead` (Pydantic) = what the client receives
   - The repository converts between them

5. **How to add a new endpoint:**
   - Define Pydantic schemas in `schemas/`
   - Add a route handler in `api/routes/`
   - If it needs database access, use the repository layer
   - Register the router in `api/router.py`

6. **How to add a new database column:**
   - Add the column to the SQLAlchemy model in `db/models/`
   - Run `uv run alembic revision --autogenerate -m "description"`
   - Review the generated migration in `db/migrations/versions/`
   - Run `uv run alembic upgrade head`
   - Update related Pydantic schemas

7. **How to test:**
   - Write tests in `tests/`
   - Run `uv run pytest`
   - Current tests use synchronous `TestClient` — for database tests, use `pytest-asyncio`

8. **Environment variables** — All configuration comes from environment variables or `.env` file. Never hardcode secrets. Use `SecretStr` for sensitive values.

---

## Appendix: Complete Request Flow Diagram

```
┌──────────┐    ┌───────────┐    ┌──────────┐    ┌────────────┐    ┌──────────┐
│  Browser  │───>│  Next.js   │───>│  FastAPI  │───>│  Repository │───>│PostgreSQL│
│           │    │  (proxy)   │    │  (route)  │    │  (query)    │    │          │
└──────────┘    └───────────┘    └──────────┘    └────────────┘    └──────────┘
      │              │                │                │                │
      │   GET /projects              │                │                │
      │──────────────>│              │                │                │
      │              │  GET /content/project?locale=en                 │
      │              │──────────────>│                │                │
      │              │              │  Depends:       │                │
      │              │              │  - DbSessionDep │                │
      │              │              │                │                │
      │              │              │  ContentRepository(session)      │
      │              │              │───────────────->│                │
      │              │              │                │  SELECT * FROM  │
      │              │              │                │  content_items  │
      │              │              │                │  WHERE type=... │
      │              │              │                │  AND status=    │
      │              │              │                │  'published'    │
      │              │              │                │───────────────->│
      │              │              │                │  [rows]         │
      │              │              │                │<────────────────│
      │              │              │  [ContentItem] │                │
      │              │              │<────────────────│                │
      │              │  to_content_read() → JSON     │                │
      │              │<──────────────│                │                │
      │  Rendered HTML              │                │                │
      │<──────────────│              │                │                │
```

---

*This document reflects the actual state of the codebase as of its writing. No features are described that don't exist in the repository. Boundary modules and stub services are clearly identified as planned but unimplemented.*
