"""replace ivfflat knowledge index with hnsw

Revision ID: 0004_knowledge_hnsw_index
Revises: 0003_create_knowledge_base
Create Date: 2026-05-30

The original IVFFlat index used ``lists = 100``. IVFFlat partitions vectors
into ``lists`` cells and, with the default ``probes = 1``, a query only scans
the single nearest cell. On a small corpus (hundreds–low thousands of chunks)
each cell holds only a handful of vectors, so most queries returned almost no
relevant neighbours — recall collapsed and the assistant frequently claimed the
context did not cover topics that were, in fact, indexed.

HNSW is a graph index with high recall at default settings and no ``probes``
foot-gun. Combined with a per-query ``hnsw.ef_search`` (set in the retrieval
service) it gives near-exact recall at this scale while still scaling as the
corpus grows.
"""

from collections.abc import Sequence

from alembic import op

revision: str = "0004_knowledge_hnsw_index"
down_revision: str | None = "0003_create_knowledge_base"
branch_labels: Sequence[str] | None = None
depends_on: Sequence[str] | None = None


def upgrade() -> None:
    # Drop the recall-limiting IVFFlat index.
    op.execute("DROP INDEX IF EXISTS ix_knowledge_chunks_embedding")

    # HNSW over cosine distance. m / ef_construction are pgvector defaults that
    # work well for this corpus size; query-time breadth is set via
    # ``hnsw.ef_search`` in the retrieval layer.
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_knowledge_chunks_embedding_hnsw "
        "ON knowledge_chunks USING hnsw (embedding vector_cosine_ops) "
        "WITH (m = 16, ef_construction = 64)"
    )


def downgrade() -> None:
    op.execute("DROP INDEX IF EXISTS ix_knowledge_chunks_embedding_hnsw")
    op.execute(
        "CREATE INDEX IF NOT EXISTS ix_knowledge_chunks_embedding "
        "ON knowledge_chunks USING ivfflat (embedding vector_cosine_ops) "
        "WITH (lists = 100)"
    )
