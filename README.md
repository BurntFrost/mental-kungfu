# Mental Kung Fu

**A tactical mindset engine powered by AI.** Browse 90+ curated one-liners for mental toughness, filter by character, mood, or emotion — or generate fresh ones from today's current events.

**[Try it live](https://burntfrost.github.io/mental-kungfu/)**

---

## What It Does

Mental Kung Fu gives you cold, confident one-liners across 10 psychological categories. Use them as mental anchors, conversation ammo, or just a daily mindset reset.

The app is a unified dashboard with:

- **Character Grid** — 13 character archetypes you can filter by (tap to filter, long-press for profile)
- **Mood Chips** — tone filters: Cold, Calculated, Existential, Dismissive, Stoic
- **Emotion Chips** — "I'm feeling..." filters: Angry, Insecure, Disrespected, Anxious, Challenged, Underestimated
- **Trending Today** — collapsible section showing the latest AI-forged lines from current events
- **Line Feed** — all 90+ lines with search, filterable by any combination of character, mood, and emotion
- **Saved** — star any line to save it; filter to view your collection

### The 13 Characters

John Wick, Tyler Durden, Sierra Six, Harvey Specter, Seven of Nine, Slevin, Capa, Snape, Spock, Tony Stark, Thanos, Batman, Dr. Strange

Each character brings a distinct energy — from Wick's silent force to Snape's cutting precision to Strange's dimensional superiority.

### The 10 Categories

Reframe, Scale, Tempo, Indifference, Dismissal, Stoic, Inevitability, Control, Existential, Identity

Each targets a different psychological vector — from flipping someone's frame to erasing them from the equation entirely.

### Emotion Filtering

Emotion chips let you filter lines by how you're feeling. Each emotion maps to categories that counter or channel that state:

- **Angry** → Stoic, Indifference, Control
- **Insecure** → Identity, Scale
- **Disrespected** → Dismissal, Reframe
- **Anxious** → Control, Inevitability, Stoic
- **Challenged** → Tempo, Existential, Reframe
- **Underestimated** → Scale, Inevitability, Identity

Mood and emotion filters combine (union) so you can mix both freely.

---

## Forge Engine

The Forge Engine connects to the Anthropic API to generate fresh lines from real current events:

1. Searches today's headlines via web search
2. Performs psychological deconstruction analysis on trending stories
3. Generates 2 tactical one-liners mapped to different categories
4. Stores results with source attribution in the Trending Today section

**Auto-forge** mode regenerates every 90 seconds for a continuous feed.

### Bring Your Own Key

The Forge requires an [Anthropic API key](https://console.anthropic.com/settings/keys). Enter it in the Settings panel (gear icon) — it's stored in your browser's localStorage and only sent to Anthropic's API. Nothing is stored server-side.

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

Deployment to GitHub Pages runs automatically on push to `main` via GitHub Actions.

---

## Tech Stack

- **React 18** — modular component architecture with hooks
- **Vite 5** — build tooling and dev server (port 3000)
- **Anthropic API** (Claude Sonnet + web search) — powers the Forge Engine
- **localStorage** — persists saved lines, forged batches, and API key
- **GitHub Pages** — auto-deployed via GitHub Actions (v5)

### Project Structure

```
src/
├── App.jsx                  # Lightweight orchestrator
├── components/              # UI components (LineCard, CharacterGrid, ForgePanel, etc.)
├── data/                    # Categories, characters, moods, emotions
├── hooks/                   # useStorage, useForge
└── lib/                     # Line filtering, forge API
```

---

## Docs

Detailed design documentation lives in `/docs/`:

- `DESIGN.md` — design philosophy and psychological framework
- `CATEGORIES.md` — full category taxonomy with archetypes
- `FORGE-ENGINE.md` — Forge engine technical documentation

---

## License

MIT
