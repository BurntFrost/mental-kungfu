# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Dev server (Vite on http://localhost:3000)
npm run build     # Production build → dist/
npm run preview   # Preview production build locally
```

No test runner, linter, or formatter is configured.

## Architecture

**Mental Kung Fu** is a React 18 + Vite 5 PWA — a tactical mindset engine providing curated psychological one-liners for mental toughness, with an AI forge that generates new lines from live current events via the Anthropic Claude API.

### Key Files

- **`src/App.jsx`** — Monolithic main component (~505 lines): contains inlined data copies, styles, and core logic. **Important:** Data is duplicated between App.jsx and `src/data/` — both must be kept in sync when editing.
- **`src/lib/forge-api.js`** — Anthropic API integration (claude-sonnet-4-20250514 + web_search tool)
- **`src/lib/lines.js`** — Line filtering/grouping utilities
- **`src/data/`** — Canonical data: categories.js (10 categories), characters.js (23+ archetypes), moods.js, emotions.js
- **`src/hooks/`** — useStorage.js (localStorage), useForge.js (forge orchestration)
- **`src/components/`** — 15 modular React components (LineFeed, ForgePanel, CharacterGrid, FilterChips, etc.)

### Data Model

- **10 psychological categories**: REFRAME, SCALE, TEMPO, INDIFFERENCE, DISMISSAL, STOIC, INEVITABILITY, CONTROL, EXISTENTIAL, IDENTITY
- **23+ character archetypes** (John Wick, Harvey Specter, Tyler Durden, etc.)
- **8 moods**, **12 emotions** for filtering
- **Forge batches** stored in localStorage (`forged-lines`, max 20 retained)

### API Integration

The Forge Engine calls Anthropic's API directly from the browser using `anthropic-dangerous-direct-browser-access` header. API key stored in localStorage or `.env` (`VITE_ANTHROPIC_API_KEY`). Auto-forge runs every 90 seconds when enabled.

### Deployment

GitHub Pages via `.github/workflows/deploy.yml`. Vite base path: `/mental-kungfu/`.

## Conventions

- No TypeScript — plain JSX
- CSS-in-JS via inline styles and a single `<style>` tag in App.jsx
- Google Fonts: IBM Plex Mono (body) + Outfit (headings)
- Dual data source gotcha: App.jsx inlines data copies — keep in sync with `src/data/`
- See `AGENTS.md` for additional project guidance and `docs/` for design/category/forge specs
