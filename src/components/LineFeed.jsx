import LineCard from "./LineCard.jsx";

export default function LineFeed({ lines, copiedId, onCopy, onSave, savedSet, search, onSearchChange }) {
  return (
    <div style={{ padding: "14px 16px 0" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 8,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 800, color: "#6b7280",
          letterSpacing: 0.5, fontFamily: "'Outfit',sans-serif",
        }}>
          ALL LINES
        </div>
        <div style={{ fontSize: 8, color: "#4b5563", fontFamily: "'Outfit',sans-serif" }}>
          {lines.length} lines
        </div>
      </div>

      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search lines..."
          style={{
            width: "100%", padding: "8px 12px", fontSize: 11,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8, color: "#f5f5f7", fontFamily: "'Outfit',sans-serif",
            outline: "none",
          }}
        />
      </div>

      {lines.length === 0 && (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          color: "#3a3a4a", fontFamily: "'Outfit',sans-serif",
        }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>No lines match your filters</div>
        </div>
      )}

      {lines.map(l => (
        <LineCard
          key={l.id}
          line={l.line}
          category={l.category}
          character={l.character || "wick"}
          copied={copiedId === l.id}
          onCopy={() => onCopy(l.line, l.id)}
          onSave={onSave}
          saved={savedSet.has(l.line)}
          extra={l.inspired_by ? `← ${l.inspired_by}` : undefined}
          forged={l.source === "forged"}
        />
      ))}
    </div>
  );
}
