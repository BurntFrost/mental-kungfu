import { useState, useEffect, useRef, useCallback, useMemo } from "react";

/* ═══════════════════════════════════════════════════════════
   DATA — CORE SET + EXPANDED DECK
   ═══════════════════════════════════════════════════════════ */

const CORE_SET = [
  { id: 1, line: "You don't like me? Want me to lower the difficulty for your comfort?", category: "REFRAME" },
  { id: 2, line: "I'm not intimidating. You're just underprepared for the room you walked into.", category: "SCALE" },
  { id: 3, line: "I don't talk about what I'm going to do. I just let you watch.", category: "TEMPO" },
  { id: 4, line: "You can't put me in a box — I built the warehouse.", category: "SCALE" },
  { id: 5, line: "You're not in my way. I just keep forgetting you're here.", category: "INDIFFERENCE" },
  { id: 6, line: "Nothing personal. You're just playing a different game at a different difficulty.", category: "DISMISSAL" },
  { id: 7, line: "I don't get even. I get distance. The gap is the punishment.", category: "STOIC" },
  { id: 8, line: "I already know how this ends — you're still hoping.", category: "INEVITABILITY" },
  { id: 9, line: "I don't play the odds. I already see the board.", category: "CONTROL" },
  { id: 10, line: "You're not afraid of me. You're afraid of what I prove about you.", category: "EXISTENTIAL" },
];

const CATEGORIES = {
  REFRAME: { icon: "↻", color: "#3b82f6", desc: "Flip their attack into your advantage", archetype: "Harvey Specter — redirect the courtroom", lines: [
    "You don't like me? Want me to lower the difficulty for your comfort?",
    "Your criticism is just a map of your limitations.",
    "You didn't offend me. You auditioned — and didn't get a callback.",
    "That was supposed to hurt? Recalibrate.",
    "You tried to expose me. All you did was advertise me.",
    "You think you're testing me. I'm the one grading.",
  ]},
  SCALE: { icon: "△", color: "#8b5cf6", desc: "Establish you operate on a different plane", archetype: "John Wick — the legend precedes the man", lines: [
    "I'm not intimidating. You're just underprepared for the room you walked into.",
    "You can't put me in a box — I built the warehouse.",
    "You brought a ladder. I own the building.",
    "Your ceiling is my foundation.",
    "You measured the room. I designed the blueprint.",
    "You're competing for a seat. I built the table.",
  ]},
  TEMPO: { icon: "◉", color: "#ef4444", desc: "Show you're already three moves ahead", archetype: "Wick silence — action already in motion", lines: [
    "I don't talk about what I'm going to do. I just let you watch.",
    "By the time you understood the move, I'd already made the next three.",
    "You're rehearsing. I'm already in post-production.",
    "You're loading. I've already shipped.",
    "You finished planning. I finished executing. Tuesday.",
    "You're building momentum. I'm already coasting on results.",
  ]},
  INDIFFERENCE: { icon: "◌", color: "#64748b", desc: "Erase them from the equation entirely", archetype: "Wick walking past the body", lines: [
    "You're not in my way. I just keep forgetting you're here.",
    "I'd explain, but I don't onboard tourists.",
    "You're not background noise. Background noise is consistent.",
    "I don't have enemies. I have people I haven't noticed yet.",
    "I didn't ignore you on purpose. You just weren't a variable.",
    "You keep showing up. I keep not adjusting.",
  ]},
  DISMISSAL: { icon: "⊘", color: "#f59e0b", desc: "Acknowledge and discard in one breath", archetype: "Harvey's 'get out of my office'", lines: [
    "Nothing personal. You're just playing a different game at a different difficulty.",
    "I don't punch down. I don't even look down.",
    "You came to compete. I came to collect.",
    "Cute strategy. Did it come with instructions?",
    "Your best move was interesting. My default was better.",
    "That was your A-game? I was warming up the bench.",
  ]},
  STOIC: { icon: "◇", color: "#06b6d4", desc: "Weaponize calm. Stillness does the damage.", archetype: "Marcus Aurelius — the emperor doesn't flinch", lines: [
    "I don't get even. I get distance. The gap is the punishment.",
    "Your chaos isn't my emergency.",
    "I don't react. I adjust. There's a difference you'll learn too late.",
    "Pressure doesn't build diamonds. Discipline does. I'm the proof.",
    "I removed you from the equation. The math got better.",
    "Your turbulence is not my weather.",
  ]},
  INEVITABILITY: { icon: "⊞", color: "#10b981", desc: "Frame the outcome as already decided", archetype: "Wick's pencil — always going to end this way", lines: [
    "I already know how this ends — you're still hoping.",
    "This isn't a contest. It's a schedule — and you're not on it.",
    "You're still in the negotiation phase. I'm in the delivery phase.",
    "I don't rush because the outcome already has my name on it.",
    "The result was decided before you entered the room. I just haven't filed the paperwork.",
    "I don't race. I set the finish line.",
  ]},
  CONTROL: { icon: "⊕", color: "#ec4899", desc: "Mastery over the system itself", archetype: "Tyler Durden — I rewrote the rules", lines: [
    "I don't play the odds. I already see the board.",
    "You follow the playbook. I write the errata.",
    "You learned the rules. I designed the constraints.",
    "You found a loophole. I built the loop.",
    "You're playing chess. I'm playing the chess player.",
    "The game changed. You weren't notified.",
  ]},
  EXISTENTIAL: { icon: "◈", color: "#f43f5e", desc: "Turn their own mind against them", archetype: "Tyler Durden — the mirror that fights back", lines: [
    "You're not afraid of me. You're afraid of what I prove about you.",
    "I didn't break your confidence. I just showed you where it was already cracked.",
    "You don't hate me. You hate that I'm the standard you can't meet.",
    "Every time you doubt me, you're really confessing about yourself.",
    "I'm not your enemy. I'm the mirror you keep trying to walk past.",
    "You wanted to find my weakness. You found your own instead.",
  ]},
  IDENTITY: { icon: "⬡", color: "#a855f7", desc: "Define yourself so completely they can't", archetype: "Wick + Durden + Harvey — reputation, philosophy, brand", lines: [
    "I'm not motivated. I'm engineered.",
    "I wasn't built for comfort. I was built for output.",
    "I don't have a backup plan. The first one works.",
    "I'm not lucky. I'm what prepared looks like from the outside.",
    "I don't fit in. I was never designed to.",
    "They didn't make me. I compiled myself.",
  ]},
};

