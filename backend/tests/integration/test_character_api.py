def test_create_character(client):
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

    assert data["id"] is not None
    assert data["name"] == "Aragorn"
    assert data["race"] == "Human"
    assert data["character_class"] == "Ranger"
    assert data["level"] == 5


def test_get_characters(client):
    client.post(
        "/characters/",
        json={
            "name": "Legolas",
            "race": "Elf",
            "character_class": "Archer",
            "level": 5,
        },
    )

    response = client.get("/characters/")

    assert response.status_code == 200

    characters = response.json()

    assert isinstance(characters, list)
    assert len(characters) == 1
    assert characters[0]["name"] == "Legolas"


def test_get_character(client):
    create_response = client.post(
        "/characters/",
        json={
            "name": "Gandalf",
            "race": "Wizard",
            "character_class": "Mage",
            "level": 10,
        },
    )

    character_id = create_response.json()["id"]

    response = client.get(f"/characters/{character_id}")

    assert response.status_code == 200
    assert response.json()["id"] == character_id
    assert response.json()["name"] == "Gandalf"


def test_get_character_not_found(client):
    response = client.get("/characters/999999999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Character not found"


def test_filter_characters_by_race(client):
    client.post(
        "/characters/",
        json={
            "name": "Legolas",
            "race": "Elf",
            "character_class": "Archer",
            "level": 5,
        },
    )

    client.post(
        "/characters/",
        json={
            "name": "Gimli",
            "race": "Dwarf",
            "character_class": "Warrior",
            "level": 5,
        },
    )

    response = client.get("/characters/?race=Elf")

    assert response.status_code == 200

    characters = response.json()

    assert len(characters) == 1
    assert characters[0]["name"] == "Legolas"
    assert characters[0]["race"] == "Elf"


def test_put_character(client):
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

    data = response.json()

    assert data["name"] == "New Name"
    assert data["race"] == "Elf"
    assert data["character_class"] == "Mage"
    assert data["level"] == 10


def test_put_character_not_found(client):
    response = client.put(
        "/characters/999999999",
        json={
            "name": "Unknown",
            "race": "Human",
            "character_class": "Warrior",
            "level": 1,
        },
    )

    assert response.status_code == 404


def test_patch_character_level(client):
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
        json={"level": 10},
    )

    assert response.status_code == 200
    assert response.json()["level"] == 10
    assert response.json()["name"] == "Character"


def test_patch_character_level_not_found(client):
    response = client.patch(
        "/characters/999999999/level",
        json={"level": 10},
    )

    assert response.status_code == 404


def test_delete_character(client):
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

    response = client.delete(f"/characters/{character_id}")

    assert response.status_code == 204
    assert response.content == b""

    get_response = client.get(f"/characters/{character_id}")

    assert get_response.status_code == 404


def test_delete_character_not_found(client):
    response = client.delete("/characters/999999999")

    assert response.status_code == 404