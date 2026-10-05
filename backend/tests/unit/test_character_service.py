import pytest

from app.schemas.character import CharacterCreate
from app.services import character_service


@pytest.fixture(autouse=True)
def reset_characters():
    character_service.characters.clear()
    character_service.next_id = 1


def test_create_character():
    character_data = CharacterCreate(
        name="Aragorn",
        race="Human",
        character_class="Ranger",
        level=5,
    )

    character = character_service.create_character(character_data)

    assert character["id"] == 1
    assert character["name"] == "Aragorn"
    assert character["level"] == 5


def test_get_character():
    character_data = CharacterCreate(
        name="Gandalf",
        race="Wizard",
        character_class="Mage",
        level=10,
    )

    created = character_service.create_character(character_data)

    character = character_service.get_character(created["id"])

    assert character is not None
    assert character["name"] == "Gandalf"


def test_get_character_not_found():
    character = character_service.get_character(999)

    assert character is None


def test_filter_characters_by_race():
    character_service.create_character(
        CharacterCreate(
            name="Legolas",
            race="Elf",
            character_class="Archer",
            level=5,
        )
    )

    character_service.create_character(
        CharacterCreate(
            name="Gimli",
            race="Dwarf",
            character_class="Warrior",
            level=5,
        )
    )

    elves = character_service.get_all_characters("Elf")

    assert len(elves) == 1
    assert elves[0]["name"] == "Legolas"


def test_delete_character():
    character = character_service.create_character(
        CharacterCreate(
            name="Boromir",
            race="Human",
            character_class="Warrior",
            level=4,
        )
    )

    result = character_service.delete_character(character["id"])

    assert result is True
    assert character_service.get_character(character["id"]) is None