.PHONY: help install run test test-unit test-integration lint format format-check check \
        migrate migration downgrade api-build api-up api-logs api-stop \
		frontend-install frontend-dev frontend-build frontend-logs frontend-stop \
        docker-build docker-up docker-down docker-logs docker-ps docker-restart \
		frontend-test frontend-test-unit frontend-test-integration \
        frontend-test-e2e frontend-check frontend-format frontend-build-check

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
	@echo "EstantePessoal - Frontend Commands:"
	@echo "  frontend-install - Instala as dependências do frontend"
	@echo "  frontend-dev - Inicia o Vite localmente"
	@echo "  frontend-build - Constrói a imagem do frontend"
	@echo "  frontend-logs - Exibe os logs do frontend"
	@echo "  frontend-stop - Para o frontend"
	@echo "Frontend - Tests:"
	@echo "  frontend-test - Executa todos os testes"
	@echo "  frontend-test-unit - Executa testes unitários"
	@echo "  frontend-test-integration - Executa testes de integração"
	@echo "  frontend-test-e2e - Executa testes E2E"
	@echo "  frontend-check - Verifica código com Biome"
	@echo "  frontend-format - Formata código com Biome"
	@echo "  frontend-build-check - Verifica o build de produção"
	@echo "Docker Compose:"
	@echo "  docker-build - Constrói todas as imagens"
	@echo "  docker-up - Inicia toda a aplicação"
	@echo "  docker-down  - Para e remove os containers"
	@echo "  docker-logs - Exibe os logs dos serviços"
	@echo "  docker-ps - Mostra o estado dos containers"
	@echo "  docker-restart - Reinicia os serviços"

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

frontend-install:
	cd frontend && npm ci

frontend-dev:
	cd frontend && npm run dev

frontend-test:
	cd frontend && npm test

frontend-test-unit:
	cd frontend && npm run test:unit

frontend-test-integration:
	cd frontend && npm run test:integration

frontend-test-e2e:
	cd frontend && npm run test:e2e

frontend-check:
	cd frontend && npm run check

frontend-format:
	cd frontend && npm run format

frontend-build-check:
	cd frontend && npm run build

frontend-build:
	docker compose build frontend

frontend-logs:
	docker compose logs -f frontend

frontend-stop:
	docker compose stop frontend

docker-build:
	docker compose build

docker-up:
	docker compose up -d --build

docker-down:
	docker compose down

docker-logs:
	docker compose logs -f

docker-ps:
	docker compose ps

docker-restart:
	docker compose restart

