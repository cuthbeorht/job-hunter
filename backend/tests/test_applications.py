import pytest
from httpx import AsyncClient


APPLICATION_PAYLOAD = {
    "company": "Acme Corp",
    "position": "Software Engineer",
    "status": "APPLIED",
    "applied_date": "2026-06-01",
}


@pytest.mark.asyncio
async def test_create_application(auth_client: AsyncClient):
    resp = await auth_client.post("/applications", json=APPLICATION_PAYLOAD)
    assert resp.status_code == 201
    data = resp.json()
    assert data["company"] == "Acme Corp"
    assert data["status"] == "APPLIED"


@pytest.mark.asyncio
async def test_list_applications(auth_client: AsyncClient):
    await auth_client.post("/applications", json=APPLICATION_PAYLOAD)
    await auth_client.post("/applications", json={**APPLICATION_PAYLOAD, "company": "Beta Inc"})
    resp = await auth_client.get("/applications")
    assert resp.status_code == 200
    assert len(resp.json()) == 2


@pytest.mark.asyncio
async def test_update_application_status(auth_client: AsyncClient):
    app_id = (await auth_client.post("/applications", json=APPLICATION_PAYLOAD)).json()["id"]
    resp = await auth_client.put(f"/applications/{app_id}", json={**APPLICATION_PAYLOAD, "status": "INTERVIEW"})
    assert resp.status_code == 200
    assert resp.json()["status"] == "INTERVIEW"


@pytest.mark.asyncio
async def test_delete_application(auth_client: AsyncClient):
    app_id = (await auth_client.post("/applications", json=APPLICATION_PAYLOAD)).json()["id"]
    resp = await auth_client.delete(f"/applications/{app_id}")
    assert resp.status_code == 204
    get_resp = await auth_client.get(f"/applications/{app_id}")
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_cannot_access_other_users_application(client: AsyncClient):
    await client.post("/auth/register", json={"email": "alice@example.com", "password": "pass"})
    alice_token = (await client.post("/auth/login", json={"email": "alice@example.com", "password": "pass"})).json()["access_token"]

    await client.post("/auth/register", json={"email": "bob@example.com", "password": "pass"})
    bob_token = (await client.post("/auth/login", json={"email": "bob@example.com", "password": "pass"})).json()["access_token"]

    client.headers["Authorization"] = f"Bearer {alice_token}"
    app_id = (await client.post("/applications", json=APPLICATION_PAYLOAD)).json()["id"]

    client.headers["Authorization"] = f"Bearer {bob_token}"
    resp = await client.get(f"/applications/{app_id}")
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_requires_auth(client: AsyncClient):
    resp = await client.get("/applications")
    assert resp.status_code in (401, 403)
