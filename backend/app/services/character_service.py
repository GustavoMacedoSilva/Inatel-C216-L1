from app.schemas.character import CharacterCreate, CharacterLevelUpdate, CharacterUpdate


characters = []
next_id = 1


def get_all_characters(race: str | None = None):
    if race is None:
        return characters

    return [
        character
        for character in characters
        if character["race"].lower() == race.lower()
    ]


def get_character(character_id: int):
    for character in characters:
        if character["id"] == character_id:
            return character

    return None


def create_character(character_data: CharacterCreate):
    global next_id

    character = {
        "id": next_id,
        **character_data.model_dump(),
    }

    characters.append(character)
    next_id += 1

    return character


def replace_character(
    character_id: int,
    character_data: CharacterUpdate,
):
    character = get_character(character_id)

    if character is None:
        return None

    character.update(character_data.model_dump())

    return character


def update_character_level(
    character_id: int,
    level_data: CharacterLevelUpdate,
):
    character = get_character(character_id)

    if character is None:
        return None

    character["level"] = level_data.level

    return character


def delete_character(character_id: int):
    character = get_character(character_id)

    if character is None:
        return False

    characters.remove(character)

    return True