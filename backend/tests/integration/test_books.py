def test_create_book(client):
    payload = {
        "title": "Duna",
        "author": "Frank Herbert",
        "genre": "Ficção científica",
        "description": "Uma história sobre política e poder.",
        "total_pages": 500,
        "current_page": 120,
        "status": "READING",
        "rating": None,
    }

    response = client.post("/books/", json=payload)

    assert response.status_code == 201

    data = response.json()

    assert data["id"] is not None
    assert data["title"] == "Duna"
    assert data["author"] == "Frank Herbert"
    assert data["total_pages"] == 500
    assert data["current_page"] == 120
    assert data["status"] == "READING"


def test_list_books(client):
    payload = {
        "title": "O Hobbit",
        "author": "J.R.R. Tolkien",
        "total_pages": 310,
    }

    client.post("/books/", json=payload)

    response = client.get("/books/")

    assert response.status_code == 200
    assert len(response.json()) == 1
    assert response.json()[0]["title"] == "O Hobbit"


def test_get_book_by_id(client):
    payload = {
        "title": "1984",
        "author": "George Orwell",
        "total_pages": 328,
    }

    create_response = client.post("/books/", json=payload)
    book_id = create_response.json()["id"]

    response = client.get(f"/books/{book_id}")

    assert response.status_code == 200
    assert response.json()["title"] == "1984"


def test_get_nonexistent_book(client):
    response = client.get("/books/9999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Livro não encontrado."


def create_test_book(client, **overrides):
    payload = {
        "title": "Duna",
        "author": "Frank Herbert",
        "total_pages": 500,
        "current_page": 120,
        "status": "READING",
    }

    payload.update(overrides)

    response = client.post("/books/", json=payload)

    assert response.status_code == 201

    return response.json()


def test_update_book(client):
    book = create_test_book(client)

    response = client.put(
        f"/books/{book['id']}",
        json={"current_page": 250},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["current_page"] == 250
    assert data["total_pages"] == 500
    assert data["title"] == "Duna"


def test_update_book_to_completed(client):
    book = create_test_book(client)

    response = client.put(
        f"/books/{book['id']}",
        json={"status": "COMPLETED"},
    )

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "COMPLETED"
    assert data["current_page"] == data["total_pages"]


def test_update_book_rejects_invalid_progress(client):
    book = create_test_book(client)

    response = client.put(
        f"/books/{book['id']}",
        json={"current_page": 600},
    )

    assert response.status_code == 422

    book_response = client.get(f"/books/{book['id']}")

    assert book_response.json()["current_page"] == 120


def test_update_book_rejects_invalid_total_pages(client):
    book = create_test_book(client)

    response = client.put(
        f"/books/{book['id']}",
        json={"total_pages": 100},
    )

    assert response.status_code == 422

    book_response = client.get(f"/books/{book['id']}")

    assert book_response.json()["total_pages"] == 500


def test_update_book_rejects_empty_payload(client):
    book = create_test_book(client)

    response = client.put(
        f"/books/{book['id']}",
        json={},
    )

    assert response.status_code == 422


def test_update_book_rejects_null_required_field(client):
    book = create_test_book(client)

    response = client.put(
        f"/books/{book['id']}",
        json={"title": None},
    )

    assert response.status_code == 422


def test_delete_book(client):
    book = create_test_book(client)

    response = client.delete(f"/books/{book['id']}")

    assert response.status_code == 204
    assert response.content == b""

    get_response = client.get(f"/books/{book['id']}")

    assert get_response.status_code == 404


def test_delete_nonexistent_book(client):
    response = client.delete("/books/9999")

    assert response.status_code == 404
    assert response.json()["detail"] == "Livro não encontrado."


def test_create_book_rejects_empty_title(client):
    response = client.post(
        "/books/",
        json={
            "title": "   ",
            "author": "Frank Herbert",
            "total_pages": 500,
        },
    )

    assert response.status_code == 422


def test_create_book_rejects_invalid_total_pages(client):
    response = client.post(
        "/books/",
        json={
            "title": "Duna",
            "author": "Frank Herbert",
            "total_pages": 0,
        },
    )

    assert response.status_code == 422


def test_create_book_rejects_progress_above_total_pages(client):
    response = client.post(
        "/books/",
        json={
            "title": "Duna",
            "author": "Frank Herbert",
            "total_pages": 500,
            "current_page": 600,
        },
    )

    assert response.status_code == 422


def test_create_completed_book_updates_progress(client):
    book = create_test_book(
        client,
        status="COMPLETED",
        current_page=120,
    )

    assert book["status"] == "COMPLETED"
    assert book["current_page"] == 500


def test_update_nonexistent_book(client):
    response = client.put(
        "/books/9999",
        json={"current_page": 100},
    )

    assert response.status_code == 404


def test_update_book_clears_optional_field(client):
    book = create_test_book(
        client,
        genre="Ficção científica",
    )

    response = client.put(
        f"/books/{book['id']}",
        json={"genre": None},
    )

    assert response.status_code == 200
    assert response.json()["genre"] is None
