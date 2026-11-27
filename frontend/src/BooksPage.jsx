import { useCallback, useEffect, useMemo, useState } from "react";
import { createBook, deleteBook, getBooks, updateBook } from "./books";

import BookForm from "./components/BookForm";
import BookList from "./components/BookList";

function BooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showForm, setShowForm] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);

  const loadBooks = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getBooks();
      setBooks(data);
    } catch (loadError) {
      setError(loadError.message || "Não foi possível carregar os livros.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBooks();
  }, [loadBooks]);

  const filteredBooks = useMemo(() => {
    return books.filter((book) => {
      const searchTerm = search.toLowerCase().trim();

      const matchesSearch =
        book.title.toLowerCase().includes(searchTerm) ||
        book.author.toLowerCase().includes(searchTerm);

      const matchesStatus =
        statusFilter === "ALL" || book.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [books, search, statusFilter]);

  const stats = useMemo(
    () => ({
      total: books.length,
      reading: books.filter((book) => book.status === "READING").length,
      completed: books.filter((book) => book.status === "COMPLETED").length,
      wantToRead: books.filter((book) => book.status === "WANT_TO_READ").length,
    }),
    [books],
  );

  function handleAddBook() {
    setSelectedBook(null);
    setShowForm(true);
    setError("");
  }

  function handleEditBook(book) {
    setSelectedBook(book);
    setShowForm(true);
    setError("");
  }

  function handleCancelForm() {
    setShowForm(false);
    setSelectedBook(null);
  }

  async function handleSaveBook(payload) {
    setSaving(true);

    try {
      if (selectedBook) {
        await updateBook(selectedBook.id, payload);
      } else {
        await createBook(payload);
      }

      await loadBooks();
      handleCancelForm();
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteBook(book) {
    const confirmed = window.confirm(
      `Deseja realmente excluir "${book.title}"?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBook(book.id);
      setBooks((previous) => previous.filter((item) => item.id !== book.id));
    } catch (deleteError) {
      setError(deleteError.message || "Não foi possível excluir o livro.");
    }
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-800">
              EstantePessoal
            </h1>
            <p className="mt-1 text-sm text-stone-500">
              Seu catálogo pessoal de leitura.
            </p>
          </div>

          <span className="hidden rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-800 sm:inline-block">
            Minha biblioteca
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total de livros" value={stats.total} />
          <StatCard label="Lendo atualmente" value={stats.reading} />
          <StatCard label="Concluídos" value={stats.completed} />
          <StatCard label="Quero ler" value={stats.wantToRead} />
        </section>

        {showForm ? (
          <section className="mb-8">
            <BookForm
              book={selectedBook}
              onSave={handleSaveBook}
              onCancel={handleCancelForm}
              saving={saving}
            />
          </section>
        ) : (
          <section className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-stone-800">
                Minha biblioteca
              </h2>
              <p className="mt-1 text-sm text-stone-500">
                Gerencie seus livros e acompanhe suas leituras.
              </p>
            </div>

            <button
              type="button"
              onClick={handleAddBook}
              className="rounded-lg bg-emerald-800 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-900"
            >
              + Adicionar livro
            </button>
          </section>
        )}

        {!showForm && (
          <section className="mb-6 grid gap-3 sm:grid-cols-[1fr_220px]">
            <input
              type="search"
              aria-label="Pesquisar livros"
              placeholder="Pesquisar por título ou autor..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="form-input"
            />

            <select
              aria-label="Filtrar por status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="form-input"
            >
              <option value="ALL">Todos os status</option>
              <option value="WANT_TO_READ">Quero ler</option>
              <option value="READING">Lendo</option>
              <option value="COMPLETED">Concluídos</option>
            </select>
          </section>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 flex items-center justify-between gap-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
          >
            <span>{error}</span>
            <button
              type="button"
              onClick={() => setError("")}
              className="font-medium hover:underline"
            >
              Fechar
            </button>
          </div>
        )}

        {!showForm &&
          (loading ? (
            <div className="rounded-xl border border-stone-200 bg-white py-16 text-center text-sm text-stone-500">
              Carregando biblioteca...
            </div>
          ) : (
            <BookList
              books={filteredBooks}
              onEdit={handleEditBook}
              onDelete={handleDeleteBook}
            />
          ))}
      </main>

      <footer className="border-t border-stone-200 bg-white">
        <div className="mx-auto max-w-7xl px-5 py-5 text-center text-xs text-stone-400 sm:px-8">
          EstantePessoal · Seu espaço para organizar leituras.
        </div>
      </footer>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-stone-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-stone-800">{value}</p>
    </div>
  );
}

export default BooksPage;
