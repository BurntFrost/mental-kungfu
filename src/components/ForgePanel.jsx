const FORGE_CSS = `
@keyframes forge-orbit { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
@keyframes forge-pulse-glow { 0%, 100% { opacity: 0.3; transform: scale(1); } 50% { opacity: 1; transform: scale(1.15); } }
@keyframes forge-scan { 0% { transform: translateX(-100%); } 100% { transform: translateX(200%); } }
@keyframes forge-node-ping { 0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.4); } 70% { box-shadow: 0 0 0 8px rgba(239,68,68,0); } 100% { box-shadow: 0 0 0 0 rgba(239,68,68,0); } }
@keyframes ember-float {
  0% { transform: translateY(0) scale(1); opacity: 0.7; }
  50% { opacity: 1; }
  100% { transform: translateY(-80px) scale(0); opacity: 0; }
}
@keyframes forge-border-glow {
  0%, 100% { border-color: rgba(239,68,68,0.15); }
  50% { border-color: rgba(239,68,68,0.4); }
}
@keyframes accent-sweep {
  0% { background-position: 0% 50%; }
  100% { background-position: 200% 50%; }
}
@keyframes forge-breathe {
  0%, 100% { box-shadow: 0 0 20px rgba(239,68,68,0.1), 0 0 60px rgba(239,68,68,0.05); }
  50% { box-shadow: 0 0 30px rgba(239,68,68,0.2), 0 0 80px rgba(239,68,68,0.1); }
}
`;

function ForgeGraphic({ forging }) {
  const nodes = [
    { x: 12, y: 25, delay: 0, size: 6 },
    { x: 30, y: 12, delay: 0.3, size: 7 },
    { x: 50, y: 30, delay: 0.1, size: 5 },
    { x: 70, y: 14, delay: 0.6, size: 6 },
    { x: 88, y: 28, delay: 0.9, size: 7 },
    { x: 20, y: 55, delay: 0.4, size: 5 },
    { x: 42, y: 65, delay: 0.2, size: 6 },
    { x: 62, y: 55, delay: 0.7, size: 5 },
    { x: 80, y: 62, delay: 0.5, size: 6 },
  ];
  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [5, 6], [6, 7], [7, 8],
    [1, 6], [2, 7], [3, 8], [5, 2],
  ];

  return (
    <div style={{
      position: "relative", height: 100, overflow: "hidden",
      borderRadius: 14,
      background: "linear-gradient(135deg, rgba(239,68,68,0.06) 0%, rgba(139,92,246,0.04) 50%, rgba(249,115,22,0.05) 100%)",
      border: `1px solid ${forging ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.04)"}`,
      transition: "border-color 0.5s ease",
    }}>
      {/* Ambient gradient mesh */}
      <div style={{
        position: "absolute", inset: 0, opacity: forging ? 0.15 : 0.05,
        background: "radial-gradient(ellipse at 30% 40%, rgba(239,68,68,0.4), transparent 60%), radial-gradient(ellipse at 70% 60%, rgba(249,115,22,0.3), transparent 60%)",
        transition: "opacity 0.6s ease",
      }} />

      {/* Scan line */}
      {forging && (
        <div style={{
          position: "absolute", top: 0, left: 0, width: "35%", height: "100%",
          background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.08), transparent)",
          animation: "forge-scan 2s ease-in-out infinite",
        }} />
      )}

      {/* Connection lines */}
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {connections.map(([a, b], i) => (
          <line
            key={i}
            x1={`${nodes[a].x}%`} y1={`${nodes[a].y}%`}
            x2={`${nodes[b].x}%`} y2={`${nodes[b].y}%`}
            stroke={forging ? "rgba(239,68,68,0.25)" : "rgba(255,255,255,0.05)"}
            strokeWidth="1"
            strokeDasharray={forging ? "none" : "3 4"}
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
            width: node.size, height: node.size, borderRadius: "50%",
            background: forging ? "#ef4444" : "rgba(255,255,255,0.08)",
            transform: "translate(-50%, -50%)",
            transition: "background 0.4s ease, box-shadow 0.4s ease",
            animation: forging ? `forge-node-ping 2s ease-out ${node.delay}s infinite` : "none",
            boxShadow: forging ? `0 0 ${node.size * 2}px rgba(239,68,68,0.3)` : "none",
          }}
        />
      ))}

      {/* Center forge icon */}
      <div style={{
        position: "absolute", left: "50%", top: "50%", transform: "translate(-50%, -50%)",
        width: 42, height: 42, borderRadius: "50%",
        background: forging
          ? "linear-gradient(135deg, rgba(239,68,68,0.3), rgba(249,115,22,0.2))"
          : "rgba(255,255,255,0.03)",
        border: `1.5px solid ${forging ? "rgba(239,68,68,0.4)" : "rgba(255,255,255,0.06)"}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18, transition: "all 0.4s ease",
        animation: forging ? "forge-pulse-glow 2s ease-in-out infinite" : "none",
        boxShadow: forging ? "0 0 24px rgba(239,68,68,0.2)" : "none",
      }}>
        ⚡
      </div>

      {/* Orbit ring */}
      <div style={{
        position: "absolute", left: "50%", top: "50%",
        width: 64, height: 64,
        transform: "translate(-50%, -50%)",
        border: `1px dashed ${forging ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.04)"}`,
        borderRadius: "50%",
        animation: forging ? "forge-orbit 8s linear infinite" : "none",
        transition: "border-color 0.4s ease",
      }}>
        <div style={{
          position: "absolute", top: -3, left: "50%", transform: "translateX(-50%)",
          width: 5, height: 5, borderRadius: "50%",
          background: forging ? "#ef4444" : "transparent",
          boxShadow: forging ? "0 0 8px rgba(239,68,68,0.5)" : "none",
        }} />
      </div>
    </div>
  );
}

