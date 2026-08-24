from datetime import UTC, datetime, timedelta

import jwt
import pytest

from app.config import settings
from app.security import create_access_token, decode_access_token, hash_password, verify_password


def test_hash_password_roundtrip():
    hashed = hash_password("correct-horse")
    assert hashed != "correct-horse"
    assert verify_password("correct-horse", hashed)


def test_verify_password_rejects_wrong_password():
    hashed = hash_password("correct-horse")
    assert not verify_password("wrong-password", hashed)


def test_create_and_decode_access_token_roundtrip():
    token = create_access_token("user-123")
    assert decode_access_token(token) == "user-123"


def test_decode_access_token_rejects_expired_token():
    expired_payload = {"sub": "user-123", "exp": datetime.now(UTC) - timedelta(minutes=1)}
    expired_token = jwt.encode(expired_payload, settings.secret_key, algorithm=settings.algorithm)
    with pytest.raises(jwt.ExpiredSignatureError):
        decode_access_token(expired_token)


def test_decode_access_token_rejects_bad_signature():
    tampered = jwt.encode(
        {"sub": "user-123", "exp": datetime.now(UTC) + timedelta(minutes=5)},
        "a-completely-different-secret",
        algorithm=settings.algorithm,
    )
    with pytest.raises(jwt.InvalidSignatureError):
        decode_access_token(tampered)


def test_decode_access_token_rejects_malformed_token():
    with pytest.raises(jwt.DecodeError):
        decode_access_token("not-a-valid-jwt")
