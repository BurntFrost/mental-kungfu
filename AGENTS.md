# AGENTS.md — Mental Kung Fu Project

AI agent instructions for the `mental-kungfu` codebase. Claude Code picks this up automatically as project-level context.

---

## Project Overview

**Mental Kung Fu** is a React PWA — a tactical mindset engine with three modes:

| Mode | Description |
|------|-------------|
| **Core 10** | Locked primary arsenal — 10 lines across 10 psychological vectors |
| **Full Deck** | Expanded arsenal — 60 lines across 10 categories, collapsible by category |
| **Forge Engine** | AI-powered generator: scans live current events → generates 5 new one-liners per run |

Archetypes: John Wick (implied capability), Tyler Durden (mirror/existential), Harvey Specter (dominance as procedure).

---

## Tech Stack

- **React 18** — functional components + hooks only (no class components)
- **Vite 5** — bundler, dev server on port 3000
- **Anthropic API** — `claude-sonnet-4-20250514` with `web_search_20250305` tool (Forge Engine)
- **localStorage** — persistence for forged batches (`forged-lines`) and starred lines (`saved-lines`)
- **CSS-in-JS** — all styles are in a `CSS` template literal inside `src/App.jsx`, injected via `<style>{CSS}</style>`
- **No external UI framework** — raw React + CSS custom properties only
- **Google Fonts CDN** — IBM Plex Mono (body) + Outfit (headings)

---

## Project Structure

```
mental-kungfu/
├── src/
│   ├── App.jsx              # Entire application — all components, data, styles, API logic
│   ├── data/
│   │   ├── core-set.js      # Exported CORE_SET array (10 lines)
│   │   └── categories.js    # Exported CATEGORIES object + CATEGORY_KEYS (60 lines)
│   ├── reference/
│   │   └── card.jsx          # v1 static reference card (legacy, not used in App.jsx)
│   └── main.jsx             # React entry point — mounts App to #root
├── docs/
│   ├── DESIGN.md             # Psychological framework and anti-patterns
│   ├── CATEGORIES.md         # Full category taxonomy reference
│   └── FORGE-ENGINE.md       # Forge Engine technical documentation
├── public/                   # Static assets
├── index.html                # PWA entry — preloads Google Fonts, sets bg #08080c
├── package.json
├── vite.config.js            # Vite config, port 3000
└── .env                      # NOT committed — contains VITE_ANTHROPIC_API_KEY
```

> **Note**: `src/data/categories.js` and `src/data/core-set.js` exist as canonical exports but `src/App.jsx` also inlines its own copies of `CORE_SET` and `CATEGORIES`. If editing line data, update **both** the data files and the inline copies in `App.jsx`.

---

## Development Commands

```bash
npm run dev       # Start dev server at http://localhost:3000
npm run build     # Production build → dist/
npm run preview   # Preview production build
```

No test runner is configured. No linter is configured. Manual browser testing is the current workflow.

---

## Environment Variables

The Forge Engine requires an Anthropic API key. Create `.env` in the project root (it is gitignored):

```
VITE_ANTHROPIC_API_KEY=your_key_here
```

Accessed in `App.jsx` via `import.meta.env.VITE_ANTHROPIC_API_KEY`. If missing, the Forge Engine throws a descriptive error displayed in the UI.

---

## Architecture Notes

### App.jsx is the monolith

All logic lives in `src/App.jsx`:
- `CORE_SET` array and `CATEGORIES` object are inlined at the top
- `CSS` template literal contains all styles (injected via `<style>`)
- `loadForged()`, `saveForged()`, `loadSaved()`, `saveSavedLines()` — localStorage helpers
- `forgeNewLines()` — async function that calls the Anthropic API
- Components: `Toast`, `LineCard`, `NeuralActivity`, `SearchBar`, `MentalKungFuApp`

### Data Model

**Category object shape:**
```js
{
  icon: "↻",           // Unicode symbol
  color: "#3b82f6",    // Hex color for theming
  desc: "...",         // Short description
  archetype: "...",    // Archetype reference
  lines: ["...", ...], // 6 lines per category
}
```

**Forged batch shape:**
```js
{
  id: Date.now(),
  timestamp: new Date().toISOString(),
  events: [{ headline: "...", source: "..." }],
  lines: [{
    id: `${Date.now()}-${index}`,
    line: "...",
    category: "REFRAME",   // Must be a valid CATEGORIES key
    inspired_by: "..."
  }]
}
```

**Saved line shape:**
```js
{ line: "...", category: "REFRAME", savedAt: Date.now() }
```

### Storage

- `localStorage.getItem("forged-lines")` / `setItem` — max 20 batches retained
- `localStorage.getItem("saved-lines")` / `setItem` — user's starred collection
- Both wrapped in try/catch; failures are logged but non-fatal

### Forge Engine flow

1. `runForge()` is called (debounced by `forging` flag — single-flight)
2. Calls Anthropic API with `web_search_20250305` tool enabled
3. Claude searches current events, then generates 5 lines as structured JSON
4. Response processing: extract `type === "text"` blocks, parse JSON (with regex fallback)
5. Batch is prepended to `forgedBatches` state, persisted to localStorage
6. Auto-forge mode: `setInterval(runForge, 90000)` when `autoForge === true`

