# UI Overhaul Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 4-tab layout with a unified dashboard/feed featuring character archetypes, mood filtering, and a slide-up forge panel.

**Architecture:** Single-page app with one main view. Data files provide characters and lines with character tags. App.jsx is rewritten as a smaller orchestrator importing focused components. Forge engine logic preserved, UI restructured.

**Tech Stack:** React 18, Vite, Anthropic API, localStorage, CSS-in-JS (inline styles matching existing patterns)

**Spec:** `docs/superpowers/specs/2026-03-15-ui-overhaul-design.md`

---

## File Structure

### New files
- `src/data/characters.js` — 7 character profile definitions
- `src/data/moods.js` — mood-to-category mapping + category metadata
- `src/components/CharacterGrid.jsx` — horizontal scrollable character cards with tap-to-filter and long-press-to-profile
- `src/components/MoodChips.jsx` — mood/energy filter pills + Saved toggle
- `src/components/LineCard.jsx` — unified line card (copy, save, category tag, character name)
- `src/components/LineFeed.jsx` — All Lines section with search, filtering, count
- `src/components/TrendingToday.jsx` — forged lines section
- `src/components/CharacterProfile.jsx` — overlay showing character details
- `src/components/ForgePanel.jsx` — slide-up forge panel (forge button, auto-forge, status)
- `src/components/BottomNav.jsx` — fixed bottom navigation
- `src/components/SettingsPanel.jsx` — API key input, app info
- `src/components/Toast.jsx` — toast notification (extracted from App.jsx)
- `src/hooks/useForge.js` — forge engine hook (API call, status tracking, auto-forge)
- `src/hooks/useStorage.js` — localStorage hooks for saved lines, forged batches, API key
- `src/lib/forge-api.js` — forgeNewLines API function (extracted from App.jsx)
- `src/lib/lines.js` — builds unified line array from categories + forged, applies filters

### Modified files
- `src/data/categories.js` — add `character` field to each line
- `src/App.jsx` — complete rewrite (from 1367 lines to ~150 line orchestrator)
- `index.html` — update title (remove 功 if still present)

### Deleted files
- `src/data/core-set.js` — lines are duplicates of categories.js

---

## Chunk 1: Data Layer

### Task 1: Create characters.js

**Files:**
- Create: `src/data/characters.js`

- [ ] **Step 1: Create the character definitions file**

```js
export const CHARACTERS = {
  wick: {
    id: "wick",
    name: "John Wick",
    icon: "🎯",
    energy: "Silent force",
    philosophy: "Capability implied through stillness. The legend precedes the man — violence is a last resort that never feels like one.",
    source: "John Wick",
    signatureQuote: "People keep asking if I'm back. Yeah, I'm thinking I'm back.",
  },
  durden: {
    id: "durden",
    name: "Tyler Durden",
    icon: "🔥",
    energy: "The mirror",
    philosophy: "The existential mirror that fights back. You defeat yourself — he just shows you where.",
    source: "Fight Club",
    signatureQuote: "It's only after we've lost everything that we're free to do anything.",
  },
  six: {
    id: "six",
    name: "Sierra Six",
    icon: "👤",
    energy: "Ghost protocol",
    philosophy: "Quiet professionalism with zero ego. A ghost who gets the job done before anyone knows he was there.",
    source: "The Gray Man",
    signatureQuote: "I don't have feelings. I have objectives.",
  },
  specter: {
    id: "specter",
    name: "Harvey Specter",
    icon: "⚖️",
    energy: "Dominance",
    philosophy: "The outcome is already decided — the courtroom is just theater. Dominance as procedure.",
    source: "Suits",
    signatureQuote: "I don't play the odds. I play the man.",
  },
  seven: {
    id: "seven",
    name: "Seven of Nine",
    icon: "🧊",
    energy: "Cold logic",
    philosophy: "Emotional irrelevance as a weapon. Efficiency without sentiment — your feelings are not her variable.",
    source: "Star Trek: Voyager",
    signatureQuote: "Fun will now commence.",
  },
  slevin: {
    id: "slevin",
    name: "Slevin",
    icon: "🃏",
    energy: "Misdirection",
    philosophy: "Casual control with a hidden hand. Everyone thinks they're running the play — Slevin wrote the script.",
    source: "Lucky Number Slevin",
    signatureQuote: "The unlucky are nothing more than a frame of reference for the lucky.",
  },
  capa: {
    id: "capa",
    name: "Capa",
    icon: "☀️",
    energy: "Last witness",
    philosophy: "Existential weight at cosmic scale. When you've stared into the sun, nothing on earth intimidates.",
    source: "Sunshine",
    signatureQuote: "At the end of time, a moment of grace.",
  },
};

export const CHARACTER_IDS = Object.keys(CHARACTERS);
```

- [ ] **Step 2: Verify file loads**

Run: `node -e "import('./src/data/characters.js').then(m => console.log(Object.keys(m.CHARACTERS).length, 'characters'))"`
Expected: `7 characters`

- [ ] **Step 3: Commit**

```bash
git add src/data/characters.js
git commit -m "feat: add character archetype definitions"
```

### Task 2: Create moods.js

**Files:**
- Create: `src/data/moods.js`

- [ ] **Step 1: Create the mood mapping file**

