const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:8000"
).replace(/\/$/, "");

async function parseResponse(response) {
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      typeof data?.detail === "string"
        ? data.detail
        : "Não foi possível concluir a operação. Tente novamente.";
    throw new Error(message);
  }

  return data;
}

export async function getCharacters() {
  const response = await fetch(`${API_BASE_URL}/characters/`);
  return parseResponse(response);
}

export async function createCharacter(character) {
  const response = await fetch(`${API_BASE_URL}/characters/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(character),
  });

  return parseResponse(response);
}
