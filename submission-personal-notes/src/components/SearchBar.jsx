export default function SearchBar({ keyword, onChange }) {
  return (
    <section className="app-section app-search">
      <input
        type="text"
        placeholder="Cari catatan…"
        value={keyword}
        onChange={(e)=>onChange(e.target.value)}
        className="app-input app-searchInput"
      />
    </section>
  );
}
