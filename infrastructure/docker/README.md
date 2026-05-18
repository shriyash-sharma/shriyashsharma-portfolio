# Docker

Local Docker development is intentionally minimal and currently managed from
the root `docker-compose.yml`.

Included services:

- `web`
- `api`
- `postgres`

Do not add Redis, pgvector, queues, or observability stacks until the product
actually needs them.
