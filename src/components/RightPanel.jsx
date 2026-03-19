import { EMOTION_NAMES, EMOTION_META } from "../data/emotions.js";
import { MOOD_MAP, MOOD_NAMES, MOOD_META } from "../data/moods.js";
import { CATEGORY_META } from "../data/moods.js";
import { CATEGORY_KEYS } from "../data/categories.js";

export default function RightPanel({
  activeEmotions, onToggleEmotion,
  activeMoods, onToggleMood,
  activeCategories, onToggleCategory,
  savedActive, onToggleSaved,
}) {
  return (
    <aside className="left-panel">
      {/* Emotions */}
      <div className="panel-section">
        <div className="panel-label">I'M FEELING...</div>
        <div className="filter-stack">
          {EMOTION_NAMES.map(emotion => {
            const active = activeEmotions.has(emotion);
            const meta = EMOTION_META[emotion];
            return (
              <button
                key={emotion}
                onClick={() => onToggleEmotion(emotion)}
                className={`sidebar-chip ${active ? "sidebar-chip--active" : ""}`}
                title={meta.desc}
                style={{
                  "--chip-color": meta.color,
                }}
              >
                <span className="sidebar-chip-icon">{meta.icon}</span>
                <span className="sidebar-chip-text">{emotion}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Moods */}
      <div className="panel-section">
        <div className="panel-label">MOOD</div>
        <div className="filter-stack">
          {MOOD_NAMES.map(mood => {
            const active = activeMoods.has(mood);
            const meta = MOOD_META[mood];
            return (
              <button
                key={mood}
                onClick={() => onToggleMood(mood)}
                className={`sidebar-chip sidebar-chip--mood ${active ? "sidebar-chip--active" : ""}`}
                title={`${mood}: ${meta?.desc || (MOOD_MAP[mood] || []).map(c => c.charAt(0) + c.slice(1).toLowerCase()).join(" + ")}`}
                style={{ "--chip-color": "#ef4444" }}
              >
                <span className="sidebar-chip-icon">{meta?.icon}</span>
                <span className="sidebar-chip-text">{mood}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Categories */}
      <div className="panel-section">
        <div className="panel-label">CATEGORY</div>
        <div className="filter-stack">
          {CATEGORY_KEYS.map(cat => {
            const active = activeCategories.has(cat);
            const meta = CATEGORY_META[cat];
            return (
              <button
                key={cat}
                onClick={() => onToggleCategory(cat)}
                className={`sidebar-chip ${active ? "sidebar-chip--active" : ""}`}
                title={meta.desc}
                style={{ "--chip-color": meta.color }}
              >
                <span className="sidebar-chip-icon">{meta.icon}</span>
                <span className="sidebar-chip-text">
                  {cat.charAt(0) + cat.slice(1).toLowerCase()}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Saved */}
      <div className="panel-section">
        <button
          onClick={onToggleSaved}
          className={`sidebar-chip sidebar-chip--saved ${savedActive ? "sidebar-chip--active" : ""}`}
          style={{ "--chip-color": "#f59e0b" }}
        >
          <span className="sidebar-chip-icon">★</span>
          <span className="sidebar-chip-text">Saved</span>
        </button>
      </div>
    </aside>
  );
}
