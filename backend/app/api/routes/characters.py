from fastapi import APIRouter, HTTPException, Query

from app.schemas.character import CharacterCreate, CharacterLevelUpdate, CharacterResponse, CharacterUpdate
from app.services import character_service


router = APIRouter(
    prefix="/characters",
    tags=["Characters"],
)


@router.get("/", response_model=list[CharacterResponse])
def get_characters(
    race: str | None = Query(default=None)
):
    return character_service.get_all_characters(race)


@router.get("/{character_id}", response_model=CharacterResponse)
def get_character(character_id: int):
    character = character_service.get_character(character_id)

    if character is None:
        raise HTTPException(
            status_code=404,
            detail="Character not found",
        )

    return character


@router.post(
    "/",
    response_model=CharacterResponse,
    status_code=201,
)
def create_character(character: CharacterCreate):
    return character_service.create_character(character)


@router.put(
    "/{character_id}",
    response_model=CharacterResponse,
)
def replace_character(
    character_id: int,
    character: CharacterUpdate,
):
    updated_character = character_service.replace_character(
        character_id,
        character,
    )

    if updated_character is None:
        raise HTTPException(
            status_code=404,
            detail="Character not found",
        )

    return updated_character


@router.patch(
    "/{character_id}/level",
    response_model=CharacterResponse,
)
def update_character_level(
    character_id: int,
    level: CharacterLevelUpdate,
):
    updated_character = character_service.update_character_level(
        character_id,
        level,
    )

    if updated_character is None:
        raise HTTPException(
            status_code=404,
            detail="Character not found",
        )

    return updated_character


@router.delete(
    "/{character_id}",
    status_code=204,
)
def delete_character(character_id: int):
    deleted = character_service.delete_character(character_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Character not found",
        )