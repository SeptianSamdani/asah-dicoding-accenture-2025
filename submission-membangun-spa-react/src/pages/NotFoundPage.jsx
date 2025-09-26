import React from 'react';
import { Link } from 'react-router-dom';


export default function NotFoundPage() {
    return (
        <section>
            <h1>404 — Halaman tidak ditemukan</h1>
            <p>URL yang Anda akses tidak tersedia.</p>
            <Link to="/">Kembali ke beranda</Link>
        </section>
    );
}