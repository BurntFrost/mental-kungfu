import { useState } from "react";

const CORE_SET = [
  { id: 1, line: "You don't like me? Want me to lower the difficulty for your comfort?", category: "Reframe", icon: "↻" },
  { id: 2, line: "I'm not intimidating. You're just underprepared for the room you walked into.", category: "Scale", icon: "△" },
  { id: 3, line: "I don't talk about what I'm going to do. I just let you watch.", category: "Tempo", icon: "◉" },
  { id: 4, line: "You can't put me in a box — I built the warehouse.", category: "Scale", icon: "△" },
  { id: 5, line: "You're not in my way. I just keep forgetting you're here.", category: "Indifference", icon: "◌" },
  { id: 6, line: "Nothing personal. You're just playing a different game at a different difficulty.", category: "Dismissal", icon: "⊘" },
  { id: 7, line: "I don't get even. I get distance. The gap is the punishment.", category: "Stoic", icon: "◇" },
  { id: 8, line: "I already know how this ends — you're still hoping.", category: "Inevitability", icon: "⊞" },
  { id: 9, line: "I don't play the odds. I already see the board.", category: "Control", icon: "⊕" },
  { id: 10, line: "You're not afraid of me. You're afraid of what I prove about you.", category: "Existential", icon: "◈" },
];

const CATEGORIES = {
  "REFRAME": {
    icon: "↻",
    color: "#3b82f6",
    description: "Flip their attack into your advantage",
    archetype: "Harvey Specter — redirect the courtroom",
    lines: [
      "You don't like me? Want me to lower the difficulty for your comfort?",
      "Your criticism is just a map of your limitations.",
      "You didn't offend me. You auditioned — and didn't get a callback.",
      "That was supposed to hurt? Recalibrate.",
      "You tried to expose me. All you did was advertise me.",
      "You think you're testing me. I'm the one grading.",
    ]
  },
  "SCALE": {
    icon: "△",
    color: "#8b5cf6",
    description: "Establish you operate on a different plane",
    archetype: "John Wick — the legend precedes the man",
    lines: [
      "I'm not intimidating. You're just underprepared for the room you walked into.",
      "You can't put me in a box — I built the warehouse.",
      "You brought a ladder. I own the building.",
      "Your ceiling is my foundation.",
      "You measured the room. I designed the blueprint.",
      "You're competing for a seat. I built the table.",
    ]
  },
  "TEMPO": {
    icon: "◉",
    color: "#ef4444",
    description: "Show you're already three moves ahead",
    archetype: "Wick silence — action already in motion",
    lines: [
      "I don't talk about what I'm going to do. I just let you watch.",
      "By the time you understood the move, I'd already made the next three.",
      "You're rehearsing. I'm already in post-production.",
      "You're loading. I've already shipped.",
      "You finished planning. I finished executing. Tuesday.",
      "You're building momentum. I'm already coasting on results.",
    ]
  },
  "INDIFFERENCE": {
    icon: "◌",
    color: "#64748b",
    description: "Erase them from the equation entirely",
    archetype: "Wick walking past the body",
    lines: [
      "You're not in my way. I just keep forgetting you're here.",
      "I'd explain, but I don't onboard tourists.",
      "You're not background noise. Background noise is consistent.",
      "I don't have enemies. I have people I haven't noticed yet.",
      "I didn't ignore you on purpose. You just weren't a variable.",
      "You keep showing up. I keep not adjusting.",
    ]
  },
  "DISMISSAL": {
    icon: "⊘",
    color: "#f59e0b",
    description: "Acknowledge and discard in one breath",
    archetype: "Harvey's 'get out of my office'",
    lines: [
      "Nothing personal. You're just playing a different game at a different difficulty.",
      "I don't punch down. I don't even look down.",
      "You came to compete. I came to collect.",
      "Cute strategy. Did it come with instructions?",
      "Your best move was interesting. My default was better.",
      "That was your A-game? I was warming up the bench.",
    ]
  },
  "STOIC": {
    icon: "◇",
    color: "#06b6d4",
    description: "Weaponize calm. Let stillness do the damage.",
    archetype: "Marcus Aurelius energy — the emperor doesn't flinch",
    lines: [
      "I don't get even. I get distance. The gap is the punishment.",
      "Your chaos isn't my emergency.",
      "I don't react. I adjust. There's a difference you'll learn too late.",
      "Pressure doesn't build diamonds. Discipline does. I'm the proof.",
      "I removed you from the equation. The math got better.",
      "Your turbulence is not my weather.",
    ]
  },
  "INEVITABILITY": {
    icon: "⊞",
    color: "#10b981",
    description: "Frame the outcome as already decided",
    archetype: "Wick's pencil — it was always going to end this way",
    lines: [
      "I already know how this ends — you're still hoping.",
      "This isn't a contest. It's a schedule — and you're not on it.",
      "You're still in the negotiation phase. I'm in the delivery phase.",
      "I don't rush because the outcome already has my name on it.",
      "The result was decided before you entered the room. I just haven't filed the paperwork.",
      "I don't race. I set the finish line.",
    ]
  },
  "CONTROL": {
    icon: "⊕",
    color: "#ec4899",
    description: "Demonstrate mastery over the system itself",
    archetype: "Tyler Durden — you don't own the rules, I rewrote them",
    lines: [
      "I don't play the odds. I already see the board.",
      "You follow the playbook. I write the errata.",
      "You learned the rules. I designed the constraints.",
      "You found a loophole. I built the loop.",
      "You're playing chess. I'm playing the chess player.",
      "The game changed. You weren't notified.",
    ]
  },
  "EXISTENTIAL": {
    icon: "◈",
    color: "#f43f5e",
    description: "Turn their own mind against them",
    archetype: "Tyler Durden — the mirror that fights back",
    lines: [
      "You're not afraid of me. You're afraid of what I prove about you.",
      "I didn't break your confidence. I just showed you where it was already cracked.",
      "You don't hate me. You hate that I'm the standard you can't meet.",
      "Every time you doubt me, you're really confessing about yourself.",
      "I'm not your enemy. I'm the mirror you keep trying to walk past.",
      "You wanted to find my weakness. You found your own instead.",
    ]
  },
  "IDENTITY": {
    icon: "⬡",
    color: "#a855f7",
    description: "Define yourself so completely they can't",
    archetype: "All three — Wick's reputation, Durden's philosophy, Harvey's brand",
    lines: [
      "I'm not motivated. I'm engineered.",
      "I wasn't built for comfort. I was built for output.",
      "I don't have a backup plan. The first one works.",
      "I'm not lucky. I'm what prepared looks like from the outside.",
      "I don't fit in. I was never designed to.",
      "They didn't make me. I compiled myself.",
    ]
  }
};