```js
export const MOOD_MAP = {
  Cold: ["TEMPO", "INDIFFERENCE"],
  Calculated: ["CONTROL", "INEVITABILITY"],
  Existential: ["EXISTENTIAL", "IDENTITY"],
  Dismissive: ["DISMISSAL", "REFRAME"],
  Stoic: ["STOIC", "SCALE"],
};

export const MOOD_NAMES = Object.keys(MOOD_MAP);

/** Given a category string, return its mood */
export function getMoodForCategory(category) {
  for (const [mood, cats] of Object.entries(MOOD_MAP)) {
    if (cats.includes(category)) return mood;
  }
  return null;
}

/** Category display metadata (icon + color) — extracted from old CATEGORIES object */
export const CATEGORY_META = {
  REFRAME:       { icon: "↻", color: "#3b82f6" },
  SCALE:         { icon: "△", color: "#8b5cf6" },
  TEMPO:         { icon: "◉", color: "#ef4444" },
  INDIFFERENCE:  { icon: "◌", color: "#64748b" },
  DISMISSAL:     { icon: "⊘", color: "#f59e0b" },
  STOIC:         { icon: "◇", color: "#06b6d4" },
  INEVITABILITY: { icon: "⊞", color: "#10b981" },
  CONTROL:       { icon: "⊕", color: "#ec4899" },
  EXISTENTIAL:   { icon: "◈", color: "#f43f5e" },
  IDENTITY:      { icon: "⬡", color: "#a855f7" },
};
```

- [ ] **Step 2: Commit**

```bash
git add src/data/moods.js
git commit -m "feat: add mood-to-category mapping and category metadata"
```

### Task 3: Add character tags to categories.js and delete core-set.js

**Files:**
- Modify: `src/data/categories.js`
- Delete: `src/data/core-set.js`

- [ ] **Step 1: Update categories.js — change lines from string arrays to object arrays with character field**

Each line becomes `{ line: "...", character: "..." }`. Default character per category from spec:

| Category | Default |
|----------|---------|
| REFRAME | slevin |
| SCALE | wick |
| TEMPO | six |
| INDIFFERENCE | seven |
| DISMISSAL | specter |
| STOIC | wick |
| INEVITABILITY | seven |
| CONTROL | durden |
| EXISTENTIAL | durden |
| IDENTITY | capa |

The full updated file:

```js
/**
 * Mental Kung Fu — Category Taxonomy
 * 10 psychological categories × 6 lines each = 60 total lines
 * Each line tagged with a character archetype energy
 */

export const CATEGORIES = {
  REFRAME: {
    icon: "↻",
    color: "#3b82f6",
    desc: "Flip their attack into your advantage",
    lines: [
      { line: "You don't like me? Want me to lower the difficulty for your comfort?", character: "slevin" },
      { line: "Your criticism is just a map of your limitations.", character: "slevin" },
      { line: "You didn't offend me. You auditioned — and didn't get a callback.", character: "specter" },
      { line: "That was supposed to hurt? Recalibrate.", character: "slevin" },
      { line: "You tried to expose me. All you did was advertise me.", character: "slevin" },
      { line: "You think you're testing me. I'm the one grading.", character: "specter" },
    ],
  },
  SCALE: {
    icon: "△",
    color: "#8b5cf6",
    desc: "Establish you operate on a different plane",
    lines: [
      { line: "I'm not intimidating. You're just underprepared for the room you walked into.", character: "wick" },
      { line: "You can't put me in a box — I built the warehouse.", character: "wick" },
      { line: "You brought a ladder. I own the building.", character: "specter" },
      { line: "Your ceiling is my foundation.", character: "wick" },
      { line: "You measured the room. I designed the blueprint.", character: "six" },
      { line: "You're competing for a seat. I built the table.", character: "wick" },
    ],
  },
  TEMPO: {
    icon: "◉",
    color: "#ef4444",
    desc: "Show you're already three moves ahead",
    lines: [
      { line: "I don't talk about what I'm going to do. I just let you watch.", character: "six" },
      { line: "By the time you understood the move, I'd already made the next three.", character: "six" },
      { line: "You're rehearsing. I'm already in post-production.", character: "six" },
      { line: "You're loading. I've already shipped.", character: "six" },
      { line: "You finished planning. I finished executing. Tuesday.", character: "six" },
      { line: "You're building momentum. I'm already coasting on results.", character: "six" },
    ],
  },
  INDIFFERENCE: {
    icon: "◌",
    color: "#64748b",
    desc: "Erase them from the equation entirely",
    lines: [
      { line: "You're not in my way. I just keep forgetting you're here.", character: "seven" },
      { line: "I'd explain, but I don't onboard tourists.", character: "seven" },
      { line: "You're not background noise. Background noise is consistent.", character: "seven" },
      { line: "I don't have enemies. I have people I haven't noticed yet.", character: "wick" },
      { line: "I didn't ignore you on purpose. You just weren't a variable.", character: "seven" },
      { line: "You keep showing up. I keep not adjusting.", character: "seven" },
    ],
  },
  DISMISSAL: {
    icon: "⊘",
    color: "#f59e0b",
    desc: "Acknowledge and discard in one breath",
    lines: [
      { line: "Nothing personal. You're just playing a different game at a different difficulty.", character: "specter" },
      { line: "I don't punch down. I don't even look down.", character: "specter" },
      { line: "You came to compete. I came to collect.", character: "specter" },
      { line: "Cute strategy. Did it come with instructions?", character: "slevin" },
      { line: "Your best move was interesting. My default was better.", character: "specter" },
      { line: "That was your A-game? I was warming up the bench.", character: "specter" },
    ],
  },
  STOIC: {
    icon: "◇",
    color: "#06b6d4",
    desc: "Weaponize calm — let stillness do the damage",
    lines: [
      { line: "I don't get even. I get distance. The gap is the punishment.", character: "wick" },
      { line: "Your chaos isn't my emergency.", character: "wick" },
      { line: "I don't react. I adjust. There's a difference you'll learn too late.", character: "wick" },
      { line: "Pressure doesn't build diamonds. Discipline does. I'm the proof.", character: "capa" },
      { line: "I removed you from the equation. The math got better.", character: "seven" },
      { line: "Your turbulence is not my weather.", character: "wick" },
    ],
  },
  INEVITABILITY: {
    icon: "⊞",
    color: "#10b981",
    desc: "Frame the outcome as already decided",
    lines: [
      { line: "I already know how this ends — you're still hoping.", character: "seven" },
      { line: "This isn't a contest. It's a schedule — and you're not on it.", character: "seven" },
      { line: "You're still in the negotiation phase. I'm in the delivery phase.", character: "specter" },
      { line: "I don't rush because the outcome already has my name on it.", character: "seven" },
      { line: "The result was decided before you entered the room. I just haven't filed the paperwork.", character: "specter" },
      { line: "I don't race. I set the finish line.", character: "seven" },
    ],
  },
  CONTROL: {
    icon: "⊕",
    color: "#ec4899",
    desc: "Mastery over the system itself",
    lines: [
      { line: "I don't play the odds. I already see the board.", character: "durden" },
      { line: "You follow the playbook. I write the errata.", character: "durden" },
      { line: "You learned the rules. I designed the constraints.", character: "durden" },
      { line: "You found a loophole. I built the loop.", character: "slevin" },
      { line: "You're playing chess. I'm playing the chess player.", character: "durden" },
      { line: "The game changed. You weren't notified.", character: "durden" },
    ],
  },
  EXISTENTIAL: {
    icon: "◈",
    color: "#f43f5e",
    desc: "Turn their own mind against them",
    lines: [
      { line: "You're not afraid of me. You're afraid of what I prove about you.", character: "durden" },
      { line: "I didn't break your confidence. I just showed you where it was already cracked.", character: "durden" },
      { line: "You don't hate me. You hate that I'm the standard you can't meet.", character: "durden" },
      { line: "Every time you doubt me, you're really confessing about yourself.", character: "durden" },
      { line: "I'm not your enemy. I'm the mirror you keep trying to walk past.", character: "durden" },
      { line: "You wanted to find my weakness. You found your own instead.", character: "capa" },
    ],
  },
  IDENTITY: {
    icon: "⬡",
    color: "#a855f7",
    desc: "Define yourself so completely they can't",
    lines: [
      { line: "I'm not motivated. I'm engineered.", character: "capa" },
      { line: "I wasn't built for comfort. I was built for output.", character: "six" },
      { line: "I don't have a backup plan. The first one works.", character: "capa" },
      { line: "I'm not lucky. I'm what prepared looks like from the outside.", character: "six" },
      { line: "I don't fit in. I was never designed to.", character: "capa" },
      { line: "They didn't make me. I compiled myself.", character: "capa" },
    ],
  },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);
```

