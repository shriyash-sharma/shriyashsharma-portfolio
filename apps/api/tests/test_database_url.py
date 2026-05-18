import ssl

from app.db.database_url import describe_database_target, prepare_asyncpg_database_url


def test_strips_sslmode_and_enables_ssl() -> None:
    url = (
        "postgresql+asyncpg://user:pass@aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
        "?sslmode=require"
    )
    cleaned, connect_args = prepare_asyncpg_database_url(url)

    assert "sslmode" not in cleaned
    assert isinstance(connect_args.get("ssl"), ssl.SSLContext)


def test_local_url_without_sslmode() -> None:
    url = "postgresql+asyncpg://portfolio:portfolio@localhost:5433/portfolio"
    cleaned, connect_args = prepare_asyncpg_database_url(url)

    assert "localhost:5433" in cleaned
    assert connect_args == {}


def test_password_may_contain_at_symbol() -> None:
    url = (
        "postgresql+asyncpg://postgres.project:Secret@01@"
        "aws-1-ap-south-1.pooler.supabase.com:6543/postgres?sslmode=require"
    )
    cleaned, connect_args = prepare_asyncpg_database_url(url)

    assert isinstance(connect_args.get("ssl"), ssl.SSLContext)
    assert "aws-1-ap-south-1.pooler.supabase.com:6543" in cleaned
    assert describe_database_target(url) == (
        "postgresql+asyncpg://postgres.project:***@"
        "aws-1-ap-south-1.pooler.supabase.com:6543/postgres"
    )
