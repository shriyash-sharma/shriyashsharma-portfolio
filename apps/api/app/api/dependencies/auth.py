from typing import Annotated, cast

from fastapi import Depends, HTTPException, status

from app.api.dependencies.database import DbSessionDep
from app.core.security import decode_admin_access_token, get_optional_admin_token
from app.db.models.admin_user import AdminUser
from app.db.repositories.admin_user_repository import AdminUserRepository

AdminTokenDep = Annotated[str | None, Depends(get_optional_admin_token)]


async def require_admin_user(
    session: DbSessionDep,
    token: AdminTokenDep,
) -> AdminUser:
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authentication required",
        )

    payload = decode_admin_access_token(token)
    if not payload:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired session",
        )

    subject = payload.get("sub")
    if not isinstance(subject, str):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid session subject",
        )

    repository = AdminUserRepository(session)
    user = await repository.get_by_id(subject)
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Session user is inactive",
        )

    return user


CurrentAdminUser = Annotated[AdminUser, Depends(require_admin_user)]


def require_admin_role(user: AdminUser, role: str) -> AdminUser:
    roles = cast(list[str], user.roles)
    if role not in roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Insufficient permissions",
        )
    return user