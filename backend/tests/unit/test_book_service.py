from types import SimpleNamespace
from unittest.mock import MagicMock

import pytest
from sqlalchemy.exc import SQLAlchemyError

from app.models.book import BookStatus
from app.schemas.book import BookCreate, BookUpdate
from app.services import book_service


@pytest.fixture
def db():
    return MagicMock()


@pytest.fixture
def sample_book():
    return SimpleNamespace(
        id=1,
        title="Duna",
        author="Frank Herbert",
        total_pages=500,
        current_page=120,
        status=BookStatus.READING,
        genre="Ficção científica",
        description=None,
        rating=None,
    )


def test_get_all_books(db, monkeypatch, sample_book):
    expected = [sample_book]

    monkeypatch.setattr(
        book_service.book_repository,
        "get_all",
        lambda session: expected,
    )

    result = book_service.get_all_books(db)

    assert result == expected


def test_get_book_by_id(db, monkeypatch, sample_book):
    monkeypatch.setattr(
        book_service.book_repository,
        "get_by_id",
        lambda session, book_id: sample_book,
    )

    result = book_service.get_book_by_id(db, 1)

    assert result == sample_book


def test_get_nonexistent_book(db, monkeypatch):
    monkeypatch.setattr(
        book_service.book_repository,
        "get_by_id",
        lambda session, book_id: None,
    )

    with pytest.raises(book_service.BookNotFoundError):
        book_service.get_book_by_id(db, 999)


def test_create_book(db, monkeypatch, sample_book):
    payload = BookCreate(
        title="Duna",
        author="Frank Herbert",
        total_pages=500,
        current_page=120,
        status=BookStatus.READING,
    )

    monkeypatch.setattr(
        book_service.book_repository,
        "create",
        lambda session, data: sample_book,
    )

    result = book_service.create_book(db, payload)

    assert result == sample_book
    db.commit.assert_called_once()
    db.refresh.assert_called_once_with(sample_book)


def test_create_completed_book_updates_progress(db, monkeypatch):
    payload = BookCreate(
        title="Duna",
        author="Frank Herbert",
        total_pages=500,
        current_page=120,
        status=BookStatus.COMPLETED,
    )

    created_data = {}

    def fake_create(session, data):
        created_data.update(data)
        return SimpleNamespace(**data)

    monkeypatch.setattr(
        book_service.book_repository,
        "create",
        fake_create,
    )

    result = book_service.create_book(db, payload)

    assert result.current_page == 500
    assert created_data["current_page"] == 500
    db.commit.assert_called_once()


def test_update_book(db, monkeypatch, sample_book):
    monkeypatch.setattr(
        book_service.book_repository,
        "get_by_id",
        lambda session, book_id: sample_book,
    )

    def fake_update(session, book, data):
        for field, value in data.items():
            setattr(book, field, value)

        return book

    monkeypatch.setattr(
        book_service.book_repository,
        "update",
        fake_update,
    )

    payload = BookUpdate(current_page=250)

    result = book_service.update_book(db, 1, payload)

    assert result.current_page == 250
    assert result.total_pages == 500
    db.commit.assert_called_once()


def test_update_to_completed_updates_progress(db, monkeypatch, sample_book):
    monkeypatch.setattr(
        book_service.book_repository,
        "get_by_id",
        lambda session, book_id: sample_book,
    )

    def fake_update(session, book, data):
        for field, value in data.items():
            setattr(book, field, value)

        return book

    monkeypatch.setattr(
        book_service.book_repository,
        "update",
        fake_update,
    )

    payload = BookUpdate(status=BookStatus.COMPLETED)

    result = book_service.update_book(db, 1, payload)

    assert result.status == BookStatus.COMPLETED
    assert result.current_page == 500


def test_update_rejects_progress_above_total_pages(
    db,
    monkeypatch,
    sample_book,
):
    monkeypatch.setattr(
        book_service.book_repository,
        "get_by_id",
        lambda session, book_id: sample_book,
    )

    payload = BookUpdate(current_page=600)

    with pytest.raises(book_service.BookBusinessRuleError):
        book_service.update_book(db, 1, payload)

    db.commit.assert_not_called()


def test_update_rejects_empty_payload(db, monkeypatch, sample_book):
    monkeypatch.setattr(
        book_service.book_repository,
        "get_by_id",
        lambda session, book_id: sample_book,
    )

    payload = BookUpdate()

    with pytest.raises(book_service.BookBusinessRuleError):
        book_service.update_book(db, 1, payload)

    db.commit.assert_not_called()


def test_delete_book(db, monkeypatch, sample_book):
    monkeypatch.setattr(
        book_service.book_repository,
        "get_by_id",
        lambda session, book_id: sample_book,
    )

    delete_mock = MagicMock()

    monkeypatch.setattr(
        book_service.book_repository,
        "delete",
        delete_mock,
    )

    book_service.delete_book(db, 1)

    delete_mock.assert_called_once_with(db, sample_book)
    db.commit.assert_called_once()


def test_create_rolls_back_on_database_error(db, monkeypatch):
    payload = BookCreate(
        title="Duna",
        author="Frank Herbert",
        total_pages=500,
    )

    def fake_create(session, data):
        raise SQLAlchemyError("Database error")

    monkeypatch.setattr(
        book_service.book_repository,
        "create",
        fake_create,
    )

    with pytest.raises(SQLAlchemyError):
        book_service.create_book(db, payload)

    db.rollback.assert_called_once()
