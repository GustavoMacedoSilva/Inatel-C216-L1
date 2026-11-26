#subir docker
docker compose up -d

# rodar testes unitarios
poetry run pytest tests/unit/ -v

#rodar testes de integração
poetry run pytest tests/integration/ -v

#rodar todos os testes
poetry run pytest -v