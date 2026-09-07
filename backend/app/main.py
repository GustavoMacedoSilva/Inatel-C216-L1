from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def root():
    return {"message": "Tem que ter esse trem aqui pelo menos"}