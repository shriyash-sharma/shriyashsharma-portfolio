"""Repository for admin identity lifecycle operations.

This module handles the small but security-sensitive persistence workflow around
admin users: bootstrap creation, identity lookup, and credential validation.
Routes intentionally call into this repository instead of performing direct ORM
queries so authentication behavior stays centralized and testable.
"""

from datetime import UTC, datetime

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.security import hash_password, verify_password
from app.db.models.admin_user import AdminUser


class AdminUserRepository:
    def __init__(self, session: AsyncSession) -> None:
        self.session = session

    async def get_by_email(self, email: str) -> AdminUser | None:
        statement = select(AdminUser).where(AdminUser.email == email.lower())
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def get_by_id(self, user_id: str) -> AdminUser | None:
        statement = select(AdminUser).where(AdminUser.id == user_id)
        result = await self.session.execute(statement)
        return result.scalar_one_or_none()

    async def ensure_bootstrap_user(self) -> AdminUser:
        settings = get_settings()
        existing = await self.get_by_email(settings.admin_bootstrap_email)
        if existing:
            return existing

        user = AdminUser(
            email=settings.admin_bootstrap_email.lower(),
            name=settings.admin_bootstrap_name,
            password_hash=hash_password(
                settings.admin_bootstrap_password.get_secret_value()
            ),
            roles=["owner"],
            is_active=True,
        )
        self.session.add(user)
        await self.session.commit()
        await self.session.refresh(user)
        return user

    async def authenticate(self, email: str, password: str) -> AdminUser | None:
        user = await self.get_by_email(email)
        if not user or not user.is_active:
            return None
        if not verify_password(password, user.password_hash):
            return None

        user.last_login_at = datetime.now(UTC)
        await self.session.commit()
        await self.session.refresh(user)
        return user