# Auth Architecture

The current authentication model is intentionally narrow: it exists to protect
dashboard and admin tooling, not to provide a generalized multi-tenant identity
platform.

## Session Model

Admin login is implemented as a signed JWT session with an expiration window.

- `apps/api/app/api/routes/auth.py` exchanges credentials for a token
- `apps/api/app/core/security.py` signs and validates the token
- `apps/api/app/db/repositories/admin_user_repository.py` authenticates against
  persisted admin users and bootstraps the initial admin account
- `apps/web/src/app/api/auth/login/route.ts` stores the token as an HttpOnly
  cookie on the web origin

This is a pragmatic fit for the current platform stage: simple to operate,
typed, and sufficient for a single-admin or small-editor environment.

## Why the Cookie Is Issued in Next.js

The backend returns token data, but the frontend writes the browser cookie.

That choice keeps session storage same-origin with the web app and avoids
cross-origin cookie complexity. It also lets the frontend BFF routes reuse the
same token without exposing it to client JavaScript.

## Authorization Boundary

Protected backend routes do not trust the presence of the cookie alone.

1. the request reaches a protected route
2. `app/api/dependencies/auth.py` extracts a bearer token or dashboard cookie
3. `decode_admin_access_token()` validates signature and expiry
4. `AdminUserRepository` loads the user and confirms activity status
5. the route receives a concrete admin user object

This keeps authorization checks close to the backend business boundary and
prevents the web app from becoming the source of truth for session validity.

## Current Constraints

The existing auth model does not yet implement:

- refresh tokens
- session revocation storage
- SSO or third-party identity providers
- fine-grained role hierarchies beyond role claims on the token

Those omissions are deliberate. The present system is sized for internal admin
operations, and the current seams are sufficient to evolve later if stronger
session coordination becomes necessary.