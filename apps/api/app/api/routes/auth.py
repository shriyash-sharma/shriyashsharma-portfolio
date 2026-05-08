from fastapi import APIRouter, HTTPException, status

from app.api.dependencies.auth import CurrentAdminUser
from app.api.dependencies.database import DbSessionDep
from app.core.config import get_settings
from app.core.security import create_admin_access_token
from app.db.repositories.admin_user_repository import AdminUserRepository
from app.schemas.auth import AdminLoginRequest, AdminSessionResponse, AdminSessionUser

router = APIRouter(prefix="/auth", tags=["auth"])


@router.post("/login", response_model=AdminSessionResponse)
async def admin_login(
    payload: AdminLoginRequest,
    session: DbSessionDep,
) -> AdminSessionResponse:
    repository = AdminUserRepository(session)
    await repository.ensure_bootstrap_user()
    user = await repository.authenticate(payload.email, payload.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    expires_in = get_settings().admin_session_ttl_minutes * 60
    token = create_admin_access_token(
        user_id=user.id,
        email=user.email,
        roles=user.roles,
    )
    return AdminSessionResponse(
        access_token=token,
        expires_in=expires_in,
        user=AdminSessionUser.model_validate(user),
    )


@router.get("/session", response_model=AdminSessionUser)
async def admin_session(user: CurrentAdminUser) -> AdminSessionUser:
    return AdminSessionUser.model_validate(user)


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT)
async def admin_logout() -> None:
    return None