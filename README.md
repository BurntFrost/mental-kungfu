# Mental Kung Fu

**A tactical mindset engine powered by AI.** 90+ curated one-liners for mental toughness — filterable by character, mood, and emotion — plus an AI forge that generates new lines from live current events.

**[Try it live →](https://burntfrost.github.io/mental-kungfu/)**

---

## Overview

A unified dashboard for browsing, filtering, and generating cold, confident one-liners across 10 psychological categories.

**Filters** — Narrow the feed by combining any of:
- **13 Characters** — Wick, Durden, Specter, Snape, Stark, Thanos, Batman, and more (tap to filter, long-press for profile)
- **5 Moods** — Cold, Calculated, Existential, Dismissive, Stoic
- **6 Emotions** — Angry, Insecure, Disrespected, Anxious, Challenged, Underestimated

Emotion filters surface lines that counter or channel that state (e.g. "Angry" → Stoic + Indifference + Control lines). Mood and emotion filters combine freely.

**Line Cards** — Each line shows its category (with hover tooltip), character, and emotion tags in a single compact row. Tap to copy, star to save.

**Trending Today** — Collapsible section showing the latest AI-forged lines with source attribution.

---

## Forge Engine

Generates fresh lines from real current events via the Anthropic API:

1. Searches today's headlines via web search
2. Performs psychological deconstruction on trending stories
3. Generates 2 tactical one-liners with category + character assignment
4. Results appear in Trending Today with source attribution

**Auto-forge** mode regenerates every 90 seconds. Requires an [Anthropic API key](https://console.anthropic.com/settings/keys) — enter it in Settings (⚙️). Stored in localStorage only; nothing server-side.

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

- **React 18** + **Vite 5** — modular components, hooks, dev server on port 3000
- **Anthropic API** (Claude Sonnet + web search) — Forge Engine
- **localStorage** — saved lines, forged batches, API key
- **GitHub Pages** — auto-deployed via GitHub Actions

```
src/
├── App.jsx            # Orchestrator + global styles
├── components/        # LineCard, CharacterGrid, ForgePanel, EmotionChips, etc.
├── data/              # Categories, characters, moods, emotions
├── hooks/             # useStorage, useForge
└── lib/               # Line filtering, forge API
```

---

## Docs

- [`docs/DESIGN.md`](docs/DESIGN.md) — Psychological framework and anti-patterns
- [`docs/CATEGORIES.md`](docs/CATEGORIES.md) — Full category taxonomy with archetypes
- [`docs/FORGE-ENGINE.md`](docs/FORGE-ENGINE.md) — Forge engine technical spec

---

## License

MIT
