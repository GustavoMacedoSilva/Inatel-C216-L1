.PHONY: help install run test test-unit test-integration lint format format-check check \
        migrate migration downgrade api-build api-up api-logs api-stop

help:
	@echo "EstantePessoal - Backend Commands"
	@echo ""
	@echo "  make install - Instala as dependencias"
	@echo "  make run - Inicia a API localmente"
	@echo "  make test - Executa todos os testes"
	@echo "  make test-unit - Executa testes unitarios"
	@echo "  make test-integration - Executa testes de integracao"
	@echo "  make lint - Executa o Ruff"
	@echo "  make format - Formata o codigo"
	@echo "  make format-check - Verifica a formatacao"
	@echo "  make check - Executa lint, format-check e testes"
	@echo "  make migrate - Aplica as migrations"
	@echo "  make migration MSG='descricao' - Cria uma migration"
	@echo "  make downgrade - Reverte a ultima migration"
	@echo "  make api-build - Constroi a imagem Docker da API"
	@echo "  make api-up - Inicia API e banco pelo Docker"
	@echo "  make api-logs - Exibe logs da API"
	@echo "  make api-stop - Para somente a API"

install:
	cd backend && poetry install --with dev

run:
	cd backend && poetry run uvicorn app.main:app --reload

test:
	cd backend && poetry run pytest -v

test-unit:
	cd backend && poetry run pytest tests/unit -v

test-integration:
	cd backend && poetry run pytest tests/integration -v

lint:
	cd backend && poetry run ruff check .

format:
	cd backend && poetry run ruff format .

format-check:
	cd backend && poetry run ruff format --check .

check: lint format-check test

migrate:
	cd backend && poetry run alembic upgrade head

migration:
	@test -n "$(MSG)" || (echo "Informe a mensagem: make migration MSG='descricao'" && exit 1)
	cd backend && poetry run alembic revision --autogenerate -m "$(MSG)"

downgrade:
	cd backend && poetry run alembic downgrade -1

api-build:
	docker compose build api

api-up:
	docker compose up --build api

api-logs:
	docker compose logs -f api

api-stop:
	docker compose stop api
