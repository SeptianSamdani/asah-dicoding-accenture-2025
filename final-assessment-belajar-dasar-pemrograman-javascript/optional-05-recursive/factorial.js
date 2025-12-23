function factorial(n) {
  if (n < 0) {
    throw new Error("Bilangan harus positif atau nol");
  }
  if (n === 0 || n === 1) {
    return 1;
  }
  return n * factorial(n - 1);
}

// Jangan hapus kode di bawah ini!
export default factorial;