const CAT_KEYS = Object.keys(CATEGORIES);

/* ═══════════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════════ */

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

:root {
  --bg-0: #08080c; --bg-1: #0e0e14; --bg-2: #14141c; --bg-3: #1a1a24;
  --text-0: #f0f0f5; --text-1: #c0c0cc; --text-2: #808098; --text-3: #50506a;
  --red: #ef4444; --red-dim: rgba(239,68,68,0.12);
  --accent: #ef4444;
}

body { background: var(--bg-0); color: var(--text-1); }

@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.8); opacity: 0; }
}
@keyframes scan-line {
  0% { transform: translateY(-100%); }
  100% { transform: translateY(100vh); }
}
@keyframes fade-in {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
@keyframes breathe {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 1; }
}
@keyframes toast-in {
  from { opacity: 0; transform: translateY(20px) scale(0.95); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}
@keyframes toast-out {
  from { opacity: 1; transform: translateY(0) scale(1); }
  to { opacity: 0; transform: translateY(-10px) scale(0.95); }
}

.fade-in { animation: fade-in 0.35s ease-out both; }
.scan-line::after {
  content: ''; position: fixed; top: 0; left: 0; right: 0; height: 2px;
  background: linear-gradient(90deg, transparent, rgba(239,68,68,0.15), transparent);
  animation: scan-line 8s linear infinite; pointer-events: none; z-index: 0;
}

.line-card {
  transition: all 0.2s ease;
  cursor: pointer;
  position: relative;
}
.line-card:hover {
  background: rgba(255,255,255,0.04) !important;
}
.line-card:active {
  transform: scale(0.985);
}
.line-card:focus-visible {
  outline: 2px solid var(--red);
  outline-offset: -2px;
  border-radius: 10px;
}

.forge-pulse {
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--red);
  position: relative;
}
.forge-pulse::after {
  content: ''; position: absolute; inset: -3px; border-radius: 50%;
  border: 1px solid var(--red);
  animation: pulse-ring 2s ease-out infinite;
}

.shimmer-btn {
  background: linear-gradient(90deg, #ef4444, #dc2626, #b91c1c, #dc2626, #ef4444);
  background-size: 200% 100%;
  animation: shimmer 3s ease-in-out infinite;
}

.neural-dot {
  animation: breathe 2s ease-in-out infinite;
}

.cat-accordion {
  transition: all 0.25s ease;
  overflow: hidden;
}

/* Tab buttons */
.tab-btn {
  flex: 1; padding: 14px 0; border: none; cursor: pointer;
  background: transparent;
  font-family: 'Outfit', sans-serif; font-size: 12px; font-weight: 700;
  letter-spacing: 2px; text-transform: uppercase;
  border-bottom: 2px solid transparent;
  transition: all 0.2s;
  display: flex; align-items: center; justify-content: center; gap: 6px;
}
.tab-btn:focus-visible {
  outline: 2px solid var(--red);
  outline-offset: -2px;
}
.tab-btn--active {
  color: #f5f5f7 !important;
  border-bottom-color: #ef4444 !important;
  background: rgba(239,68,68,0.04) !important;
}
.tab-btn--inactive {
  color: #4b5563;
}
.tab-btn--inactive:hover {
  color: #9ca3af;
  background: rgba(255,255,255,0.02);
}

/* Save button */
.save-btn {
  background: none; border: none; cursor: pointer;
  font-size: 16px; padding: 4px 6px; flex-shrink: 0;
  transition: all 0.15s;
}
.save-btn:hover {
  transform: scale(1.2);
}
.save-btn:focus-visible {
  outline: 2px solid #f59e0b;
  outline-offset: 2px;
  border-radius: 4px;
}

/* Category header */
.cat-header {
  display: flex; align-items: center; gap: 12px;
  padding: 14px 16px; cursor: pointer;
  transition: all 0.2s;
}
.cat-header:hover {
  background: rgba(255,255,255,0.03) !important;
}
.cat-header:focus-visible {
  outline: 2px solid var(--red);
  outline-offset: -2px;
  border-radius: 10px;
}

/* Deck line */
.deck-line {
  padding: 10px 16px 10px 44px;
  position: relative;
  cursor: pointer;
  transition: background 0.15s;
}
.deck-line:hover {
  background: rgba(255,255,255,0.03);
}
.deck-line:focus-visible {
  outline: 2px solid var(--red);
  outline-offset: -2px;
}

/* Forge action buttons */
.forge-btn {
  border: none; border-radius: 8px;
  font-family: 'Outfit', sans-serif; font-weight: 700;
  letter-spacing: 1px; cursor: pointer;
  transition: all 0.2s;
}
.forge-btn:focus-visible {
  outline: 2px solid var(--red);
  outline-offset: 2px;
}
.forge-btn:disabled {
  cursor: wait;
}

/* Toast notification */
.toast {
  position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%);
  z-index: 1000;
  animation: toast-in 0.25s ease-out both;
}
.toast--exit {
  animation: toast-out 0.2s ease-in both;
}