- [ ] **Step 2: Delete core-set.js**

```bash
rm src/data/core-set.js
```

- [ ] **Step 3: Commit**

```bash
git add src/data/categories.js
git rm src/data/core-set.js
git commit -m "feat: add character tags to all lines, remove duplicate core-set"
```

### Task 4: Create lines.js utility

**Files:**
- Create: `src/lib/lines.js`

- [ ] **Step 1: Create the unified line builder and filter logic**

```js
import { CATEGORIES, CATEGORY_KEYS } from "../data/categories.js";
import { MOOD_MAP } from "../data/moods.js";

/**
 * Build flat array of all static lines from categories.
 * Each line: { id, line, category, character }
 */
export function getAllLines() {
  const lines = [];
  for (const cat of CATEGORY_KEYS) {
    for (const [i, item] of CATEGORIES[cat].lines.entries()) {
      lines.push({
        id: `${cat}-${i}`,
        line: item.line,
        category: cat,
        character: item.character,
      });
    }
  }
  return lines;
}

/**
 * Filter lines by active characters, moods, saved state, and search text.
 */
export function filterLines(lines, { characters, moods, savedOnly, savedSet, search }) {
  let result = lines;

  if (characters.size > 0) {
    result = result.filter(l => characters.has(l.character));
  }

  if (moods.size > 0) {
    const allowedCats = new Set();
    for (const mood of moods) {
      for (const cat of (MOOD_MAP[mood] || [])) {
        allowedCats.add(cat);
      }
    }
    result = result.filter(l => allowedCats.has(l.category));
  }

  if (savedOnly) {
    result = result.filter(l => savedSet.has(l.line));
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(l => l.line.toLowerCase().includes(q));
  }

  return result;
}
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/lines.js
git commit -m "feat: add unified line builder and filter utility"
```

### Task 5: Extract forge API to lib/forge-api.js

**Files:**
- Create: `src/lib/forge-api.js`

- [ ] **Step 1: Extract forge API function with character assignment added to prompt**

```js
import { CATEGORY_KEYS } from "../data/categories.js";

export async function forgeNewLines(apiKey, count = 2) {
  if (!apiKey) {
    throw new Error("API key required. Add your Anthropic API key in Settings.");
  }

  const catList = CATEGORY_KEYS.join(", ");
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
      max_tokens: 1500,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `You are a psychological warfare specialist and tactical mindset coach. You create cold, surgical one-liners in the style of John Wick, Tyler Durden, and Harvey Specter — lines that land like a scalpel, not a sledgehammer.