### CSS Architecture

All styles are in the `CSS` const in `App.jsx` — a single `<style>` tag injected in JSX. CSS custom properties are defined in `:root`. Class names used:
- `.scan-line` — full-app wrapper with scan-line animation pseudo-element
- `.line-card` — clickable line card with hover/active/focus states
- `.tab-btn`, `.tab-btn--active`, `.tab-btn--inactive` — navigation tabs
- `.save-btn` — star button on line cards
- `.cat-header`, `.cat-accordion`, `.deck-line` — Deck tab accordion
- `.forge-btn`, `.shimmer-btn`, `.forge-pulse` — Forge tab controls
- `.toast`, `.toast--exit` — notification system
- `.search-input` — search bar
- `.neural-dot` — animated neural activity bars
- `.clear-batch-btn` — batch management buttons
- `.fade-in` — entrance animation for tab content

Responsive breakpoint at `@media (max-width: 480px)`.

---

## The 10 Categories

| Key | Icon | Color | Archetype |
|-----|------|-------|-----------|
| `REFRAME` | ↻ | `#3b82f6` | Harvey Specter |
| `SCALE` | △ | `#8b5cf6` | John Wick |
| `TEMPO` | ◉ | `#ef4444` | John Wick |
| `INDIFFERENCE` | ◌ | `#64748b` | John Wick |
| `DISMISSAL` | ⊘ | `#f59e0b` | Harvey Specter |
| `STOIC` | ◇ | `#06b6d4` | Marcus Aurelius |
| `INEVITABILITY` | ⊞ | `#10b981` | John Wick |
| `CONTROL` | ⊕ | `#ec4899` | Tyler Durden |
| `EXISTENTIAL` | ◈ | `#f43f5e` | Tyler Durden |
| `IDENTITY` | ⬡ | `#a855f7` | All three |

---

## Line Quality Rules

New lines added to the deck must pass this rubric (see `docs/DESIGN.md`):

1. **Compression** — under 20 words; best lines are under 15
2. **Reframe** — the listener's frame of reference must shift
3. **Temperature** — cold, never hot; calm is the weapon; no exclamation points, no volume
4. **Standalone** — works without context or setup
5. **Archetype alignment** — maps cleanly to Wick / Durden / Specter energy

**Anti-patterns to reject:**
- Explaining the insult (manual = fail)
- Acknowledging peer status (breaks scale assertion)
- Loud energy or anger signals
- Clichés ("stay in your lane", "I'm built different")
- Self-congratulation ("I'm the greatest at X")
- Double-barrel lines trying to do two things at once

---

## Common Tasks

### Add a new line to an existing category
1. Add to the `lines` array in `src/data/categories.js` under the correct category key
2. Add the same line to the inline `CATEGORIES` object in `src/App.jsx`
3. The Deck tab will pick it up automatically (no index needed)

### Add a new category
1. Add the category object to `CATEGORIES` in both `src/data/categories.js` and `src/App.jsx`
2. `CAT_KEYS` is derived from `Object.keys(CATEGORIES)` — it updates automatically
3. Pick an unused Unicode symbol for `icon`, a unique hex for `color`
4. Update `docs/CATEGORIES.md` with the new entry
5. Stats strip hardcodes "Deck: 60" — update if line count changes

### Modify the Forge Engine prompt
The prompt is in `forgeNewLines()` in `src/App.jsx` (around line 395–410). The `catList` variable is injected into the prompt from `CAT_KEYS`. Keep the output format instruction strict — the JSON parser is brittle.

### Change the model
Update the `model` field in the `forgeNewLines()` fetch body. Also update the reference in `docs/FORGE-ENGINE.md` and `README.md`.

### Add a new tab
1. Add the tab key to the `TABS` array: `const TABS = ["CORE", "DECK", "SAVED", "FORGE"]`
2. Add a conditional render block inside the content area (`{tab === "NEW_TAB" && (...)}`
3. The tab button renders automatically from the `TABS` array

---

## Known Patterns & Gotchas

- **Dual data source**: `src/App.jsx` inlines its own data rather than importing from `src/data/`. Always sync both when editing content.
- **No TypeScript**: Plain JSX throughout. No type checking.
- **`window.storage` in README is wrong**: The actual implementation uses `localStorage` directly (the README references an older design). Trust the code, not the README for storage details.
- **`src/reference/card.jsx`**: Legacy v1 component. Not imported or used anywhere in the current app. Safe to ignore.
- **CSS custom properties**: Defined in `:root` inside the `CSS` const. Colors are `--bg-0` through `--bg-3`, `--text-0` through `--text-3`, `--red`, `--red-dim`, `--accent`.
- **Auto-forge warning**: Each auto-forge cycle consumes Anthropic API credits. Auto-forge fires at 90-second intervals — approximately 40 calls/hour max.
- **Forge JSON parsing**: Uses a two-pass approach (direct parse, then regex fallback). If the API response format changes, update `forgeNewLines()` parsing logic.
- **`anthropic-dangerous-direct-browser-access` header**: Required because the API is called directly from the browser without a proxy. This is intentional for the PWA architecture.
