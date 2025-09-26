import React from 'react';
import PropTypes from 'prop-types';
import NoteForm from '../components/NoteForm.jsx';


export default function NewNotePage({ api }) {
    return (
        <section>
            <h1>Tambah Catatan Baru</h1>
            <NoteForm onSubmit={api.addNote} />
        </section>
    );
}


NewNotePage.propTypes = {
    api: PropTypes.shape(
        { addNote: PropTypes.func.isRequired }
    ).isRequired,
};