STEP 1: Search for today's most interesting current events, news headlines, trending topics, or cultural moments.

STEP 2: For each event, perform a psychological deconstruction:
- Identify the CORE VULNERABILITY it exposes (fear of irrelevance, loss of control, ego fragility, identity crisis, status anxiety)
- Find the PRESSURE POINT — the specific insecurity most people won't say out loud but instantly recognize
- Extract the POWER DYNAMIC — who has leverage, who's pretending, who's exposed
- Locate the METAPHOR WEAPON — the element of the event that can be turned into a universal psychological strike

STEP 3: Generate exactly ${count} one-liners that EXPLOIT these psychological findings. Each line must:
- Target a specific cognitive vulnerability (not generic confidence — precision damage)
- Use the event's metaphor to trigger self-doubt, inadequacy, or forced reframing in the listener
- Hit the gap between who someone thinks they are and who they actually are
- Be cold, surgical, confident — never loud or angry. Calm is the weapon.
- Work as standalone statements without needing to know the news context
- Be under 20 words each
- Each belong to a different category from: ${catList}
- Assign each line a character energy from: wick, durden, six, specter, seven, slevin, capa
  - wick: silent force, implied capability
  - durden: existential mirror, system destruction
  - six: ghost professionalism, zero ego
  - specter: dominance, procedural certainty
  - seven: cold logic, emotional irrelevance
  - slevin: casual misdirection, hidden hand
  - capa: cosmic perspective, existential weight

STEP 4: Return ONLY valid JSON with no markdown formatting, no backticks, no preamble. Just raw JSON:
{"events":[{"headline":"short headline","source":"source name","vulnerability":"the core psychological vulnerability identified"}],"lines":[{"line":"the one-liner","category":"CATEGORY_NAME","character":"character_id","inspired_by":"which headline inspired this","target":"what psychological pressure point this exploits"}]}`
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
```

- [ ] **Step 2: Commit**

```bash
git add src/lib/forge-api.js
git commit -m "feat: extract forge API with character energy assignment"
```

### Task 6: Create storage hooks

**Files:**
- Create: `src/hooks/useStorage.js`

- [ ] **Step 1: Create localStorage hooks**

```js
import { useState, useEffect, useCallback, useMemo } from "react";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function useSavedLines() {
  const [savedLines, setSavedLines] = useState([]);

  useEffect(() => { setSavedLines(loadJSON("saved-lines", [])); }, []);

  const savedSet = useMemo(() => new Set(savedLines.map(s => s.line)), [savedLines]);

  const toggleSave = useCallback((line, category) => {
    setSavedLines(prev => {
      const exists = prev.some(s => s.line === line);
      const next = exists
        ? prev.filter(s => s.line !== line)
        : [...prev, { line, category, savedAt: Date.now() }];
      saveJSON("saved-lines", next);
      return next;
    });
  }, []);

  return { savedLines, savedSet, toggleSave };
}

export function useForgedBatches() {
  const [batches, setBatches] = useState([]);

  useEffect(() => { setBatches(loadJSON("forged-lines", [])); }, []);

  const addBatch = useCallback((batch) => {
    setBatches(prev => {
      const next = [batch, ...prev].slice(0, 20);
      saveJSON("forged-lines", next);
      return next;
    });
  }, []);

  const deleteBatch = useCallback((batchId) => {
    setBatches(prev => {
      const next = prev.filter(b => b.id !== batchId);
      saveJSON("forged-lines", next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setBatches([]);
    saveJSON("forged-lines", []);
  }, []);

  return { batches, addBatch, deleteBatch, clearAll };
}

export function useApiKey() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    try { setApiKey(localStorage.getItem("anthropic-api-key") || ""); } catch {}
  }, []);

  const saveKey = useCallback((key) => {
    setApiKey(key);
    try { localStorage.setItem("anthropic-api-key", key); } catch {}
  }, []);

  const clearKey = useCallback(() => {
    setApiKey("");
    try { localStorage.removeItem("anthropic-api-key"); } catch {}
  }, []);

  return { apiKey, saveKey, clearKey };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useStorage.js
git commit -m "feat: extract localStorage hooks for saved lines, batches, API key"
```

---

## Chunk 2: UI Components

### Task 7: Create Toast component

**Files:**
- Create: `src/components/Toast.jsx`

- [ ] **Step 1: Extract Toast from App.jsx**

```jsx
export default function Toast({ message, visible }) {
  if (!message) return null;
  return (
    <div className={`toast ${visible ? "" : "toast--exit"}`}>
      <div style={{
        padding: "10px 20px", borderRadius: 10,
        background: "rgba(15,15,25,0.95)", border: "1px solid rgba(239,68,68,0.15)",
        color: "#f5f5f7", fontSize: 12, fontFamily: "'Outfit',sans-serif",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}>{message}</div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Toast.jsx
git commit -m "feat: extract Toast component"
```

### Task 8: Create LineCard component

**Files:**
- Create: `src/components/LineCard.jsx`

- [ ] **Step 1: Create unified line card**

