import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import BooksPage from "../../src/BooksPage";
import { createBook, deleteBook, getBooks, updateBook } from "../../src/books";

vi.mock("../../src/books", () => ({
  createBook: vi.fn(),
  deleteBook: vi.fn(),
  getBooks: vi.fn(),
  updateBook: vi.fn(),
}));

const books = [
  {
    id: 1,
    title: "O Hobbit",
    author: "J. R. R. Tolkien",
    genre: "Fantasia",
    description: "Uma aventura inesperada.",
    total_pages: 310,
    current_page: 100,
    status: "READING",
    rating: null,
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    genre: "Distopia",
    description: null,
    total_pages: 328,
    current_page: 328,
    status: "COMPLETED",
    rating: 5,
  },
  {
    id: 3,
    title: "Duna",
    author: "Frank Herbert",
    genre: "Ficção científica",
    description: null,
    total_pages: 500,
    current_page: 0,
    status: "WANT_TO_READ",
    rating: null,
  },
];

function renderPage() {
  return render(<BooksPage />);
}

beforeEach(() => {
  vi.clearAllMocks();
  getBooks.mockResolvedValue(books);
  createBook.mockResolvedValue({});
  updateBook.mockResolvedValue({});
  deleteBook.mockResolvedValue(null);
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("BooksPage", () => {
  it("should display the loading state before loading books", async () => {
    let resolveBooks;

    getBooks.mockReturnValue(
      new Promise((resolve) => {
        resolveBooks = resolve;
      }),
    );

    renderPage();

    expect(screen.getByText("Carregando biblioteca...")).toBeInTheDocument();

    resolveBooks([]);

    await waitFor(() => {
      expect(screen.getByText("Nenhum livro encontrado")).toBeInTheDocument();
    });
  });

  it("should display an error when loading books fails", async () => {
    getBooks.mockRejectedValue(new Error("Falha ao carregar livros."));

    renderPage();

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Falha ao carregar livros.",
    );
  });

  it("should display the books and library statistics", async () => {
    renderPage();

    expect(
      await screen.findByRole("heading", { name: "O Hobbit" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "1984" })).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "Duna" })).toBeInTheDocument();

    expect(screen.getByText("Total de livros")).toBeInTheDocument();
    expect(screen.getByText("Lendo atualmente")).toBeInTheDocument();
    expect(screen.getAllByText("Concluídos")).toHaveLength(2);
    expect(screen.getAllByText("Quero ler")).toHaveLength(3);
  });

  it("should filter books by title", async () => {
    const user = userEvent.setup();

    renderPage();

    await screen.findByRole("heading", { name: "O Hobbit" });

    await user.type(
      screen.getByRole("searchbox", { name: "Pesquisar livros" }),
      "Duna",
    );

    expect(screen.getByRole("heading", { name: "Duna" })).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "O Hobbit" }),
    ).not.toBeInTheDocument();
  });

  it("should filter books by author", async () => {
    const user = userEvent.setup();

    renderPage();

    await screen.findByRole("heading", { name: "O Hobbit" });

    await user.type(
      screen.getByRole("searchbox", { name: "Pesquisar livros" }),
      "Orwell",
    );

    expect(screen.getByRole("heading", { name: "1984" })).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "O Hobbit" }),
    ).not.toBeInTheDocument();
  });

  it("should filter books by reading status", async () => {
    const user = userEvent.setup();

    renderPage();

    await screen.findByRole("heading", { name: "O Hobbit" });

    await user.selectOptions(
      screen.getByRole("combobox", { name: "Filtrar por status" }),
      "COMPLETED",
    );

    expect(screen.getByRole("heading", { name: "1984" })).toBeInTheDocument();

    expect(
      screen.queryByRole("heading", { name: "O Hobbit" }),
    ).not.toBeInTheDocument();
  });

  it("should open the form when adding a book", async () => {
    const user = userEvent.setup();

    renderPage();

    await screen.findByRole("heading", { name: "O Hobbit" });

    await user.click(screen.getByRole("button", { name: /adicionar livro/i }));

    expect(screen.getByLabelText("Título *")).toBeInTheDocument();
    expect(screen.getByLabelText("Autor *")).toBeInTheDocument();
    expect(screen.getByLabelText("Total de páginas *")).toBeInTheDocument();
  });

  it("should create a book and reload the library", async () => {
    const user = userEvent.setup();

    const newBook = {
      id: 4,
      title: "Neuromancer",
      author: "William Gibson",
      genre: "Cyberpunk",
      description: null,
      total_pages: 271,
      current_page: 0,
      status: "WANT_TO_READ",
      rating: null,
    };

    getBooks
      .mockResolvedValueOnce(books)
      .mockResolvedValueOnce([...books, newBook]);

    renderPage();

    await screen.findByRole("heading", { name: "O Hobbit" });

    await user.click(screen.getByRole("button", { name: /adicionar livro/i }));

    await user.type(screen.getByLabelText("Título *"), "Neuromancer");
    await user.type(screen.getByLabelText("Autor *"), "William Gibson");
    await user.type(screen.getByLabelText("Total de páginas *"), "271");

    await user.click(screen.getByRole("button", { name: "Adicionar livro" }));

    await waitFor(() => {
      expect(createBook).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Neuromancer",
          author: "William Gibson",
          total_pages: 271,
        }),
      );
    });

    expect(
      await screen.findByRole("heading", { name: "Neuromancer" }),
    ).toBeInTheDocument();

    expect(getBooks).toHaveBeenCalledTimes(2);
  });

  it("should update an existing book", async () => {
    const user = userEvent.setup();

    const updatedBook = {
      ...books[0],
      title: "O Hobbit: Edição revisada",
    };

    getBooks
      .mockResolvedValueOnce(books)
      .mockResolvedValueOnce([updatedBook, books[1], books[2]]);

    renderPage();

    await screen.findByRole("heading", { name: "O Hobbit" });

    await user.click(screen.getByRole("button", { name: "Editar O Hobbit" }));

    const titleInput = screen.getByLabelText("Título *");

    await user.clear(titleInput);
    await user.type(titleInput, "O Hobbit: Edição revisada");

    await user.click(screen.getByRole("button", { name: "Salvar alterações" }));

    await waitFor(() => {
      expect(updateBook).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          title: "O Hobbit: Edição revisada",
        }),
      );
    });

    expect(
      await screen.findByRole("heading", {
        name: "O Hobbit: Edição revisada",
      }),
    ).toBeInTheDocument();
  });

  it("should delete a book after confirmation", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    renderPage();

    await screen.findByRole("heading", { name: "O Hobbit" });

    await user.click(screen.getByRole("button", { name: "Excluir O Hobbit" }));

    await waitFor(() => {
      expect(deleteBook).toHaveBeenCalledWith(1);
    });

    expect(
      screen.queryByRole("heading", { name: "O Hobbit" }),
    ).not.toBeInTheDocument();
  });

  it("should not delete a book when confirmation is cancelled", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(false);

    renderPage();

    await screen.findByRole("heading", { name: "O Hobbit" });

    await user.click(screen.getByRole("button", { name: "Excluir O Hobbit" }));

    expect(deleteBook).not.toHaveBeenCalled();

    expect(
      screen.getByRole("heading", { name: "O Hobbit" }),
    ).toBeInTheDocument();
  });

  it("should display an error when deleting a book fails", async () => {
    const user = userEvent.setup();
    vi.spyOn(window, "confirm").mockReturnValue(true);

    deleteBook.mockRejectedValue(new Error("Falha ao excluir livro."));

    renderPage();

    await screen.findByRole("heading", { name: "O Hobbit" });

    await user.click(screen.getByRole("button", { name: "Excluir O Hobbit" }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Falha ao excluir livro.",
    );
  });
});
