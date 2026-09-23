"""Tests for the in-app keep-alive pinger."""

from __future__ import annotations

import asyncio

import httpx

from app.services.keepalive_ping import (
    parse_keepalive_urls,
    ping_once,
    run_keepalive_ping_loop,
)


def test_parse_keepalive_urls_splits_and_trims() -> None:
    raw = " https://a.example.com/health ,https://b.example.com/health,,"
    assert parse_keepalive_urls(raw) == [
        "https://a.example.com/health",
        "https://b.example.com/health",
    ]


def test_parse_keepalive_urls_empty_string() -> None:
    assert parse_keepalive_urls("") == []


async def test_ping_once_hits_every_url_and_survives_failures(caplog) -> None:
    calls: list[str] = []

    def handler(request: httpx.Request) -> httpx.Response:
        calls.append(str(request.url))
        if "portfolio-api" in str(request.url):
            return httpx.Response(200, json={"status": "ok"})
        if "fieldflow-api-prod" in str(request.url):
            raise httpx.ConnectTimeout("boom", request=request)
        return httpx.Response(503)

    transport = httpx.MockTransport(handler)
    async with httpx.AsyncClient(transport=transport) as client:
        with caplog.at_level("WARNING"):
            await ping_once(
                client,
                [
                    "https://portfolio-api-0pp2.onrender.com/health",
                    "https://fieldflow-api-prod.onrender.com/api/v1/health",
                    "https://api.teamshastra.com/api/v1/health",
                ],
            )

    # All three targets attempted regardless of earlier failures.
    assert len(calls) == 3
    assert any("non_2xx" in r.message for r in caplog.records)
    assert any("failed" in r.message for r in caplog.records)


async def test_run_keepalive_ping_loop_noop_when_no_urls() -> None:
    # Should return immediately without sleeping or raising.
    await asyncio.wait_for(
        run_keepalive_ping_loop([], interval_seconds=720),
        timeout=1,
    )


async def test_run_keepalive_ping_loop_is_cancellable(monkeypatch) -> None:
    import app.services.keepalive_ping as module

    # Skip the real 10s pre-ping delay so this test runs fast.
    monkeypatch.setattr(module, "_INITIAL_DELAY_SECONDS", 0)

    ticks = 0

    async def fake_ping_once(client: httpx.AsyncClient, urls: list[str]) -> None:
        nonlocal ticks
        ticks += 1

    monkeypatch.setattr(module, "ping_once", fake_ping_once)

    task = asyncio.create_task(
        run_keepalive_ping_loop(["https://example.com/health"], interval_seconds=0.01)
    )
    await asyncio.sleep(0.1)
    task.cancel()

    try:
        await task
    except asyncio.CancelledError:
        pass

    assert ticks > 0
