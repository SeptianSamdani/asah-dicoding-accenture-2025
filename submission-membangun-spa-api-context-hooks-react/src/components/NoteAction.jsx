import React from 'react';
import PropTypes from 'prop-types';


export default function NoteAction({ id, archived, onDelete, onToggleArchive }) {
    return (
        <div className="row-actions">
            <button onClick={() => onToggleArchive(id)}>{archived ? 'Batal Arsip' : 'Arsipkan'}</button>
            <button className="danger" onClick={() => onDelete(id)}>Hapus</button>
        </div>
    );
}

NoteAction.propTypes = {
    id: PropTypes.string.isRequired,
    archived: PropTypes.bool.isRequired,
    onDelete: PropTypes.func.isRequired,
    onToggleArchive: PropTypes.func.isRequired,
};