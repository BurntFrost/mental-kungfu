import { CATEGORY_META } from "../data/moods.js";
import { CHARACTERS } from "../data/characters.js";
import { getEmotionsForCategory, EMOTION_META } from "../data/emotions.js";

export default function LineCard({ line, category, character, copied, onCopy, onSave, saved, extra, forged }) {
  const cat = CATEGORY_META[category] || { icon: "?", color: "#666" };
  const char = CHARACTERS[character];
  const emotions = getEmotionsForCategory(category);

  return (
    <div
      className="line-card"
      onClick={() => onCopy(line)}
      tabIndex={0}
      role="button"
      aria-label={`Copy: ${line}`}
      style={{
        padding: "12px 14px", marginBottom: 8,
        background: forged
          ? "linear-gradient(135deg, rgba(239,68,68,0.04), rgba(139,92,246,0.02))"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${forged ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)"}`,
        borderRadius: 10, position: "relative",
      }}
    >
      <div style={{ fontSize: 13, color: "#f5f5f7", lineHeight: 1.55, fontFamily: "'Outfit',sans-serif" }}>
        "{line}"
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 8, flexWrap: "wrap" }}>
        {forged && (
          <span style={{
            fontSize: 7, fontWeight: 700, fontFamily: "'Outfit',sans-serif",
            padding: "1px 5px", borderRadius: 4,
            background: "rgba(239,68,68,0.1)", color: "#ef4444",
          }}>⚡ FORGED</span>
        )}
        <span
          className="cat-tag"
          style={{
            fontSize: 8, fontWeight: 700, fontFamily: "'Outfit',sans-serif",
            padding: "1px 5px", borderRadius: 4,
            background: `${cat.color}15`, color: cat.color,
          }}
        >
          {cat.icon} {category}
          {cat.desc && <span className="cat-tip">{cat.desc}</span>}
        </span>
        {char && (
          <span style={{ fontSize: 8, color: "#555", fontFamily: "'Outfit',sans-serif" }}>
            {char.icon} {char.name}
          </span>
        )}
        {extra && (
          <span style={{ fontSize: 8, color: "#444", fontFamily: "'Outfit',sans-serif" }}>← {extra.replace(/^←\s*/, "")}</span>
        )}
        {emotions.map(e => (
          <span
            key={e}
            style={{
              fontSize: 7, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
              color: `${EMOTION_META[e].color}99`,
            }}
          >
            {EMOTION_META[e].icon} {e}
          </span>
        ))}
        {copied && (
          <span style={{
            fontSize: 8, color: "#22c55e", fontWeight: 700, fontFamily: "'Outfit',sans-serif",
          }}>✓ COPIED</span>
        )}
        <button
          onClick={e => { e.stopPropagation(); onSave(line, category); }}
          style={{
            marginLeft: "auto", background: "none", border: "none", cursor: "pointer",
            fontSize: 14, color: saved ? "#f59e0b" : "#333", padding: "2px 4px",
          }}
          aria-label={saved ? "Unsave" : "Save"}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}
