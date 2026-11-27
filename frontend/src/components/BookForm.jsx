import { useEffect, useState } from "react";

const EMPTY_BOOK = {
  title: "",
  author: "",
  genre: "",
  description: "",
  total_pages: "",
  current_page: 0,
  status: "WANT_TO_READ",
  rating: "",
};

function BookForm({ book, onSave, onCancel, saving }) {
  const [form, setForm] = useState(EMPTY_BOOK);
  const [error, setError] = useState("");

  useEffect(() => {
    if (book) {
      setForm({
        title: book.title ?? "",
        author: book.author ?? "",
        genre: book.genre ?? "",
        description: book.description ?? "",
        total_pages: book.total_pages ?? "",
        current_page: book.current_page ?? 0,
        status: book.status ?? "WANT_TO_READ",
        rating: book.rating ?? "",
      });
    } else {
      setForm(EMPTY_BOOK);
    }

    setError("");
  }, [book]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const totalPages = Number(form.total_pages);
    const currentPage = Number(form.current_page);

    if (!form.title.trim() || !form.author.trim()) {
      setError("Informe o título e o autor.");
      return;
    }

    if (!Number.isInteger(totalPages) || totalPages <= 0) {
      setError("O total de páginas deve ser maior que zero.");
      return;
    }

    if (
      !Number.isInteger(currentPage) ||
      currentPage < 0 ||
      currentPage > totalPages
    ) {
      setError("A página atual deve estar entre 0 e o total de páginas.");
      return;
    }

    if (
      form.rating !== "" &&
      (Number(form.rating) < 0 || Number(form.rating) > 5)
    ) {
      setError("A avaliação deve estar entre 0 e 5.");
      return;
    }

    const payload = {
      title: form.title.trim(),
      author: form.author.trim(),
      genre: form.genre.trim() || null,
      description: form.description.trim() || null,
      total_pages: totalPages,
      current_page: form.status === "COMPLETED" ? totalPages : currentPage,
      status: form.status,
      rating: form.rating === "" ? null : Number(form.rating),
    };

    try {
      await onSave(payload);
    } catch (saveError) {
      setError(saveError.message || "Não foi possível salvar o livro.");
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-stone-200 bg-white p-6 shadow-sm"
    >
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-stone-800">
          {book ? "Editar livro" : "Adicionar livro"}
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Preencha as informações do livro.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="title" className="form-label">
            Título *
          </label>
          <input
            id="title"
            name="title"
            value={form.title}
            onChange={handleChange}
            maxLength={200}
            required
            className="form-input"
            placeholder="Ex.: Duna"
          />
        </div>

        <div>
          <label htmlFor="author" className="form-label">
            Autor *
          </label>
          <input
            id="author"
            name="author"
            value={form.author}
            onChange={handleChange}
            maxLength={150}
            required
            className="form-input"
            placeholder="Ex.: Frank Herbert"
          />
        </div>

        <div>
          <label htmlFor="genre" className="form-label">
            Gênero
          </label>
          <input
            id="genre"
            name="genre"
            value={form.genre}
            onChange={handleChange}
            maxLength={80}
            className="form-input"
            placeholder="Ex.: Ficção científica"
          />
        </div>

        <div>
          <label htmlFor="total_pages" className="form-label">
            Total de páginas *
          </label>
          <input
            id="total_pages"
            name="total_pages"
            type="number"
            min="1"
            step="1"
            value={form.total_pages}
            onChange={handleChange}
            required
            className="form-input"
          />
        </div>

        <div>
          <label htmlFor="current_page" className="form-label">
            Página atual
          </label>
          <input
            id="current_page"
            name="current_page"
            type="number"
            min="0"
            max={form.total_pages || undefined}
            step="1"
            value={form.current_page}
            onChange={handleChange}
            disabled={form.status === "COMPLETED"}
            className="form-input disabled:bg-stone-100"
          />
        </div>

        <div>
          <label htmlFor="status" className="form-label">
            Status de leitura
          </label>
          <select
            id="status"
            name="status"
            value={form.status}
            onChange={handleChange}
            className="form-input"
          >
            <option value="WANT_TO_READ">Quero ler</option>
            <option value="READING">Lendo</option>
            <option value="COMPLETED">Concluído</option>
          </select>
        </div>

        <div>
          <label htmlFor="rating" className="form-label">
            Avaliação (0 a 5)
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min="0"
            max="5"
            step="0.5"
            value={form.rating}
            onChange={handleChange}
            className="form-input"
            placeholder="Ex.: 4.5"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="form-label">
            Descrição
          </label>
          <textarea
            id="description"
            name="description"
            value={form.description}
            onChange={handleChange}
            rows="3"
            className="form-input resize-y"
            placeholder="Anotações sobre o livro..."
          />
        </div>
      </div>

      {error && (
        <p
          role="alert"
          className="mt-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {error}
        </p>
      )}

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          disabled={saving}
          className="rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition hover:bg-stone-100 disabled:opacity-50"
        >
          Cancelar
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-emerald-800 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving
            ? "Salvando..."
            : book
              ? "Salvar alterações"
              : "Adicionar livro"}
        </button>
      </div>
    </form>
  );
}

export default BookForm;
