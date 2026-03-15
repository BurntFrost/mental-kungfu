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
      {forged && (
        <div style={{ fontSize: 8, color: "#ef4444", fontWeight: 700, marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>
          ⚡ FORGED
        </div>
      )}
      <div style={{ fontSize: 13, color: "#f5f5f7", lineHeight: 1.55, fontFamily: "'Outfit',sans-serif" }}>
        "{line}"
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
        <span
          title={cat.desc}
          style={{
            fontSize: 9, fontWeight: 700, color: cat.color, fontFamily: "'Outfit',sans-serif",
            cursor: "help",
          }}
        >
          {cat.icon} {category}
        </span>
        {char && (
          <>
            <span style={{ fontSize: 9, color: "#333" }}>•</span>
            <span style={{ fontSize: 9, color: "#555", fontFamily: "'Outfit',sans-serif" }}>
              {char.icon} {char.name}
            </span>
          </>
        )}
        {extra && (
          <>
            <span style={{ fontSize: 9, color: "#333" }}>•</span>
            <span style={{ fontSize: 9, color: "#555", fontFamily: "'Outfit',sans-serif" }}>{extra}</span>
          </>
        )}
        {copied && (
          <span style={{
            fontSize: 8, color: "#22c55e", fontWeight: 700, fontFamily: "'Outfit',sans-serif",
            marginLeft: 4,
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
      {emotions.length > 0 && (
        <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
          {emotions.map(e => {
            const meta = EMOTION_META[e];
            return (
              <span
                key={e}
                style={{
                  fontSize: 8, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
                  padding: "2px 6px", borderRadius: 8,
                  background: `${meta.color}12`, border: `1px solid ${meta.color}30`,
                  color: meta.color, display: "inline-flex", alignItems: "center", gap: 2,
                }}
              >
                {meta.icon} {e}
              </span>
            );
          })}
        </div>
      )}
    </div>
  );
}
