import uuid

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
    alice_token = (
        await client.post("/auth/login", json={"email": "alice@example.com", "password": "pass"})
    ).json()["access_token"]

    await client.post("/auth/register", json={"email": "bob@example.com", "password": "pass"})
    bob_token = (
        await client.post("/auth/login", json={"email": "bob@example.com", "password": "pass"})
    ).json()["access_token"]

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
        await auth_client.post(
            f"/resumes/{resume_id}/skills", json={"name": "Python", "category": "Languages"}
        )
    ).json()["id"]
    resp = await auth_client.delete(f"/resumes/{resume_id}/skills/{skill_id}")
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_requires_auth(client: AsyncClient):
    resp = await client.get("/resumes")
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
async def test_get_nonexistent_resume(auth_client: AsyncClient):
    resp = await auth_client.get(f"/resumes/{uuid.uuid4()}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_create_resume_missing_required_field(auth_client: AsyncClient):
    resp = await auth_client.post("/resumes", json={"full_name": "Jane Doe"})
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_add_work_experience_missing_required_field(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    resp = await auth_client.post(
        f"/resumes/{resume_id}/work-experience", json={"title": "Engineer"}
    )
    assert resp.status_code == 422


@pytest.mark.asyncio
async def test_add_entries_to_nonexistent_resume(auth_client: AsyncClient):
    fake_id = uuid.uuid4()
    resp = await auth_client.post(
        f"/resumes/{fake_id}/work-experience",
        json={"company": "Acme", "title": "Engineer"},
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_update_nonexistent_work_experience(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    resp = await auth_client.put(
        f"/resumes/{resume_id}/work-experience/{uuid.uuid4()}",
        json={"company": "Acme", "title": "Engineer"},
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_nonexistent_education(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    resp = await auth_client.delete(f"/resumes/{resume_id}/education/{uuid.uuid4()}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_update_nonexistent_skill(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    resp = await auth_client.put(
        f"/resumes/{resume_id}/skills/{uuid.uuid4()}",
        json={"name": "Python"},
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_entry_from_other_resume_is_not_accessible(auth_client: AsyncClient):
    resume_a = (await auth_client.post("/resumes", json={"title": "Resume A"})).json()["id"]
    resume_b = (await auth_client.post("/resumes", json={"title": "Resume B"})).json()["id"]

    skill_id = (
        await auth_client.post(f"/resumes/{resume_a}/skills", json={"name": "Python"})
    ).json()["id"]

    resp = await auth_client.put(f"/resumes/{resume_b}/skills/{skill_id}", json={"name": "Rust"})
    assert resp.status_code == 404

    resp = await auth_client.delete(f"/resumes/{resume_b}/skills/{skill_id}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_cannot_update_other_users_resume(auth_client: AsyncClient, second_user_token):
    resume_id = (await auth_client.post("/resumes", json={"title": "Mine"})).json()["id"]
    bob_token = await second_user_token("bob@example.com")
    auth_client.headers["Authorization"] = f"Bearer {bob_token}"
    resp = await auth_client.put(f"/resumes/{resume_id}", json={"title": "Hijacked"})
    assert resp.status_code == 403


@pytest.mark.asyncio
async def test_update_work_experience(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    entry_id = (
        await auth_client.post(
            f"/resumes/{resume_id}/work-experience",
            json={"company": "Acme", "title": "Engineer"},
        )
    ).json()["id"]
    resp = await auth_client.put(
        f"/resumes/{resume_id}/work-experience/{entry_id}",
        json={"company": "Acme", "title": "Senior Engineer"},
    )
    assert resp.status_code == 200
    assert resp.json()["title"] == "Senior Engineer"


@pytest.mark.asyncio
async def test_update_skill(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    skill_id = (
        await auth_client.post(f"/resumes/{resume_id}/skills", json={"name": "Python"})
    ).json()["id"]
    resp = await auth_client.put(f"/resumes/{resume_id}/skills/{skill_id}", json={"name": "Rust"})
    assert resp.status_code == 200
    assert resp.json()["name"] == "Rust"


@pytest.mark.asyncio
async def test_delete_work_experience(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    entry_id = (
        await auth_client.post(
            f"/resumes/{resume_id}/work-experience",
            json={"company": "Acme", "title": "Engineer"},
        )
    ).json()["id"]
    resp = await auth_client.delete(f"/resumes/{resume_id}/work-experience/{entry_id}")
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_delete_nonexistent_work_experience(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    resp = await auth_client.delete(f"/resumes/{resume_id}/work-experience/{uuid.uuid4()}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_add_education(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    resp = await auth_client.post(
        f"/resumes/{resume_id}/education", json={"institution": "MIT", "degree": "BS"}
    )
    assert resp.status_code == 201
    assert resp.json()["institution"] == "MIT"


@pytest.mark.asyncio
async def test_update_education(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    entry_id = (
        await auth_client.post(f"/resumes/{resume_id}/education", json={"institution": "MIT"})
    ).json()["id"]
    resp = await auth_client.put(
        f"/resumes/{resume_id}/education/{entry_id}", json={"institution": "Stanford"}
    )
    assert resp.status_code == 200
    assert resp.json()["institution"] == "Stanford"


@pytest.mark.asyncio
async def test_update_nonexistent_education(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    resp = await auth_client.put(
        f"/resumes/{resume_id}/education/{uuid.uuid4()}", json={"institution": "MIT"}
    )
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_delete_education(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    entry_id = (
        await auth_client.post(f"/resumes/{resume_id}/education", json={"institution": "MIT"})
    ).json()["id"]
    resp = await auth_client.delete(f"/resumes/{resume_id}/education/{entry_id}")
    assert resp.status_code == 204


@pytest.mark.asyncio
async def test_delete_nonexistent_skill(auth_client: AsyncClient):
    resume_id = (await auth_client.post("/resumes", json={"title": "R"})).json()["id"]
    resp = await auth_client.delete(f"/resumes/{resume_id}/skills/{uuid.uuid4()}")
    assert resp.status_code == 404


@pytest.mark.asyncio
async def test_cannot_delete_other_users_resume(auth_client: AsyncClient, second_user_token):
    resume_id = (await auth_client.post("/resumes", json={"title": "Mine"})).json()["id"]
    bob_token = await second_user_token("bob@example.com")
    auth_client.headers["Authorization"] = f"Bearer {bob_token}"
    resp = await auth_client.delete(f"/resumes/{resume_id}")
    assert resp.status_code == 403
