# Dynamic Character Background — Design Spec

## Overview

Add a living, animated background to the Mental Kung Fu app that responds to character selection. Plasma-style blurred orbs drift across the background, adopting the selected character's color. When no character is selected, a neutral grey ambient keeps the background alive.

## Trigger

Character selection in the `CharacterGrid` component drives the background color.

- Selecting a character → orbs crossfade to that character's color
- Deselecting a character → orbs crossfade back to neutral grey
- Multiple characters selected → uses the most recently selected character's color

**State change required:** Add a `lastSelectedCharacter` ref (or state) to `App.jsx` alongside the existing `activeCharacters` Set. Updated inside `toggleCharacter` — set to the character ID when adding, cleared (or set to the next most recent) when removing. The `Set` cannot track insertion order through toggles.

## Visual Effect: Plasma Morph

3-4 absolutely positioned circular elements behind all app content:

| Orb | Size | Opacity | Animation Duration | Notes |
|-----|------|---------|-------------------|-------|
| 1 | 55% viewport | 0.35 | 7s | Top-left origin, drifts right/down |
| 2 | 45% viewport | 0.30 | 9s | Bottom-right origin, drifts left/up |
| 3 | 35% viewport | 0.25 | 11s | Center, expands/contracts |
| 4 (optional) | 30% viewport | 0.20 | 8s | Top-right, subtle drift |

**CSS properties:**
- `filter: blur(60-80px)`
- `border-radius: 50%`
- Each orb uses a flat `background-color` (not `radial-gradient`) — the heavy blur naturally creates the gradient/glow effect
- Movement via `@keyframes` using `transform: translate() scale()` for GPU compositing
- **No `mix-blend-mode`** — opacity alone handles the blending against the dark background

**Why flat `background-color`:** CSS `transition` cannot interpolate between `radial-gradient` values — it snaps instantly. Using a flat color with `filter: blur()` achieves the same soft-glow visual and enables smooth `transition: background-color 1.5s ease-in-out` crossfades.

## Transition

Smooth crossfade via CSS `transition: background-color 1.5s ease-in-out` on each orb element. No JS animation loops — the browser interpolates between the old and new colors natively.

## Neutral State

When no character is selected, orbs render with neutral tones:
- `rgba(255, 255, 255, 0.06)` (uniform across orbs)
- Same animation behavior — background stays alive but colorless

## Character Colors

New `color` field added to each character in `src/data/characters.js`. All colors are unique per character and chosen to be visible against the `#08080c` base:

| Character | Color | Rationale |
|-----------|-------|-----------|
| John Wick | `#ef4444` | Red — lethal precision, blood |
| Tyler Durden | `#f97316` | Orange — chaos, fire, anarchy |
| Sierra Six | `#64748b` | Slate — ghost, shadow operative |
| Harvey Specter | `#eab308` | Gold — power, authority, wealth |
| Seven of Nine | `#06b6d4` | Cyan — Borg tech, cold logic |
| Slevin | `#8b5cf6` | Violet — misdirection, sleight |
| Capa | `#fb923c` | Light orange — sun, warmth, sacrifice |
| Snape | `#475569` | Mid-slate — shadows with enough contrast to read |
| Spock | `#3b82f6` | Blue — logic, calm, Starfleet |
| Tony Stark | `#dc2626` | Deep red — Iron Man suit, bravado |
| Thanos | `#a855f7` | Purple — infinity, cosmic power |
| Batman | `#334155` | Dark blue-slate — darkness with visible presence |
| Dr. Strange | `#14b8a6` | Teal — time stone, mysticism |
| Hannibal Lecter | `#7c3aed` | Deep violet — sophistication, menace |
| Anton Chigurh | `#94a3b8` | Light slate — cold, inevitable, clinical |
| Joker | `#22c55e` | Bright green — chaos, unpredictability |
| Heisenberg | `#f59e0b` | Amber — meth gold, empire |
| Rorschach | `#78716c` | Stone — grit, moral absolutism |

**Color distinctiveness:** No two characters share the same hex value. Similar hues are differentiated by lightness/saturation (e.g., Wick `#ef4444` vs Stark `#dc2626`, Hannibal `#7c3aed` vs Thanos `#a855f7`).

## Component: `BackgroundPlasma`

New file: `src/components/BackgroundPlasma.jsx`

**Props:**
- `color` — hex string or `null` (null = neutral state)

**Renders:**
- A `div` with `position: fixed; inset: 0; z-index: 0; pointer-events: none; overflow: hidden`
- 3-4 child `div` orbs with inline styles for size, position, animation
- Color applied via inline `background-color` style with character-specific opacity

**Placement in App.jsx:**
- Rendered as the first child inside the root container
- Content wrapper gets `isolation: isolate` to prevent any potential blend-mode leaking from future changes
- All other content sits above via `position: relative; z-index: 1` on the content wrapper

## Data Flow

```
toggleCharacter(id) in App.jsx
  → update activeCharacters Set (existing)
  → update lastSelectedCharacter ref (new)
  → derive color: activeCharacters.size > 0
      ? CHARACTERS[lastSelectedCharacter].color
      : null
  → pass to <BackgroundPlasma color={color} />
  → CSS transition handles the visual change
```

## Performance

- All animations use `transform` and `opacity` — GPU-composited, no layout thrash
- `filter: blur()` is applied once per orb, not per-frame
- `pointer-events: none` ensures no interaction interference
- No JS animation loops — pure CSS `@keyframes` + `transition`

## Scope Boundaries

**In scope:**
- `BackgroundPlasma` component
- `color` field on character data
- `lastSelectedCharacter` state in App.jsx
- Wiring in `App.jsx`

**Out of scope:**
- Emotion-driven backgrounds (future enhancement)
- Category-driven backgrounds (future enhancement)
- User preference to disable animation
- Light mode support
