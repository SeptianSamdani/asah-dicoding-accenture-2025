import React from "react";
import NoteItem from "./noteItem";

export default function NoteList({ title, notes, onDelete, onToggleArchive }) {
  const empty = notes.length === 0;
  return (
    <section>
        <h2>{title}</h2>
        {
            empty ? <p style={{ color: "#64748b" }}>Tidak ada catatan</p> : notes.map(n => <NoteItem key={n.id} note={n} onDelete={onDelete} onToggleArchive={onToggleArchive} />)
        }
    </section>
  );
}