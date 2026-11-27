import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import App from "../../src/App";

describe("App", () => {
  it("should render the application title", () => {
    render(<App />);

    expect(
      screen.getByRole("heading", { name: "EstantePessoal" }),
    ).toBeInTheDocument();
  });

  it("should render the application description", () => {
    render(<App />);

    expect(
      screen.getByText("Seu catálogo pessoal de leitura."),
    ).toBeInTheDocument();
  });
});
