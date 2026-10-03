from fastapi.testclient import TestClient

from app.main import app


client = TestClient(app)


def test_create_character():
    response = client.post(
        "/characters/",
        json={
            "name": "Aragorn",
            "race": "Human",
            "character_class": "Ranger",
            "level": 5,
        },
    )

    assert response.status_code == 201

    data = response.json()

    assert data["name"] == "Aragorn"
    assert data["race"] == "Human"


def test_get_characters():
    response = client.get("/characters/")

    assert response.status_code == 200
    assert isinstance(response.json(), list)


def test_get_character():
    create_response = client.post(
        "/characters/",
        json={
            "name": "Legolas",
            "race": "Elf",
            "character_class": "Archer",
            "level": 5,
        },
    )

    character_id = create_response.json()["id"]

    response = client.get(f"/characters/{character_id}")

    assert response.status_code == 200
    assert response.json()["name"] == "Legolas"


def test_get_character_not_found():
    response = client.get("/characters/999999")

    assert response.status_code == 404


def test_filter_characters_by_race():
    client.post(
        "/characters/",
        json={
            "name": "Gimli",
            "race": "Dwarf",
            "character_class": "Warrior",
            "level": 5,
        },
    )

    response = client.get("/characters/?race=Dwarf")

    assert response.status_code == 200

    characters = response.json()

    assert all(
        character["race"] == "Dwarf"
        for character in characters
    )


def test_put_character():
    create_response = client.post(
        "/characters/",
        json={
            "name": "Old Name",
            "race": "Human",
            "character_class": "Warrior",
            "level": 1,
        },
    )

    character_id = create_response.json()["id"]

    response = client.put(
        f"/characters/{character_id}",
        json={
            "name": "New Name",
            "race": "Elf",
            "character_class": "Mage",
            "level": 10,
        },
    )

    assert response.status_code == 200
    assert response.json()["name"] == "New Name"
    assert response.json()["race"] == "Elf"
    assert response.json()["level"] == 10


def test_patch_character_level():
    create_response = client.post(
        "/characters/",
        json={
            "name": "Character",
            "race": "Human",
            "character_class": "Knight",
            "level": 1,
        },
    )

    character_id = create_response.json()["id"]

    response = client.patch(
        f"/characters/{character_id}/level",
        json={
            "level": 10,
        },
    )

    assert response.status_code == 200
    assert response.json()["level"] == 10


def test_delete_character():
    create_response = client.post(
        "/characters/",
        json={
            "name": "To Delete",
            "race": "Human",
            "character_class": "Rogue",
            "level": 1,
        },
    )

    character_id = create_response.json()["id"]

    response = client.delete(
        f"/characters/{character_id}"
    )

    assert response.status_code == 204

    get_response = client.get(
        f"/characters/{character_id}"
    )

    assert get_response.status_code == 404