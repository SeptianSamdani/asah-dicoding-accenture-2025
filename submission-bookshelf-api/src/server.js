/* eslint-disable no-console */
const express = require('express');
const { nanoid } = require('nanoid'); // gunakan nanoid v3
const app = express();

app.use(express.json());

// Data penyimpanan sementara (in-memory)
const books = [];

/** Helper timestamp ISO */
const nowISO = () => new Date().toISOString();

/**
 * Kriteria 3: Tambah buku
 * POST /books
 */
app.post('/books', (req, res) => {
  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = req.body || {};

  // Validasi: nama wajib
  if (!name || String(name).trim() === '') {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
  }

  // Validasi: readPage <= pageCount
  if (typeof readPage === 'number' && typeof pageCount === 'number' && readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const id = nanoid(16);
  const insertedAt = nowISO();
  const updatedAt = insertedAt;
  const finished = Number(pageCount) === Number(readPage);

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading: Boolean(reading),
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  return res.status(201).json({
    status: 'success',
    message: 'Buku berhasil ditambahkan',
    data: { bookId: id },
  });
});

/**
 * Kriteria 4 (+ Optional): Daftar buku
 * GET /books
 * Query params: ?name, ?reading, ?finished
 */
app.get('/books', (req, res) => {
  const { name, reading, finished } = req.query || {};

  let filtered = books;

  // Filter name (case-insensitive)
  if (typeof name === 'string' && name.trim() !== '') {
    const keyword = name.toLowerCase();
    filtered = filtered.filter((b) => (b.name || '').toLowerCase().includes(keyword));
  }

  // Filter reading (0/1)
  if (reading === '0' || reading === '1') {
    const flag = reading === '1';
    filtered = filtered.filter((b) => b.reading === flag);
  }

  // Filter finished (0/1)
  if (finished === '0' || finished === '1') {
    const flag = finished === '1';
    filtered = filtered.filter((b) => b.finished === flag);
  }

  const minimalBooks = filtered.map(({ id, name: n, publisher }) => ({
    id,
    name: n,
    publisher,
  }));

  return res.status(200).json({
    status: 'success',
    data: { books: minimalBooks },
  });
});

/**
 * Kriteria 5: Detail buku by id
 * GET /books/:bookId
 */
app.get('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const book = books.find((b) => b.id === bookId);

  if (!book) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku tidak ditemukan',
    });
  }

  return res.status(200).json({
    status: 'success',
    data: { book },
  });
});

/**
 * Kriteria 6: Ubah buku by id
 * PUT /books/:bookId
 */
app.put('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Id tidak ditemukan',
    });
  }

  const {
    name, year, author, summary, publisher,
    pageCount, readPage, reading,
  } = req.body || {};

  // Validasi: nama wajib
  if (!name || String(name).trim() === '') {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });
  }

  // Validasi: readPage <= pageCount
  if (typeof readPage === 'number' && typeof pageCount === 'number' && readPage > pageCount) {
    return res.status(400).json({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });
  }

  const updatedAt = nowISO();
  const finished = Number(pageCount) === Number(readPage);

  books[index] = {
    ...books[index],
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    reading: Boolean(reading),
    finished,
    updatedAt,
  };

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil diperbarui',
  });
});

/**
 * Kriteria 7: Hapus buku by id
 * DELETE /books/:bookId
 */
app.delete('/books/:bookId', (req, res) => {
  const { bookId } = req.params;
  const index = books.findIndex((b) => b.id === bookId);

  if (index === -1) {
    return res.status(404).json({
      status: 'fail',
      message: 'Buku gagal dihapus. Id tidak ditemukan',
    });
  }

  books.splice(index, 1);

  return res.status(200).json({
    status: 'success',
    message: 'Buku berhasil dihapus',
  });
});

/** Jalankan server di port 9000 */
const PORT = 9000;
app.listen(PORT, () => {
  console.log(`Bookshelf API running at http://localhost:${PORT}`);
});

module.exports = app; // untuk testing