import BookCard from "./BookCard";

function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-white px-6 py-14 text-center">
        <h3 className="text-lg font-medium text-stone-700">
          Nenhum livro encontrado
        </h3>
        <p className="mt-2 text-sm text-stone-500">
          Adicione um livro ou altere os filtros da pesquisa.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default BookList;
