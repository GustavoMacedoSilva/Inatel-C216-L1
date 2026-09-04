.PHONY: hello help test_enviroment build up down restart logs test lint format clean

POETRY_RUN := poetry -C backend run
POETRY := poetry


PROJECT_DIR := backend

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
	

hello:
	@echo "Ola, Sistemas Distribuidos!"

test_enviroment:
	$(POETRY_RUN) python --version
	$(POETRY_RUN) ruff --version
	$(POETRY_RUN) pytest --version

install:
	cd $(PROJECT_DIR) && $(POETRY) install

test:
	cd $(PROJECT_DIR) && $(POETRY) run pytest

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
	docker compose down -v