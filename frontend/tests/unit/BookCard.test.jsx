import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import BookCard from "../../src/components/BookCard";

const mockBook = {
  id: 1,
  title: "Duna",
  author: "Frank Herbert",
  genre: "Ficção científica",
  description: "Uma história sobre Arrakis.",
  total_pages: 500,
  current_page: 250,
  status: "READING",
  rating: 4.5,
};

describe("BookCard", () => {
  it("should display the book information", () => {
    render(<BookCard book={mockBook} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(screen.getByRole("heading", { name: "Duna" })).toBeInTheDocument();
    expect(screen.getByText("Frank Herbert")).toBeInTheDocument();
    expect(screen.getByText("Ficção científica")).toBeInTheDocument();
    expect(screen.getByText("Uma história sobre Arrakis.")).toBeInTheDocument();
    expect(screen.getByText("250/500 páginas")).toBeInTheDocument();
    expect(screen.getByText("Avaliação: 4.5/5")).toBeInTheDocument();
  });

  it.each([
    ["WANT_TO_READ", "Quero ler"],
    ["READING", "Lendo"],
    ["COMPLETED", "Concluído"],
  ])("should display the correct label for status %s", (status, label) => {
    render(
      <BookCard
        book={{ ...mockBook, status }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText(label)).toBeInTheDocument();
  });

  it("should calculate the reading progress correctly", () => {
    render(<BookCard book={mockBook} onEdit={vi.fn()} onDelete={vi.fn()} />);

    expect(
      screen.getByRole("progressbar", { name: "Progresso de Duna" }),
    ).toHaveAttribute("aria-valuenow", "50");

    expect(screen.getByText("50%")).toBeInTheDocument();
  });

  it("should display 0% progress when no pages have been read", () => {
    render(
      <BookCard
        book={{ ...mockBook, current_page: 0 }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("0%")).toBeInTheDocument();
  });

  it("should display 100% progress when all pages have been read", () => {
    render(
      <BookCard
        book={{ ...mockBook, current_page: 500 }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("100%")).toBeInTheDocument();
  });

  it("should display a message when the book has no rating", () => {
    render(
      <BookCard
        book={{ ...mockBook, rating: null }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Sem avaliação")).toBeInTheDocument();
  });

  it("should not display optional fields when they are empty", () => {
    render(
      <BookCard
        book={{
          ...mockBook,
          genre: null,
          description: null,
        }}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.queryByText("Ficção científica")).not.toBeInTheDocument();
    expect(
      screen.queryByText("Uma história sobre Arrakis."),
    ).not.toBeInTheDocument();
  });

  it("should call onEdit with the selected book", () => {
    const onEdit = vi.fn();

    render(<BookCard book={mockBook} onEdit={onEdit} onDelete={vi.fn()} />);

    fireEvent.click(screen.getByRole("button", { name: "Editar Duna" }));

    expect(onEdit).toHaveBeenCalledExactlyOnceWith(mockBook);
  });

  it("should call onDelete with the selected book", () => {
    const onDelete = vi.fn();

    render(<BookCard book={mockBook} onEdit={vi.fn()} onDelete={onDelete} />);

    fireEvent.click(screen.getByRole("button", { name: "Excluir Duna" }));

    expect(onDelete).toHaveBeenCalledExactlyOnceWith(mockBook);
  });
});
