from fastapi import FastAPI

from app.api.routes.health import router as health_router

app = FastAPI(
    title="EstantePessoal API",
    description="API para gerenciamento de um catálogo pessoal de leitura.",
    version="0.1.0",
)

app.include_router(health_router)
