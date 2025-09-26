import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import NoteList from '../components/NoteList.jsx';
import SearchBar from '../components/SearchBar.jsx';


export default function ArchivePage({ notes, api }) {
    const [params] = useSearchParams();
    const q = (params.get('q') || '').toLowerCase();


    const archivedNotes = useMemo(() => notes.filter((n) => n.archived), [notes]);
    const filtered = useMemo(() => (
    q ? archivedNotes.filter((n) => n.title.toLowerCase().includes(q)) : archivedNotes
    ), [archivedNotes, q]);


    return (
        <section>
            <h1>Arsip Catatan</h1>
            <SearchBar placeholder="Cari di arsip…" />
            <NoteList notes={filtered} onDelete={api.deleteNote} onToggleArchive={api.toggleArchive} emptyText="Arsip kosong" />
        </section>
    );
}


ArchivePage.propTypes = {
    notes: PropTypes.array.isRequired,
    api: PropTypes.shape({
        addNote: PropTypes.func.isRequired,
        deleteNote: PropTypes.func.isRequired,
        toggleArchive: PropTypes.func.isRequired,
    }).isRequired,
};