import { formatDate } from "../utils/formatDate";

export default function NoteItem({ note, onDelete, onToggleArchive }) {
    const { archived } = note; 
    return (
        <article className="app-article">
            <header className="app-articleHead">
                <h3 className="app-articleTitle">{note.title}</h3>
                <small className="app-articleMeta">{formatDate(note.createdAt)}</small>
            </header>
            
            <p className="app-articleBody">{note.body}</p>

            <div className="app-actions">
                <button className="app-btn app-btn-archive" onClick={() => onToggleArchive(note.id)}>
                    {archived ? "Pindahkan" : "Arsipkan"}
                </button>
                <button className="app-btn app-btn-delete" onClick={() => onDelete(note.id)}>Hapus</button>
            </div>
        </article>
    );
}