```jsx
import { CATEGORY_META } from "../data/moods.js";
import { CHARACTERS } from "../data/characters.js";

export default function LineCard({ line, category, character, copied, onCopy, onSave, saved, extra, forged }) {
  const cat = CATEGORY_META[category] || { icon: "?", color: "#666" };
  const char = CHARACTERS[character];

  return (
    <div
      className="line-card"
      onClick={() => onCopy(line)}
      tabIndex={0}
      role="button"
      aria-label={`Copy: ${line}`}
      style={{
        padding: "12px 14px", marginBottom: 8,
        background: forged
          ? "linear-gradient(135deg, rgba(239,68,68,0.04), rgba(139,92,246,0.02))"
          : "rgba(255,255,255,0.02)",
        border: `1px solid ${forged ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.05)"}`,
        borderRadius: 10, position: "relative",
      }}
    >
      {forged && (
        <div style={{ fontSize: 8, color: "#ef4444", fontWeight: 700, marginBottom: 4, fontFamily: "'Outfit',sans-serif" }}>
          ⚡ FORGED
        </div>
      )}
      <div style={{ fontSize: 13, color: "#f5f5f7", lineHeight: 1.55, fontFamily: "'Outfit',sans-serif" }}>
        "{line}"
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6, flexWrap: "wrap" }}>
        <span style={{
          fontSize: 9, fontWeight: 700, color: cat.color, fontFamily: "'Outfit',sans-serif",
        }}>
          {cat.icon} {category}
        </span>
        {char && (
          <>
            <span style={{ fontSize: 9, color: "#333" }}>•</span>
            <span style={{ fontSize: 9, color: "#555", fontFamily: "'Outfit',sans-serif" }}>
              {char.icon} {char.name}
            </span>
          </>
        )}
        {extra && (
          <>
            <span style={{ fontSize: 9, color: "#333" }}>•</span>
            <span style={{ fontSize: 9, color: "#555", fontFamily: "'Outfit',sans-serif" }}>{extra}</span>
          </>
        )}
        {copied && (
          <span style={{
            fontSize: 8, color: "#22c55e", fontWeight: 700, fontFamily: "'Outfit',sans-serif",
            marginLeft: 4,
          }}>✓ COPIED</span>
        )}
        <button
          onClick={e => { e.stopPropagation(); onSave(line, category); }}
          style={{
            marginLeft: "auto", background: "none", border: "none", cursor: "pointer",
            fontSize: 14, color: saved ? "#f59e0b" : "#333", padding: "2px 4px",
          }}
          aria-label={saved ? "Unsave" : "Save"}
        >
          {saved ? "★" : "☆"}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LineCard.jsx
git commit -m "feat: create unified LineCard component"
```

### Task 9: Create CharacterGrid component

**Files:**
- Create: `src/components/CharacterGrid.jsx`

- [ ] **Step 1: Create character grid with tap and long-press**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CharacterGrid.jsx
git commit -m "feat: create CharacterGrid with tap-to-filter and long-press-to-profile"
```

### Task 10: Create MoodChips component

**Files:**
- Create: `src/components/MoodChips.jsx`

- [ ] **Step 1: Create mood filter chips**

```jsx
import { MOOD_NAMES } from "../data/moods.js";

export default function MoodChips({ activeMoods, onToggle, savedActive, onToggleSaved }) {
  return (
    <div style={{
      display: "flex", gap: 6, flexWrap: "wrap", padding: "10px 16px 0",
    }}>
      {MOOD_NAMES.map(mood => {
        const active = activeMoods.has(mood);
        return (
          <button
            key={mood}
            onClick={() => onToggle(mood)}
            style={{
              background: active ? "rgba(239,68,68,0.1)" : "rgba(255,255,255,0.03)",
              border: `1px solid ${active ? "rgba(239,68,68,0.2)" : "rgba(255,255,255,0.06)"}`,
              borderRadius: 14, padding: "4px 10px",
              fontSize: 9, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
              color: active ? "#ef4444" : "#6b7280",
              cursor: "pointer", transition: "all 0.2s ease",
            }}
          >
            {mood}
          </button>
        );
      })}
      <button
        onClick={onToggleSaved}
        style={{
          background: savedActive ? "rgba(245,158,11,0.1)" : "rgba(255,255,255,0.03)",
          border: `1px solid ${savedActive ? "rgba(245,158,11,0.2)" : "rgba(255,255,255,0.06)"}`,
          borderRadius: 14, padding: "4px 10px",
          fontSize: 9, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
          color: savedActive ? "#f59e0b" : "#6b7280",
          cursor: "pointer", display: "flex", alignItems: "center", gap: 3,
          transition: "all 0.2s ease",
        }}
      >
        ★ Saved
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MoodChips.jsx
git commit -m "feat: create MoodChips filter component"
```

### Task 11: Create CharacterProfile overlay

**Files:**
- Create: `src/components/CharacterProfile.jsx`

- [ ] **Step 1: Create the overlay component**

```jsx
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/CharacterProfile.jsx
git commit -m "feat: create CharacterProfile overlay"
```

### Task 12: Create TrendingToday component

**Files:**
- Create: `src/components/TrendingToday.jsx`

- [ ] **Step 1: Create trending section**

