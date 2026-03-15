# UI Overhaul: Unified Feed + Dashboard

## Summary

Replace the current 4-tab layout (CORE, DECK, SAVED, FORGE) with a single-screen dashboard/feed hybrid. All lines live in one unified feed, filtered by character archetype and mood/energy. Forged lines surface in a "Trending Today" section. Saved lines are a filter toggle, not a separate view.

## Characters

7 character archetypes. Each line in the system is tagged with a character energy:

| Character | ID | Icon | Energy | Source |
|-----------|-----|------|--------|--------|
| John Wick | wick | 🎯 | Silent force — implied capability through stillness | John Wick franchise |
| Tyler Durden | durden | 🔥 | The mirror — you defeat yourself | Fight Club |
| Sierra Six | six | 👤 | Ghost protocol — quiet professionalism, zero ego | The Gray Man |
| Harvey Specter | specter | ⚖️ | Dominance — the outcome is already decided | Suits |
| Seven of Nine | seven | 🧊 | Cold logic — emotional irrelevance as weapon | Star Trek: Voyager |
| Slevin | slevin | 🃏 | Misdirection — casual control, hidden hand | Lucky Number Slevin |
| Capa | capa | ☀️ | Last witness — existential weight, cosmic perspective | Sunshine |

### Character-to-Line Mapping

Each existing line gets a single character tag based on its energy. Assignment rules by category:

| Category | Default Character | Reasoning |
|----------|------------------|-----------|
| REFRAME | slevin | Misdirection — flipping the frame is Slevin's move |
| SCALE | wick | Operating on a different plane — Wick's legend |
| TEMPO | six | Already three moves ahead — Sierra Six's quiet professionalism |
| INDIFFERENCE | seven | Erasing from equation — Seven of Nine's emotional irrelevance |
| DISMISSAL | specter | Acknowledge and discard — Harvey's courtroom energy |
| STOIC | wick | Weaponized calm — Wick's silence |
| INEVITABILITY | seven | Outcome already decided — cold logical certainty |
| CONTROL | durden | Mastery over the system — Durden rewrites the rules |
| EXISTENTIAL | durden | Turn their mind against them — the mirror |
| IDENTITY | capa | Self-definition at cosmic scale — last witness energy |

Individual lines may override the default if their energy better matches a different character. These overrides are set manually in the data file.

### Character Profile Data

Stored in `src/data/characters.js`:

```
{
  id: string,                 // "wick", "durden", etc.
  name: string,               // "John Wick"
  icon: string,               // emoji
  energy: string,             // "Silent force"
  philosophy: string,         // 1-2 sentence description of their approach
  source: string,             // movie/show name
  signatureQuote: string,     // one iconic quote from the actual character
}
```

Signature lines for the profile view are derived at runtime: the first 3 lines in the data tagged with that character.

## Layout (Top → Bottom)

### 1. Header
- App logo (⚡ in red gradient box) + "Mental Kung Fu" title
- Subtitle: "Tactical Mindset Engine"

### 2. Character Grid
- Horizontal scrollable row of character cards
- Each card: icon, short name, 2-word energy description
- **Tap** to filter feed by that character's lines (multi-select, tap again to deselect)
- **Long-press** to open character profile overlay (philosophy, signature quote, all tagged lines)
- Active character has highlighted border + accent color

### 3. Mood/Energy Chips
- Horizontal wrap row of pill-shaped chips
- Moods: Cold, Calculated, Existential, Dismissive, Stoic (maps to existing categories)
- Special chip: ★ Saved — toggles feed to show only saved lines
- Multi-select — combine character + mood filters
- Active chip has red accent styling

