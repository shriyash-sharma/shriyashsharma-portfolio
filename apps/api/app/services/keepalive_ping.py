"""Background loop: GET a list of health URLs on an interval.

Keeps Render free-tier services from spinning down after inactivity. This
process is already woken on a schedule by the GitHub Actions workflow (see
docs/render-keepalive.md), so once it's up it can also carry ping duty for
peer services (this API's own /health included) — see get_settings().
keepalive_ping_urls for the actual target list.
"""

from __future__ import annotations

import asyncio
import logging
import time

import httpx

logger = logging.getLogger(__name__)

_PING_TIMEOUT_SECONDS = 20.0
# Give the app a moment to finish startup before the first ping.
_INITIAL_DELAY_SECONDS = 10.0


def parse_keepalive_urls(raw: str) -> list[str]:
    return [u.strip() for u in raw.split(",") if u.strip()]


async def ping_once(client: httpx.AsyncClient, urls: list[str]) -> None:
    """GET every URL once, logging each result. Never raises."""
    for url in urls:
        start = time.monotonic()
        try:
            response = await client.get(url, timeout=_PING_TIMEOUT_SECONDS)
            elapsed_ms = round((time.monotonic() - start) * 1000)
            if response.is_success:
                logger.info(
                    "keepalive_ping ok url=%s status=%d elapsed_ms=%d",
                    url,
                    response.status_code,
                    elapsed_ms,
                )
            else:
                logger.warning(
                    "keepalive_ping non_2xx url=%s status=%d elapsed_ms=%d",
                    url,
                    response.status_code,
                    elapsed_ms,
                )
        except Exception as exc:
            elapsed_ms = round((time.monotonic() - start) * 1000)
            logger.warning(
                "keepalive_ping failed url=%s elapsed_ms=%d error=%s",
                url,
                elapsed_ms,
                exc,
            )


async def run_keepalive_ping_loop(
    urls: list[str],
    *,
    interval_seconds: int,
) -> None:
    """Ping every URL every ``interval_seconds`` until cancelled.

    One misbehaving target (timeout, 5xx, DNS failure) never stops the loop —
    each URL is isolated in ``ping_once``, and the loop itself keeps going on
    any unexpected error so a single bad tick can't silently kill keep-alive.
    """
    if not urls:
        logger.warning("keepalive_ping enabled but keepalive_ping_urls is empty — skipping")
        return

    logger.info(
        "keepalive_ping starting interval_seconds=%d urls=%s",
        interval_seconds,
        urls,
    )
    await asyncio.sleep(_INITIAL_DELAY_SECONDS)

    async with httpx.AsyncClient() as client:
        while True:
            try:
                await ping_once(client, urls)
            except Exception:
                logger.exception("keepalive_ping tick raised unexpectedly")
            await asyncio.sleep(interval_seconds)
