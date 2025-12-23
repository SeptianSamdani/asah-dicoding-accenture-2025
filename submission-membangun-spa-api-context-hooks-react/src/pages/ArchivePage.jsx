import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useArchivedNotes } from '../hooks/useNotes.js';
import NoteList from '../components/NoteList.jsx';
import Loader from '../components/Loader.jsx';

export default function ArchivePage() {
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') || '').toLowerCase();
  const { notes, loading, err, actions } = useArchivedNotes();
  const filtered = q ? notes.filter(n => n.title.toLowerCase().includes(q)) : notes;

  return (
    <section>
      <h1>Arsip Catatan</h1>
      <input
        className="search"
        type="search"
        placeholder="Cari di arsip…"
        value={q}
        onChange={(e) => e.target.value ? setParams({ q: e.target.value }) : setParams({})}
      />
      {loading ? <Loader/> : err ? <p className="empty">{err}</p> : (
        <NoteList
          notes={filtered}
          onDelete={(id) => actions.deleteNote(id)}
          onToggleArchive={(id) => actions.toggleArchive(id)}
          emptyText="Arsip kosong"
        />
      )}
    </section>
  );
}
