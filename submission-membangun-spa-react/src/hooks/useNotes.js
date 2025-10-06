import { useCallback, useEffect, useState } from 'react';
import { getActiveNotes, getArchivedNotes, addNote as addNoteApi, archiveNote, unarchiveNote, deleteNote as deleteNoteApi } from '../utils/network-data.js';

export function useActiveNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true); setErr(null);
    const { error, data } = await getActiveNotes();
    if (error) setErr('Gagal memuat catatan'); else setNotes(data);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const addNote = useCallback(async ({ title, body }) => {
    const { error } = await addNoteApi({ title, body });
    if (!error) refresh();
  }, [refresh]);

  const toggleArchive = useCallback(async (id, isArchived) => {
    const fn = isArchived ? unarchiveNote : archiveNote;
    const { error } = await fn(id);
    if (!error) refresh();
  }, [refresh]);

  const deleteNote = useCallback(async (id) => {
    const { error } = await deleteNoteApi(id);
    if (!error) refresh();
  }, [refresh]);

  return { notes, loading, err, actions: { addNote, toggleArchive, deleteNote, refresh } };
}

export function useArchivedNotes() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const refresh = useCallback(async () => {
    setLoading(true); setErr(null);
    const { error, data } = await getArchivedNotes();
    if (error) setErr('Gagal memuat arsip'); else setNotes(data);
    setLoading(false);
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  const toggleArchive = useCallback(async (id) => {
    const { error } = await unarchiveNote(id);
    if (!error) refresh();
  }, [refresh]);

  const deleteNote = useCallback(async (id) => {
    const { error } = await deleteNoteApi(id);
    if (!error) refresh();
  }, [refresh]);

  return { notes, loading, err, actions: { toggleArchive, deleteNote, refresh } };
}
