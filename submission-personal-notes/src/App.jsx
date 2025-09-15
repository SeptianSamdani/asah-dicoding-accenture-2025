import { useMemo, useState } from "react";
import NoteList from "./components/NoteList";
import { initialNotes } from "./initialData";
import NoteForm from "./components/NoteForm";
import SearchBar from "./components/SearchBar";

export default function App() {
  const [ notes, setNotes ] = useState(initialNotes); 
  const [ keyword, setKeyword ] = useState(''); 

  const filtered = useMemo(() => {
    const q = keyword.trim().toLowerCase(); 
    if (!q) return notes; 
    return notes.filter(n => n.title.toLowerCase().includes(q)); 
  }, [notes, keyword]); 

  const active = filtered.filter(n => !n.archived);
  const archived = filtered.filter(n => n.archived);

  const handleAdd = (note) => setNotes(prev => [note, ...prev]);
  const handleDelete = (id) => setNotes(prev => prev.filter(n => n.id !== id));
  const handleToggleArchive = (id) => {
    setNotes(prev => prev.map(n => n.id === id ? { ...n, archived: !n.archived } : n));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1 className="app-title">Aplikasi Catatan Pribadi</h1>
      </header>

      <SearchBar keyword={keyword} onChange={setKeyword} />
      <NoteForm onAdd={handleAdd} />
      <NoteList title="Catatan Aktif" notes={active} onDelete={handleDelete} onToggleArchive={handleToggleArchive} />
      <NoteList title="Arsip" notes={archived} onDelete={handleDelete} onToggleArchive={handleToggleArchive} />

      {/* Footer baru */}
      <footer className="app-footer">
        <p>© {new Date().getFullYear()} Aplikasi Catatan Pribadi. Dibuat dengan 💙 menggunakan React.</p>
      </footer>
    </div>
  );
}