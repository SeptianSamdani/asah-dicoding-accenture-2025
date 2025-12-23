function fibonacci(n) {
  if (n < 0) {
    throw new Error("Indeks tidak boleh negatif");
  }

  // basis kasus
  if (n === 0) return [0];
  if (n === 1) return [0, 1];

  // ambil deret sampai n-1, lalu tambahkan elemen baru
  const prev = fibonacci(n - 1);
  const nextValue = prev[prev.length - 1] + prev[prev.length - 2];
  return [...prev, nextValue];
}

// Jangan hapus kode di bawah ini!
export default fibonacci;
