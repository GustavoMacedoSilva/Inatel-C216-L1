import os

import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database.base import Base
from app.database.session import get_db
from app.main import app
from app.models.character import Character

TEST_DATABASE_URL = os.environ["TEST_DATABASE_URL"]

test_engine = create_engine(TEST_DATABASE_URL)

TestingSessionLocal = sessionmaker(
    bind=test_engine,
    autoflush=False,
    expire_on_commit=False,
)


@pytest.fixture(scope="session", autouse=True)
def setup_test_database():
    Base.metadata.create_all(bind=test_engine)

    yield

    Base.metadata.drop_all(bind=test_engine)
    test_engine.dispose()


@pytest.fixture
def clean_test_db(setup_test_database):
    with TestingSessionLocal() as db:
        db.query(Character).delete(synchronize_session=False)
        db.commit()

    yield


@pytest.fixture
def db_session(clean_test_db):
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()

        with TestingSessionLocal() as cleanup_db:
            cleanup_db.query(Character).delete(
                synchronize_session=False
            )
            cleanup_db.commit()


@pytest.fixture
def client(clean_test_db):
    def override_get_db():
        db = TestingSessionLocal()

        try:
            yield db
        finally:
            db.close()

    app.dependency_overrides[get_db] = override_get_db

    try:
        with TestClient(app) as test_client:
            yield test_client
    finally:
        app.dependency_overrides.pop(get_db, None)