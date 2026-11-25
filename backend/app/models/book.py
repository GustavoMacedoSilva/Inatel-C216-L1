from datetime import datetime
from enum import Enum

from sqlalchemy import (
    CheckConstraint,
    DateTime,
    Float,
    Integer,
    String,
    Text,
    func,
)
from sqlalchemy import (
    Enum as SQLAlchemyEnum,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class BookStatus(str, Enum):
    WANT_TO_READ = "WANT_TO_READ"
    READING = "READING"
    COMPLETED = "COMPLETED"


class Book(Base):
    __tablename__ = "books"

    __table_args__ = (
        CheckConstraint("total_pages > 0", name="ck_books_total_pages_positive"),
        CheckConstraint(
            "current_page >= 0 AND current_page <= total_pages",
            name="ck_books_current_page_range",
        ),
        CheckConstraint(
            "rating IS NULL OR (rating >= 0 AND rating <= 5)",
            name="ck_books_rating_range",
        ),
        CheckConstraint(
            "status != 'COMPLETED' OR current_page = total_pages",
            name="ck_books_completed_progress",
        ),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )

    title: Mapped[str] = mapped_column(String(200), nullable=False)
    author: Mapped[str] = mapped_column(String(150), nullable=False)
    genre: Mapped[str | None] = mapped_column(String(80), nullable=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)

    total_pages: Mapped[int] = mapped_column(Integer, nullable=False)
    current_page: Mapped[int] = mapped_column(Integer, default=0, nullable=False)

    status: Mapped[BookStatus] = mapped_column(
        SQLAlchemyEnum(
            BookStatus,
            name="book_status",
            native_enum=False,
            create_constraint=True,
            values_callable=lambda enum: [item.value for item in enum],
        ),
        default=BookStatus.WANT_TO_READ,
        nullable=False,
    )

    rating: Mapped[float | None] = mapped_column(Float, nullable=True)

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
        onupdate=func.now(),
        nullable=False,
    )
