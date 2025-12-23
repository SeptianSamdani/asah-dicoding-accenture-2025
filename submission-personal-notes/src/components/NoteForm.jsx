import { useState } from "react";

export default function NoteForm({ onAdd }) {
    const TITLE_LIMIT = 50;
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");

    const remaining = TITLE_LIMIT - title.length;
    const handleTitleChange = (e) => setTitle(e.target.value.slice(0, TITLE_LIMIT));

    const submit = (e) => {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    onAdd({
        id: Date.now(),           // timestamp unik
        title: title.trim(),
        body: body.trim(),
        archived: false,
        createdAt: new Date().toISOString(),
    });
    setTitle(""); setBody("");
    };

    return (
    <section className="app-section">
        <h2 className="app-sectionTitle">Tambah Catatan</h2>
        <form className="app-form" onSubmit={submit}>
            <div className="app-field">
                <label className="app-label" htmlFor="title">
                    Judul <span className="app-helper">(sisa {remaining} karakter)</span>
                </label>
                <input id="title" className="app-input" value={title} onChange={handleTitleChange} placeholder="Maks 50 karakter" />
            </div>
            <div className="app-field">
                <label className="app-label" htmlFor="body">Isi</label>
                <textarea id="body" className="app-textarea" rows={4} value={body} onChange={e=>setBody(e.target.value)} />
            </div>
            <button className="app-button" type="submit">Tambah</button>
        </form>
    </section>
    );
}