### 4. Trending Today Section
- Header: "⚡ TRENDING TODAY" with pulse indicator
- Shows forged lines from the most recent forge run
- Each line card has: line text, category tag, character energy, event attribution ("← headline"), save star
- Subtle gradient border distinguishes from static lines
- Hidden when no lines have been forged yet (no empty state — section just doesn't render)

### 5. All Lines Feed
- Header: "ALL LINES" with count (reflects current filter)
- Unified, deduplicated feed — the 60 lines from categories.js are the canonical set (core-set.js is removed; those 10 lines already exist within categories.js)
- Each line card: line text, category tag (colored), character name, save star (☆/★)
- Tap to copy to clipboard with toast confirmation
- Filtered by active character and mood selections
- **Default sort**: by category group (all REFRAME together, then SCALE, etc.), maintaining the order from categories.js
- Forged lines appear at the top of the feed (newest first) when no filters are active, or mixed into filtered results
- Search bar above the feed for text search (carried over from current app)

### 6. Bottom Navigation
- Fixed bottom bar, 3 items:
  - **Home** (🏠) — scrolls to top / resets filters
  - **Forge** (⚡) — prominent raised circular button. Opens forge slide-up panel (Forge Now button, auto-forge toggle, forge status display)
  - **Settings** (⚙️) — API key input, app info

## Data Model

### Line Object (unified)

The canonical data lives in `src/data/categories.js`. Each line gets two new fields:

```
{
  line: string,
  category: string,          // REFRAME, SCALE, TEMPO, etc. (unchanged)
  character: string,          // "wick", "durden", "six", "specter", "seven", "slevin", "capa"
}
```

Mood is **derived at runtime** from the category using this lookup (not stored on the object):

| Mood Chip | Categories Included |
|-----------|-------------------|
| Cold | TEMPO, INDIFFERENCE |
| Calculated | CONTROL, INEVITABILITY |
| Existential | EXISTENTIAL, IDENTITY |
| Dismissive | DISMISSAL, REFRAME |
| Stoic | STOIC, SCALE |

### Saved Lines (unchanged)

Saved state remains a separate array in localStorage under `"saved-lines"`:

```
[{ line: string, category: string, savedAt: number }]
```

The ★ Saved chip filters the feed to lines whose `line` string exists in this array. No changes to the saved data structure.

### Forged Lines

Forged batches remain in localStorage under `"forged-lines"`. Each forged line now includes a `character` field:

```
{
  id: string,
  line: string,
  category: string,
  character: string,          // assigned by the forge prompt
  inspired_by?: string,
}
```

Existing forged batches without `character` field default to `"wick"` at render time.

## Forge Changes

### Prompt Update

Add to the existing forge prompt, after the line generation rules:

```
- Assign each line a character energy from: wick, durden, six, specter, seven, slevin, capa
  - wick: silent force, implied capability
  - durden: existential mirror, system destruction
  - six: ghost professionalism, zero ego
  - specter: dominance, procedural certainty
  - seven: cold logic, emotional irrelevance
  - slevin: casual misdirection, hidden hand
  - capa: cosmic perspective, existential weight
```

Add `"character"` to the JSON output format:
```
{"events":[...],"lines":[{"line":"...","category":"...","character":"...","inspired_by":"...","target":"..."}]}
```

### Forge Panel

Slides up from bottom when Forge button tapped. Contains:
- Forge Now button + Auto-forge toggle (from current FORGE tab)
- Forge status panel with pipeline stages (from current implementation)
- Dismiss by swiping down or tapping outside

API key input moves to the Settings screen.

## Interactions

| Action | Behavior |
|--------|----------|
| Tap line card | Copy to clipboard + toast |
| Tap ☆ on line | Save/unsave line, persist to localStorage |
| Tap character card | Toggle filter — show only that character's lines |
| Long-press character card | Open character profile overlay |
| Tap mood chip | Toggle filter — show lines matching those categories |
| Tap ★ Saved chip | Show only saved lines |
| Tap Forge (bottom nav) | Open forge slide-up panel |
| Tap Home (bottom nav) | Scroll to top, clear all filters |
| Tap Settings (bottom nav) | Open settings screen |

## What Gets Removed

- CORE, DECK, SAVED, FORGE tabs and tab navigation bar
- `src/data/core-set.js` — those 10 lines already exist in categories.js
- Accordion expand/collapse for categories
- "EXPAND ALL / COLLAPSE ALL" controls
- Stats strip in header
- Neural activity indicator in header (the forge status panel replaces this)

## What Gets Added

- `src/data/characters.js` — character profile definitions
- Character grid component
- Mood chip filter component
- Character profile overlay
- Forge slide-up panel
- Bottom navigation bar
- Settings screen
- `character` field on each line in categories.js

## Migration

- 60 lines in categories.js get `character` field added per the mapping table above
- core-set.js is deleted (lines are duplicates)
- Saved lines in localStorage remain compatible — matched by `line` string
- Existing forged batches default `character` to `"wick"` if missing
- API key stays in localStorage under `"anthropic-api-key"`
- Search functionality carried over from current app
