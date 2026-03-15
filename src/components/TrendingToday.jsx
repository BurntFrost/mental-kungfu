import { useState } from "react";
import LineCard from "./LineCard.jsx";

export default function TrendingToday({ batches, copiedId, onCopy, onSave, savedSet }) {
  const [collapsed, setCollapsed] = useState(false);
  const recentBatch = batches[0];
  if (!recentBatch || !recentBatch.lines.length) return null;

  return (
    <div style={{ padding: "14px 16px 0" }}>
      <div
        onClick={() => setCollapsed(v => !v)}
        style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          marginBottom: collapsed ? 0 : 8, cursor: "pointer", userSelect: "none",
        }}
      >
        <div style={{
          fontSize: 10, fontWeight: 800, color: "#ef4444",
          letterSpacing: 0.5, fontFamily: "'Outfit',sans-serif",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span style={{
            display: "inline-block", fontSize: 8, transition: "transform 0.2s ease",
            transform: collapsed ? "rotate(-90deg)" : "rotate(0deg)",
          }}>▼</span>
          <span>⚡ TRENDING TODAY</span>
          <div className="forge-pulse" style={{ width: 5, height: 5 }} />
        </div>
        <div style={{ fontSize: 8, color: "#4b5563", fontFamily: "'Outfit',sans-serif" }}>
          {collapsed ? `${recentBatch.lines.length} lines` : "from current events"}
        </div>
      </div>
      {!collapsed && recentBatch.lines.map(item => (
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
