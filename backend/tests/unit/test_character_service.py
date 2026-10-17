from app.schemas.character import (
    CharacterCreate,
    CharacterLevelUpdate,
    CharacterUpdate,
)
from app.services import character_service


def test_create_character(db_session):
    character_data = CharacterCreate(
        name="Aragorn",
        race="Human",
        character_class="Ranger",
        level=5,
    )

    character = character_service.create_character(
        db_session,
        character_data,
    )

    assert character.id is not None
    assert character.name == "Aragorn"
    assert character.race == "Human"
    assert character.character_class == "Ranger"
    assert character.level == 5


def test_get_character(db_session):
    character_data = CharacterCreate(
        name="Gandalf",
        race="Wizard",
        character_class="Mage",
        level=10,
    )

    created = character_service.create_character(
        db_session,
        character_data,
    )

    character = character_service.get_character(
        db_session,
        created.id,
    )

    assert character is not None
    assert character.id == created.id
    assert character.name == "Gandalf"


def test_get_character_not_found(db_session):
    character = character_service.get_character(
        db_session,
        999999999,
    )

    assert character is None


def test_get_all_characters(db_session):
    character_service.create_character(
        db_session,
        CharacterCreate(
            name="Legolas",
            race="Elf",
            character_class="Archer",
            level=5,
        ),
    )

    character_service.create_character(
        db_session,
        CharacterCreate(
            name="Gimli",
            race="Dwarf",
            character_class="Warrior",
            level=5,
        ),
    )

    characters = character_service.get_all_characters(db_session)

    assert len(characters) == 2
    assert {character.name for character in characters} == {
        "Legolas",
        "Gimli",
    }


def test_filter_characters_by_race(db_session):
    character_service.create_character(
        db_session,
        CharacterCreate(
            name="Legolas",
            race="Elf",
            character_class="Archer",
            level=5,
        ),
    )

    character_service.create_character(
        db_session,
        CharacterCreate(
            name="Gimli",
            race="Dwarf",
            character_class="Warrior",
            level=5,
        ),
    )

    elves = character_service.get_all_characters(
        db_session,
        "Elf",
    )

    assert len(elves) == 1
    assert elves[0].name == "Legolas"
    assert elves[0].race == "Elf"


def test_replace_character(db_session):
    created = character_service.create_character(
        db_session,
        CharacterCreate(
            name="Old Name",
            race="Human",
            character_class="Warrior",
            level=1,
        ),
    )

    updated = character_service.replace_character(
        db_session,
        created.id,
        CharacterUpdate(
            name="New Name",
            race="Elf",
            character_class="Mage",
            level=10,
        ),
    )

    assert updated is not None
    assert updated.name == "New Name"
    assert updated.race == "Elf"
    assert updated.character_class == "Mage"
    assert updated.level == 10


def test_replace_character_not_found(db_session):
    updated = character_service.replace_character(
        db_session,
        999999999,
        CharacterUpdate(
            name="Unknown",
            race="Human",
            character_class="Warrior",
            level=1,
        ),
    )

    assert updated is None


def test_update_character_level(db_session):
    created = character_service.create_character(
        db_session,
        CharacterCreate(
            name="Knight",
            race="Human",
            character_class="Knight",
            level=1,
        ),
    )

    updated = character_service.update_character_level(
        db_session,
        created.id,
        CharacterLevelUpdate(level=10),
    )

    assert updated is not None
    assert updated.level == 10
    assert updated.name == "Knight"


def test_update_character_level_not_found(db_session):
    updated = character_service.update_character_level(
        db_session,
        999999999,
        CharacterLevelUpdate(level=10),
    )

    assert updated is None


def test_delete_character(db_session):
    created = character_service.create_character(
        db_session,
        CharacterCreate(
            name="Boromir",
            race="Human",
            character_class="Warrior",
            level=4,
        ),
    )

    result = character_service.delete_character(
        db_session,
        created.id,
    )

    assert result is True
    assert (
        character_service.get_character(db_session, created.id)
        is None
    )


def test_delete_character_not_found(db_session):
    result = character_service.delete_character(
        db_session,
        999999999,
    )

    assert result is False