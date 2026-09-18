from fastapi import FastAPI

app = FastAPI()

def soma(a: int, b: int) -> int:
    return a + b


def dividir(a: float, b: float) -> float:
    if b == 0:
        raise ValueError("Não é possível dividir por zero")

    return a / b


@app.get("/")
def root():
    return {"message": "Tem que ter esse trem aqui pelo menos"}