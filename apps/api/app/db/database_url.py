"""Normalize DATABASE_URL for SQLAlchemy + asyncpg.

- libpq ``sslmode`` query params are converted to asyncpg ``ssl`` connect_args.
- Userinfo is parsed from the rightmost ``@`` so passwords may contain ``@``.
"""

from __future__ import annotations

import re
import ssl

import certifi

from app.core.config import get_settings

from sqlalchemy.engine import make_url
from sqlalchemy.engine.url import URL

_SCHEME_RE = re.compile(r"^postgresql(\+asyncpg)?://", re.IGNORECASE)


def _parse_authority(authority: str) -> tuple[str, str | None, str, str]:
    """Split ``user:password@host:port/database`` using the last ``@``."""
    at_index = authority.rfind("@")
    if at_index == -1:
        raise ValueError(
            "DATABASE_URL must include userinfo and host, e.g. "
            "postgresql+asyncpg://user:password@host:5432/dbname"
        )

    userinfo, host_path = authority[:at_index], authority[at_index + 1 :]
    colon_index = userinfo.find(":")
    if colon_index == -1:
        username, password = userinfo, None
    else:
        username, password = userinfo[:colon_index], userinfo[colon_index + 1 :]

    if "/" not in host_path:
        raise ValueError("DATABASE_URL must include a database name after the host")

    host_port, database = host_path.split("/", 1)
    if host_port.startswith("["):
        host_end = host_port.find("]")
        if host_end == -1:
            raise ValueError("Invalid IPv6 host in DATABASE_URL")
        host = host_port[1:host_end]
        port = (
            int(host_port[host_end + 2 :])
            if host_port[host_end + 1] == ":"
            else 5432
        )
    elif ":" in host_port:
        host, port_str = host_port.rsplit(":", 1)
        port = int(port_str)
    else:
        host, port = host_port, 5432

    if not host:
        raise ValueError(
            "DATABASE_URL has an empty host. If your password contains '@', "
            "keep using the full URL string — it is parsed from the last '@'."
        )

    return username, password, host, database, port


def prepare_asyncpg_database_url(database_url: str) -> tuple[str, dict[str, object]]:
    """Return a URL and connect_args suitable for create_async_engine(asyncpg)."""
    match = _SCHEME_RE.match(database_url)
    if not match:
        raise ValueError("DATABASE_URL must start with postgresql:// or postgresql+asyncpg://")

    remainder = database_url[match.end() :]
    query_string = ""
    if "?" in remainder:
        remainder, query_string = remainder.split("?", 1)

    username, password, host, database, port = _parse_authority(remainder)

    query = {}
    if query_string:
        for part in query_string.split("&"):
            if not part:
                continue
            key, _, value = part.partition("=")
            query[key] = value

    connect_args: dict[str, object] = {}
    sslmode = query.pop("sslmode", None)
    needs_ssl = sslmode in ("require", "verify-ca", "verify-full", "prefer") or host.endswith(
        ".supabase.com"
    )
    if needs_ssl:
        ssl_context = ssl.create_default_context(cafile=certifi.where())
        if get_settings().database_ssl_insecure:
            ssl_context.check_hostname = False
            ssl_context.verify_mode = ssl.CERT_NONE
        connect_args["ssl"] = ssl_context

    # Supabase transaction pooler (port 6543) does not support prepared statement cache.
    if host.endswith(".pooler.supabase.com"):
        connect_args["statement_cache_size"] = 0

    sqlalchemy_url = URL.create(
        drivername="postgresql+asyncpg",
        username=username,
        password=password,
        host=host,
        port=port,
        database=database,
        query=query,
    )

    return sqlalchemy_url.render_as_string(hide_password=False), connect_args


def describe_database_target(database_url: str) -> str:
    """Safe summary for logs (no password)."""
    cleaned, _ = prepare_asyncpg_database_url(database_url)
    url = make_url(cleaned)
    return f"{url.drivername}://{url.username}:***@{url.host}:{url.port}/{url.database}"
