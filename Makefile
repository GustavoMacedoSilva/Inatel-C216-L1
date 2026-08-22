.PHONY: hello help test_enviroment

POETRY := poetry -C backend run


help:
	@echo "Comandos:"
	@echo "make test_enviroment	- mostra as versoes das bibliotecas/frameworks instalados"
	@echo "make hello - fala oi"

hello:
	@echo "Ola, Sistemas Distribuidos!"

test_enviroment:
	$(POETRY) python --version
	$(POETRY) ruff --version
	$(POETRY) pytest --version