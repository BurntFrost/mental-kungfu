# Dynamic Character Background Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add animated plasma-morph background orbs that change color based on character selection.

**Architecture:** A new `BackgroundPlasma` component renders 3 fixed-position blurred orbs behind all app content. Character selection drives the orb color via a `lastSelectedCharacter` ref in App.jsx. Crossfades use CSS `transition: background-color 1.5s`. A neutral grey ambient plays when no character is active.

**Tech Stack:** React (JSX), CSS-in-JS (inline styles matching existing codebase patterns)

**Spec:** `docs/superpowers/specs/2026-03-15-dynamic-character-background-design.md`

---

## Task 1: Add `color` field to character data

**Files:**
- Modify: `src/data/characters.js`

- [ ] **Step 1: Add `color` to each character**

Add a `color` property to every character object in `CHARACTERS`. Insert it after `signatureQuote` for consistency. Values from the spec:

```javascript
// In each character object, add after signatureQuote:
wick:    color: "#ef4444",   // Red
durden:  color: "#f97316",   // Orange
six:     color: "#64748b",   // Slate
specter: color: "#eab308",   // Gold
seven:   color: "#06b6d4",   // Cyan
slevin:  color: "#8b5cf6",   // Violet
capa:    color: "#fb923c",   // Light orange
snape:   color: "#475569",   // Mid-slate
spock:   color: "#3b82f6",   // Blue
stark:   color: "#dc2626",   // Deep red
thanos:  color: "#a855f7",   // Purple
batman:  color: "#334155",   // Dark blue-slate
strange: color: "#14b8a6",   // Teal
lecter:  color: "#7c3aed",   // Deep violet
chigurh: color: "#94a3b8",   // Light slate
joker:   color: "#22c55e",   // Bright green
heisenberg: color: "#f59e0b", // Amber
rorschach: color: "#78716c", // Stone
```

- [ ] **Step 2: Verify no syntax errors**

Run: `npx vite build --mode development 2>&1 | head -5`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/data/characters.js
git commit -m "feat: add color field to all characters for dynamic background"
```

---

## Task 2: Create `BackgroundPlasma` component

**Files:**
- Create: `src/components/BackgroundPlasma.jsx`

- [ ] **Step 1: Create the component file**

```jsx
import { useMemo } from "react";

const NEUTRAL = "rgba(255,255,255,0.06)";

const ORB_CONFIG = [
  { size: "55vmax", top: "-10%", left: "-10%", opacity: 0.35, duration: "7s",  kf: "plasma1" },
  { size: "45vmax", bottom: "-12%", right: "-8%", opacity: 0.30, duration: "9s",  kf: "plasma2" },
  { size: "35vmax", top: "35%", left: "45%", opacity: 0.25, duration: "11s", kf: "plasma3" },
];

const KEYFRAMES = `
@keyframes plasma1 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(30%, 20%) scale(1.3); }
  66% { transform: translate(10%, 40%) scale(0.9); }
}
@keyframes plasma2 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(-25%, -15%) scale(1.2); }
  66% { transform: translate(-40%, -30%) scale(0.85); }
}
@keyframes plasma3 {
  0%, 100% { transform: translate(0, 0) scale(1); }
  50% { transform: translate(-30%, 20%) scale(1.4); }
}
`;

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

