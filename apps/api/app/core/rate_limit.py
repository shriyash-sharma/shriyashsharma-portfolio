"""In-memory sliding-window rate limiting for public assistant endpoints.

Single-process deployments (local dev, small hosts) share one limiter instance.
For multi-replica production, add a shared store (e.g. Redis) or enforce limits
at the edge — this module is the application-layer guardrail.
"""

from __future__ import annotations

import asyncio
from collections import defaultdict
from time import monotonic


class SlidingWindowRateLimiter:
    def __init__(self) -> None:
        self._hits: dict[str, list[float]] = defaultdict(list)
        self._lock = asyncio.Lock()

    async def allow(
        self,
        key: str,
        *,
        limit: int,
        window_seconds: float,
    ) -> tuple[bool, int]:
        """Return (allowed, retry_after_seconds)."""
        if limit <= 0:
            return True, 0

        now = monotonic()
        cutoff = now - window_seconds

        async with self._lock:
            timestamps = [t for t in self._hits[key] if t > cutoff]
            if len(timestamps) >= limit:
                oldest = timestamps[0]
                retry_after = max(1, int(oldest + window_seconds - now) + 1)
                self._hits[key] = timestamps
                return False, retry_after

            timestamps.append(now)
            self._hits[key] = timestamps
            return True, 0


_assistant_limiter = SlidingWindowRateLimiter()


def get_assistant_rate_limiter() -> SlidingWindowRateLimiter:
    return _assistant_limiter
