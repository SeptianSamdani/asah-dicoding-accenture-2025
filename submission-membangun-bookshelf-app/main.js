// main.js

// main.js

// ---------------------------
// Storage Keys & State
// ---------------------------
const STORAGE_KEY = "BOOKSHELF_APPS_BOOKS_V1";
let books = []; // { id, title, author, year, isComplete }
let editId = null; // null = mode tambah, selain itu = mode edit

// ---------------------------
// DOM Elements
// ---------------------------
const form = document.querySelector('[data-testid="bookForm"]');
const titleInput = document.querySelector('[data-testid="bookFormTitleInput"]');
const authorInput = document.querySelector('[data-testid="bookFormAuthorInput"]');
const yearInput = document.querySelector('[data-testid="bookFormYearInput"]');
const isCompleteCheckbox = document.querySelector('[data-testid="bookFormIsCompleteCheckbox"]');
const submitBtn = document.querySelector('[data-testid="bookFormSubmitButton"]');
const submitBtnSpan = submitBtn.querySelector("span");

const incompleteList = document.querySelector('[data-testid="incompleteBookList"]');
const completeList = document.querySelector('[data-testid="completeBookList"]');

const searchForm = document.querySelector('[data-testid="searchBookForm"]');
const searchInput = document.querySelector('[data-testid="searchBookFormTitleInput"]');

// ---------------------------
// Utilities
// ---------------------------
function generateId() {
  // Kombinasi timestamp + random untuk peluang unik yang lebih baik
  return `${Date.now()}-${Math.floor(Math.random() * 1e6)}`;
}

function saveToStorage() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    books = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(books)) books = [];
  } catch {
    books = [];
  }
}

function resetForm() {
  editId = null;
  form.reset();
  // Default teks tombol sesuai status checkbox
  updateSubmitButtonLabel(isCompleteCheckbox.checked);
  // Kembalikan teks tombol submit jika habis edit
  if (submitBtn) submitBtn.textContent = "";
  submitBtn.innerHTML = 'Masukkan Buku ke rak <span>Belum selesai dibaca</span>';
}

function updateSubmitButtonLabel(isComplete) {
  // Wajib menjaga struktur "Masukkan Buku ke rak <span>...</span>"
  submitBtnSpan.textContent = isComplete ? "Selesai dibaca" : "Belum selesai dibaca";
}

// ---------------------------
// Rendering
// ---------------------------
function createBookElement(book) {
  const wrapper = document.createElement("div");
  wrapper.setAttribute("data-testid", "bookItem");
  wrapper.setAttribute("data-bookid", String(book.id));

  const h3 = document.createElement("h3");
  h3.setAttribute("data-testid", "bookItemTitle");
  h3.textContent = book.title;

  const pAuthor = document.createElement("p");
  pAuthor.setAttribute("data-testid", "bookItemAuthor");
  pAuthor.textContent = `Penulis: ${book.author}`;

  const pYear = document.createElement("p");
  pYear.setAttribute("data-testid", "bookItemYear");
  pYear.textContent = `Tahun: ${book.year}`;

  const btnGroup = document.createElement("div");

  const toggleBtn = document.createElement("button");
  toggleBtn.setAttribute("data-testid", "bookItemIsCompleteButton");
  toggleBtn.textContent = book.isComplete ? "Belum selesai dibaca" : "Selesai dibaca";
  toggleBtn.addEventListener("click", () => {
    toggleBookStatus(book.id);
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.setAttribute("data-testid", "bookItemDeleteButton");
  deleteBtn.textContent = "Hapus Buku";
  deleteBtn.addEventListener("click", () => {
    deleteBook(book.id);
  });

  const editBtn = document.createElement("button");
  editBtn.setAttribute("data-testid", "bookItemEditButton");
  editBtn.textContent = "Edit Buku";
  editBtn.addEventListener("click", () => {
    startEdit(book.id);
  });

  btnGroup.appendChild(toggleBtn);
  btnGroup.appendChild(deleteBtn);
  btnGroup.appendChild(editBtn);

  wrapper.appendChild(h3);
  wrapper.appendChild(pAuthor);
  wrapper.appendChild(pYear);
  wrapper.appendChild(btnGroup);

  return wrapper;
}

function clearLists() {
  incompleteList.innerHTML = "";
  completeList.innerHTML = "";
}

function render(filterTitle = "") {
  clearLists();
  const q = filterTitle.trim().toLowerCase();

  books.forEach((book) => {
    if (q && !book.title.toLowerCase().includes(q)) return;

    const el = createBookElement(book);
    if (book.isComplete) {
      completeList.appendChild(el);
    } else {
      incompleteList.appendChild(el);
    }
  });
}

// ---------------------------
// CRUD & Actions
// ---------------------------
function addBook({ title, author, year, isComplete }) {
  const book = {
    id: generateId(),
    title,
    author,
    year,
    isComplete,
  };
  books.push(book);
  saveToStorage();
  render(searchInput.value);
}

function updateBook(id, { title, author, year, isComplete }) {
  const idx = books.findIndex((b) => String(b.id) === String(id));
  if (idx !== -1) {
    books[idx] = { ...books[idx], title, author, year, isComplete };
    saveToStorage();
    render(searchInput.value);
  }
}

function deleteBook(id) {
  const idx = books.findIndex((b) => String(b.id) === String(id));
  if (idx !== -1) {
    books.splice(idx, 1);
    saveToStorage();
    render(searchInput.value);
  }
}

function toggleBookStatus(id) {
  const idx = books.findIndex((b) => String(b.id) === String(id));
  if (idx !== -1) {
    books[idx].isComplete = !books[idx].isComplete;
    saveToStorage();
    render(searchInput.value);
  }
}

function startEdit(id) {
  const book = books.find((b) => String(b.id) === String(id));
  if (!book) return;

  editId = id;
  titleInput.value = book.title;
  authorInput.value = book.author;
  yearInput.value = book.year;
  isCompleteCheckbox.checked = book.isComplete;
  updateSubmitButtonLabel(book.isComplete);

  // Ubah label tombol menjadi "Simpan Perubahan" (tetap tanpa mengubah data-testid)
  submitBtn.textContent = "Simpan Perubahan";
}

// ---------------------------
// Events
// ---------------------------
document.addEventListener("DOMContentLoaded", () => {
  loadFromStorage();
  render();

  // Sinkron label tombol submit saat checkbox berubah
  isCompleteCheckbox.addEventListener("change", (e) => {
    updateSubmitButtonLabel(e.target.checked);
  });

  // Submit form tambah/edit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = titleInput.value.trim();
    const author = authorInput.value.trim();
    const year = Number(yearInput.value);
    const isComplete = isCompleteCheckbox.checked;

    if (!title || !author || !year) return;

    if (editId) {
      updateBook(editId, { title, author, year, isComplete });
    } else {
      addBook({ title, author, year, isComplete });
    }

    resetForm();
  });

  // Pencarian buku (by judul)
  searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    render(searchInput.value);
  });
});
