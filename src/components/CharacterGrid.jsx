import { useRef, useCallback } from "react";
import { CHARACTERS, CHARACTER_IDS } from "../data/characters.js";

export default function CharacterGrid({ activeCharacters, onToggle, onProfile }) {
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
    <div style={{
      display: "flex", gap: 8, overflowX: "auto", padding: "14px 16px 0",
      WebkitOverflowScrolling: "touch", scrollbarWidth: "none",
    }}>
      {CHARACTER_IDS.map(id => {
        const c = CHARACTERS[id];
        const active = activeCharacters.has(id);
        return (
          <div
            key={id}
            onPointerDown={() => handlePointerDown(id)}
            onPointerUp={() => handlePointerUp(id)}
            onPointerLeave={handlePointerLeave}
            style={{
              minWidth: 72, padding: "10px 6px", textAlign: "center",
              borderRadius: 10, cursor: "pointer", userSelect: "none",
              background: active
                ? "linear-gradient(135deg, rgba(239,68,68,0.15), rgba(239,68,68,0.05))"
                : "rgba(255,255,255,0.03)",
              border: `1px solid ${active ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.06)"}`,
              transition: "all 0.2s ease",
            }}
          >
            <div style={{ fontSize: 18, marginBottom: 3 }}>{c.icon}</div>
            <div style={{
              fontSize: 8, fontWeight: 800, color: "#f5f5f7",
              letterSpacing: 0.3, fontFamily: "'Outfit',sans-serif",
            }}>
              {c.name.split(" ").pop().toUpperCase()}
            </div>
            <div style={{
              fontSize: 7, color: active ? "#ef4444" : "#666",
              marginTop: 1, fontFamily: "'Outfit',sans-serif",
            }}>
              {c.energy}
            </div>
          </div>
        );
      })}
    </div>
  );
}
