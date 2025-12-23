import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { showFormattedDate, stripHtml } from '../utils/index.js';


export default function NoteItem({ note, onDelete, onToggleArchive }) {
return (
    <article className="card">
        <header className="card-header">
            <h3 className="card-title"><Link to={`/notes/${note.id}`}>{note.title}</Link></h3>
            <time className="muted">{showFormattedDate(note.createdAt)}</time>
        </header>

        <p className="card-body">{stripHtml(note.body).slice(0, 180)}{stripHtml(note.body).length > 180 ? '…' : ''}</p>

        <footer className="card-actions">
            <button onClick={() => onToggleArchive(note.id)}>
            {note.archived ? 'Batal Arsip' : 'Arsipkan'}
            </button>
            <button className="danger" onClick={() => onDelete(note.id)}>Hapus</button>
            <Link className="ghost" to={`/notes/${note.id}`}>Detail</Link>
        </footer>
    </article>
);
}


NoteItem.propTypes = {
note: PropTypes.shape({
id: PropTypes.string.isRequired,
title: PropTypes.string.isRequired,
body: PropTypes.string.isRequired,
archived: PropTypes.bool.isRequired,
createdAt: PropTypes.string.isRequired,
}).isRequired,
onDelete: PropTypes.func.isRequired,
onToggleArchive: PropTypes.func.isRequired,
};