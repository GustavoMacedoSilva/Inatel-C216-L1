from sqlalchemy.orm import Session

from app.repositories import character_repository
from app.schemas.character import CharacterCreate, CharacterLevelUpdate, CharacterUpdate


def get_all_characters(db: Session, race: str | None = None):
    return character_repository.get_all(db, race)


def get_character(db: Session, character_id: int):
    return character_repository.get_by_id(db, character_id)


def create_character(db: Session, data: CharacterCreate):
    return character_repository.create(db, data)


def replace_character(
    db: Session,
    character_id: int,
    data: CharacterUpdate,
):
    character = character_repository.get_by_id(db, character_id)

    if character is None:
        return None

    return character_repository.replace(db, character, data)


def update_character_level(
    db: Session,
    character_id: int,
    data: CharacterLevelUpdate,
):
    character = character_repository.get_by_id(db, character_id)

    if character is None:
        return None

    return character_repository.update_level(db, character, data.level)


def delete_character(db: Session, character_id: int):
    character = character_repository.get_by_id(db, character_id)

    if character is None:
        return False

    character_repository.delete(db, character)
    return True