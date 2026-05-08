from fastapi.testclient import TestClient

from app.main import app

client = TestClient(app)


def test_health_route() -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json()["status"] == "ok"


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


def test_assistant_boundary() -> None:
    response = client.post("/assistant", json={"query": "what can you do?"})

    assert response.status_code == 200
    assert response.json()["implemented"] is False


def test_admin_content_requires_authentication() -> None:
    response = client.get("/admin/content/project")

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required"


def test_admin_media_requires_authentication() -> None:
    response = client.get("/admin/media")

    assert response.status_code == 401
    assert response.json()["detail"] == "Authentication required"
