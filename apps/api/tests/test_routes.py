from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_route_get() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


def test_health_route_head() -> None:
    response = client.head("/health")

    assert response.status_code == 200
    assert response.content == b""


def test_platform_route() -> None:
    response = client.get("/platform")

    assert response.status_code == 200
    assert response.json()["capabilities"]


def test_content_route() -> None:
    response = client.get("/content")

    assert response.status_code == 200
    assert response.json()["collections"]


def test_search_boundary() -> None:
    response = client.post("/search", json={"query": "semantic search"})

    assert response.status_code == 200
    assert response.json()["implemented"] is False


def test_assistant_contract() -> None:
    response = client.post("/assistant", json={"query": "what can you do?"})

    assert response.status_code == 200
    body = response.json()
    # ``implemented`` is True when AI providers are configured (real RAG flow)
    # and False when they are not (e.g. CI without keys). Either way the
    # response must honour the structured contract.
    assert isinstance(body["implemented"], bool)
    assert isinstance(body["message"], str) and body["message"]
    assert isinstance(body["sources"], list)


def test_admin_content_requires_authentication() -> None:
    response = client.get("/admin/content/project")

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required"


def test_admin_media_requires_authentication() -> None:
    response = client.get("/admin/media")

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required"
