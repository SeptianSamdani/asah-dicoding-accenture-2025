// Aturan 1: Terdapat semicolon di setiap akhir statement.
// Aturan 2: Indentasi sebesar 2 spasi.
// Aturan 3: Menggunakan const jika variabel tidak diubah nilainya.
// Aturan 4: Selalu tambahkan spasi di antara tanda {} dan nama properti.

const books = {};

function getBooks() {
  return books;
}

function getBookById(id) {
  const book = books[id];

  if (!book) {
    return null;
  }

  return book.id;
}

function saveBook(book) {
  books[book.id] = book;
}

saveBook({ id: 'book-1', name: 'Book 1' });
const myBooks = getBooks();
const myBook = getBookById('book-1');

console.log(myBooks);
console.log(myBook);