# Mental Kung Fu

**A tactical mindset engine powered by AI.** 108 curated one-liners for mental toughness — filterable by character, mood, emotion, and category — plus an AI forge that generates new lines from live current events.

**[Try it live →](https://burntfrost.github.io/mental-kungfu/)**

---

## Overview

Browse, filter, and generate cold, confident one-liners across 10 psychological categories.

**Filters** — Narrow the feed by combining any of:
- **18 Characters** — Wick, Durden, Specter, Snape, Stark, Thanos, Batman, Lecter, Joker, Heisenberg, and more (tap to filter, long-press for profile)
- **6 Emotions** — Angry, Insecure, Disrespected, Anxious, Challenged, Underestimated
- **5 Moods + 10 Categories** — Combined filter row with mood shortcuts (Cold, Calculated, Existential, Dismissive, Stoic) and granular category pills (Reframe, Scale, Tempo, etc.)

Emotion filters surface lines that counter or channel that state (e.g. "Angry" → Stoic + Indifference + Control lines). All filters combine freely.

**Line Feed** — Three view modes:
- **By Category** — Lines grouped under collapsible section headers with color-coded category icons, descriptions, and counts
- **By Character** — Grouped by character archetype, sorted by line count
- **Shuffle** — Randomized flat list with reshuffle

Tap any line to copy. Star to save. Each card shows category, character, and emotion tags.

**Trending Today** — Collapsible section showing the latest AI-forged lines with source attribution.

---

## Forge Engine

Generates fresh lines from real current events via the Anthropic API:

1. Searches today's headlines via web search
2. Performs psychological deconstruction on trending stories
3. Generates 2 tactical one-liners with category + character assignment
4. Results appear in Trending Today with source attribution

**Auto-forge** mode regenerates every 90 seconds. Requires an [Anthropic API key](https://console.anthropic.com/settings/keys) — enter it in Settings (⚙️). Stored in localStorage only; nothing leaves the browser.

---

## Run Locally

```bash
git clone https://github.com/BurntFrost/mental-kungfu.git
cd mental-kungfu
npm install
npm run dev        # http://localhost:3000
```

```bash
npm run build      # Production build → dist/
npm run preview    # Preview production build
```

Auto-deploys to GitHub Pages on push to `main`.

---

## Tech Stack

- **React 18** + **Vite 5** — functional components + hooks, dev server on port 3000
- **Anthropic API** (Claude Sonnet + web search) — Forge Engine
- **localStorage** — saved lines, forged batches, API key
- **GitHub Pages** — auto-deployed via GitHub Actions

```
src/
├── App.jsx              # Orchestrator + global styles
├── components/
│   ├── BottomNav.jsx    # Home / Forge / Settings navigation
│   ├── CharacterGrid.jsx
│   ├── CharacterProfile.jsx
│   ├── EmotionChips.jsx
│   ├── FilterChips.jsx  # Combined mood + category + saved filters
│   ├── ForgePanel.jsx
│   ├── LineCard.jsx
│   ├── LineFeed.jsx     # Grouped/character/shuffle view modes
│   ├── SettingsPanel.jsx
│   ├── Toast.jsx
│   └── TrendingToday.jsx
├── data/                # Categories, characters, moods, emotions
├── hooks/               # useStorage, useForge
└── lib/                 # Line filtering + grouping, forge API
```

---

## Docs

- [`docs/DESIGN.md`](docs/DESIGN.md) — Psychological framework and anti-patterns
- [`docs/CATEGORIES.md`](docs/CATEGORIES.md) — Full category taxonomy with archetypes
- [`docs/FORGE-ENGINE.md`](docs/FORGE-ENGINE.md) — Forge Engine technical spec

---

## License

MIT
