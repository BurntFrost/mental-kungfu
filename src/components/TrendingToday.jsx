import LineCard from "./LineCard.jsx";

export default function TrendingToday({ batches, copiedId, onCopy, onSave, savedSet }) {
  const recentBatch = batches[0];
  if (!recentBatch || !recentBatch.lines.length) return null;

  return (
    <div style={{ padding: "14px 16px 0" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 8,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 800, color: "#ef4444",
          letterSpacing: 0.5, fontFamily: "'Outfit',sans-serif",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span>⚡ TRENDING TODAY</span>
          <div className="forge-pulse" style={{ width: 5, height: 5 }} />
        </div>
        <div style={{ fontSize: 8, color: "#4b5563", fontFamily: "'Outfit',sans-serif" }}>
          from current events
        </div>
      </div>
      {recentBatch.lines.map(item => (
        <LineCard
          key={item.id}
          line={item.line}
          category={item.category}
          character={item.character || "wick"}
          copied={copiedId === item.id}
          onCopy={() => onCopy(item.line, item.id)}
          onSave={onSave}
          saved={savedSet.has(item.line)}
          extra={item.inspired_by ? `← ${item.inspired_by}` : undefined}
          forged
        />
      ))}
    </div>
  );
}