/* Search input */
.search-input {
  width: 100%; padding: 10px 14px 10px 36px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px;
  color: #e8e8f0;
  font-family: 'Outfit', sans-serif; font-size: 13px;
  outline: none;
  transition: border-color 0.2s, background 0.2s;
}
.search-input:focus {
  border-color: rgba(239,68,68,0.3);
  background: rgba(255,255,255,0.05);
}
.search-input::placeholder {
  color: #3a3a4a;
}

/* Clear batch button */
.clear-batch-btn {
  background: none; border: none; cursor: pointer;
  font-size: 9px; color: #3a3a4a; padding: 2px 6px;
  border-radius: 3px; transition: all 0.15s;
  font-family: 'Outfit', sans-serif; font-weight: 600;
}
.clear-batch-btn:hover {
  color: #ef4444;
  background: rgba(239,68,68,0.08);
}

/* Responsive */
@media (max-width: 480px) {
  .stats-strip { gap: 10px !important; flex-wrap: wrap; }
  .header-inner { padding: 24px 16px 14px !important; }
  .content-area { padding: 12px 14px 80px !important; }
  .line-card { padding: 12px 14px !important; }
  .forge-controls { flex-direction: column !important; }
}

::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }
`;

/* ═══════════════════════════════════════════════════════════
   STORAGE HELPERS — localStorage
   ═══════════════════════════════════════════════════════════ */

function loadForged() {
  try {
    const raw = localStorage.getItem("forged-lines");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveForged(lines) {
  try {
    localStorage.setItem("forged-lines", JSON.stringify(lines));
  } catch (e) { console.error("Storage save error:", e); }
}

function loadSaved() {
  try {
    const raw = localStorage.getItem("saved-lines");
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

function saveSavedLines(lines) {
  try {
    localStorage.setItem("saved-lines", JSON.stringify(lines));
  } catch (e) { console.error("Storage save error:", e); }
}

/* ═══════════════════════════════════════════════════════════
   API — FORGE ENGINE
   ═══════════════════════════════════════════════════════════ */

function loadApiKey() {
  try { return localStorage.getItem("anthropic-api-key") || ""; } catch { return ""; }
}

function saveApiKey(key) {
  try { localStorage.setItem("anthropic-api-key", key); } catch {}
}

async function forgeNewLines(apiKey) {
  if (!apiKey) {
    throw new Error("API key required. Enter your Anthropic API key in the settings below.");
  }

  const catList = CAT_KEYS.join(", ");
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `You are a tactical mindset coach who creates cold, surgical, confident one-liners in the style of John Wick, Tyler Durden, and Harvey Specter.

STEP 1: Search for today's most interesting current events, news headlines, trending topics, or cultural moments.

STEP 2: Generate exactly 5 aggressive one-liner "mental kung fu" lines INSPIRED BY specific events you found. The lines should:
- Be cold, surgical, confident — never loud or angry
- Weaponize the metaphor from the current event — don't just comment on the news
- Work as standalone statements without needing to know the news context
- Be under 20 words each
- Each belong to a different category from: ${catList}

