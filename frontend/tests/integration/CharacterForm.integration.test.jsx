import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import "@testing-library/jest-dom/vitest";

import CharacterForm from "../../src/components/CharacterForm";

const createdCharacter = {
  id: 1,
  name: "Arthas",
  race: "Humano",
  character_class: "Paladino",
  level: 1,
};

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("CharacterForm - integração com a API", () => {
  it("deve permitir preencher todos os campos", async () => {
    const user = userEvent.setup();
    render(<CharacterForm />);

    await user.type(screen.getByLabelText("Nome do personagem"), "Arthas");
    await user.selectOptions(screen.getByLabelText("Raça"), "Humano");
    await user.selectOptions(screen.getByLabelText("Classe"), "Paladino");

    expect(screen.getByLabelText("Nome do personagem")).toHaveValue("Arthas");
    expect(screen.getByLabelText("Raça")).toHaveValue("Humano");
    expect(screen.getByLabelText("Classe")).toHaveValue("Paladino");
  });

  it("deve enviar o personagem para a API e limpar o formulário", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => createdCharacter,
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<CharacterForm />);
    await user.type(screen.getByLabelText("Nome do personagem"), "Arthas");
    await user.selectOptions(screen.getByLabelText("Raça"), "Humano");
    await user.selectOptions(screen.getByLabelText("Classe"), "Paladino");
    await user.click(screen.getByRole("button", { name: "Criar Personagem" }));

    await screen.findByRole("status");
    expect(screen.getByRole("status")).toHaveTextContent(
      "Personagem criado com sucesso!",
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:8000/characters/",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Arthas",
          race: "Humano",
          character_class: "Paladino",
          level: 1,
        }),
      },
    );
    expect(screen.getByLabelText("Nome do personagem")).toHaveValue("");
    expect(screen.getByLabelText("Raça")).toHaveValue("");
    expect(screen.getByLabelText("Classe")).toHaveValue("");
  });

  it("deve apresentar o estado de carregamento durante o envio", async () => {
    const user = userEvent.setup();
    let resolveFetch;
    const fetchMock = vi.fn(
      () =>
        new Promise((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal("fetch", fetchMock);

    render(<CharacterForm />);
    await user.type(screen.getByLabelText("Nome do personagem"), "Arthas");
    await user.selectOptions(screen.getByLabelText("Raça"), "Humano");
    await user.selectOptions(screen.getByLabelText("Classe"), "Paladino");
    await user.click(screen.getByRole("button", { name: "Criar Personagem" }));

    expect(screen.getByRole("button", { name: "Criando..." })).toBeDisabled();

    resolveFetch({ ok: true, json: async () => createdCharacter });
    await screen.findByText("Personagem criado com sucesso!");
  });

  it("deve exibir a mensagem enviada pela API quando o nome já existe", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          detail: "Já existente um personagem com esse nome",
        }),
      }),
    );

    render(<CharacterForm />);
    await user.type(screen.getByLabelText("Nome do personagem"), "Arthas");
    await user.selectOptions(screen.getByLabelText("Raça"), "Humano");
    await user.selectOptions(screen.getByLabelText("Classe"), "Paladino");
    await user.click(screen.getByRole("button", { name: "Criar Personagem" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Já existente um personagem com esse nome",
    );
    expect(screen.getByLabelText("Nome do personagem")).toHaveValue("Arthas");
  });

  it("deve exibir um erro de rede", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("API indisponível")),
    );

    render(<CharacterForm />);
    await user.type(screen.getByLabelText("Nome do personagem"), "Arthas");
    await user.selectOptions(screen.getByLabelText("Raça"), "Humano");
    await user.selectOptions(screen.getByLabelText("Classe"), "Paladino");
    await user.click(screen.getByRole("button", { name: "Criar Personagem" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "API indisponível",
    );
  });
});
