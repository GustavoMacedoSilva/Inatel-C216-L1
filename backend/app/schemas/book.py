from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models.book import BookStatus


class BookBase(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    author: str = Field(min_length=1, max_length=150)
    genre: str | None = Field(default=None, max_length=80)
    description: str | None = None

    total_pages: int = Field(gt=0)
    current_page: int = Field(default=0, ge=0)

    status: BookStatus = BookStatus.WANT_TO_READ
    rating: float | None = Field(default=None, ge=0, le=5)

    @field_validator("title", "author")
    @classmethod
    def validate_required_strings(cls, value: str) -> str:
        value = value.strip()

        if not value:
            raise ValueError("Este campo não pode ficar vazio.")

        return value


class BookCreate(BookBase):
    pass


class BookUpdate(BaseModel):
    title: str | None = Field(default=None, min_length=1, max_length=200)
    author: str | None = Field(default=None, min_length=1, max_length=150)
    genre: str | None = Field(default=None, max_length=80)
    description: str | None = None

    total_pages: int | None = Field(default=None, gt=0)
    current_page: int | None = Field(default=None, ge=0)

    status: BookStatus | None = None
    rating: float | None = Field(default=None, ge=0, le=5)

    @field_validator("title", "author")
    @classmethod
    def validate_required_strings(cls, value: str | None) -> str | None:
        if value is None:
            return value

        value = value.strip()

        if not value:
            raise ValueError("Este campo não pode ficar vazio.")

        return value


class BookResponse(BookBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
