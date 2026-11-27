const STATUS_LABELS = {
  WANT_TO_READ: "Quero ler",
  READING: "Lendo",
  COMPLETED: "Concluído",
};

const STATUS_STYLES = {
  WANT_TO_READ: "bg-amber-50 text-amber-800",
  READING: "bg-blue-50 text-blue-800",
  COMPLETED: "bg-emerald-50 text-emerald-800",
};

function BookCard({ book, onEdit, onDelete }) {
  const progress = Math.round((book.current_page / book.total_pages) * 100);

  return (
    <article className="flex flex-col rounded-xl border border-stone-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="break-words text-lg font-semibold text-stone-800">
            {book.title}
          </h3>
          <p className="mt-1 text-sm text-stone-500">{book.author}</p>
        </div>

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium ${STATUS_STYLES[book.status]}`}
        >
          {STATUS_LABELS[book.status]}
        </span>
      </div>

      {book.genre && (
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-stone-400">
          {book.genre}
        </p>
      )}

      {book.description && (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-stone-600">
          {book.description}
        </p>
      )}

      <div className="mt-5">
        <div className="mb-2 flex justify-between text-xs text-stone-500">
          <span>Progresso de leitura</span>
          <span>
            {book.current_page}/{book.total_pages} páginas
          </span>
        </div>

        <div
          className="h-2 overflow-hidden rounded-full bg-stone-100"
          role="progressbar"
          aria-label={`Progresso de ${book.title}`}
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
          <div
            className="h-full rounded-full bg-emerald-700 transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="mt-1 text-right text-xs text-stone-400">{progress}%</p>
      </div>

      <div className="mt-auto flex items-center justify-between border-t border-stone-100 pt-4">
        <span className="text-sm text-stone-500">
          {book.rating !== null && book.rating !== undefined
            ? `Avaliação: ${book.rating}/5`
            : "Sem avaliação"}
        </span>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(book)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-stone-600 transition hover:bg-stone-100"
            aria-label={`Editar ${book.title}`}
          >
            Editar
          </button>

          <button
            type="button"
            onClick={() => onDelete(book)}
            className="rounded-lg px-3 py-2 text-sm font-medium text-red-700 transition hover:bg-red-50"
            aria-label={`Excluir ${book.title}`}
          >
            Excluir
          </button>
        </div>
      </div>
    </article>
  );
}

export default BookCard;
