import { CATEGORY_META } from "../data/moods.js";
import { CATEGORY_KEYS } from "../data/categories.js";
import { MOOD_MAP, MOOD_NAMES } from "../data/moods.js";

export default function FilterChips({ activeMoods, onToggleMood, activeCategories, onToggleCategory, savedActive, onToggleSaved }) {
  return (
    <div style={{ padding: "8px 16px 0" }}>
      <div style={{
        display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center",
        alignItems: "center",
      }}>
        {/* Mood shortcuts — multi-select category groups */}
        {MOOD_NAMES.map(mood => {
          const active = activeMoods.has(mood);
          return (
            <button
              key={mood}
              onClick={() => onToggleMood(mood)}
              title={`${mood}: ${(MOOD_MAP[mood] || []).map(c => c.charAt(0) + c.slice(1).toLowerCase()).join(" + ")}`}
              style={{
                background: active ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.03)",
                border: `1px solid ${active ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
                borderRadius: 14, padding: "4px 10px",
                fontSize: 9, fontFamily: "'Outfit',sans-serif", fontWeight: 700,
                color: active ? "#ef4444" : "#6b7280",
                cursor: "pointer", transition: "all 0.2s ease",
              }}
            >
              {mood}
            </button>
          );
        })}

        {/* Divider dot */}
        <span style={{ color: "#2a2a3a", fontSize: 6, userSelect: "none" }}>●</span>

        {/* Category pills — granular selection */}
        {CATEGORY_KEYS.map(cat => {
          const active = activeCategories.has(cat);
          const meta = CATEGORY_META[cat];
          return (
            <button
              key={cat}
              onClick={() => onToggleCategory(cat)}
              title={meta.desc}
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
              <span style={{ fontSize: 9 }}>{meta.icon}</span>
              {cat.charAt(0) + cat.slice(1).toLowerCase()}
            </button>
          );
        })}

        {/* Divider dot */}
        <span style={{ color: "#2a2a3a", fontSize: 6, userSelect: "none" }}>●</span>

        {/* Saved toggle */}
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
    </div>
  );
}