```jsx
import LineCard from "./LineCard.jsx";

export default function TrendingToday({ batches, copiedId, onCopy, onSave, savedSet }) {
  // Flatten the most recent batch's lines
  const recentBatch = batches[0];
  if (!recentBatch || !recentBatch.lines.length) return null;

  return (
    <div style={{ padding: "14px 16px 0" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 8,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 800, color: "#ef4444",
          letterSpacing: 0.5, fontFamily: "'Outfit',sans-serif",
          display: "flex", alignItems: "center", gap: 5,
        }}>
          <span>⚡ TRENDING TODAY</span>
          <div className="forge-pulse" style={{ width: 5, height: 5 }} />
        </div>
        <div style={{ fontSize: 8, color: "#4b5563", fontFamily: "'Outfit',sans-serif" }}>
          from current events
        </div>
      </div>
      {recentBatch.lines.map(item => (
        <LineCard
          key={item.id}
          line={item.line}
          category={item.category}
          character={item.character || "wick"}
          copied={copiedId === item.id}
          onCopy={() => onCopy(item.line, item.id)}
          onSave={onSave}
          saved={savedSet.has(item.line)}
          extra={item.inspired_by ? `← ${item.inspired_by}` : undefined}
          forged
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/TrendingToday.jsx
git commit -m "feat: create TrendingToday section component"
```

### Task 13: Create LineFeed component

**Files:**
- Create: `src/components/LineFeed.jsx`

- [ ] **Step 1: Create the All Lines feed with search and count**

```jsx
import LineCard from "./LineCard.jsx";

export default function LineFeed({ lines, copiedId, onCopy, onSave, savedSet, search, onSearchChange }) {
  return (
    <div style={{ padding: "14px 16px 0" }}>
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 8,
      }}>
        <div style={{
          fontSize: 10, fontWeight: 800, color: "#6b7280",
          letterSpacing: 0.5, fontFamily: "'Outfit',sans-serif",
        }}>
          ALL LINES
        </div>
        <div style={{ fontSize: 8, color: "#4b5563", fontFamily: "'Outfit',sans-serif" }}>
          {lines.length} lines
        </div>
      </div>

      {/* Search bar */}
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search lines..."
          style={{
            width: "100%", padding: "8px 12px", fontSize: 11,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8, color: "#f5f5f7", fontFamily: "'Outfit',sans-serif",
            outline: "none",
          }}
        />
      </div>

      {lines.length === 0 && (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          color: "#3a3a4a", fontFamily: "'Outfit',sans-serif",
        }}>
          <div style={{ fontSize: 13, color: "#6b7280" }}>No lines match your filters</div>
        </div>
      )}

      {lines.map(l => (
        <LineCard
          key={l.id}
          line={l.line}
          category={l.category}
          character={l.character || "wick"}
          copied={copiedId === l.id}
          onCopy={() => onCopy(l.line, l.id)}
          onSave={onSave}
          saved={savedSet.has(l.line)}
          extra={l.inspired_by ? `← ${l.inspired_by}` : undefined}
          forged={l.source === "forged"}
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/LineFeed.jsx
git commit -m "feat: create LineFeed component with search and filtered count"
```

### Task 14: Create ForgePanel slide-up (renumbered)

**Files:**
- Create: `src/components/ForgePanel.jsx`

- [ ] **Step 1: Create forge slide-up panel**

```jsx
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

        {/* Forge status */}
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
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ForgePanel.jsx
git commit -m "feat: create ForgePanel slide-up component"
```

### Task 14: Create BottomNav and SettingsPanel

**Files:**
- Create: `src/components/BottomNav.jsx`
- Create: `src/components/SettingsPanel.jsx`

- [ ] **Step 1: Create BottomNav**

```jsx
export default function BottomNav({ onHome, onForge, onSettings }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(8,8,12,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)",
      backdropFilter: "blur(10px)", display: "flex", padding: "10px 0 14px",
      maxWidth: 480, margin: "0 auto",
    }}>
      <button onClick={onHome} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center",
      }}>
        <div style={{ fontSize: 16, marginBottom: 2 }}>🏠</div>
        <div style={{ fontSize: 8, color: "#6b7280", fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>HOME</div>
      </button>
      <button onClick={onForge} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center",
      }}>
        <div style={{
          width: 40, height: 40, margin: "-18px auto 0",
          background: "linear-gradient(135deg, #ef4444, #dc2626)", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 0 20px rgba(239,68,68,0.3)",
        }}>⚡</div>
        <div style={{ fontSize: 8, color: "#ef4444", fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>FORGE</div>
      </button>
      <button onClick={onSettings} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center",
      }}>
        <div style={{ fontSize: 16, marginBottom: 2 }}>⚙️</div>
        <div style={{ fontSize: 8, color: "#6b7280", fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>SETTINGS</div>
      </button>
    </div>
  );
}
```

- [ ] **Step 2: Create SettingsPanel**

```jsx
export default function SettingsPanel({ visible, onClose, apiKey, onSaveKey, onClearKey, onToast }) {
  if (!visible) return null;

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
        }}>
          ⚙️ Settings
        </div>

        <div style={{
          fontSize: 11, fontWeight: 700, color: "#6b7280",
          fontFamily: "'Outfit',sans-serif", marginBottom: 8,
        }}>
          API Key
        </div>

        <div style={{
          fontSize: 9, color: "#4b5563", marginBottom: 8,
          fontFamily: "'Outfit',sans-serif", lineHeight: 1.5,
        }}>
          Enter your Anthropic API key for the Forge Engine. Stored locally — never sent anywhere except Anthropic's API.
          Get one at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer"
            style={{ color: "#ef4444", textDecoration: "none" }}>console.anthropic.com</a>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="password"
            value={apiKey}
            onChange={e => onSaveKey(e.target.value)}
            placeholder="sk-ant-..."
            style={{
              flex: 1, padding: "8px 10px", fontSize: 12,
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6, color: "#f5f5f7", fontFamily: "monospace", outline: "none",
            }}
          />
          {apiKey && (
            <button onClick={() => { onClearKey(); onToast("API key removed"); }} style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 6, color: "#ef4444", fontSize: 10, padding: "0 10px",
              cursor: "pointer", fontFamily: "'Outfit',sans-serif",
            }}>
              Clear
            </button>
          )}
        </div>

        <div style={{
          marginTop: 24, paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: 10, color: "#4b5563", fontFamily: "'Outfit',sans-serif",
          textAlign: "center",
        }}>
          Mental Kung Fu v3.0 • Tactical Mindset Engine
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/BottomNav.jsx src/components/SettingsPanel.jsx
git commit -m "feat: create BottomNav and SettingsPanel components"
```

