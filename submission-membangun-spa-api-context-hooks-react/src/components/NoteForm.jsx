import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';


export default function NoteForm({ onSubmit }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState(''); // HTML string
    const bodyRef = useRef(null);


    const handleInput = (e) => {
        setBody(e.currentTarget.innerHTML);
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        const payload = {
            id: `notes-${Date.now()}`,
            title: title.trim() || 'Tanpa Judul',
            body: body || '<p></p>',
            archived: false,
            createdAt: new Date().toISOString(),
        };
        onSubmit(payload);
        setTitle('');
        setBody('');
        if (bodyRef.current) bodyRef.current.innerHTML = '';
    };


    return (
        <form className="note-form" onSubmit={handleSubmit}>
            <label>
                Judul
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Judul catatan"
                    required
                />
            </label>

            <label>
                Isi (rich text)
                <div
                    ref={bodyRef}
                    className="content-editable"
                    data-placeholder="Tulis catatan Anda di sini…"
                    contentEditable
                    onInput={handleInput}
                    aria-label="Isi catatan"
                />
            </label>

            <div className="form-actions">
                <button type="submit" className="primary">Simpan</button>
            </div>
        </form>
    );
}


NoteForm.propTypes = {
    onSubmit: PropTypes.func.isRequired,
};