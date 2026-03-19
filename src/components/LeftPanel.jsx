import { useRef, useCallback } from "react";
import { CHARACTERS, CHARACTER_IDS } from "../data/characters.js";

export default function LeftPanel({ activeCharacters, onToggle, onProfile }) {
  const pressTimer = useRef(null);
  const pressedId = useRef(null);

  const handlePointerDown = useCallback((id) => {
    pressedId.current = id;
    pressTimer.current = setTimeout(() => {
      pressedId.current = null;
      onProfile(id);
    }, 500);
  }, [onProfile]);

  const handlePointerUp = useCallback((id) => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    if (pressedId.current === id) {
      onToggle(id);
      pressedId.current = null;
    }
  }, [onToggle]);

  const handlePointerLeave = useCallback(() => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    pressedId.current = null;
  }, []);

  return (
    <aside className="right-panel">
      <div className="panel-label">CHARACTERS</div>
      <div className="char-list">
        {CHARACTER_IDS.map(id => {
          const c = CHARACTERS[id];
          const active = activeCharacters.has(id);
          return (
            <div
              key={id}
              className={`char-item ${active ? "char-item--active" : ""}`}
              title={`${c.name} — ${c.source}`}
              onPointerDown={() => handlePointerDown(id)}
              onPointerUp={() => handlePointerUp(id)}
              onPointerLeave={handlePointerLeave}
            >
              <div className="char-item-icon">{c.icon}</div>
              <div className="char-item-info">
                <div className="char-item-name">
                  {c.name.split(" ").pop().toUpperCase()}
                </div>
                <div className={`char-item-energy ${active ? "char-item-energy--active" : ""}`}>
                  {c.energy}
                </div>
                <div className="char-item-source">{c.source}</div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="panel-hint">Long-press for profile</div>
    </aside>
  );
}