---

## Chunk 3: App Rewrite + Integration

### Task 15: Create useForge hook

**Files:**
- Create: `src/hooks/useForge.js`

- [ ] **Step 1: Create forge hook (extracted and cleaned from App.jsx)**

```js
import { useState, useCallback, useRef, useEffect } from "react";
import { forgeNewLines } from "../lib/forge-api.js";

export function useForge({ apiKey, onBatch, onToast }) {
  const [forging, setForging] = useState(false);
  const [forgeError, setForgeError] = useState(null);
  const [forgeStatus, setForgeStatus] = useState(null);
  const [autoForge, setAutoForge] = useState(false);
  const forgingRef = useRef(false);
  const timerRef = useRef(null);
  const autoRef = useRef(null);

  const runForge = useCallback(async () => {
    if (forgingRef.current) return;
    forgingRef.current = true;
    setForging(true);
    setForgeError(null);
    const startTime = Date.now();
    setForgeStatus({ stage: "connecting", elapsed: 0 });

    timerRef.current = setInterval(() => {
      setForgeStatus(prev => prev ? { ...prev, elapsed: Date.now() - startTime } : null);
    }, 100);

    const setStage = (stage) => setForgeStatus(prev => prev ? { ...prev, stage } : null);

    try {
      setStage("searching");
      const result = await forgeNewLines(apiKey, 2);
      setStage("processing");
      const batch = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        events: result.events || [],
        lines: (result.lines || []).map((l, i) => ({
          ...l,
          id: `${Date.now()}-${i}`,
          category: (l.category || "REFRAME").toUpperCase(),
          character: l.character || "wick",
        })),
      };
      setStage("complete");
      onBatch(batch);
      onToast(`Forged ${batch.lines.length} new lines from ${batch.events.length} events`);
    } catch (err) {
      setForgeError(err.message || "Forge failed");
    }
    clearInterval(timerRef.current);
    setForgeStatus(null);
    setForging(false);
    forgingRef.current = false;
  }, [apiKey, onBatch, onToast]);

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

  return {
    forging, forgeError, forgeStatus, autoForge,
    runForge,
    toggleAuto: () => setAutoForge(v => !v),
  };
}
```

- [ ] **Step 2: Commit**

```bash
git add src/hooks/useForge.js
git commit -m "feat: extract useForge hook"
```

### Task 16: Rewrite App.jsx

**Files:**
- Rewrite: `src/App.jsx`

- [ ] **Step 1: Create the new App.jsx — complete rewrite**

```jsx
import { useState, useCallback, useMemo, useRef } from "react";
import { useSavedLines, useForgedBatches, useApiKey } from "./hooks/useStorage.js";
import { useForge } from "./hooks/useForge.js";
import { getAllLines, filterLines } from "./lib/lines.js";
import CharacterGrid from "./components/CharacterGrid.jsx";
import MoodChips from "./components/MoodChips.jsx";
import TrendingToday from "./components/TrendingToday.jsx";
import LineFeed from "./components/LineFeed.jsx";
import CharacterProfile from "./components/CharacterProfile.jsx";
import ForgePanel from "./components/ForgePanel.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Toast from "./components/Toast.jsx";

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
:root {
  --bg-0: #08080c; --bg-1: #0e0e14; --bg-2: #14141c; --bg-3: #1a1a24;
  --text-0: #f0f0f5; --text-1: #c0c0cc; --text-2: #808098; --text-3: #50506a;
  --red: #ef4444; --red-dim: rgba(239,68,68,0.12); --accent: #ef4444;
}
body { background: var(--bg-0); color: var(--text-1); }

@keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
@keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes breathe { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
@keyframes toast-in { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes toast-out { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px) scale(0.95); } }

.fade-in { animation: fade-in 0.35s ease-out both; }
.line-card { transition: all 0.2s ease; cursor: pointer; position: relative; }
.line-card:hover { background: rgba(255,255,255,0.04) !important; }
.line-card:active { transform: scale(0.985); }
.line-card:focus-visible { outline: 2px solid var(--red); outline-offset: -2px; border-radius: 10px; }
.forge-pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--red); position: relative; }
.forge-pulse::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; border: 1px solid var(--red); animation: pulse-ring 2s ease-out infinite; }
.shimmer-btn { background: linear-gradient(90deg, #ef4444, #dc2626, #b91c1c, #dc2626, #ef4444); background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite; }
.toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); z-index: 200; animation: toast-in 0.3s ease-out; pointer-events: none; }
.toast--exit { animation: toast-out 0.25s ease-in forwards; }
`;

const ALL_LINES = getAllLines();