export default function BackgroundPlasma({ color }) {
  const orbColors = useMemo(() => {
    if (!color) return ORB_CONFIG.map(() => NEUTRAL);
    return ORB_CONFIG.map((orb) => hexToRgba(color, orb.opacity));
  }, [color]);

  return (
    <>
      <style>{KEYFRAMES}</style>
      <div style={{
        position: "fixed",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}>
        {ORB_CONFIG.map((orb, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: orb.size,
              height: orb.size,
              top: orb.top,
              bottom: orb.bottom,
              left: orb.left,
              right: orb.right,
              borderRadius: "50%",
              backgroundColor: orbColors[i],
              filter: "blur(70px)",
              transition: "background-color 1.5s ease-in-out",
              animation: `${orb.kf} ${orb.duration} ease-in-out infinite`,
              willChange: "transform",
            }}
          />
        ))}
      </div>
    </>
  );
}
```

- [ ] **Step 2: Verify no syntax errors**

Run: `npx vite build --mode development 2>&1 | head -5`
Expected: No errors

- [ ] **Step 3: Commit**

```bash
git add src/components/BackgroundPlasma.jsx
git commit -m "feat: add BackgroundPlasma component with plasma morph orbs"
```

---

## Task 3: Wire `BackgroundPlasma` into App.jsx

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Add import**

At the top of `src/App.jsx`, add after the existing component imports (after line 14):

```javascript
import BackgroundPlasma from "./components/BackgroundPlasma.jsx";
import { CHARACTERS } from "./data/characters.js";
```

`CHARACTERS` is not currently imported in App.jsx — this import is required.

- [ ] **Step 2: Add `lastSelectedCharacter` ref**

Inside `MentalKungFuApp()`, after the `scrollRef` ref on line 70 (there are two refs: `toastTimer` on line 69, `scrollRef` on line 70):

```javascript
const lastSelectedChar = useRef(null);
```

- [ ] **Step 3: Update `toggleCharacter` to track last selected**

Replace the existing `toggleCharacter` callback (lines 99-105). The ref mutation must happen **outside** the `setState` updater to avoid issues with React 18 Concurrent Mode (updaters may be called multiple times):

```javascript
const toggleCharacter = useCallback((id) => {
  setActiveCharacters(prev => {
    const next = new Set(prev);
    next.has(id) ? next.delete(id) : next.add(id);
    return next;
  });
  // Update ref outside the updater — safe for Concurrent Mode
  if (lastSelectedChar.current === id) {
    // Deselecting the current character — clear ref
    // (We can't easily pick "next best" without reading the new Set,
    //  but plasmaColor derivation handles null gracefully)
    lastSelectedChar.current = null;
  } else {
    lastSelectedChar.current = id;
  }
}, []);
```

- [ ] **Step 4: Derive plasma color**

After the `toggleCategory` callback (line 129), before the `forgedFeedLines` useMemo (line 132), add:

```javascript
const plasmaColor = activeCharacters.size > 0 && lastSelectedChar.current
  ? CHARACTERS[lastSelectedChar.current]?.color ?? null
  : null;
```

- [ ] **Step 5: Add `BackgroundPlasma` to render output**

In the return JSX, add `<BackgroundPlasma>` as the first element inside the Fragment, before `<style>{CSS}</style>` (line 170):

```jsx
return (
  <>
    <BackgroundPlasma color={plasmaColor} />
    <style>{CSS}</style>
    <div ref={scrollRef} style={{
      maxWidth: 720, margin: "0 auto", minHeight: "100vh",
      paddingBottom: 70, fontFamily: "'Outfit',sans-serif",
      position: "relative", zIndex: 1, isolation: "isolate",
    }}>
```

Note the additions to the content wrapper `div` style: `position: "relative"`, `zIndex: 1`, `isolation: "isolate"`.

**Important:** `BottomNav`, `ForgePanel`, `SettingsPanel`, `CharacterProfile`, and `Toast` all render outside this content wrapper div. They already use high z-index values (Toast uses `z-index: 200`) so they will correctly render above the plasma background. No changes needed for these.

- [ ] **Step 6: Update `handleHome` to clear lastSelectedChar**

In `handleHome` (lines 159-167), add before the `scrollRef.current?.scrollTo` call on line 166:

```javascript
lastSelectedChar.current = null;
```

- [ ] **Step 7: Verify the app runs**

Run: `npx vite build --mode development 2>&1 | head -5`
Expected: No errors

- [ ] **Step 8: Manual verification**

Run: `npx vite --open`

Verify:
1. App loads with faint grey orbs drifting (neutral state)
2. Click a character → orbs crossfade to that character's color over ~1.5s
3. Click another character → orbs crossfade to new color
4. Deselect all characters → orbs fade back to neutral grey
5. Home button resets to neutral
6. Content (cards, text, chips) renders cleanly above the orbs with no visual bleed

- [ ] **Step 9: Commit**

```bash
git add src/App.jsx
git commit -m "feat: wire BackgroundPlasma to character selection in App"
```
