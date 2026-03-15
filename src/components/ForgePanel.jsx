const FORGE_CSS = `
@keyframes forge-orbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes forge-pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes forge-scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
@keyframes forge-node-ping { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 70% { box-shadow: 0 0 0 8px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }
`;

function ForgeGraphic({ forging }) {
  const nodes = [
    { x: 15, y: 30, delay: 0 },
    { x: 40, y: 15, delay: 0.3 },
    { x: 65, y: 35, delay: 0.6 },
    { x: 85, y: 18, delay: 0.9 },
    { x: 50, y: 55, delay: 0.2 },
    { x: 25, y: 60, delay: 0.5 },
    { x: 75, y: 58, delay: 0.8 },
  ];
  const connections = [
    [0, 1], [1, 2], [2, 3], [1, 4], [0, 5], [4, 6], [2, 6], [5, 4],
  ];

  return (
    <div style={{
      position: "relative", height: 90, marginBottom: 16, overflow: "hidden",
      borderRadius: 12, background: "linear-gradient(135deg, rgba(239,68,68,0.04), rgba(139,92,246,0.03))",
      border: "1px solid rgba(239,68,68,0.08)",
    }}>
      {/* Scan line */}
      {forging && (
        <div style={{
          position: "absolute", top: 0, left: 0, width: "40%", height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.06), transparent)",
          animation: "forge-scan 2.5s ease-in-out infinite",
        }} />
      )}

      {/* Connection lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {connections.map(([a, b], i) => (
          <line
            key={i}
            x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
            x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
            stroke={forging ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.04)"}
            strokeWidth="1"
            style={{ transition: "stroke 0.5s ease" }}
          />
        ))}
      </svg>

      {/* Nodes */}
      {nodes.map((node, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: `${node.x}%`, top: `${node.y}%`,
            width: 8, height: 8, borderRadius: "50%",
            background: forging ? "#ef4444" : "rgba(255,255,255,0.08)",
            transform: "translate(-50%, -50%)",
            transition: "background 0.4s ease",
            animation: forging ? `forge-node-ping 2s ease-out ${node.delay}s infinite` : "none",
          }}
        />
      ))}

      {/* Center forge icon */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
        width: 36, height: 36, borderRadius: "50%",
        background: forging
          ? "linear-gradient(135deg, rgba(239,68,68,0.25), rgba(249,115,22,0.15))"
          : "rgba(255,255,255,0.03)",
        border: `1px solid ${forging ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 16, transition: "all 0.4s ease",
        animation: forging ? "forge-pulse-glow 2s ease-in-out infinite" : "none",
      }}>
        ⚡
      </div>

      {/* Orbit ring */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: 56, height: 56,
        transform: "translate(-50%, -50%)",
        border: `1px dashed ${forging ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)"}`,
        borderRadius: "50%",
        animation: forging ? "forge-orbit 8s linear infinite" : "none",
        transition: "border-color 0.4s ease",
      }}>
        <div style={{
          position: "absolute", top: -2, left: "50%", transform: "translateX(-50%)",
          width: 4, height: 4, borderRadius: "50%",
          background: forging ? "#ef4444" : "transparent",
        }} />
      </div>
    </div>
  );
}

