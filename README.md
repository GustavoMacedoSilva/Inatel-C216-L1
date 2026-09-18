Inatel-C216-L1


## Testes

Os testes do backend utilizam Pytest e estão localizados em `backend/tests`.

### Executando os testes localmente

A partir da raiz do projeto:

```bash
make test
```

Ou diretamente utilizando o Poetry:

```bash
poetry -C backend run pytest
```

### GitHub Actions

Os testes são executados automaticamente pelo GitHub Actions em:

* `push`
* `pull_request`

O workflow está localizado em:

```text
.github/workflows/ci-backend.yml
```

O workflow configura o Python, instala as dependências utilizando Poetry e executa os testes com Pytest.
