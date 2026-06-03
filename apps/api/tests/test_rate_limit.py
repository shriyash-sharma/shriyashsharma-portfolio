import pytest
from fastapi.testclient import TestClient

from app.core.config import Settings, get_settings
from app.core.rate_limit import SlidingWindowRateLimiter
from app.main import app


@pytest.mark.asyncio
async def test_sliding_window_blocks_after_limit() -> None:
    limiter = SlidingWindowRateLimiter()

    for _ in range(3):
        allowed, _ = await limiter.allow("127.0.0.1", limit=3, window_seconds=60.0)
        assert allowed is True

    allowed, retry_after = await limiter.allow(
        "127.0.0.1", limit=3, window_seconds=60.0
    )
    assert allowed is False
    assert retry_after >= 1


def test_assistant_endpoint_rate_limited(monkeypatch: pytest.MonkeyPatch) -> None:
    get_settings.cache_clear()
    settings = Settings(app_env="development", assistant_rate_limit_per_minute=2)
    monkeypatch.setattr(
        "app.api.dependencies.rate_limit.get_settings",
        lambda: settings,
    )

    from app.core.rate_limit import get_assistant_rate_limiter

    get_assistant_rate_limiter()._hits.clear()  # noqa: SLF001

    client = TestClient(app)

    for _ in range(2):
        response = client.post("/assistant", json={"query": "what can you do?"})
        assert response.status_code == 200

    response = client.post("/assistant", json={"query": "again please"})
    assert response.status_code == 429
    assert response.headers.get("Retry-After")
    assert response.json()["detail"]

    get_settings.cache_clear()
    get_assistant_rate_limiter()._hits.clear()  # noqa: SLF001
