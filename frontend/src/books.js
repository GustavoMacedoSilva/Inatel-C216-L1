import request from "./client";

export function getBooks() {
  return request("/books/");
}

export function getBookById(id) {
  return request(`/books/${id}`);
}

export function createBook(bookData) {
  return request("/books/", {
    method: "POST",
    body: JSON.stringify(bookData),
  });
}

export function updateBook(id, bookData) {
  return request(`/books/${id}`, {
    method: "PUT",
    body: JSON.stringify(bookData),
  });
}

export function deleteBook(id) {
  return request(`/books/${id}`, {
    method: "DELETE",
  });
}
