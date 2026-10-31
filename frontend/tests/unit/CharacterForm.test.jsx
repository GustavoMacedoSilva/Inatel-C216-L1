import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import CharacterForm from "../../src/components/CharacterForm";

describe("CharacterForm - Testes Unitários", () => {
  it("deve renderizar o formulário corretamente", () => {
    render(<CharacterForm />);

    expect(
      screen.getByRole("heading", {
        name: "Criar Personagem",
      }),
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Criar Personagem",
      }),
    ).toBeInTheDocument();
  });

  it("deve possuir um campo para o nome", () => {
    render(<CharacterForm />);

    expect(screen.getByLabelText("Nome do personagem")).toBeInTheDocument();
  });

  it("deve possuir as opções de raça", () => {
    render(<CharacterForm />);

    const raceSelect = screen.getByLabelText("Raça");

    expect(raceSelect).toBeInTheDocument();

    expect(screen.getByRole("option", { name: "Humano" })).toBeInTheDocument();

    expect(screen.getByRole("option", { name: "Elfo" })).toBeInTheDocument();

    expect(screen.getByRole("option", { name: "Anão" })).toBeInTheDocument();
  });

  it("deve possuir as opções de classe", () => {
    render(<CharacterForm />);

    const classSelect = screen.getByLabelText("Classe");

    expect(classSelect).toBeInTheDocument();

    expect(
      screen.getByRole("option", { name: "Guerreiro" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("option", { name: "Mago" })).toBeInTheDocument();

    expect(screen.getByRole("option", { name: "Ladino" })).toBeInTheDocument();
  });

  it("deve apresentar o nível inicial como 1", () => {
    render(<CharacterForm />);

    expect(screen.getByText("Nível inicial")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();

    expect(screen.queryByLabelText("Nível")).not.toBeInTheDocument();
  });
});
