import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import BookForm from "../../src/components/BookForm";

describe("BookForm", () => {
  it("should render the form with default values", () => {
    render(<BookForm onSave={vi.fn()} onCancel={vi.fn()} saving={false} />);

    expect(
      screen.getByRole("heading", { name: "Adicionar livro" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Título *")).toHaveValue("");
    expect(screen.getByLabelText("Autor *")).toHaveValue("");
    expect(screen.getByLabelText("Gênero")).toHaveValue("");
    expect(screen.getByLabelText("Página atual")).toHaveValue(0);
    expect(screen.getByLabelText("Status de leitura")).toHaveValue(
      "WANT_TO_READ",
    );
  });

  it("should call onSave with the correct payload", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(<BookForm onSave={onSave} onCancel={vi.fn()} saving={false} />);

    await user.type(screen.getByLabelText("Título *"), "  Duna  ");
    await user.type(screen.getByLabelText("Autor *"), "  Frank Herbert  ");
    await user.type(screen.getByLabelText("Gênero"), "Ficção científica");
    await user.type(screen.getByLabelText("Total de páginas *"), "500");
    await user.clear(screen.getByLabelText("Página atual"));
    await user.type(screen.getByLabelText("Página atual"), "120");
    await user.type(screen.getByLabelText("Avaliação (0 a 5)"), "4.5");

    await user.click(screen.getByRole("button", { name: "Adicionar livro" }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith({
        title: "Duna",
        author: "Frank Herbert",
        genre: "Ficção científica",
        description: null,
        total_pages: 500,
        current_page: 120,
        status: "WANT_TO_READ",
        rating: 4.5,
      });
    });
  });

  it("should show an error when title or author is empty", async () => {
    const _user = userEvent.setup();
    const onSave = vi.fn();

    render(<BookForm onSave={onSave} onCancel={vi.fn()} saving={false} />);

    fireEvent.submit(
      screen.getByRole("button", { name: "Adicionar livro" }).closest("form"),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Informe o título e o autor.",
    );
    expect(onSave).not.toHaveBeenCalled();
  });

  it("should reject an invalid total page count", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<BookForm onSave={onSave} onCancel={vi.fn()} saving={false} />);

    await user.type(screen.getByLabelText("Título *"), "Duna");
    await user.type(screen.getByLabelText("Autor *"), "Frank Herbert");
    await user.type(screen.getByLabelText("Total de páginas *"), "0");

    fireEvent.submit(
      screen.getByRole("button", { name: "Adicionar livro" }).closest("form"),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "O total de páginas deve ser maior que zero.",
    );
    expect(onSave).not.toHaveBeenCalled();
  });

  it("should reject a current page greater than total pages", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<BookForm onSave={onSave} onCancel={vi.fn()} saving={false} />);

    await user.type(screen.getByLabelText("Título *"), "Duna");
    await user.type(screen.getByLabelText("Autor *"), "Frank Herbert");
    await user.type(screen.getByLabelText("Total de páginas *"), "300");
    await user.clear(screen.getByLabelText("Página atual"));
    await user.type(screen.getByLabelText("Página atual"), "350");

    fireEvent.submit(
      screen.getByRole("button", { name: "Adicionar livro" }).closest("form"),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "A página atual deve estar entre 0 e o total de páginas.",
    );
    expect(onSave).not.toHaveBeenCalled();
  });

  it("should reject a rating outside the 0 to 5 range", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();

    render(<BookForm onSave={onSave} onCancel={vi.fn()} saving={false} />);

    await user.type(screen.getByLabelText("Título *"), "Duna");
    await user.type(screen.getByLabelText("Autor *"), "Frank Herbert");
    await user.type(screen.getByLabelText("Total de páginas *"), "300");
    await user.type(screen.getByLabelText("Avaliação (0 a 5)"), "6");

    fireEvent.submit(
      screen.getByRole("button", { name: "Adicionar livro" }).closest("form"),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "A avaliação deve estar entre 0 e 5.",
    );
    expect(onSave).not.toHaveBeenCalled();
  });

  it("should set current page to total pages when status is completed", async () => {
    const user = userEvent.setup();
    const onSave = vi.fn().mockResolvedValue(undefined);

    render(<BookForm onSave={onSave} onCancel={vi.fn()} saving={false} />);

    await user.type(screen.getByLabelText("Título *"), "Duna");
    await user.type(screen.getByLabelText("Autor *"), "Frank Herbert");
    await user.type(screen.getByLabelText("Total de páginas *"), "300");

    await user.selectOptions(
      screen.getByLabelText("Status de leitura"),
      "COMPLETED",
    );

    expect(screen.getByLabelText("Página atual")).toBeDisabled();

    await user.click(screen.getByRole("button", { name: "Adicionar livro" }));

    await waitFor(() => {
      expect(onSave).toHaveBeenCalledWith(
        expect.objectContaining({
          total_pages: 300,
          current_page: 300,
          status: "COMPLETED",
        }),
      );
    });
  });

  it("should populate the form when editing a book", () => {
    const book = {
      id: 1,
      title: "Duna",
      author: "Frank Herbert",
      genre: "Ficção científica",
      description: "Uma história sobre Arrakis.",
      total_pages: 500,
      current_page: 200,
      status: "READING",
      rating: 4.5,
    };

    render(
      <BookForm
        book={book}
        onSave={vi.fn()}
        onCancel={vi.fn()}
        saving={false}
      />,
    );

    expect(
      screen.getByRole("heading", { name: "Editar livro" }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText("Título *")).toHaveValue("Duna");
    expect(screen.getByLabelText("Autor *")).toHaveValue("Frank Herbert");
    expect(screen.getByLabelText("Página atual")).toHaveValue(200);
    expect(screen.getByLabelText("Avaliação (0 a 5)")).toHaveValue(4.5);
  });

  it("should show an error when onSave fails", async () => {
    const user = userEvent.setup();
    const onSave = vi
      .fn()
      .mockRejectedValue(new Error("Erro ao salvar livro."));

    render(<BookForm onSave={onSave} onCancel={vi.fn()} saving={false} />);

    await user.type(screen.getByLabelText("Título *"), "Duna");
    await user.type(screen.getByLabelText("Autor *"), "Frank Herbert");
    await user.type(screen.getByLabelText("Total de páginas *"), "300");

    await user.click(screen.getByRole("button", { name: "Adicionar livro" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Erro ao salvar livro.",
    );
  });

  it("should call onCancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(<BookForm onSave={vi.fn()} onCancel={onCancel} saving={false} />);

    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(onCancel).toHaveBeenCalledOnce();
  });

  it("should disable buttons while saving", () => {
    render(<BookForm onSave={vi.fn()} onCancel={vi.fn()} saving />);

    expect(screen.getByRole("button", { name: "Cancelar" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Salvando..." })).toBeDisabled();
  });
});
