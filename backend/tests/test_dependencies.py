import uuid
from datetime import UTC, datetime, timedelta

import jwt
import pytest
from httpx import AsyncClient

from app.config import settings

PROTECTED_ROUTE = "/applications"


@pytest.mark.asyncio
async def test_missing_auth_header_rejected(client: AsyncClient):
    resp = await client.get(PROTECTED_ROUTE)
    assert resp.status_code in (401, 403)


@pytest.mark.asyncio
async def test_malformed_token_rejected(client: AsyncClient):
    client.headers["Authorization"] = "Bearer not-a-valid-jwt"
    resp = await client.get(PROTECTED_ROUTE)
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_expired_token_rejected(client: AsyncClient):
    expired_payload = {"sub": str(uuid.uuid4()), "exp": datetime.now(UTC) - timedelta(minutes=1)}
    expired_token = jwt.encode(expired_payload, settings.secret_key, algorithm=settings.algorithm)
    client.headers["Authorization"] = f"Bearer {expired_token}"
    resp = await client.get(PROTECTED_ROUTE)
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_token_for_unknown_user_rejected(client: AsyncClient):
    unknown_payload = {"sub": str(uuid.uuid4()), "exp": datetime.now(UTC) + timedelta(minutes=5)}
    token = jwt.encode(unknown_payload, settings.secret_key, algorithm=settings.algorithm)
    client.headers["Authorization"] = f"Bearer {token}"
    resp = await client.get(PROTECTED_ROUTE)
    assert resp.status_code == 401


@pytest.mark.asyncio
async def test_token_with_non_uuid_subject_rejected(client: AsyncClient):
    bad_subject_payload = {"sub": "not-a-uuid", "exp": datetime.now(UTC) + timedelta(minutes=5)}
    token = jwt.encode(bad_subject_payload, settings.secret_key, algorithm=settings.algorithm)
    client.headers["Authorization"] = f"Bearer {token}"
    resp = await client.get(PROTECTED_ROUTE)
    assert resp.status_code == 401
