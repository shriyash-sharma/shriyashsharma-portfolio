import pytest

from app.core.config import Settings
from app.core.deployment import validate_deployment_settings


def test_production_rejects_default_secrets() -> None:
    settings = Settings(
        app_env="production",
        admin_jwt_secret="change-me-before-production",
        admin_bootstrap_password="changeme-admin-password",
        admin_bootstrap_email="admin@localhost",
    )

    with pytest.raises(RuntimeError, match="ADMIN_JWT_SECRET"):
        validate_deployment_settings(settings)


def test_development_allows_defaults() -> None:
    settings = Settings(app_env="development")

    validate_deployment_settings(settings)