export default function ForgePanel({
  visible, onClose, forging, forgeStatus, forgeError,
  onForge, autoForge, onToggleAuto,
}) {
  if (!visible) return null;

  const stages = [
    { key: "connecting", icon: "◉", label: "Connecting to Anthropic API" },
    { key: "searching", icon: "◎", label: "Scanning live current events" },
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
      <style>{FORGE_CSS}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 720,
          background: "linear-gradient(180deg, #111118, #0e0e14)",
          borderRadius: "16px 16px 0 0",
          padding: "20px 20px 32px", animation: "fade-in 0.2s ease-out",
          border: "1px solid rgba(255,255,255,0.04)",
          borderBottom: "none",
        }}
      >
        {/* Drag handle */}
        <div style={{
          width: 36, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.1)",
          margin: "0 auto 18px",
        }} />

        {/* Title row */}
        <div style={{
          fontSize: 16, fontWeight: 800, color: "#f5f5f7",
          fontFamily: "'Outfit',sans-serif", marginBottom: 6,
          display: "flex", alignItems: "center", gap: 8,
        }}>
          <span style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 26, height: 26, borderRadius: 7,
            background: "linear-gradient(135deg, #ef4444, #991b1b)",
            fontSize: 13,
          }}>⚡</span>
          FORGE ENGINE
        </div>

        {/* Description */}
        <div style={{
          fontSize: 12, color: "#6b7280", lineHeight: 1.6,
          fontFamily: "'Outfit',sans-serif", marginBottom: 16,
          maxWidth: 500,
        }}>
          Scans live current events via web search, then generates 5 fresh tactical one-liners
          inspired by what's happening in the world right now. Each line is mapped to a category
          and character archetype.
        </div>

        {/* How it works steps */}
        <div style={{
          display: "flex", gap: 12, marginBottom: 18,
        }}>
          {[
            { num: "1", label: "Scan", desc: "Search live news" },
            { num: "2", label: "Analyze", desc: "Extract key events" },
            { num: "3", label: "Forge", desc: "Generate 5 lines" },
          ].map((step, i) => (
            <div key={i} style={{
              flex: 1, padding: "10px 10px", borderRadius: 10,
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
              textAlign: "center",
            }}>
              <div style={{
                width: 22, height: 22, borderRadius: "50%", margin: "0 auto 6px",
                background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.15)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 10, fontWeight: 800, color: "#ef4444",
                fontFamily: "'Outfit',sans-serif",
              }}>{step.num}</div>
              <div style={{
                fontSize: 11, fontWeight: 700, color: "#e5e5ea",
                fontFamily: "'Outfit',sans-serif", marginBottom: 2,
              }}>{step.label}</div>
              <div style={{
                fontSize: 9, color: "#555", fontFamily: "'Outfit',sans-serif",
              }}>{step.desc}</div>
            </div>
          ))}
        </div>

        {/* Neural network graphic */}
        <ForgeGraphic forging={forging} />

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
          <button
            onClick={onForge}
            disabled={forging}
            className={forging ? "" : "shimmer-btn"}
            style={{
              flex: 1, padding: "14px 0", border: "none", borderRadius: 10,
              fontSize: 14, fontWeight: 700, fontFamily: "'Outfit',sans-serif",
              cursor: forging ? "default" : "pointer",
              background: forging ? "#2a2a3a" : undefined,
              color: forging ? "#6b7280" : "#fff",
              letterSpacing: 0.3,
            }}
          >
            {forging ? "◎ FORGING..." : "⚡ FORGE NOW"}
          </button>
          <button
            onClick={onToggleAuto}
            style={{
              padding: "14px 20px", borderRadius: 10,
              border: `1px solid ${autoForge ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`,
              background: autoForge ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)",
              color: autoForge ? "#ef4444" : "#6b7280",
              fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
              cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {autoForge && <div className="forge-pulse" style={{ width: 6, height: 6 }} />}
            {autoForge ? "AUTO: ON" : "AUTO: OFF"}
          </button>
        </div>

        {autoForge && (
          <div style={{
            fontSize: 10, color: "#ef4444", marginBottom: 12, textAlign: "center",
            fontFamily: "'Outfit',sans-serif", opacity: 0.7,
          }}>
            ⚠ Auto-forging every 90s — uses API credits
          </div>
        )}

        {/* Forge progress */}
        {forgeStatus && (
          <div style={{
            padding: "14px", marginBottom: 12,
            background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.1)",
            borderRadius: 10, position: "relative", overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: 0, left: 0, height: 2,
              background: "linear-gradient(90deg, #ef4444, #f97316)",
              width: `${Math.min(((currentIdx + 1) / stages.length) * 100, 100)}%`,
              transition: "width 0.5s ease",
            }} />
            <div style={{
              display: "flex", justifyContent: "space-between", marginBottom: 10,
              fontSize: 11, fontFamily: "'Outfit',sans-serif",
            }}>
              <span style={{ color: "#ef4444", fontWeight: 700 }}>FORGING</span>
              <span style={{ color: "#6b7280", fontVariantNumeric: "tabular-nums" }}>{elapsed}s</span>
            </div>
            {stages.map((s, i) => {
              const done = i < currentIdx;
              const active = i === currentIdx;
              return (
                <div key={s.key} style={{
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 5,
                  opacity: i > currentIdx ? 0.25 : 1,
                  fontSize: 11, fontFamily: "'IBM Plex Mono',monospace",
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
            padding: "12px 14px", marginBottom: 8,
            background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
            borderRadius: 10, fontSize: 12, color: "#ef4444",
            fontFamily: "'Outfit',sans-serif",
          }}>
            ⚠ {forgeError}
          </div>
        )}
      </div>
    </div>
  );
}
