import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import parser from 'html-react-parser';
import Loader from '../components/Loader.jsx';
import { getNote, deleteNote, archiveNote, unarchiveNote } from '../utils/network-data.js';

export default function DetailPage() {
  const { id } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    setLoading(true);
    const { error, data } = await getNote(id);
    if (!error) setNote(data);
    setLoading(false);
  };

  useEffect(() => { refresh(); }, [id]);

  if (loading) return <Loader />;
  if (!note) return <section><h1>Tidak ditemukan</h1><Link to="/">Kembali</Link></section>;

  const onToggleArchive = async () => {
    if (note.archived) await unarchiveNote(id); else await archiveNote(id);
    refresh();
  };

  const onDelete = async () => {
    await deleteNote(id);
    history.back();
  };

  return (
    <article className="detail">
      <header className="detail-header">
        <h1>{note.title}</h1>
        <time className="muted">{new Date(note.createdAt).toLocaleString('id-ID')}</time>
        <div className="row-actions">
          <button onClick={onToggleArchive}>{note.archived ? 'Batal Arsip' : 'Arsipkan'}</button>
          <button className="danger" onClick={onDelete}>Hapus</button>
          <Link className="ghost" to="/">Kembali</Link>
        </div>
      </header>
      <div className="detail-body">{parser(note.body)}</div>
    </article>
  );
}
