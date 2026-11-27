from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy.orm import Session

from app.models.book import Book, BookStatus
from app.repositories import book_repository
from app.schemas.book import BookCreate, BookUpdate


class BookNotFoundError(Exception):
    pass


class BookBusinessRuleError(Exception):
    pass


def get_all_books(db: Session) -> list[Book]:
    return book_repository.get_all(db)


def get_book_by_id(db: Session, book_id: int) -> Book:
    book = book_repository.get_by_id(db, book_id)

    if book is None:
        raise BookNotFoundError("Livro não encontrado.")

    return book


def create_book(db: Session, book_data: BookCreate) -> Book:
    data = book_data.model_dump()

    if data["current_page"] > data["total_pages"]:
        raise BookBusinessRuleError(
            "A página atual não pode ultrapassar o total de páginas."
        )

    if data["status"] == BookStatus.COMPLETED:
        data["current_page"] = data["total_pages"]

    try:
        book = book_repository.create(db, data)
        db.commit()
        db.refresh(book)

        return book

    except SQLAlchemyError:
        db.rollback()
        raise


def update_book(
    db: Session,
    book_id: int,
    book_data: BookUpdate,
) -> Book:
    book = get_book_by_id(db, book_id)
    data = book_data.model_dump(exclude_unset=True)

    if not data:
        raise BookBusinessRuleError("Informe pelo menos um campo para atualizar.")

    required_fields = {
        "title",
        "author",
        "total_pages",
        "current_page",
        "status",
    }

    for field, value in data.items():
        if field in required_fields and value is None:
            raise BookBusinessRuleError(f"O campo '{field}' não pode ser nulo.")

    new_total_pages = data.get("total_pages", book.total_pages)
    new_current_page = data.get("current_page", book.current_page)
    new_status = data.get("status", book.status)

    if new_current_page > new_total_pages:
        raise BookBusinessRuleError(
            "A página atual não pode ultrapassar o total de páginas."
        )

    if new_status == BookStatus.COMPLETED:
        data["current_page"] = new_total_pages

    try:
        book = book_repository.update(db, book, data)
        db.commit()
        db.refresh(book)

        return book

    except SQLAlchemyError:
        db.rollback()
        raise


def delete_book(db: Session, book_id: int) -> None:
    book = get_book_by_id(db, book_id)

    try:
        book_repository.delete(db, book)
        db.commit()

    except SQLAlchemyError:
        db.rollback()
        raise
