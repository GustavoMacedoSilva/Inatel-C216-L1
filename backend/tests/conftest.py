import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import Session

from app.core.config import settings
from app.core.database import DATABASE_URL, Base, get_db
from app.main import app
from app.models import Book  # noqa: F401


@pytest.fixture(scope="session")
def test_engine():
    test_database_url = DATABASE_URL.set(database=f"{settings.POSTGRES_DB}_test")

    engine = create_engine(
        test_database_url,
        pool_pre_ping=True,
    )

    # Reinicia somente o banco exclusivo de testes.
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    yield engine

    Base.metadata.drop_all(bind=engine)
    engine.dispose()


@pytest.fixture
def db_session(test_engine):
    connection = test_engine.connect()
    transaction = connection.begin()

    session = Session(
        bind=connection,
        join_transaction_mode="create_savepoint",
    )

    yield session

    session.close()
    transaction.rollback()
    connection.close()


@pytest.fixture
def client(db_session):
    def override_get_db():
        yield db_session

    app.dependency_overrides[get_db] = override_get_db

    with TestClient(app) as test_client:
        yield test_client

    app.dependency_overrides.clear()
