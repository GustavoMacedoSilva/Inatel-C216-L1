from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.book import Book


def get_all(db: Session) -> list[Book]:
    statement = select(Book).order_by(Book.id.desc())

    return list(db.scalars(statement).all())


def get_by_id(db: Session, book_id: int) -> Book | None:
    return db.get(Book, book_id)


def create(db: Session, book_data: dict) -> Book:
    book = Book(**book_data)

    db.add(book)

    return book


def update(db: Session, book: Book, book_data: dict) -> Book:
    for field, value in book_data.items():
        setattr(book, field, value)

    return book


def delete(db: Session, book: Book) -> None:
    db.delete(book)
