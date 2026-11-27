Inatel-C216-L1

# Estante Pessoal

### Aplicação para catalogar seus livros

***

Aplicação web para gerenciamento de uma biblioteca pessoal, permitindo cadastrar livros, acompanhar o progresso de leitura e organizar a coleção de maneira simples.

## Funcionalidades

- Cadastro de livros.
- Listagem de livros cadastrados.
- Consulta de detalhes de um livro.
- Edição e exclusão de livros.
- Pesquisa por título ou autor.
- Filtragem por status de leitura.
- Acompanhamento do progresso de leitura.
- Avaliação de livros de 0 a 5.
- Estatísticas gerais da biblioteca.

## Tecnologias utilizadas

### Backend
- Python 3.14
- FastAPI
- SQLAlchemy
- Alembic
- PostgreSQL
- Poetry
- Pytest
- Ruff

### Frontend
- JavaScript
- React 19
- Vite
- Tailwind CSS 4
- Biome
- Vitest
- Testing Library
- Playwright

### Infraestrutura
- Docker
- Docker Compose
- Nginx
- GitHub Actions

## Pré-requisitos

Para executar o projeto, é necessário ter instalado:

- Git
- Docker
- Docker Compose
- Make

## Configuração do ambiente

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
cd EstantePessoal
```

Crie o arquivo de configuração do ambiente:

```bash
cp .env.example .env
```

Edite o `.env` e configure as credenciais do PostgreSQL.

Exemplo:

```dotenv
POSTGRES_USER=estante
POSTGRES_PASSWORD=change_me
POSTGRES_DB=estante_pessoal
POSTGRES_HOST=localhost
POSTGRES_PORT=5432
```

## Executando com Docker Compose

A maneira recomendada de executar a aplicação é utilizando Docker Compose.

Na raiz do projeto, execute:

```bash
docker compose up --build -d
```

Ou utilize o Makefile:

```bash
make docker-up
```

O Compose inicializa os seguintes serviços:

| Serviço | Descrição | Porta |
|---|---|---|
| `frontend` | Aplicação React servida pelo Nginx | 5173 |
| `api` | API FastAPI | 8000 |
| `db` | Banco PostgreSQL | 5432 |

### Acessando a aplicação

- Aplicação web: http://localhost:5173
- API: http://localhost:8000
- Documentação Swagger: http://localhost:8000/docs
- Health check: http://localhost:5173/api/health

### Comandos úteis

```bash
# Verificar os containers
make docker-ps

# Visualizar logs
make docker-logs

# Reconstruir as imagens
make docker-build

# Reiniciar os serviços
make docker-restart

# Parar e remover os containers
make docker-down
```

## Executando em ambiente de desenvolvimento

Também é possível executar frontend e backend separadamente, mantendo o PostgreSQL em Docker.

### Banco de dados

Inicie somente o PostgreSQL:

```bash
docker compose up -d db
```

### Backend

Na raiz do projeto, instale as dependências:

```bash
make install
```

Inicie a API:

```bash
make run
```

A API estará disponível em:

http://localhost:8000

### Frontend

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependências:

```bash
npm ci
```

Crie o arquivo de ambiente:

```bash
cp .env.example .env
```

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O frontend estará disponível em:

http://localhost:5173

## API REST

A API disponibiliza operações CRUD para gerenciamento dos livros. Essa documentação também está presente em localhost:8000/docs (Swagger)

| Método | Endpoint | Descrição |
|---|---|---|
| `GET` | `/health` | Verifica a disponibilidade da API |
| `GET` | `/books/` | Lista todos os livros |
| `GET` | `/books/{id}` | Busca um livro pelo ID |
| `POST` | `/books/` | Cadastra um livro |
| `PUT` | `/books/{id}` | Atualiza os dados de um livro |
| `DELETE` | `/books/{id}` | Exclui um livro |

### Exemplo de cadastro

Requisição:

```http
POST /books/
Content-Type: application/json
```

Corpo:

```json
{
  "title": "O Hobbit",
  "author": "J. R. R. Tolkien",
  "genre": "Fantasia",
  "description": "Uma aventura pela Terra-média.",
  "total_pages": 310,
  "current_page": 0,
  "status": "WANT_TO_READ",
  "rating": null
}
```

## Testes

O projeto possui testes unitários, de integração e end-to-end.

### Backend

Os testes são implementados com Pytest.

```bash
# Todos os testes
make test

# Testes unitários
make test-unit

# Testes de integração
make test-integration
```

Para verificar qualidade e formatação:

```bash
make lint
make format-check
```

### Frontend

Os testes unitários e de integração utilizam Vitest e Testing Library.

```bash
cd frontend

# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes end-to-end
npm run test:e2e
```

Os testes E2E utilizam Playwright e verificam fluxos completos da aplicação, incluindo cadastro, edição, persistência e exclusão de livros.

Para executar os testes E2E, o backend e o PostgreSQL devem estar disponíveis.

### Verificação geral

No frontend:

```bash
npm run check
npm run build
```

No backend:

```bash
make check
```

## Integração contínua

Os workflows estão organizados em:

- `backend-ci.yml`: validação do backend, incluindo Ruff e Pytest.
- `frontend-ci.yml`: validação do frontend, incluindo Biome, Vitest, build e Playwright.

Esses workflows possuem filtros para não serem rodados de maneira desnecessaria.

## Makefile

O projeto possui um Makefile na raiz para simplificar tarefas recorrentes.

Para visualizar todos os comandos disponíveis:

```bash
make help
```
