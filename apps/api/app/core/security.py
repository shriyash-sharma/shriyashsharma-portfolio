"""Security primitives for admin authentication.

This module centralizes password hashing, signed token creation, token
validation, and request token extraction. Keeping these primitives together
lets the rest of the backend depend on a narrow security boundary rather than
reimplementing credential or session logic in routes.

Design notes:
- The current admin session model uses signed JWTs with role claims and a
    bounded TTL.
- Tokens can arrive via bearer headers or same-origin dashboard cookies so the
    backend can serve both direct API clients and the Next.js BFF layer.
"""

import base64
import hashlib
import hmac
import json
import secrets
from collections.abc import Sequence
from datetime import UTC, datetime, timedelta
from typing import Annotated, Any
from uuid import UUID

from fastapi import Cookie, Header

from app.core.config import get_settings

_PBKDF2_ITERATIONS = 600_000


def _b64url_encode(value: bytes) -> str:
    return base64.urlsafe_b64encode(value).rstrip(b"=").decode("ascii")


def _b64url_decode(value: str) -> bytes:
    padding = "=" * (-len(value) % 4)
    return base64.urlsafe_b64decode(f"{value}{padding}")


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        salt,
        _PBKDF2_ITERATIONS,
    )
    return (
        f"pbkdf2_sha256${_PBKDF2_ITERATIONS}$"
        f"{_b64url_encode(salt)}${_b64url_encode(digest)}"
    )


def verify_password(password: str, password_hash: str) -> bool:
    algorithm, iterations, salt, expected = password_hash.split("$", 3)
    if algorithm != "pbkdf2_sha256":
        return False

    digest = hashlib.pbkdf2_hmac(
        "sha256",
        password.encode("utf-8"),
        _b64url_decode(salt),
        int(iterations),
    )
    return hmac.compare_digest(_b64url_encode(digest), expected)


def create_admin_access_token(*, user_id: UUID, email: str, roles: Sequence[str]) -> str:
    now = datetime.now(UTC)
    expires_at = now + timedelta(minutes=get_settings().admin_session_ttl_minutes)
    payload = {
        "sub": str(user_id),
        "email": email,
        "roles": list(roles),
        "iat": int(now.timestamp()),
        "exp": int(expires_at.timestamp()),
    }
    header = {"alg": "HS256", "typ": "JWT"}
    encoded_header = _b64url_encode(json.dumps(header, separators=(",", ":")).encode())
    encoded_payload = _b64url_encode(
        json.dumps(payload, separators=(",", ":")).encode()
    )
    message = f"{encoded_header}.{encoded_payload}".encode("ascii")
    signature = hmac.new(
        get_settings().admin_jwt_secret.get_secret_value().encode("utf-8"),
        message,
        hashlib.sha256,
    ).digest()
    return f"{encoded_header}.{encoded_payload}.{_b64url_encode(signature)}"


def decode_admin_access_token(token: str) -> dict[str, Any] | None:
    try:
        encoded_header, encoded_payload, encoded_signature = token.split(".", 2)
    except ValueError:
        return None

    message = f"{encoded_header}.{encoded_payload}".encode("ascii")
    expected_signature = hmac.new(
        get_settings().admin_jwt_secret.get_secret_value().encode("utf-8"),
        message,
        hashlib.sha256,
    ).digest()
    if not hmac.compare_digest(_b64url_encode(expected_signature), encoded_signature):
        return None

    try:
        payload = json.loads(_b64url_decode(encoded_payload))
    except (ValueError, json.JSONDecodeError):
        return None

    if not isinstance(payload, dict):
        return None

    exp = payload.get("exp")
    if not isinstance(exp, int) or exp <= int(datetime.now(UTC).timestamp()):
        return None

    return payload


async def get_optional_bearer_token(
    authorization: Annotated[str | None, Header()] = None,
) -> str | None:
    if not authorization:
        return None

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None

    return token


async def get_optional_admin_token(
    authorization: Annotated[str | None, Header()] = None,
    dashboard_access_token: Annotated[str | None, Cookie()] = None,
) -> str | None:
    bearer_token = await get_optional_bearer_token(authorization)
    return bearer_token or dashboard_access_token