export default function MentalKungFuApp() {
  // Filters
  const [activeCharacters, setActiveCharacters] = useState(new Set());
  const [activeMoods, setActiveMoods] = useState(new Set());
  const [savedOnly, setSavedOnly] = useState(false);
  const [search, setSearch] = useState("");

  // UI state
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [profileChar, setProfileChar] = useState(null);
  const [forgeOpen, setForgeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toastTimer = useRef(null);
  const scrollRef = useRef(null);

  // Data hooks
  const { savedLines, savedSet, toggleSave } = useSavedLines();
  const { batches, addBatch, deleteBatch, clearAll } = useForgedBatches();
  const { apiKey, saveKey, clearKey } = useApiKey();

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 1800);
    setTimeout(() => setToast({ message: "", visible: false }), 2100);
  }, []);

  const { forging, forgeError, forgeStatus, autoForge, runForge, toggleAuto } = useForge({
    apiKey,
    onBatch: addBatch,
    onToast: showToast,
  });

  // Copy handler
  const copyLine = useCallback((line, id) => {
    navigator.clipboard?.writeText(line);
    setCopiedId(id);
    showToast("Copied to clipboard");
    setTimeout(() => setCopiedId(null), 2000);
  }, [showToast]);

  // Filter toggles
  const toggleCharacter = useCallback((id) => {
    setActiveCharacters(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleMood = useCallback((mood) => {
    setActiveMoods(prev => {
      const next = new Set(prev);
      next.has(mood) ? next.delete(mood) : next.add(mood);
      return next;
    });
  }, []);

  // Build forged lines for the unified feed
  const forgedFeedLines = useMemo(() => {
    const lines = [];
    for (const batch of batches) {
      for (const item of batch.lines) {
        lines.push({
          ...item,
          character: item.character || "wick",
          source: "forged",
        });
      }
    }
    return lines;
  }, [batches]);

  // Filtered lines
  const filteredLines = useMemo(() => {
    const combined = [...forgedFeedLines, ...ALL_LINES];
    return filterLines(combined, {
      characters: activeCharacters,
      moods: activeMoods,
      savedOnly,
      savedSet,
      search,
    });
  }, [activeCharacters, activeMoods, savedOnly, savedSet, search, forgedFeedLines]);

  const handleHome = useCallback(() => {
    setActiveCharacters(new Set());
    setActiveMoods(new Set());
    setSavedOnly(false);
    setSearch("");
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div ref={scrollRef} style={{
        maxWidth: 480, margin: "0 auto", minHeight: "100vh",
        paddingBottom: 70, fontFamily: "'Outfit',sans-serif",
      }}>
        {/* Header */}
        <div style={{ padding: "16px 16px 0", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "linear-gradient(135deg, #ef4444, #991b1b)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}>⚡</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#f5f5f7", letterSpacing: -0.5 }}>
              Mental Kung Fu
            </div>
          </div>
          <div style={{ fontSize: 9, color: "#4b5563", marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>
            Tactical Mindset Engine
          </div>
        </div>

        <CharacterGrid
          activeCharacters={activeCharacters}
          onToggle={toggleCharacter}
          onProfile={setProfileChar}
        />

        <MoodChips
          activeMoods={activeMoods}
          onToggle={toggleMood}
          savedActive={savedOnly}
          onToggleSaved={() => setSavedOnly(v => !v)}
        />

        <TrendingToday
          batches={batches}
          copiedId={copiedId}
          onCopy={copyLine}
          onSave={toggleSave}
          savedSet={savedSet}
        />

        <LineFeed
          lines={filteredLines}
          copiedId={copiedId}
          onCopy={copyLine}
          onSave={toggleSave}
          savedSet={savedSet}
          search={search}
          onSearchChange={setSearch}
        />
      </div>

      <BottomNav
        onHome={handleHome}
        onForge={() => setForgeOpen(true)}
        onSettings={() => setSettingsOpen(true)}
      />

      <ForgePanel
        visible={forgeOpen}
        onClose={() => setForgeOpen(false)}
        forging={forging}
        forgeStatus={forgeStatus}
        forgeError={forgeError}
        onForge={runForge}
        autoForge={autoForge}
        onToggleAuto={toggleAuto}
      />

      <SettingsPanel
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        onSaveKey={saveKey}
        onClearKey={clearKey}
        onToast={showToast}
      />

      {profileChar && (
        <CharacterProfile
          characterId={profileChar}
          lines={ALL_LINES}
          onClose={() => setProfileChar(null)}
          onCopy={copyLine}
          copiedId={copiedId}
          onSave={toggleSave}
          savedSet={savedSet}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
```

- [ ] **Step 2: Build and verify**

Run: `npm run build`
Expected: Build succeeds with no errors

- [ ] **Step 3: Run dev server and smoke test**

Run: `npm run dev`
Verify in browser:
- Character grid renders 7 characters
- Tapping a character filters the feed
- Mood chips filter correctly
- Saved toggle works
- Forge panel opens from bottom nav
- Settings panel shows API key input
- Lines copy on tap
- Search filters lines
- Long-press opens character profile

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: complete UI overhaul — unified dashboard with character grid and feed"
```

### Task 17: Create components directory and verify build

**Files:**
- Verify: all new files in `src/components/`, `src/hooks/`, `src/lib/`

- [ ] **Step 1: Run production build**

Run: `npm run build`
Expected: Build succeeds, single JS bundle

- [ ] **Step 2: Preview production build**

Run: `npm run preview`
Verify: App loads correctly at the preview URL

- [ ] **Step 3: Final commit and push**

```bash
git add -A
git status  # verify no unexpected files
git commit -m "feat: UI overhaul complete — unified feed with character archetypes"
git push origin main
```
