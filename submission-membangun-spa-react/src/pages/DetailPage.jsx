import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import parser from 'html-react-parser';
import { showFormattedDate } from '../utils/index.js';
import NoteAction from '../components/NoteAction.jsx';


export default function DetailPage({ notes, api }) {
    const { id } = useParams();
    const note = useMemo(() => notes.find((n) => n.id === id), [notes, id]);


    if (!note) {
        return (
            <section>
            <h1>Catatan tidak ditemukan</h1>
            <p>Catatan dengan id <code>{id}</code> tidak ada atau telah dihapus.</p>
            <Link to="/">Kembali ke beranda</Link>
            </section>
        );
    }


    return (
        <article className="detail">
            <header className="detail-header">
                <h1>{note.title}</h1>
                <time className="muted">{showFormattedDate(note.createdAt)}</time>
                <NoteAction id={note.id} archived={note.archived} onDelete={api.deleteNote} onToggleArchive={api.toggleArchive} />
            </header>
            <div className="detail-body">
                {parser(note.body)}
            </div>
        </article>
    );
}


DetailPage.propTypes = {
    notes: PropTypes.array.isRequired,
        api: PropTypes.shape({
        deleteNote: PropTypes.func.isRequired,
        toggleArchive: PropTypes.func.isRequired,
    }).isRequired,
};