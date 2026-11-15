.PHONY: help hello test lint format build up up-build down restart logs clean ps \
        db-upgrade db-current frontend-install frontend-dev frontend-test \
        frontend-check frontend-build frontend-lint frontend-format e2e check-all \
        test-front lint-front format-front format-check-front test-watch-front \
        test-unit-front test-integration-front test-e2e-front test_enviroment

POETRY_RUN := poetry -C backend run
FRONTEND_DIR := frontend
NPM := npm --prefix $(FRONTEND_DIR)

help:
	@echo "Comandos principais:"
	@echo "  make up-build       - constroi e sobe db, api e frontend"
	@echo "  make ps             - mostra status e health dos containers"
	@echo "  make db-upgrade     - aplica migrations Alembic"
	@echo "  make db-current     - mostra a revisao atual do banco"
	@echo "  make test           - executa testes do backend"
	@echo "  make frontend-test  - executa testes Vitest"
	@echo "  make frontend-check - executa lint e format check com Biome"
	@echo "  make frontend-build - gera build de producao"
	@echo "  make e2e            - executa Playwright com ambiente lab-e2e isolado"
	@echo "  make check-all      - executa todas as validacoes"

hello:
	@echo "Ola, Sistemas Distribuidos!"

test_enviroment:
	$(POETRY_RUN) python --version
	$(POETRY_RUN) ruff --version
	$(POETRY_RUN) pytest --version

install:
	poetry -C backend install --no-interaction

test:
	docker compose up -d --wait db
	docker compose run --build --rm api python scripts/ensure_test_db.py
	docker compose run --build --rm api pytest

lint:
	$(POETRY_RUN) ruff check .

format:
	$(POETRY_RUN) ruff format .

build:
	docker compose build

up:
	docker compose up -d

up-build:
	docker compose up -d --build --wait

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d

logs:
	docker compose logs -f

ps:
	docker compose ps

db-upgrade:
	docker compose exec -T api alembic upgrade head

db-current:
	docker compose exec -T api alembic current

clean:
	docker compose down

frontend-install:
	$(NPM) install

frontend-dev:
	$(NPM) run dev

frontend-test:
	$(NPM) run test

frontend-check:
	$(NPM) run check

frontend-build:
	$(NPM) run build

frontend-lint:
	$(NPM) run lint

frontend-format:
	$(NPM) run format

# Mantem compatibilidade com os nomes de comandos anteriores.
test-front: frontend-test
lint-front: frontend-lint
format-front: frontend-format
format-check-front:
	$(NPM) run format:check

test-watch-front:
	$(NPM) run test:watch

test-unit-front:
	$(NPM) run test:unit

test-integration-front:
	$(NPM) run test:integration

test-e2e-front: e2e

e2e:
	python scripts/run_e2e.py

check-all:
	$(MAKE) test
	$(MAKE) lint
	$(MAKE) frontend-test
	$(MAKE) frontend-check
	$(MAKE) frontend-build
	$(MAKE) e2e
