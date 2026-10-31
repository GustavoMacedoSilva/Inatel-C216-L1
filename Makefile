.PHONY: hello help test_enviroment build up down restart logs test lint format clean install

POETRY_RUN := poetry -C backend run
FRONTEND_DIR := frontend
NPM := npm  --prefix $(FRONTEND_DIR)

help:
	@echo "Comandos:"
	@echo "make test_enviroment	- mostra as versoes das bibliotecas/frameworks instalados"
	@echo "make hello - fala oi"
	@echo "install" instala as dependencias do projeto
	@echo "test" - roda os testes
	@echo "build" - faz a build do docker
	@echo "up" - levanta o docker
	@echo "down" - derruba o docker
	@echo "restart" - restarta o docker
	@echo "logs" - pega os logs do docker
	@echo "clean" - derruba e limpa o docker
	@echo "lint" - verifica problemas de estilo com Ruff
	@echo "make frontend-install - instala dependencias do frontend"
	@echo "make frontend-dev - inicia servidor React"
	@echo "make lint-front - verifica codigo"
	@echo "make format-front - formata codigo"
	@echo "make format-check-front - verifica formatacao"
	@echo "make test-front - executa todos os testes"
	@echo "make test-watch-front - executa Vitest em watch mode"
	@echo "make test-unit-front - executa testes unitarios"
	@echo "make test-integration-front - executa testes de integracao"
	@echo "make test-e2e-front - executa testes Playwright"

hello:
	@echo "Ola, Sistemas Distribuidos!"

test_enviroment:
	$(POETRY_RUN) python --version
	$(POETRY_RUN) ruff --version
	$(POETRY_RUN) pytest --version

install:
	poetry -C backend install --no-interaction

test:
	docker compose run --rm api pytest

lint:
	$(POETRY_RUN) ruff check .

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose down
	docker compose up -d

logs:
	docker compose logs -f

clean:
	docker compose down


frontend-install:
	$(NPM) install

frontend-dev:
	$(NPM) run dev

lint-front:
	$(NPM) run lint

format-front:
	$(NPM) run format

format-check-front:
	$(NPM) run format:check

test-front:
	$(NPM) run test

test-watch-front:
	$(NPM) run test:watch

test-unit-front:
	$(NPM) run test:unit

test-integration-front:
	$(NPM) run test:integration

test-e2e-front:
	$(NPM) run test:e2e