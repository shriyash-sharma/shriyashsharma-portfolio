# Why Not X?

This document records concise rationale for architectural paths not taken yet.

## Why not Django?

FastAPI is a better fit for the current backend shape because the system is API-
first, async-oriented, and relatively thin in terms of server-rendered backend
views or framework-owned admin tooling.

Tradeoff:

- Django would provide a more batteries-included backend stack
- FastAPI keeps the current platform lighter and closer to explicit API boundary design

## Why not Prisma-style tooling?

The backend is Python-first, and the persistence layer needs to stay close to
FastAPI, SQLAlchemy async, and repository-level query composition.

Tradeoff:

- Prisma-style ergonomics are attractive in TypeScript-heavy stacks
- SQLAlchemy is a better fit for the current Python runtime and repository design

## Why not microservices?

The current system has strong contract coupling but limited operational sprawl.
Splitting it into services now would add deployment and coordination overhead
without solving a pressing boundary problem.

Tradeoff:

- microservices can isolate operational domains at larger scale
- the current monorepo and two-app runtime are easier to evolve and reason about

## Why not cloud object storage first?

The media workflow is currently modest and dashboard-focused. Local storage keeps
the implementation transparent while the product validates how media is actually
used.

Tradeoff:

- cloud storage improves durability and deployment flexibility
- local-first storage keeps the current architecture simpler and faster to adapt

## Why not server-side session storage first?

The dashboard needs protected access, but it does not yet need a fully stateful
session subsystem.

Tradeoff:

- stateful sessions support centralized revocation more naturally
- signed JWTs keep the current auth path simple while still enforcing expiry and user checks

## Why not a synchronous ORM model in an async backend?

The backend is already structured around async request handling. Keeping the
persistence layer async avoids mixing concurrency models and reduces future
rework if request volume or I/O surfaces expand.