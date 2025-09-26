import React from 'react';
import PropTypes from 'prop-types';
import NoteItem from './NoteItem.jsx';


export default function NoteList({ notes, onDelete, onToggleArchive, emptyText = 'Tidak ada catatan' }) {
    if (!notes.length) return <p className="empty">{emptyText}</p>;
    return (
        <div className="grid">
            {notes.map((n) => (
            <NoteItem key={n.id} note={n} onDelete={onDelete} onToggleArchive={onToggleArchive} />
            ))}
        </div>
    );
}

NoteList.propTypes = {
    notes: PropTypes.arrayOf(NoteItem.propTypes.note).isRequired,
    onDelete: PropTypes.func.isRequired,
    onToggleArchive: PropTypes.func.isRequired,
    emptyText: PropTypes.string,
};