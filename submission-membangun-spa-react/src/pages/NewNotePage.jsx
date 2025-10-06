import React from 'react';
import NoteForm from '../components/NoteForm.jsx';
import { addNote } from '../utils/network-data.js';
import { useNavigate } from 'react-router-dom';

export default function NewNotePage() {
    const navigate = useNavigate();
    const onSubmit = async ({ title, body }) => {
        const { error } = await addNote({ title, body });
        if (!error) navigate('/');
    };

    return (
        <section>
            <h1>Tambah Catatan Baru</h1>
            <NoteForm onSubmit={onSubmit} />
        </section>
    );
}
