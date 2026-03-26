import { getMoodsForCategory, MOOD_META } from "../data/moods.js";
import { getEmotionsForCategory, EMOTION_META } from "../data/emotions.js";
import { CHARACTERS } from "../data/characters.js";

export default function LineCard({ line, category, character, copied, onCopy, onSave, saved, extra, forged }) {
  const char = CHARACTERS[character];
  const mood = getMoodsForCategory(category)[0];
  const moodMeta = mood && MOOD_META[mood];
  const emotion = getEmotionsForCategory(category)[0];
  const emotionMeta = emotion && EMOTION_META[emotion];

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
      <div style={{ fontSize: 16, color: "#f5f5f7", lineHeight: 1.55, fontFamily: "'Outfit',sans-serif" }}>
        "{line}"
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 8, flexWrap: "wrap" }}>
        {forged && (
          <span style={{
            fontSize: 11, fontWeight: 700, fontFamily: "'Outfit',sans-serif",
            padding: "2px 6px", borderRadius: 4,
            background: "rgba(239,68,68,0.1)", color: "#ef4444",
          }}>⚡ FORGED</span>
        )}
        {char && (
          <span className="char-pill" style={{ fontSize: 11, color: "#888", fontFamily: "'Outfit',sans-serif" }}>
            {char.icon} {char.name}
            <span className="char-pill-tip">📽 {char.source}</span>
          </span>
        )}
        {moodMeta && (
          <span style={{
            fontSize: 11, fontFamily: "'Outfit',sans-serif",
            padding: "2px 6px", borderRadius: 4,
            background: "rgba(255,255,255,0.04)", color: "#999",
          }}>{moodMeta.icon} {mood}</span>
        )}
        {emotionMeta && (
          <span style={{
            fontSize: 11, fontFamily: "'Outfit',sans-serif",
            padding: "2px 6px", borderRadius: 4,
            background: `${emotionMeta.color}10`, color: emotionMeta.color,
          }}>{emotionMeta.icon} {emotion}</span>
        )}
        {extra && (
          <span style={{ fontSize: 11, color: "#444", fontFamily: "'Outfit',sans-serif" }}>← {extra.replace(/^←\s*/, "")}</span>
        )}
        {copied && (
          <span style={{
            fontSize: 11, color: "#22c55e", fontWeight: 700, fontFamily: "'Outfit',sans-serif",
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
