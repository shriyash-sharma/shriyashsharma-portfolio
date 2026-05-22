# Content pipeline (single source of truth)

## CMS-driven (database / FastAPI `content_items`)

| Content | Web service | Public routes | Home |
|--------|-------------|---------------|------|
| Projects | `project-service.ts` | `/projects`, `/projects/[slug]` | Featured section (`metadata.featured`) |
| Case studies | `content-service.ts` | `/case-studies`, `/case-studies/[slug]` | All published, sorted by date |
| Blog articles | `content-service.ts` | `/blog`, `/blog/[slug]` | — |
| Architecture notes | `content-service.ts` | `/architecture`, `/architecture/[slug]` | — |
| Experiments / research | API types exist | Routes TBD | — |

**Homepage cards** map CMS rows via `lib/content/home-cards.ts`:

- Projects: `featured` in metadata (falls back to all projects if none featured)
- Optional home fields in metadata: `key_decision`, `architecture_summary`, `system_detail`, `card_label`, `home_visual`, `visual_label`
- Case studies: `challenge`, `decision`, `operations`, `outcome` (fallback to `description` / `system_area`)

Seed reference: `apps/api/scripts/seed_content.py`.

## Static config (not in CMS)

- Navigation (`lib/constants/nav.ts`)
- Site identity & social links (`lib/constants/site.ts`)
- SEO page defaults (`lib/seo/metadata.ts`)
- i18n UI copy (`lib/i18n/dictionaries.ts`)
- Hero layout & assistant prompt chips (UX configuration)
- Speaking page narrative (no `speaking` content type yet)
- About experience blocks (no timeline content type)

## Data flow

```text
PostgreSQL content_items
  → FastAPI /content
  → web content-service / project-service (server-only)
  → pages (SSR) + sitemap-data.ts
  → home-cards mappers → FeaturedProjectsSection / CaseStudiesSection
```

## RAG ingestion (same public content)

`apps/api/scripts/ingest_knowledge.py`:

- **CMS**: published items with `ai_indexable=true` (title + description + body)
- **Docs**: `docs/**`, repo READMEs

The assistant does not use separate mock corpora. Re-run ingestion after CMS or doc changes.

## Featured projects

Set `metadata.featured: true` on project rows in the dashboard or seed. Homepage shows featured projects first; if none are featured, all published projects are shown (sorted featured → newest).

## Operational checklist

1. `uv run python scripts/seed_content.py` — load CMS rows
2. `uv run python scripts/ingest_knowledge.py` — refresh vectors
3. Ensure `NEXT_PUBLIC_API_URL` and `API_INTERNAL_URL` on the web app
