// App.jsx (ringkas & siap tempel)
import React, { useMemo, useState, useCallback } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import HomePage from './pages/HomePage.jsx';
import DetailPage from './pages/DetailPage.jsx';
import NewNotePage from './pages/NewNotePage.jsx';
import ArchivePage from './pages/ArchivePage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import {
  getAllNotes,
  getNote,
  addNote as addNoteApi,
  deleteNote as deleteNoteApi,
  archiveNote as archiveNoteApi,
  unarchiveNote as unarchiveNoteApi,
} from './utils/local-data.js';

export default function App() {
  const navigate = useNavigate();
  const [tick, setTick] = useState(0);              // pemicu re-render
  const refresh = useCallback(() => setTick(t => t + 1), []);

  const addNote = useCallback(({ title, body }) => {
    addNoteApi({ title, body });
    refresh();
    navigate('/');
  }, [navigate, refresh]);

  const deleteNote = useCallback((id) => {
    deleteNoteApi(id);
    refresh();
  }, [refresh]);

  const toggleArchive = useCallback((id) => {
    const n = getNote(id);
    if (!n) return;
    if (n.archived) unarchiveNoteApi(id); else archiveNoteApi(id);
    refresh();
  }, [refresh]);

  const api = { addNote, deleteNote, toggleArchive };
  const notes = useMemo(() => getAllNotes(), [tick]); // baca data terkini

  return (
    <div className="container">
      <header className="site-header">
        <Link to="/" className="brand">🗒️ Notes</Link>
        <nav className="nav">
          <Link to="/">Beranda</Link>
          <Link to="/archive">Arsip</Link>
          <Link to="/notes/new" className="primary">Tambah</Link>
        </nav>
      </header>

      <main className="site-main">
        <Routes>
          <Route index element={<HomePage notes={notes} api={api} />} />
          <Route path="/archive" element={<ArchivePage notes={notes} api={api} />} />
          <Route path="/notes/new" element={<NewNotePage api={api} />} />
          <Route path="/notes/:id" element={<DetailPage notes={notes} api={api} />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      <footer className="site-footer">© {new Date().getFullYear()} Notes App</footer>
    </div>
  );
}
