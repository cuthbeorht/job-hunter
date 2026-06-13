import pytest
from httpx import AsyncClient


@pytest.mark.asyncio
async def test_create_resume(auth_client: AsyncClient):
    resp = await auth_client.post("/resumes", json={"title": "My Resume", "full_name": "Jane Doe"})
    assert resp.status_code == 201
    data = resp.json()
    assert data["title"] == "My Resume"
    assert data["full_name"] == "Jane Doe"
    assert data["work_experiences"] == []


@pytest.mark.asyncio
async def test_list_resumes(auth_client: AsyncClient):
    await auth_client.post("/resumes", json={"title": "Resume 1"})
    await auth_client.post("/resumes", json={"title": "Resume 2"})
    resp = await auth_client.get("/resumes")
    assert resp.status_code == 200
    assert len(resp.json()) == 2


@pytest.mark.asyncio
async def test_get_resume(auth_client: AsyncClient):
    create_resp = await auth_client.post("/resumes", json={"title": "My Resume"})
    resume_id = create_resp.json()["id"]
    resp = await auth_client.get(f"/resumes/{resume_id}")
    assert resp.status_code == 200
    assert resp.json()["id"] == resume_id


@pytest.mark.asyncio
async def test_update_resume(auth_client: AsyncClient):
    create_resp = await auth_client.post("/resumes", json={"title": "Old Title"})
    resume_id = create_resp.json()["id"]
    resp = await auth_client.put(f"/resumes/{resume_id}", json={"title": "New Title"})
    assert resp.status_code == 200
    assert resp.json()["title"] == "New Title"


@pytest.mark.asyncio
async def test_delete_resume(auth_client: AsyncClient):
    create_resp = await auth_client.post("/resumes", json={"title": "To Delete"})
    resume_id = create_resp.json()["id"]
    resp = await auth_client.delete(f"/resumes/{resume_id}")
    assert resp.status_code == 204
    get_resp = await auth_client.get(f"/resumes/{resume_id}")
    assert get_resp.status_code == 404


@pytest.mark.asyncio
async def test_cannot_access_other_users_resume(client: AsyncClient):
    await client.post("/auth/register", json={"email": "alice@example.com", "password": "pass"})
    alice_token = (await client.post("/auth/login", json={"email": "alice@example.com", "password": "pass"})).json()["access_token"]

    await client.post("/auth/register", json={"email": "bob@example.com", "password": "pass"})
    bob_token = (await client.post("/auth/login", json={"email": "bob@example.com", "password": "pass"})).json()["access_token"]

    client.headers["Authorization"] = f"Bearer {alice_token}"
    resume_id = (await client.post("/resumes", json={"title": "Alice's"})).json()["id"]

    client.headers["Authorization"] = f"Bearer {bob_token}"
    resp = await client.get(f"/resumes/{resume_id}")
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_add_work_experience(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    resp = await auth_client.post(
        f"/resumes/{resume_id}/work-experience",
        json={"company": "Acme", "title": "Engineer", "start_date": "2020-01"},
    )
    assert resp.status_code == 201
    assert resp.json()["company"] == "Acme"


@pytest.mark.asyncio
async def test_add_and_delete_skill(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    skill_id = (
        await auth_client.post(f"/resumes/{resume_id}/skills", json={"name": "Python", "category": "Languages"})
    ).json()["id"]
    resp = await auth_client.delete(f"/resumes/{resume_id}/skills/{skill_id}")
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_requires_auth(client: AsyncClient):
    resp = await client.get("/resumes")
    assert resp.status_code in (401, 403)
