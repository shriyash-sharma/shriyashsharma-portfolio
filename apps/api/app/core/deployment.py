"""Deployment-time validation for production and staging environments."""

from app.core.config import Settings

_DEFAULT_JWT_SECRET = "change-me-before-production"
_DEFAULT_BOOTSTRAP_PASSWORD = "changeme-admin-password"


def validate_deployment_settings(settings: Settings) -> None:
    """Refuse to start with unsafe defaults in deployed environments."""
    if settings.app_env not in ("production", "staging"):
        return

    issues: list[str] = []

    if settings.admin_jwt_secret.get_secret_value() == _DEFAULT_JWT_SECRET:
        issues.append("ADMIN_JWT_SECRET must be set to a unique secret")

    if (
        settings.admin_bootstrap_password.get_secret_value()
        == _DEFAULT_BOOTSTRAP_PASSWORD
    ):
        issues.append("ADMIN_BOOTSTRAP_PASSWORD must not use the example default")

    if settings.admin_bootstrap_email == "admin@localhost":
        issues.append("ADMIN_BOOTSTRAP_EMAIL must be a real admin email")

    if issues:
        raise RuntimeError(
            "Unsafe configuration for "
            f"{settings.app_env}: "
            + "; ".join(issues)
        )
