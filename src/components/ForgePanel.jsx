export default function ForgePanel({
  visible, onClose, forging, forgeStatus, forgeError,
  onForge, autoForge, onToggleAuto,
}) {
  if (!visible) return null;

  const stages = [
    { key: "connecting", icon: "◉", label: "Connecting to Anthropic API" },
    { key: "searching", icon: "◎", label: "Searching current events" },
    { key: "processing", icon: "◈", label: "Generating tactical lines" },
    { key: "complete", icon: "✓", label: "Forge complete" },
  ];
  const currentIdx = forgeStatus ? stages.findIndex(s => s.key === forgeStatus.stage) : -1;
  const elapsed = forgeStatus ? (forgeStatus.elapsed / 1000).toFixed(1) : 0;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480,
          background: "#0e0e14", borderRadius: "16px 16px 0 0",
          padding: "20px 16px 32px", animation: "fade-in 0.2s ease-out",
        }}
      >
        <div style={{
          width: 32, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.1)",
          margin: "0 auto 16px",
        }} />

        <div style={{
          fontSize: 14, fontWeight: 800, color: "#f5f5f7",
          fontFamily: "'Outfit',sans-serif", marginBottom: 14,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          ⚡ FORGE ENGINE
        </div>

        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <button
            onClick={onForge}
            disabled={forging}
            className={forging ? "" : "shimmer-btn"}
            style={{
              flex: 1, padding: "12px 0", border: "none", borderRadius: 8,
              fontSize: 13, fontWeight: 700, fontFamily: "'Outfit',sans-serif",
              cursor: forging ? "default" : "pointer",
              background: forging ? "#2a2a3a" : undefined,
              color: forging ? "#6b7280" : "#fff",
            }}
          >
            {forging ? "◎ FORGING..." : "⚡ FORGE NOW"}
          </button>
          <button
            onClick={onToggleAuto}
            style={{
              padding: "12px 18px", borderRadius: 8,
              border: `1px solid ${autoForge ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`,
              background: autoForge ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)",
              color: autoForge ? "#ef4444" : "#6b7280",
              fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {autoForge && <div className="forge-pulse" style={{ width: 5, height: 5 }} />}
            {autoForge ? "AUTO: ON" : "AUTO: OFF"}
          </button>
        </div>

        {autoForge && (
          <div style={{
            fontSize: 9, color: "#ef4444", marginBottom: 12, textAlign: "center",
            fontFamily: "'Outfit',sans-serif", opacity: 0.7,
          }}>
            ⚠ Auto-forging every 90s — uses API credits
          </div>
        )}

        {forgeStatus && (
          <div style={{
            padding: "12px", marginBottom: 12,
            background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)",
            borderRadius: 8, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, height: 2,
              background: "linear-gradient(90deg, #ef4444, #f97316)",
              width: `${Math.min(((currentIdx + 1) / stages.length) * 100, 100)}%`,
              transition: "width 0.5s ease",
            }} />
            <div style={{
              display: "flex", justifyContent: "space-between", marginBottom: 10,
              fontSize: 10, fontFamily: "'Outfit',sans-serif",
            }}>
              <span style={{ color: "#ef4444", fontWeight: 700 }}>FORGING</span>
              <span style={{ color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>{elapsed}s</span>
            </div>
            {stages.map((s, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              return (
                <div key={s.key} style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 4,
                  opacity: i > currentIdx ? 0.25 : 1,
                  fontSize: 10, fontFamily: "'IBM Plex Mono',monospace",
                  color: done ? "#22c55e" : active ? "#f5f5f7" : "#3a3a4a",
                }}>
                  <span>{done ? "✓" : s.icon}</span>
                  <span>{s.label}{active && "..."}</span>
                </div>
              );
            })}
          </div>
        )}

        {forgeError && (
          <div style={{
            padding: "10px 12px", marginBottom: 8,
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: 8, fontSize: 11, color: "#ef4444",
            fontFamily: "'Outfit',sans-serif",
          }}>
            ⚠ {forgeError}
          </div>
        )}
      </div>
    </div>
  );
}