STEP 3: Return ONLY valid JSON with no markdown formatting, no backticks, no preamble. Just raw JSON:
{"events":[{"headline":"short headline","source":"source name"}],"lines":[{"line":"the one-liner","category":"CATEGORY_NAME","inspired_by":"which headline inspired this"}]}`
      }]
    })
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`API error ${response.status}: ${errBody.slice(0, 100)}`);
  }

  const data = await response.json();

  const textBlocks = (data.content || [])
    .filter(item => item.type === "text")
    .map(item => item.text)
    .join("\n");

  let parsed;
  try {
    parsed = JSON.parse(textBlocks.trim());
  } catch {
    const jsonMatch = textBlocks.match(/\{[\s\S]*"lines"[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Could not parse forge response");
    }
  }

  return parsed;
}

/* ═══════════════════════════════════════════════════════════
   COMPONENTS
   ═══════════════════════════════════════════════════════════ */

function Toast({ message, visible }) {
  if (!message) return null;
  return (
    <div className={`toast ${visible ? "" : "toast--exit"}`}>
      <div style={{
        padding: "10px 20px",
        background: "rgba(16,185,129,0.95)",
        borderRadius: 8,
        fontSize: 12,
        fontWeight: 600,
        color: "#fff",
        fontFamily: "'Outfit',sans-serif",
        boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        gap: 8,
      }}>
        <span>✓</span> {message}
      </div>
    </div>
  );
}

function LineCard({ line, category, index, onCopy, copied, onSave, saved, extra, forged }) {
  const cat = CATEGORIES[category] || { icon: "●", color: "#888" };
  return (
    <div className="line-card" onClick={() => onCopy(line)}
      tabIndex={0}
      role="button"
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCopy(line); } }}
      style={{
        display: "flex", gap: 14, alignItems: "flex-start",
        padding: "16px 18px", marginBottom: 6,
        background: copied ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.015)",
        border: `1px solid ${copied ? "rgba(16,185,129,0.2)" : "rgba(255,255,255,0.04)"}`,
        borderRadius: 10,
      }}>
      <div style={{
        minWidth: 34, height: 34, borderRadius: 7,
        background: `${cat.color}14`, border: `1px solid ${cat.color}28`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontFamily: "'Outfit',sans-serif", fontSize: 13, fontWeight: 800, color: cat.color,
        flexShrink: 0,
      }}>
        {index !== undefined ? cat.icon : cat.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 500,
          color: "#e8e8f0", lineHeight: 1.55, marginBottom: 8,
        }}>
          &ldquo;{line}&rdquo;
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <span style={{
            fontSize: 9, fontWeight: 700, letterSpacing: 1.5, color: cat.color,
            textTransform: "uppercase", padding: "2px 7px", borderRadius: 3,
            background: `${cat.color}10`,
          }}>{cat.icon} {category}</span>
          {forged && <span style={{
            fontSize: 9, fontWeight: 600, letterSpacing: 1, color: "#ef4444",
            padding: "2px 7px", borderRadius: 3, background: "rgba(239,68,68,0.08)",
          }}>⚡ FORGED</span>}
          {extra && <span style={{
            fontSize: 9, color: "#6b7280", fontStyle: "italic",
          }}>{extra}</span>}
          {copied && <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700, letterSpacing: 1 }}>✓ COPIED</span>}
        </div>
      </div>
      {onSave && (
        <button onClick={(e) => { e.stopPropagation(); onSave(line, category); }}
          className="save-btn"
          style={{ color: saved ? "#f59e0b" : "#3a3a4a" }}
          title={saved ? "Remove from saved" : "Save to collection"}
          aria-label={saved ? "Remove from saved" : "Save to collection"}>
          {saved ? "★" : "☆"}
        </button>
      )}
    </div>
  );
}

function NeuralActivity({ active }) {
  return (
    <div style={{ display: "flex", gap: 3, alignItems: "center", height: 14 }}>
      {[0, 0.3, 0.6, 0.9, 1.2].map((d, i) => (
        <div key={i} className="neural-dot" style={{
          width: 3, height: active ? [8, 14, 6, 12, 9][i] : 3,
          borderRadius: 2, background: active ? "#ef4444" : "#2a2a3a",
          animationDelay: `${d}s`, transition: "height 0.3s, background 0.3s",
        }} />
      ))}
    </div>
  );
}

function SearchBar({ value, onChange, placeholder }) {
  return (
    <div style={{ position: "relative", marginBottom: 16 }}>
      <span style={{
        position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
        fontSize: 14, color: "#3a3a4a", pointerEvents: "none",
      }}>⌕</span>
      <input
        type="text"
        className="search-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button onClick={() => onChange("")} style={{
          position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
          background: "none", border: "none", color: "#6b7280", cursor: "pointer",
          fontSize: 14, padding: "2px 4px",
        }} aria-label="Clear search">✕</button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN APP
   ═══════════════════════════════════════════════════════════ */

const TABS = ["CORE", "DECK", "SAVED", "FORGE"];

export default function MentalKungFuApp() {
  const [tab, setTab] = useState("CORE");
  const [copiedId, setCopiedId] = useState(null);
  const [expandedCats, setExpandedCats] = useState(new Set());
  const [search, setSearch] = useState("");

  // Toast state
  const [toast, setToast] = useState({ message: "", visible: false });
  const toastTimer = useRef(null);

  // Forge state
  const [forgedBatches, setForgedBatches] = useState([]);
  const [savedLines, setSavedLines] = useState([]);
  const [forging, setForging] = useState(false);
  const [forgeError, setForgeError] = useState(null);
  const [autoForge, setAutoForge] = useState(false);
  const [forgeCount, setForgeCount] = useState(0);
  const [storageReady, setStorageReady] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [showKeyInput, setShowKeyInput] = useState(false);
  const autoRef = useRef(null);

  // Load persisted data synchronously from localStorage
  useEffect(() => {
    setForgedBatches(loadForged());
    setSavedLines(loadSaved());
    setApiKey(loadApiKey());
    setStorageReady(true);
  }, []);

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, visible: true });
    toastTimer.current = setTimeout(() => {
      setToast(prev => ({ ...prev, visible: false }));
      setTimeout(() => setToast({ message: "", visible: false }), 200);
    }, 2000);
  }, []);

  const copyLine = useCallback((line, id) => {
    navigator.clipboard.writeText(line).then(() => {
      setCopiedId(id);
      showToast("Copied to clipboard");
      setTimeout(() => setCopiedId(null), 2500);
    });
  }, [showToast]);

  const saveLine = useCallback((line, category) => {
    setSavedLines(prev => {
      const exists = prev.some(s => s.line === line);
      const next = exists ? prev.filter(s => s.line !== line) : [...prev, { line, category, savedAt: Date.now() }];
      saveSavedLines(next);
      if (!exists) showToast("Saved to collection");
      return next;
    });
  }, [showToast]);

  const isLineSaved = useCallback((line) => savedLines.some(s => s.line === line), [savedLines]);

  const toggleCat = useCallback((key) => {
    setExpandedCats(prev => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const expandAllCats = useCallback(() => {
    setExpandedCats(prev => {
      if (prev.size === CAT_KEYS.length) return new Set();
      return new Set(CAT_KEYS);
    });
  }, []);

  // Forge engine
  const runForge = useCallback(async () => {
    if (forging) return;
    setForging(true);
    setForgeError(null);
    try {
      const result = await forgeNewLines(apiKey);
      const batch = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        events: result.events || [],
        lines: (result.lines || []).map((l, i) => ({
          ...l,
          id: `${Date.now()}-${i}`,
          category: (l.category || "REFRAME").toUpperCase(),
        })),
      };
      setForgedBatches(prev => {
        const next = [batch, ...prev].slice(0, 20);
        saveForged(next);
        return next;
      });
      setForgeCount(c => c + 1);
      showToast(`Forged ${batch.lines.length} new lines`);
    } catch (err) {
      setForgeError(err.message || "Forge failed");
    }
    setForging(false);
  }, [forging, showToast, apiKey]);

  const deleteBatch = useCallback((batchId) => {
    setForgedBatches(prev => {
      const next = prev.filter(b => b.id !== batchId);
      saveForged(next);
      return next;
    });
    showToast("Batch removed");
  }, [showToast]);

  const clearAllBatches = useCallback(() => {
    setForgedBatches([]);
    saveForged([]);
    showToast("All forged lines cleared");
  }, [showToast]);

  // Auto-forge interval
  useEffect(() => {
    if (autoForge) {
      runForge();
      autoRef.current = setInterval(runForge, 90000);
      return () => clearInterval(autoRef.current);
    } else {
      clearInterval(autoRef.current);
    }
  }, [autoForge, runForge]);

  const totalForgedLines = forgedBatches.reduce((a, b) => a + b.lines.length, 0);

  // Filter lines by search
  const filterLine = useCallback((line) => {
    if (!search) return true;
    return line.toLowerCase().includes(search.toLowerCase());
  }, [search]);

  const filteredCore = useMemo(
    () => CORE_SET.filter(item => filterLine(item.line)),
    [filterLine]
  );

  const filteredSaved = useMemo(
    () => savedLines.filter(item => filterLine(item.line)),
    [savedLines, filterLine]
  );

  return (
    <div className="scan-line" style={{
      minHeight: "100vh", background: "var(--bg-0)",
      fontFamily: "'IBM Plex Mono', monospace",
    }}>
      <style>{CSS}</style>
      <Toast message={toast.message} visible={toast.visible} />

      {/* ── HEADER ── */}
      <div className="header-inner" style={{
        padding: "32px 20px 16px", position: "relative",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
        background: "linear-gradient(180deg, rgba(239,68,68,0.03) 0%, transparent 100%)",
      }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 900, color: "#fff",
              boxShadow: "0 0 30px rgba(239,68,68,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
              fontFamily: "'Outfit',sans-serif",
            }}>功</div>
            <div>
              <div style={{
                fontFamily: "'Outfit',sans-serif", fontSize: 22, fontWeight: 800,
                color: "#f5f5f7", letterSpacing: -0.5, lineHeight: 1.1,
              }}>Mental Kung Fu</div>
              <div style={{ fontSize: 10, color: "#4b5563", letterSpacing: 2, marginTop: 3, textTransform: "uppercase" }}>
                Tactical Mindset Engine
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
              <NeuralActivity active={forging || autoForge} />
              {(forging || autoForge) && <div className="forge-pulse" />}
            </div>
          </div>

          {/* Stats strip */}
          <div className="stats-strip" style={{
            display: "flex", gap: 16, marginTop: 16,
            fontSize: 10, color: "#4b5563", letterSpacing: 1, textTransform: "uppercase",
          }}>
            <span>Core: <span style={{ color: "#ef4444" }}>10</span></span>
            <span>Deck: <span style={{ color: "#8b5cf6" }}>60</span></span>
            <span>Forged: <span style={{ color: "#f59e0b" }}>{totalForgedLines}</span></span>
            <span>Saved: <span style={{ color: "#10b981" }}>{savedLines.length}</span></span>
          </div>
        </div>
      </div>

      {/* ── TABS ── */}
      <div style={{
        display: "flex", maxWidth: 680, margin: "0 auto",
        borderBottom: "1px solid rgba(255,255,255,0.04)",
      }}>
        {TABS.map(t => (
          <button key={t} onClick={() => { setTab(t); setSearch(""); }}
            className={`tab-btn ${tab === t ? "tab-btn--active" : "tab-btn--inactive"}`}>
            {t}
            {t === "SAVED" && savedLines.length > 0 && (
              <span style={{
                fontSize: 9, fontWeight: 700, color: tab === t ? "#10b981" : "#4b5563",
                background: tab === t ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.04)",
                padding: "1px 5px", borderRadius: 3, minWidth: 18, textAlign: "center",
              }}>{savedLines.length}</span>
            )}
            {t === "FORGE" && autoForge && <div className="forge-pulse" style={{ width: 5, height: 5 }} />}
          </button>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="content-area" style={{ maxWidth: 680, margin: "0 auto", padding: "16px 20px 80px" }}>

        {/* ════════ CORE TAB ════════ */}
        {tab === "CORE" && (
          <div className="fade-in">
            <div style={{
              padding: "14px 16px", marginBottom: 16,
              background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.08)",
              borderRadius: 10, fontSize: 11, color: "#808098", lineHeight: 1.6,
              fontFamily: "'Outfit',sans-serif",
            }}>
              <span style={{ color: "#ef4444", fontWeight: 700 }}>LOCKED</span> — Primary arsenal. 10 lines, 10 psychological vectors. Tap to copy, ☆ to save.
            </div>

            <SearchBar value={search} onChange={setSearch} placeholder="Search core lines..." />

            {filteredCore.length === 0 && search && (
              <div style={{
                textAlign: "center", padding: "40px 20px", color: "#3a3a4a",
                fontFamily: "'Outfit',sans-serif",
              }}>
                <div style={{ fontSize: 13, color: "#6b7280" }}>No lines match &ldquo;{search}&rdquo;</div>
              </div>
            )}

            {filteredCore.map(item => (
              <LineCard key={item.id} line={item.line} category={item.category}
                copied={copiedId === `core-${item.id}`}
                onCopy={(l) => copyLine(l, `core-${item.id}`)}
                onSave={saveLine} saved={isLineSaved(item.line)} />
            ))}
          </div>
        )}

        {/* ════════ DECK TAB ════════ */}
        {tab === "DECK" && (
          <div className="fade-in">
            <div style={{
              padding: "14px 16px", marginBottom: 16,
              background: "rgba(139,92,246,0.04)", border: "1px solid rgba(139,92,246,0.08)",
              borderRadius: 10, fontSize: 11, color: "#808098", lineHeight: 1.6,
              fontFamily: "'Outfit',sans-serif",
              display: "flex", alignItems: "center", justifyContent: "space-between",
            }}>
              <div>
                <span style={{ color: "#8b5cf6", fontWeight: 700 }}>EXPANDED</span> — 10 categories × 6 lines. Core marked ◆. Tap to copy.
              </div>
              <button onClick={expandAllCats} style={{
                background: "none", border: "1px solid rgba(139,92,246,0.15)",
                borderRadius: 5, padding: "4px 10px", cursor: "pointer",
                fontSize: 9, fontWeight: 700, letterSpacing: 1, color: "#8b5cf6",
                fontFamily: "'Outfit',sans-serif", whiteSpace: "nowrap", flexShrink: 0,
                marginLeft: 12,
              }}>
                {expandedCats.size === CAT_KEYS.length ? "COLLAPSE ALL" : "EXPAND ALL"}
              </button>
            </div>

            <SearchBar value={search} onChange={setSearch} placeholder="Search across all categories..." />

            {CAT_KEYS.map(key => {
              const cat = CATEGORIES[key];
              const isOpen = expandedCats.has(key);
              const coreLines = CORE_SET.filter(c => c.category === key).map(c => c.line);
              const filteredCatLines = cat.lines.filter(filterLine);

              // If searching and no matches in this category, hide it
              if (search && filteredCatLines.length === 0) return null;

              return (
                <div key={key} style={{ marginBottom: 4 }}>
                  <div className="cat-header"
                    tabIndex={0}
                    role="button"
                    aria-expanded={isOpen}
                    onClick={() => toggleCat(key)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); toggleCat(key); } }}
                    style={{
                      background: isOpen ? `${cat.color}06` : "rgba(255,255,255,0.015)",
                      border: `1px solid ${isOpen ? `${cat.color}20` : "rgba(255,255,255,0.04)"}`,
                      borderRadius: isOpen ? "10px 10px 0 0" : 10,
                    }}>
                    <div style={{
                      width: 30, height: 30, borderRadius: 6,
                      background: `${cat.color}14`, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      fontSize: 14, color: cat.color,
                    }}>{cat.icon}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, fontWeight: 700, color: "#e5e5ea", letterSpacing: 0.5 }}>{key}</div>
                      <div style={{ fontSize: 10, color: "#6b7280", marginTop: 1, fontFamily: "'Outfit',sans-serif" }}>{cat.desc}</div>
                    </div>
                    <span style={{
                      fontSize: 9, color: "#4b5563", fontWeight: 600,
                      padding: "2px 6px", borderRadius: 3, background: "rgba(255,255,255,0.03)",
                    }}>{search ? filteredCatLines.length : cat.lines.length}</span>
                    <span style={{ color: "#4b5563", fontSize: 12, transition: "transform 0.2s", transform: isOpen ? "rotate(180deg)" : "none" }}>▾</span>
                  </div>
                  {(isOpen || search) && (
                    <div style={{
                      background: `${cat.color}03`, border: `1px solid ${cat.color}10`,
                      borderTop: "none", borderRadius: "0 0 10px 10px", padding: "6px 0 10px",
                    }}>
                      {!search && (
                        <div style={{
                          padding: "6px 16px 10px", fontSize: 9, color: "#6b7280",
                          fontStyle: "italic", borderBottom: `1px solid ${cat.color}08`, marginBottom: 4,
                          fontFamily: "'Outfit',sans-serif",
                        }}>Archetype: {cat.archetype}</div>
                      )}
                      {filteredCatLines.map((line, li) => {
                        const isCore = coreLines.includes(line);
                        const lid = `deck-${key}-${li}`;
                        return (
                          <div key={li} className="deck-line"
                            tabIndex={0}
                            role="button"
                            onClick={() => copyLine(line, lid)}
                            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); copyLine(line, lid); } }}>
                            <span style={{
                              position: "absolute", left: 18, top: 12,
                              fontSize: 10, fontWeight: 700, color: isCore ? cat.color : "#3a3a4a",
                            }}>{isCore ? "◆" : "○"}</span>
                            <div style={{
                              fontFamily: "'Outfit',sans-serif", fontSize: 13,
                              color: isCore ? "#e5e5ea" : "#a0a0b0",
                              fontWeight: isCore ? 500 : 400, lineHeight: 1.5,
                            }}>&ldquo;{line}&rdquo;</div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                              {copiedId === lid && <span style={{ fontSize: 9, color: "#10b981", fontWeight: 700 }}>✓ COPIED</span>}
                              <button onClick={(e) => { e.stopPropagation(); saveLine(line, key); }}
                                className="save-btn"
                                style={{ fontSize: 13, color: isLineSaved(line) ? "#f59e0b" : "#2a2a3a", padding: "0 4px" }}
                                aria-label={isLineSaved(line) ? "Remove from saved" : "Save to collection"}>
                                {isLineSaved(line) ? "★" : "☆"}
                              </button>
                            </div>
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

        {/* ════════ SAVED TAB ════════ */}
        {tab === "SAVED" && (
          <div className="fade-in">
            {savedLines.length === 0 ? (
              <div style={{
                textAlign: "center", padding: "60px 20px",
                color: "#3a3a4a", fontFamily: "'Outfit',sans-serif",
              }}>
                <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>★</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>No saved lines yet</div>
                <div style={{ fontSize: 12, color: "#4b5563", marginTop: 6, lineHeight: 1.6 }}>
                  Tap the ☆ icon on any line to save it here.<br />
                  Build your personal arsenal.
                </div>
              </div>
            ) : (
              <>
                <div style={{
                  padding: "14px 16px", marginBottom: 16,
                  background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.08)",
                  borderRadius: 10, fontSize: 11, color: "#808098", lineHeight: 1.6,
                  fontFamily: "'Outfit',sans-serif",
                }}>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>SAVED</span> — Your personal collection. {savedLines.length} line{savedLines.length !== 1 ? "s" : ""} saved.
                </div>

                <SearchBar value={search} onChange={setSearch} placeholder="Search saved lines..." />

                {filteredSaved.length === 0 && search && (
                  <div style={{
                    textAlign: "center", padding: "40px 20px", color: "#3a3a4a",
                    fontFamily: "'Outfit',sans-serif",
                  }}>
                    <div style={{ fontSize: 13, color: "#6b7280" }}>No saved lines match &ldquo;{search}&rdquo;</div>
                  </div>
                )}

                {filteredSaved.map((s, i) => (
                  <LineCard key={`saved-${i}`} line={s.line} category={s.category}
                    copied={copiedId === `saved-${i}`}
                    onCopy={(l) => copyLine(l, `saved-${i}`)}
                    onSave={saveLine} saved={true} />
                ))}
              </>
            )}
          </div>
        )}

        {/* ════════ FORGE TAB ════════ */}
        {tab === "FORGE" && (
          <div className="fade-in">
            {/* Forge Controls */}
            <div style={{
              padding: "18px 18px", marginBottom: 20,
              background: "linear-gradient(135deg, rgba(239,68,68,0.05) 0%, rgba(139,92,246,0.04) 100%)",
              border: "1px solid rgba(239,68,68,0.1)",
              borderRadius: 12,
            }}>
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                marginBottom: 14,
              }}>
                <div>
                  <div style={{
                    fontFamily: "'Outfit',sans-serif", fontSize: 14, fontWeight: 700,
                    color: "#f5f5f7", display: "flex", alignItems: "center", gap: 8,
                  }}>
                    <span>⚡ FORGE ENGINE</span>
                    <NeuralActivity active={forging} />
                  </div>
                  <div style={{ fontSize: 10, color: "#6b7280", marginTop: 3, fontFamily: "'Outfit',sans-serif" }}>
                    Scans current events → generates tactical lines
                  </div>
                </div>
                <div style={{
                  fontSize: 9, color: "#4b5563", textAlign: "right", lineHeight: 1.6,
                  fontFamily: "'Outfit',sans-serif",
                }}>
                  <div>Batches: {forgedBatches.length}</div>
                  <div>Total: {totalForgedLines} lines</div>
                </div>
              </div>

              <div className="forge-controls" style={{ display: "flex", gap: 10 }}>
                <button onClick={runForge} disabled={forging}
                  className={`forge-btn ${forging ? "" : "shimmer-btn"}`}
                  style={{
                    flex: 1, padding: "12px 0",
                    background: forging ? "#2a2a3a" : undefined,
                    color: forging ? "#6b7280" : "#fff",
                    fontSize: 13,
                  }}>
                  {forging ? "◎ FORGING..." : "⚡ FORGE NOW"}
                </button>
                <button onClick={() => {
                  if (!autoForge) {
                    setAutoForge(true);
                  } else {
                    setAutoForge(false);
                  }
                }}
                  className="forge-btn"
                  style={{
                    padding: "12px 18px",
                    border: `1px solid ${autoForge ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.06)"}`,
                    background: autoForge ? "rgba(239,68,68,0.08)" : "rgba(255,255,255,0.02)",
                    color: autoForge ? "#ef4444" : "#6b7280",
                    fontSize: 11,
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                  {autoForge && <div className="forge-pulse" style={{ width: 5, height: 5 }} />}
                  {autoForge ? "AUTO: ON" : "AUTO: OFF"}
                </button>
              </div>
              {autoForge && (
                <div style={{ fontSize: 9, color: "#ef4444", marginTop: 8, textAlign: "center", fontFamily: "'Outfit',sans-serif", opacity: 0.7 }}>
                  ⚠ Auto-forging every 90s — uses API credits. Tap AUTO: ON to stop.
                </div>
              )}
            </div>

            {/* API Key Settings */}
            <div style={{
              padding: "12px 14px", marginBottom: 16,
              background: "rgba(255,255,255,0.02)",
              border: `1px solid ${apiKey ? "rgba(255,255,255,0.06)" : "rgba(239,68,68,0.2)"}`,
              borderRadius: 10,
            }}>
              <button onClick={() => setShowKeyInput(v => !v)} style={{
                background: "none", border: "none", cursor: "pointer",
                color: apiKey ? "#6b7280" : "#ef4444",
                fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
                display: "flex", alignItems: "center", gap: 6, width: "100%",
                padding: 0,
              }}>
                <span>{apiKey ? "🔑" : "⚠"}</span>
                <span>{apiKey ? "API Key configured" : "API Key required"}</span>
                <span style={{ marginLeft: "auto", fontSize: 9, opacity: 0.5 }}>
                  {showKeyInput ? "▲" : "▼"}
                </span>
              </button>
              {showKeyInput && (
                <div style={{ marginTop: 10 }}>
                  <div style={{ fontSize: 9, color: "#6b7280", marginBottom: 6, fontFamily: "'Outfit',sans-serif", lineHeight: 1.5 }}>
                    Enter your Anthropic API key. Stored locally in your browser — never sent anywhere except Anthropic's API.
                    Get one at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer"
                      style={{ color: "#ef4444", textDecoration: "none" }}>console.anthropic.com</a>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      type="password"
                      value={apiKey}
                      onChange={e => {
                        setApiKey(e.target.value);
                        saveApiKey(e.target.value);
                      }}
                      placeholder="sk-ant-..."
                      style={{
                        flex: 1, padding: "8px 10px", fontSize: 12,
                        background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
                        borderRadius: 6, color: "#f5f5f7", fontFamily: "monospace",
                        outline: "none",
                      }}
                      onFocus={e => e.target.style.borderColor = "rgba(239,68,68,0.3)"}
                      onBlur={e => e.target.style.borderColor = "rgba(255,255,255,0.08)"}
                    />
                    {apiKey && (
                      <button onClick={() => { setApiKey(""); saveApiKey(""); showToast("API key removed"); }}
                        style={{
                          background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                          borderRadius: 6, color: "#ef4444", fontSize: 10, padding: "0 10px",
                          cursor: "pointer", fontFamily: "'Outfit',sans-serif",
                        }}>
                        Clear
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {forgeError && (
              <div style={{
                padding: "10px 14px", marginBottom: 12,
                background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: 8, fontSize: 11, color: "#ef4444",
                fontFamily: "'Outfit',sans-serif",
              }}>⚠ {forgeError}</div>
            )}

            {forgedBatches.length === 0 && !forging && (
              <div style={{
                textAlign: "center", padding: "60px 20px",
                color: "#3a3a4a", fontFamily: "'Outfit',sans-serif",
              }}>
                <div style={{ fontSize: 40, marginBottom: 16, opacity: 0.3 }}>⚡</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>No lines forged yet</div>
                <div style={{ fontSize: 12, color: "#4b5563", marginTop: 6 }}>
                  Hit FORGE NOW to scan current events and generate tactical lines
                </div>
              </div>
            )}

            {forging && forgedBatches.length === 0 && (
              <div style={{ textAlign: "center", padding: "50px 20px" }}>
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <NeuralActivity active={true} />
                </div>
                <div style={{
                  fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#6b7280",
                  marginTop: 16,
                }}>Scanning current events...</div>
                <div style={{
                  fontFamily: "'IBM Plex Mono',monospace", fontSize: 10, color: "#3a3a4a",
                  marginTop: 8,
                }}>web_search → analyze → weaponize → deliver</div>
              </div>
            )}

            {/* Search + Clear controls for batches */}
            {forgedBatches.length > 0 && (
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 12 }}>
                <div style={{ flex: 1 }}>
                  <SearchBar value={search} onChange={setSearch} placeholder="Search forged lines..." />
                </div>
                <button onClick={clearAllBatches}
                  className="clear-batch-btn"
                  style={{
                    padding: "8px 12px", fontSize: 10, marginBottom: 16,
                    border: "1px solid rgba(239,68,68,0.1)", borderRadius: 6,
                  }}>
                  CLEAR ALL
                </button>
              </div>
            )}

            {/* Forged Batches */}
            {forgedBatches.map((batch, bi) => {
              const filteredBatchLines = batch.lines.filter(item => filterLine(item.line));
              if (search && filteredBatchLines.length === 0) return null;

              return (
                <div key={batch.id} className="fade-in" style={{ marginBottom: 20 }}>
                  {/* Batch header */}
                  <div style={{
                    display: "flex", alignItems: "center", gap: 10, marginBottom: 10,
                    padding: "10px 14px",
                    background: "rgba(255,255,255,0.015)", borderRadius: 8,
                    border: "1px solid rgba(255,255,255,0.03)",
                  }}>
                    <span style={{
                      fontSize: 9, fontWeight: 700, letterSpacing: 1.5,
                      color: "#ef4444", textTransform: "uppercase",
                      fontFamily: "'Outfit',sans-serif",
                    }}>BATCH #{forgedBatches.length - bi}</span>
                    <span style={{ fontSize: 9, color: "#3a3a4a" }}>·</span>
                    <span style={{ fontSize: 9, color: "#4b5563", fontFamily: "'Outfit',sans-serif" }}>
                      {new Date(batch.timestamp).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                    <span style={{ fontSize: 9, color: "#3a3a4a" }}>·</span>
                    <span style={{ fontSize: 9, color: "#4b5563", fontFamily: "'Outfit',sans-serif" }}>
                      {batch.lines.length} lines
                    </span>
                    <button onClick={() => deleteBatch(batch.id)}
                      className="clear-batch-btn"
                      style={{ marginLeft: "auto" }}
                      aria-label="Delete batch">
                      ✕
                    </button>
                  </div>

                  {/* Source events */}
                  {batch.events.length > 0 && !search && (
                    <div style={{
                      padding: "10px 14px", marginBottom: 8,
                      background: "rgba(255,255,255,0.01)", borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.02)",
                    }}>
                      <div style={{
                        fontSize: 8, fontWeight: 700, letterSpacing: 2, color: "#3a3a4a",
                        textTransform: "uppercase", marginBottom: 6, fontFamily: "'Outfit',sans-serif",
                      }}>SOURCE EVENTS</div>
                      {batch.events.slice(0, 5).map((ev, ei) => (
                        <div key={ei} style={{
                          fontSize: 10, color: "#6b7280", lineHeight: 1.5,
                          padding: "2px 0", fontFamily: "'Outfit',sans-serif",
                          display: "flex", gap: 6,
                        }}>
                          <span style={{ color: "#3a3a4a" }}>›</span>
                          <span>{ev.headline}</span>
                          {ev.source && <span style={{ color: "#3a3a4a", fontStyle: "italic" }}>— {ev.source}</span>}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Generated lines */}
                  {filteredBatchLines.map((item) => (
                    <LineCard key={item.id} line={item.line}
                      category={CATEGORIES[item.category] ? item.category : "REFRAME"}
                      copied={copiedId === item.id}
                      onCopy={(l) => copyLine(l, item.id)}
                      onSave={saveLine} saved={isLineSaved(item.line)}
                      extra={item.inspired_by ? `← ${item.inspired_by}` : ""}
                      forged={true} />
                  ))}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
