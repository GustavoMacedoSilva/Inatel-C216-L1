from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.character import Character
from app.schemas.character import CharacterCreate, CharacterUpdate


def get_all(db: Session, race: str | None = None):
    statement = select(Character)

    if race is not None:
        statement = statement.where(Character.race.ilike(race))

    return list(db.scalars(statement).all())


def get_by_id(db: Session, character_id: int):
    return db.get(Character, character_id)


def create(db: Session, data: CharacterCreate):
    character = Character(**data.model_dump())

    db.add(character)
    db.commit()
    db.refresh(character)

    return character


def replace(
    db: Session,
    character: Character,
    data: CharacterUpdate,
):
    for field, value in data.model_dump().items():
        setattr(character, field, value)

    db.commit()
    db.refresh(character)

    return character


def update_level(db: Session, character: Character, level: int):
    character.level = level

    db.commit()
    db.refresh(character)

    return character


def delete(db: Session, character: Character):
    db.delete(character)
    db.commit()