function StepIndicator({ steps, forging }) {
  return (
    <div style={{
      display: "flex", alignItems: "flex-start", gap: 0, position: "relative",
    }}>
      {steps.map((step, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
          {/* Connector line */}
          {i < steps.length - 1 && (
            <div style={{
              position: "absolute", top: 16, left: "50%", right: "-50%", height: 1,
              background: `linear-gradient(90deg, rgba(239,68,68,${forging ? 0.3 : 0.08}), rgba(249,115,22,${forging ? 0.2 : 0.06}))`,
              zIndex: 0,
            }} />
          )}
          {/* Step circle */}
          <div style={{
            width: 32, height: 32, borderRadius: "50%", zIndex: 1,
            background: `linear-gradient(135deg, rgba(239,68,68,${forging ? 0.2 : 0.08}), rgba(249,115,22,${forging ? 0.12 : 0.04}))`,
            border: `1.5px solid rgba(239,68,68,${forging ? 0.35 : 0.12})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 14, marginBottom: 8,
            transition: "all 0.4s ease",
          }}>
            {step.icon}
          </div>
          <div style={{
            fontSize: 12, fontWeight: 700, color: "#e5e5ea",
            fontFamily: "'Outfit',sans-serif", marginBottom: 2, textAlign: "center",
          }}>{step.label}</div>
          <div style={{
            fontSize: 10, color: "#4b5563", fontFamily: "'Outfit',sans-serif", textAlign: "center",
            lineHeight: 1.3,
          }}>{step.desc}</div>
        </div>
      ))}
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
        background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <style>{FORGE_CSS}</style>
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 720, position: "relative",
          background: "linear-gradient(180deg, #131320, #0c0c14)",
          borderRadius: "20px 20px 0 0",
          padding: 0,
          animation: "fade-in 0.25s ease-out",
          border: "1px solid rgba(239,68,68,0.08)",
          borderBottom: "none",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.4), 0 -2px 20px rgba(239,68,68,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Top accent bar — animated gradient sweep */}
        <div style={{
          height: 3,
          background: "linear-gradient(90deg, #ef4444, #f97316, #ef4444, #dc2626, #ef4444)",
          backgroundSize: "200% 100%",
          animation: "accent-sweep 4s linear infinite",
        }} />

        {/* Ember particles (decorative) */}
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, overflow: "hidden", pointerEvents: "none" }}>
          {[15, 35, 55, 72, 88].map((x, i) => (
            <div key={i} style={{
              position: "absolute", bottom: 0, left: `${x}%`,
              width: 3, height: 3, borderRadius: "50%",
              background: `rgba(239,68,68,${0.3 + i * 0.1})`,
              animation: `ember-float ${2.5 + i * 0.4}s ease-out ${i * 0.6}s infinite`,
            }} />
          ))}
        </div>

        <div style={{ padding: "20px 24px 32px", position: "relative" }}>
          {/* Drag handle */}
          <div style={{
            width: 40, height: 4, borderRadius: 2,
            background: "rgba(255,255,255,0.08)",
            margin: "0 auto 20px",
          }} />

          {/* Close button */}
          <button
            onClick={onClose}
            style={{
              position: "absolute", top: 20, right: 24,
              background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8, width: 32, height: 32, cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14, color: "#6b7280", transition: "all 0.2s ease",
            }}
          >
            ✕
          </button>

          {/* Title row */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12,
              background: "linear-gradient(135deg, #ef4444, #b91c1c)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, boxShadow: "0 4px 16px rgba(239,68,68,0.25)",
              animation: forging ? "forge-breathe 2s ease-in-out infinite" : "none",
            }}>⚡</div>
            <div>
              <div style={{
                fontSize: 18, fontWeight: 900, color: "#f5f5f7",
                fontFamily: "'Outfit',sans-serif", letterSpacing: 1,
              }}>
                FORGE ENGINE
              </div>
              <div style={{
                fontSize: 11, color: "#ef4444", fontWeight: 600,
                fontFamily: "'Outfit',sans-serif", opacity: 0.7,
                letterSpacing: 0.5,
              }}>
                AI-POWERED LINE GENERATOR
              </div>
            </div>
          </div>

          {/* Divider */}
          <div style={{
            height: 1, margin: "16px 0",
            background: "linear-gradient(90deg, rgba(239,68,68,0.15), rgba(255,255,255,0.03), rgba(249,115,22,0.1))",
          }} />

          {/* Description */}
          <div style={{
            fontSize: 13, color: "#8b8b9e", lineHeight: 1.7,
            fontFamily: "'Outfit',sans-serif", marginBottom: 20,
            maxWidth: 520,
          }}>
            Scans live current events via web search, then generates <span style={{ color: "#e5e5ea", fontWeight: 600 }}>5 fresh tactical one-liners</span> inspired by what's happening in the world right now.
          </div>

          {/* How it works steps — connected */}
          <StepIndicator
            forging={forging}
            steps={[
              { icon: "🔍", label: "Scan", desc: "Search live news" },
              { icon: "🧠", label: "Analyze", desc: "Extract key events" },
              { icon: "⚡", label: "Forge", desc: "Generate 5 lines" },
            ]}
          />

          {/* Spacer */}
          <div style={{ height: 20 }} />

          {/* Neural network graphic */}
          <ForgeGraphic forging={forging} />

          {/* Spacer */}
          <div style={{ height: 20 }} />

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
            <button
              onClick={onForge}
              disabled={forging}
              className={forging ? "" : "shimmer-btn"}
              style={{
                flex: 1, padding: "16px 0", border: "none", borderRadius: 12,
                fontSize: 15, fontWeight: 800, fontFamily: "'Outfit',sans-serif",
                cursor: forging ? "default" : "pointer",
                background: forging ? "rgba(255,255,255,0.04)" : undefined,
                color: forging ? "#6b7280" : "#fff",
                letterSpacing: 0.8,
                boxShadow: forging ? "none" : "0 4px 20px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,255,255,0.1)",
                transition: "all 0.3s ease",
              }}
            >
              {forging ? "◎ FORGING..." : "⚡ FORGE NOW"}
            </button>
            <button
              onClick={onToggleAuto}
              style={{
                padding: "16px 22px", borderRadius: 12,
                border: `1.5px solid ${autoForge ? "rgba(239,68,68,0.35)" : "rgba(255,255,255,0.06)"}`,
                background: autoForge ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.02)",
                color: autoForge ? "#ef4444" : "#6b7280",
                fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 700,
                cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                transition: "all 0.3s ease",
                letterSpacing: 0.5,
                animation: autoForge ? "forge-border-glow 2s ease-in-out infinite" : "none",
              }}
            >
              {autoForge && <div className="forge-pulse" style={{ width: 7, height: 7 }} />}
              {autoForge ? "AUTO: ON" : "AUTO: OFF"}
            </button>
          </div>

          {autoForge && (
            <div style={{
              fontSize: 11, color: "#ef4444", marginBottom: 12, textAlign: "center",
              fontFamily: "'Outfit',sans-serif", opacity: 0.6,
              padding: "8px 12px", borderRadius: 8,
              background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.08)",
            }}>
              ⚠ Auto-forging every 90s — uses API credits
            </div>
          )}

          {/* Forge progress */}
          {forgeStatus && (
            <div style={{
              padding: "16px 18px", marginBottom: 12,
              background: "rgba(239,68,68,0.04)",
              border: "1px solid rgba(239,68,68,0.12)",
              borderRadius: 12, position: "relative", overflow: "hidden",
            }}>
              {/* Progress bar */}
              <div style={{
                position: "absolute", top: 0, left: 0, height: 2,
                background: "linear-gradient(90deg, #ef4444, #f97316)",
                width: `${Math.min(((currentIdx + 1) / stages.length) * 100, 100)}%`,
                transition: "width 0.5s ease",
                boxShadow: "0 0 8px rgba(239,68,68,0.4)",
              }} />
              <div style={{
                display: "flex", justifyContent: "space-between", marginBottom: 12,
                fontSize: 12, fontFamily: "'Outfit',sans-serif",
              }}>
                <span style={{ color: "#ef4444", fontWeight: 800, letterSpacing: 0.5 }}>⚡ FORGING</span>
                <span style={{ color: "#6b7280", fontVariantNumeric: "tabular-nums", fontWeight: 600 }}>{elapsed}s</span>
              </div>
              {stages.map((s, i) => {
                const done = i < currentIdx;
                const active = i === currentIdx;
                return (
                  <div key={s.key} style={{
                    display: "flex", alignItems: "center", gap: 10, marginBottom: 6,
                    opacity: i > currentIdx ? 0.2 : 1,
                    fontSize: 12, fontFamily: "'IBM Plex Mono',monospace",
                    color: done ? "#22c55e" : active ? "#f5f5f7" : "#3a3a4a",
                    transition: "all 0.3s ease",
                  }}>
                    <span style={{
                      width: 18, height: 18, borderRadius: "50%", fontSize: 10,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      background: done ? "rgba(34,197,94,0.15)" : active ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${done ? "rgba(34,197,94,0.3)" : active ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.04)"}`,
                      flexShrink: 0,
                    }}>
                      {done ? "✓" : s.icon}
                    </span>
                    <span>{s.label}{active && "..."}</span>
                  </div>
                );
              })}
            </div>
          )}

          {forgeError && (
            <div style={{
              padding: "14px 16px", marginBottom: 8,
              background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)",
              borderRadius: 12, fontSize: 13, color: "#ef4444",
              fontFamily: "'Outfit',sans-serif", fontWeight: 500,
              display: "flex", alignItems: "center", gap: 8,
            }}>
              <span style={{ fontSize: 16 }}>⚠️</span> {forgeError}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
