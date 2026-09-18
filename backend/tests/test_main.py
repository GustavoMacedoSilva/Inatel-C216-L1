import pytest
from fastapi.testclient import TestClient

from app.main import app, dividir, soma


@pytest.fixture
def client():
    return TestClient(app)


def test_root(client):
    response = client.get("/")

    assert response.status_code == 200
    assert response.json() == {"message": "Tem que ter esse trem aqui pelo menos"}


def test_soma():
    resultado = soma(2, 3)

    assert resultado == 5


def test_soma_com_zero():
    resultado = soma(10, 0)

    assert resultado == 10


def test_divisao():
    resultado = dividir(10, 2)

    assert resultado == 5


def test_divisao_por_zero():
    with pytest.raises(ValueError):
        dividir(10, 0)

@pytest.mark.parametrize(
    "a, b, esperado",
    [
        (2, 3, 5),
        (10, 5, 15),
        (0, 0, 0),
        (-2, 5, 3),
    ],
)
def test_soma(a, b, esperado):
    assert soma(a, b) == esperado