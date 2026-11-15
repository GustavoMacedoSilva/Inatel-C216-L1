import { render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import CharacterList from "../../src/components/CharacterList";

afterEach(() => {
  vi.unstubAllGlobals();
});

const characters = [
  {
    id: 1,
    name: "Arthas",
    race: "Humano",
    character_class: "Paladino",
    level: 1,
  },
];

describe("CharacterList - integração com a API", () => {
  it("deve exibir carregamento enquanto busca os personagens", async () => {
    let resolveFetch;
    vi.stubGlobal(
      "fetch",
      vi.fn(
        () =>
          new Promise((resolve) => {
            resolveFetch = resolve;
          }),
      ),
    );

    render(<CharacterList />);
    expect(screen.getByRole("status")).toHaveTextContent(
      "Carregando personagens...",
    );

    resolveFetch({ ok: true, json: async () => characters });
    expect(await screen.findByText("Arthas")).toBeInTheDocument();
  });

  it("deve listar os personagens retornados pela API", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => characters,
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CharacterList />);

    expect(await screen.findByText("Arthas")).toBeInTheDocument();
    expect(screen.getByText("Humano · Paladino")).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith("http://localhost:8000/characters/");
  });

  it("deve exibir uma mensagem quando a API falhar", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ detail: "Falha ao carregar personagens" }),
      }),
    );

    render(<CharacterList />);

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Falha ao carregar personagens",
    );
  });
});
