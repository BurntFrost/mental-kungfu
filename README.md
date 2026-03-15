# Mental Kung Fu

**A tactical mindset engine powered by AI.** Browse curated one-liners for mental toughness, or generate fresh ones from today's current events.

**[Try it live](https://burntfrost.github.io/mental-kungfu/)**

---

## What It Does

Mental Kung Fu gives you cold, confident one-liners across 10 psychological categories — think John Wick meets Harvey Specter. Use them as mental anchors, conversation ammo, or just a daily mindset reset.

The app has four tabs:

| Tab | What's There |
|-----|-------------|
| **CORE** | 10 locked primary lines — one per category |
| **DECK** | 60 expanded lines organized by category |
| **SAVED** | Your personal collection — star any line to save it |
| **FORGE** | AI-powered generator that scans live news and creates new lines |

### The 10 Categories

Reframe, Scale, Tempo, Indifference, Dismissal, Stoic, Inevitability, Control, Existential, Identity

Each targets a different psychological vector — from flipping someone's frame to erasing them from the equation entirely.

---

## Forge Engine

The Forge tab connects to the Anthropic API to generate fresh lines from real current events:

1. Searches today's headlines via web search
2. Finds metaphor potential in the news
3. Generates 5 tactical one-liners mapped to different categories
4. Stores results with source attribution

**Auto-forge** mode regenerates every 90 seconds for a continuous feed.

### Bring Your Own Key

The Forge requires an [Anthropic API key](https://console.anthropic.com/settings/keys). Enter it in the Forge tab — it's stored in your browser's localStorage and only sent to Anthropic's API. Nothing is stored server-side.

---

## Run Locally

```bash
git clone https://github.com/BurntFrost/mental-kungfu.git
cd mental-kungfu
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Build for Production

```bash
npm run build
npm run preview
```

---

## Tech Stack

- **React 18** — single-page app with hooks
- **Vite** — build tooling and dev server
- **Anthropic API** (Claude Sonnet) — powers the Forge Engine with web search
- **localStorage** — persists saved lines, forged batches, and API key
- **GitHub Pages** — hosted via GitHub Actions

---

## Docs

Detailed design documentation lives in `/docs/`:

- `DESIGN.md` — design philosophy and psychological framework
- `CATEGORIES.md` — full category taxonomy with archetypes
- `FORGE-ENGINE.md` — Forge engine technical documentation

---

## License

MIT
