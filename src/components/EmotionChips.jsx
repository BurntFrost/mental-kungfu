import { EMOTION_NAMES, EMOTION_META } from "../data/emotions.js";

export default function EmotionChips({ activeEmotions, onToggle }) {
  return (
    <div style={{ padding: "6px 16px 0" }}>
      <div style={{
        fontSize: 9, fontWeight: 700, color: "#4b5563", marginBottom: 6,
        letterSpacing: 0.5, fontFamily: "'Outfit',sans-serif",
      }}>
        I'M FEELING...
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {EMOTION_NAMES.map(emotion => {
          const active = activeEmotions.has(emotion);
          const meta = EMOTION_META[emotion];
          return (
            <button
              key={emotion}
              onClick={() => onToggle(emotion)}
              style={{
                background: active ? `${meta.color}18` : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? `${meta.color}40` : "rgba(255,255,255,0.06)"}`,
                borderRadius: 14, padding: "4px 10px",
                fontSize: 9, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
                color: active ? meta.color : "#6b7280",
                cursor: "pointer", transition: "all 0.2s ease",
                display: "flex", alignItems: "center", gap: 4,
              }}
            >
              <span style={{ fontSize: 10 }}>{meta.icon}</span>
              {emotion}
            </button>
          );
        })}
      </div>
    </div>
  );
}
