import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { useSearchParams } from 'react-router-dom';
import NoteList from '../components/NoteList.jsx';
import SearchBar from '../components/SearchBar.jsx';


export default function HomePage({ notes, api }) {
    const [params] = useSearchParams();
    const q = (params.get('q') || '').toLowerCase();


    const activeNotes = useMemo(() => notes.filter((n) => !n.archived), [notes]);
    const filtered = useMemo(() => (
    q ? activeNotes.filter((n) => n.title.toLowerCase().includes(q)) : activeNotes
    ), [activeNotes, q]);


    return (
        <section>
            <h1>Catatan Aktif</h1>
            <SearchBar />
            <NoteList notes={filtered} onDelete={api.deleteNote} onToggleArchive={api.toggleArchive} emptyText="Tidak ada catatan" />
        </section>
    );
}


HomePage.propTypes = {
    notes: PropTypes.array.isRequired,
    api: PropTypes.shape({
        addNote: PropTypes.func.isRequired,
        deleteNote: PropTypes.func.isRequired,
        toggleArchive: PropTypes.func.isRequired,
    }).isRequired,
};