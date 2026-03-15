import { CHARACTERS } from "../data/characters.js";

export default function CharacterProfile({ characterId, lines, onClose, onCopy, copiedId, onSave, savedSet }) {
  const char = CHARACTERS[characterId];
  if (!char) return null;

  const charLines = lines.filter(l => l.character === characterId);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.8)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480, maxHeight: "80vh", overflowY: "auto",
          background: "#0e0e14", borderRadius: "16px 16px 0 0",
          padding: "24px 16px 32px", animation: "fade-in 0.25s ease-out",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 40, marginBottom: 8 }}>{char.icon}</div>
          <div style={{
            fontSize: 20, fontWeight: 800, color: "#f5f5f7",
            fontFamily: "'Outfit',sans-serif",
          }}>{char.name}</div>
          <div style={{
            fontSize: 11, color: "#ef4444", fontWeight: 600,
            fontFamily: "'Outfit',sans-serif", marginTop: 2,
          }}>{char.energy}</div>
          <div style={{
            fontSize: 10, color: "#6b7280", marginTop: 2,
            fontFamily: "'Outfit',sans-serif",
          }}>{char.source}</div>
        </div>

        <div style={{
          fontSize: 12, color: "#c0c0cc", lineHeight: 1.6,
          fontFamily: "'Outfit',sans-serif", marginBottom: 16,
          padding: "0 4px",
        }}>
          {char.philosophy}
        </div>

        <div style={{
          padding: "10px 14px", marginBottom: 20,
          background: "rgba(255,255,255,0.03)", borderRadius: 8,
          borderLeft: "2px solid rgba(239,68,68,0.3)",
        }}>
          <div style={{
            fontSize: 12, color: "#f5f5f7", fontStyle: "italic",
            fontFamily: "'Outfit',sans-serif", lineHeight: 1.5,
          }}>
            "{char.signatureQuote}"
          </div>
        </div>

        <div style={{
          fontSize: 10, fontWeight: 700, color: "#6b7280",
          fontFamily: "'Outfit',sans-serif", marginBottom: 8,
          letterSpacing: 0.5,
        }}>
          {charLines.length} LINES
        </div>

        {charLines.map(l => {
          const copied = copiedId === l.id;
          return (
            <div
              key={l.id}
              className="line-card"
              onClick={() => onCopy(l.line, l.id)}
              style={{
                padding: "10px 12px", marginBottom: 6,
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.05)",
                borderRadius: 8, cursor: "pointer",
              }}
            >
              <div style={{ fontSize: 12, color: "#f5f5f7", lineHeight: 1.5, fontFamily: "'Outfit',sans-serif" }}>
                "{l.line}"
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
                <span style={{ fontSize: 8, color: "#ef4444", fontWeight: 600 }}>{l.category}</span>
                {copied && <span style={{ fontSize: 8, color: "#22c55e", fontWeight: 700 }}>✓ COPIED</span>}
                <button
                  onClick={e => { e.stopPropagation(); onSave(l.line, l.category); }}
                  style={{
                    marginLeft: "auto", background: "none", border: "none",
                    cursor: "pointer", fontSize: 13, color: savedSet.has(l.line) ? "#f59e0b" : "#333",
                  }}
                >
                  {savedSet.has(l.line) ? "★" : "☆"}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
