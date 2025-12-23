import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useActiveNotes } from '../hooks/useNotes.js';
import NoteList from '../components/NoteList.jsx';
import Loader from '../components/Loader.jsx';

export default function HomePage({ api }) {
  const [params, setParams] = useSearchParams();
  const q = (params.get('q') || '').toLowerCase();
  const { notes, loading, err, actions } = useActiveNotes();

  const filtered = q ? notes.filter(n => n.title.toLowerCase().includes(q)) : notes;

  return (
    <section>
      <h1>Catatan Aktif</h1>
      <input
        className="search"
        type="search"
        placeholder="Cari judul catatan…"
        value={q}
        onChange={(e) => e.target.value ? setParams({ q: e.target.value }) : setParams({})}
      />
      {loading ? <Loader/> : err ? <p className="empty">{err}</p> : (
        <NoteList
          notes={filtered}
          onDelete={(id) => actions.deleteNote(id)}
          onToggleArchive={(id) => {
            const n = notes.find(x => x.id === id);
            actions.toggleArchive(id, n?.archived);
          }}
          emptyText="Tidak ada catatan"
        />
      )}
    </section>
  );
}
