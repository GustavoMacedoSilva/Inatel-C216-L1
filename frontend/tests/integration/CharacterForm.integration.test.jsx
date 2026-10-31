import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom/vitest";

import CharacterForm from "../../src/components/CharacterForm";

describe("CharacterForm - Testes de Integração", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("deve permitir preencher todos os campos", async () => {
    const user = userEvent.setup();

    render(<CharacterForm />);

    const nameInput = screen.getByLabelText("Nome do personagem");

    const raceSelect = screen.getByLabelText("Raça");

    const classSelect = screen.getByLabelText("Classe");

    await user.type(nameInput, "Arthas");
    await user.selectOptions(raceSelect, "Humano");
    await user.selectOptions(classSelect, "Paladino");

    expect(nameInput).toHaveValue("Arthas");
    expect(raceSelect).toHaveValue("Humano");
    expect(classSelect).toHaveValue("Paladino");
  });

  it("deve cadastrar um personagem com nível inicial 1", async () => {
    const user = userEvent.setup();

    const alertMock = vi.spyOn(window, "alert").mockImplementation(() => {});

    const consoleMock = vi.spyOn(console, "log").mockImplementation(() => {});

    render(<CharacterForm />);

    await user.type(screen.getByLabelText("Nome do personagem"), "Arthas");

    await user.selectOptions(screen.getByLabelText("Raça"), "Humano");

    await user.selectOptions(screen.getByLabelText("Classe"), "Paladino");

    await user.click(
      screen.getByRole("button", {
        name: "Criar Personagem",
      }),
    );

    expect(alertMock).toHaveBeenCalledWith("Personagem criado com sucesso!");

    expect(consoleMock).toHaveBeenCalledWith("Personagem criado:", {
      name: "Arthas",
      race: "Humano",
      character_class: "Paladino",
      level: 1,
    });
  });

  it("deve limpar os campos após cadastrar o personagem", async () => {
    const user = userEvent.setup();

    vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<CharacterForm />);

    const nameInput = screen.getByLabelText("Nome do personagem");

    const raceSelect = screen.getByLabelText("Raça");

    const classSelect = screen.getByLabelText("Classe");

    await user.type(nameInput, "Arthas");
    await user.selectOptions(raceSelect, "Humano");
    await user.selectOptions(classSelect, "Paladino");

    await user.click(
      screen.getByRole("button", {
        name: "Criar Personagem",
      }),
    );

    expect(nameInput).toHaveValue("");
    expect(raceSelect).toHaveValue("");
    expect(classSelect).toHaveValue("");
  });
});
