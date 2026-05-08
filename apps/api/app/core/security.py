from typing import Annotated

from fastapi import Header


async def get_optional_bearer_token(
    authorization: Annotated[str | None, Header()] = None,
) -> str | None:
    if not authorization:
        return None

    scheme, _, token = authorization.partition(" ")
    if scheme.lower() != "bearer" or not token:
        return None

    return token
