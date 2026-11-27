import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BookList from "../../src/components/BookList";

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
];

describe("BookList", () => {
  it("should display an empty state when there are no books", () => {
    render(<BookList books={[]} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByText("Nenhum livro encontrado")).toBeInTheDocument();

    expect(
      screen.getByText("Adicione um livro ou altere os filtros da pesquisa."),
    ).toBeInTheDocument();
  });

  it("should render all provided books", () => {
    render(<BookList books={books} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(
      screen.getByRole("heading", { name: "O Hobbit" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("heading", { name: "1984" })).toBeInTheDocument();
  });

  it("should render one BookCard for each book", () => {
    render(<BookList books={books} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getAllByRole("article")).toHaveLength(2);
  });
});