const TAB_CORE = "core";
const TAB_DECK = "deck";

export default function MentalKungFu() {
  const [tab, setTab] = useState(TAB_CORE);
  const [expandedCat, setExpandedCat] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  const copyLine = (line, id) => {
    navigator.clipboard.writeText(line).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(180deg, #0a0a0f 0%, #111118 50%, #0d0d14 100%)",
      color: "#e2e2e8",
      fontFamily: "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace",
      padding: "0",
      overflowX: "hidden",
    }}>
      <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />

      {/* HEADER */}
      <div style={{
        padding: "40px 24px 20px",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
          background: "radial-gradient(ellipse at 20% 0%, rgba(239,68,68,0.06) 0%, transparent 60%), radial-gradient(ellipse at 80% 0%, rgba(139,92,246,0.06) 0%, transparent 60%)",
        }} />
        <div style={{ position: "relative", maxWidth: 720, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 12, marginBottom: 8,
            fontFamily: "'Inter', sans-serif",
          }}>
            <div style={{
              width: 36, height: 36,
              background: "linear-gradient(135deg, #ef4444, #8b5cf6)",
              borderRadius: 8,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 18, fontWeight: 800, color: "#fff",
              boxShadow: "0 0 20px rgba(239,68,68,0.3)",
            }}>功</div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: 3, color: "#6b7280", textTransform: "uppercase" }}>
                Mental Kung Fu
              </div>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#f5f5f7", letterSpacing: -0.5 }}>
                Tactical Reference
              </div>
            </div>
          </div>
          <div style={{ fontSize: 11, color: "#4b5563", letterSpacing: 1, marginTop: 12, textTransform: "uppercase" }}>
            v2.0 — locked core ∙ 10 categories ∙ 60 lines ∙ field ready
          </div>
        </div>
      </div>

      {/* TABS */}
      <div style={{
        display: "flex", gap: 0,
        maxWidth: 720, margin: "0 auto",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
      }}>
        {[
          { id: TAB_CORE, label: "CORE 10", count: 10 },
          { id: TAB_DECK, label: "FULL DECK", count: Object.values(CATEGORIES).reduce((a, c) => a + c.lines.length, 0) },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "16px 0", border: "none", cursor: "pointer",
            background: "transparent", color: tab === t.id ? "#f5f5f7" : "#4b5563",
            fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 700,
            letterSpacing: 2, textTransform: "uppercase",
            borderBottom: tab === t.id ? "2px solid #ef4444" : "2px solid transparent",
            transition: "all 0.2s ease",
          }}>
            {t.label}
            <span style={{
              marginLeft: 8, padding: "2px 7px", borderRadius: 4, fontSize: 10,
              background: tab === t.id ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.04)",
              color: tab === t.id ? "#ef4444" : "#6b7280",
            }}>{t.count}</span>
          </button>
        ))}
      </div>

      {/* CONTENT */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "20px 24px 60px" }}>

        {/* CORE 10 */}
        {tab === TAB_CORE && (
          <div>
            <div style={{
              padding: "16px 20px", marginBottom: 24,
              background: "rgba(239,68,68,0.04)",
              border: "1px solid rgba(239,68,68,0.1)",
              borderRadius: 10, fontSize: 12, color: "#9ca3af",
              fontFamily: "'Inter', sans-serif", lineHeight: 1.6,
            }}>
              <span style={{ color: "#ef4444", fontWeight: 700 }}>LOCKED SET</span> — The primary arsenal. Each line covers a distinct psychological vector. Tap to copy.
            </div>

            {CORE_SET.map((item, i) => {
              const cat = CATEGORIES[item.category.toUpperCase()] || { color: "#666" };
              const isCopied = copiedId === `core-${item.id}`;
              return (
                <div key={item.id}
                  onClick={() => copyLine(item.line, `core-${item.id}`)}
                  style={{
                    display: "flex", gap: 16, alignItems: "flex-start",
                    padding: "18px 20px", marginBottom: 8,
                    background: isCopied ? "rgba(16,185,129,0.08)" : "rgba(255,255,255,0.02)",
                    border: `1px solid ${isCopied ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.04)"}`,
                    borderRadius: 10, cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                  onMouseEnter={e => { if (!isCopied) { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.borderColor = `${cat.color}33`; }}}
                  onMouseLeave={e => { if (!isCopied) { e.currentTarget.style.background = "rgba(255,255,255,0.02)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.04)"; }}}
                >
                  <div style={{
                    minWidth: 36, height: 36, borderRadius: 8,
                    background: `${cat.color}15`,
                    border: `1px solid ${cat.color}30`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 800,
                    color: cat.color,
                  }}>
                    {String(item.id).padStart(2, "0")}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontFamily: "'Inter', sans-serif",
                      fontSize: 15, fontWeight: 500, color: "#e5e5ea",
                      lineHeight: 1.5, marginBottom: 8,
                    }}>
                      "{item.line}"
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 600, letterSpacing: 1.5,
                        color: cat.color, textTransform: "uppercase",
                        padding: "3px 8px", borderRadius: 4,
                        background: `${cat.color}12`,
                      }}>
                        {item.icon} {item.category}
                      </span>
                      {isCopied && (
                        <span style={{ fontSize: 10, color: "#10b981", fontWeight: 600, letterSpacing: 1 }}>
                          ✓ COPIED
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* FULL DECK */}
        {tab === TAB_DECK && (
          <div>
            <div style={{
              padding: "16px 20px", marginBottom: 24,
              background: "rgba(139,92,246,0.04)",
              border: "1px solid rgba(139,92,246,0.1)",
              borderRadius: 10, fontSize: 12, color: "#9ca3af",
              fontFamily: "'Inter', sans-serif", lineHeight: 1.6,
            }}>
              <span style={{ color: "#8b5cf6", fontWeight: 700 }}>EXPANDED ARSENAL</span> — 10 categories × 6 lines each. Core lines marked with ◆. Tap any category to expand. Tap a line to copy.
            </div>

            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const isOpen = expandedCat === key;
              const coreLines = CORE_SET.filter(c => c.category.toUpperCase() === key).map(c => c.line);

              return (
                <div key={key} style={{ marginBottom: 6 }}>
                  <div
                    onClick={() => setExpandedCat(isOpen ? null : key)}
                    style={{
                      display: "flex", alignItems: "center", gap: 14,
                      padding: "16px 20px",
                      background: isOpen ? `${cat.color}08` : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isOpen ? `${cat.color}25` : "rgba(255,255,255,0.04)"}`,
                      borderRadius: isOpen ? "10px 10px 0 0" : 10,
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={e => { if (!isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (!isOpen) e.currentTarget.style.background = "rgba(255,255,255,0.02)"; }}
                  >
                    <div style={{
                      width: 32, height: 32, borderRadius: 7,
                      background: `${cat.color}18`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 16, color: cat.color,
                    }}>{cat.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13, fontWeight: 700, color: "#e5e5ea",
                        letterSpacing: 0.5,
                      }}>{key}</div>
                      <div style={{ fontSize: 11, color: "#6b7280", marginTop: 2, fontFamily: "'Inter', sans-serif" }}>
                        {cat.description}
                      </div>
                    </div>
                    <div style={{
                      fontSize: 10, color: "#4b5563", fontWeight: 600,
                      padding: "3px 8px", borderRadius: 4,
                      background: "rgba(255,255,255,0.04)",
                    }}>{cat.lines.length}</div>
                    <div style={{
                      color: "#4b5563", fontSize: 14, transition: "transform 0.2s",
                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                    }}>▾</div>
                  </div>

                  {isOpen && (
                    <div style={{
                      background: `${cat.color}04`,
                      border: `1px solid ${cat.color}15`,
                      borderTop: "none",
                      borderRadius: "0 0 10px 10px",
                      padding: "8px 0",
                    }}>
                      <div style={{
                        padding: "8px 20px 12px",
                        fontSize: 10, color: "#6b7280",
                        fontFamily: "'Inter', sans-serif",
                        fontStyle: "italic",
                        borderBottom: `1px solid ${cat.color}10`,
                        marginBottom: 4,
                      }}>
                        Archetype: {cat.archetype}
                      </div>

                      {cat.lines.map((line, li) => {
                        const isCore = coreLines.includes(line);
                        const lineId = `deck-${key}-${li}`;
                        const isCopied = copiedId === lineId;

                        return (
                          <div key={li}
                            onClick={() => copyLine(line, lineId)}
                            style={{
                              padding: "12px 20px 12px 52px",
                              position: "relative",
                              cursor: "pointer",
                              background: isCopied ? "rgba(16,185,129,0.08)" : "transparent",
                              transition: "background 0.15s ease",
                            }}
                            onMouseEnter={e => { if (!isCopied) e.currentTarget.style.background = `${cat.color}08`; }}
                            onMouseLeave={e => { if (!isCopied) e.currentTarget.style.background = isCopied ? "rgba(16,185,129,0.08)" : "transparent"; }}
                          >
                            <span style={{
                              position: "absolute", left: 20, top: 14,
                              fontSize: 10, fontWeight: 700, color: isCore ? cat.color : "#4b5563",
                            }}>
                              {isCore ? "◆" : "○"}
                            </span>
                            <div style={{
                              fontFamily: "'Inter', sans-serif",
                              fontSize: 13, color: isCore ? "#e5e5ea" : "#b0b0b8",
                              fontWeight: isCore ? 500 : 400,
                              lineHeight: 1.5,
                            }}>
                              "{line}"
                            </div>
                            {isCopied && (
                              <span style={{
                                position: "absolute", right: 20, top: 14,
                                fontSize: 10, color: "#10b981", fontWeight: 600,
                              }}>✓</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
