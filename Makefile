.PHONY: hello help test_enviroment build up down restart logs test lint format clean install

POETRY_RUN := poetry -C backend run

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