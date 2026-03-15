import { MOOD_NAMES } from "../data/moods.js";

export default function MoodChips({ activeMoods, onToggle, savedActive, onToggleSaved }) {
  return (
    <div style={{
      display: "flex", gap: 6, flexWrap: "wrap", padding: "10px 16px 0", justifyContent: "center",
    }}>
      {MOOD_NAMES.map(mood => {
        const active = activeMoods.has(mood);
        return (
          <button
            key={mood}
            onClick={() => onToggle(mood)}
            style={{
              background: active ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${active ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 14, padding: "4px 10px",
              fontSize: 9, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
              color: active ? "#ef4444" : "#6b7280",
              cursor: "pointer", transition: "all 0.2s ease",
            }}
          >
            {mood}
          </button>
        );
      })}
      <button
        onClick={onToggleSaved}
        style={{
          background: savedActive ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${savedActive ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 14, padding: "4px 10px",
          fontSize: 9, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
          color: savedActive ? "#f59e0b" : "#6b7280",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
          transition: "all 0.2s ease",
        }}
      >
        ★ Saved
      </button>
    </div>
  );
}
