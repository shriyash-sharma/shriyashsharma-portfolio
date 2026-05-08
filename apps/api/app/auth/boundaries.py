from dataclasses import dataclass


@dataclass(frozen=True)
class AuthBoundary:
    name: str
    description: str
    implemented: bool = False


AUTH_BOUNDARIES = [
    AuthBoundary(
        name="dashboard-session",
        description=(
            "Validate dashboard sessions and role claims for protected tooling."
        ),
    ),
    AuthBoundary(
        name="service-token",
        description="Authenticate frontend BFF requests to backend APIs.",
    ),
]
