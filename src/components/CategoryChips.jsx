import { CATEGORY_META } from "../data/moods.js";
import { CATEGORY_KEYS } from "../data/categories.js";

export default function CategoryChips({ activeCategories, onToggle }) {
  return (
    <div style={{ padding: "6px 16px 0" }}>
      <div style={{
        fontSize: 9, fontWeight: 700, color: "#4b5563", marginBottom: 6,
        letterSpacing: 0.5, fontFamily: "'Outfit',sans-serif",
      }}>
        TYPE
      </div>
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
        {CATEGORY_KEYS.map(cat => {
          const active = activeCategories.has(cat);
          const meta = CATEGORY_META[cat];
          return (
            <button
              key={cat}
              onClick={() => onToggle(cat)}
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
      </div>
    </div>
  );
}
