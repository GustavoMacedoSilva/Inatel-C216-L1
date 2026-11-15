from sqlalchemy import Integer, String, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.database.base import Base


class Character(Base):
    __tablename__ = "characters"
    __table_args__ = (
        UniqueConstraint("name", name="uq_characters_name"),
    )

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True,
    )
    name: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )
    race: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    character_class: Mapped[str] = mapped_column(
        String(50),
        nullable=False,
    )
    level: Mapped[int] = mapped_column(
        Integer,
        nullable=False,
        default=1,
    )
