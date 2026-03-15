# 功 Mental Kung Fu

**A tactical mindset engine that weaponizes current events into cold, surgical one-liners.**

Built as a progressive React application with AI-powered line generation, persistent storage, and a curated arsenal of psychological vectors for mental toughness.

![Version](https://img.shields.io/badge/version-2.0-ef4444)
![Lines](https://img.shields.io/badge/core%20lines-10-blue)
![Categories](https://img.shields.io/badge/categories-10-8b5cf6)
![Deck](https://img.shields.io/badge/full%20deck-60-10b981)

---

## Overview

Mental Kung Fu is a reference tool and generative engine for crafting aggressive, confident one-liners rooted in psychological frameworks. It draws from the archetypes of **John Wick** (implied capability through silence), **Tyler Durden** (existential mirror — you defeat yourself), and **Harvey Specter** (dominance as procedure — the outcome is already decided).

The app operates in three modes:

| Mode | Purpose |
|------|---------|
| **Core 10** | Locked primary arsenal — 10 lines covering 10 distinct psychological vectors |
| **Full Deck** | Expanded arsenal — 60 lines across 10 categories with save-to-collection |
| **Forge Engine** | AI-powered generator that scans live current events and weaponizes them into new tactical lines |

---

## Architecture

```
mental-kungfu/
├── src/
│   ├── App.jsx              # Main application — full PWA with all three tabs
│   ├── data/
│   │   ├── core-set.js      # Locked Core 10 lines
│   │   └── categories.js    # 10 category definitions with 60 expanded lines
│   └── reference/
│       └── card.jsx          # Original static reference card (v1)
├── docs/
│   ├── DESIGN.md             # Design philosophy and psychological framework
│   ├── CATEGORIES.md         # Full category taxonomy with archetypes
│   └── FORGE-ENGINE.md       # Forge engine technical documentation
├── public/
│   └── index.html            # PWA entry point
├── package.json
└── README.md
```

### Tech Stack

- **React** (functional components, hooks)
- **Anthropic API** (`claude-sonnet-4-20250514`) — powers the Forge Engine
- **Web Search Tool** (`web_search_20250305`) — real-time current event scanning
- **Persistent Storage API** — cross-session state for forged lines and saved collection
- **CSS-in-JS** — scoped styles with CSS custom properties for theming

### Key Technical Decisions

1. **No external UI framework** — zero dependency bloat. Raw React + CSS custom properties.
2. **Persistent storage via `window.storage` API** — forged batches and saved lines survive session boundaries.
3. **Anthropic API with web search** — the Forge Engine doesn't hallucinate events; it searches live, then generates.
4. **Batched forge architecture** — each forge run produces a timestamped batch with source events and generated lines, maintaining full provenance chain.

---

## The Psychological Framework

### Category Taxonomy

Every line in the system maps to one of **10 psychological categories**, each designed to attack a different vector:

| # | Category | Icon | Psychological Vector | Archetype |
|---|----------|------|---------------------|-----------|
| 1 | **REFRAME** | ↻ | Flip their attack into your advantage | Harvey Specter — redirect the courtroom |
| 2 | **SCALE** | △ | Establish you operate on a different plane | John Wick — the legend precedes the man |
| 3 | **TEMPO** | ◉ | Show you're already three moves ahead | Wick silence — action already in motion |
| 4 | **INDIFFERENCE** | ◌ | Erase them from the equation entirely | Wick walking past the body |
| 5 | **DISMISSAL** | ⊘ | Acknowledge and discard in one breath | Harvey's "get out of my office" |
| 6 | **STOIC** | ◇ | Weaponize calm — let stillness do the damage | Marcus Aurelius — the emperor doesn't flinch |
| 7 | **INEVITABILITY** | ⊞ | Frame the outcome as already decided | Wick's pencil — always going to end this way |
| 8 | **CONTROL** | ⊕ | Demonstrate mastery over the system itself | Tyler Durden — I rewrote the rules |
| 9 | **EXISTENTIAL** | ◈ | Turn their own mind against them | Tyler Durden — the mirror that fights back |
| 10 | **IDENTITY** | ⬡ | Define yourself so completely they can't | All three — reputation, philosophy, brand |

### Design Principles for Effective Lines

The strongest lines share three traits:

1. **Compression** — short hit, no fat. Under 20 words.
2. **Reframe** — their reality shifts; the ground moves under them.
3. **No anger** — cold, not hot. The calm is the weapon.

Anti-patterns to avoid:
- Explaining the insult (if they need a manual, it didn't land)
- Acknowledging them as peers (scale assertion breaks if you meet them at their level)
- Loud energy (volume signals insecurity; stillness signals control)

---

## The Core 10

The locked primary arsenal. Each line covers a distinct psychological vector with zero overlap.

| # | Line | Category |
|---|------|----------|
| 01 | You don't like me? Want me to lower the difficulty for your comfort? | REFRAME |
| 02 | I'm not intimidating. You're just underprepared for the room you walked into. | SCALE |
| 03 | I don't talk about what I'm going to do. I just let you watch. | TEMPO |
| 04 | You can't put me in a box — I built the warehouse. | SCALE |
| 05 | You're not in my way. I just keep forgetting you're here. | INDIFFERENCE |
| 06 | Nothing personal. You're just playing a different game at a different difficulty. | DISMISSAL |
| 07 | I don't get even. I get distance. The gap is the punishment. | STOIC |
| 08 | I already know how this ends — you're still hoping. | INEVITABILITY |
| 09 | I don't play the odds. I already see the board. | CONTROL |
| 10 | You're not afraid of me. You're afraid of what I prove about you. | EXISTENTIAL |

### Selection Criteria

Lines were evaluated against a rubric:

- **Compression score** — word count vs. impact ratio
- **Reframe quality** — does the listener's frame of reference shift?
- **Temperature** — cold > hot (anger leaks power; calm hoards it)
- **Standalone clarity** — works without context or setup
- **Archetype alignment** — maps cleanly to Wick/Durden/Specter energy

---

## The Forge Engine

### How It Works

```
[User triggers FORGE] 
    → Anthropic API call with web_search tool enabled
    → Claude searches for today's current events / headlines
    → Analyzes events for metaphor potential
    → Generates 5 new one-liners, each mapped to a category
    → Returns structured JSON with source events + generated lines
    → Batch stored persistently with full provenance
```

### Forge Modes

| Mode | Behavior |
|------|----------|
| **FORGE NOW** | Single-shot: one API call, 5 new lines |
| **AUTO: ON** | Continuous: regenerates every 90 seconds from fresh events |

### Forge Output Structure

Each forge batch contains:

```json
{
  "id": 1710000000000,
  "timestamp": "2026-03-14T12:00:00.000Z",
  "events": [
    { "headline": "Tech company announces layoffs", "source": "Reuters" }
  ],
  "lines": [
    {
      "id": "1710000000000-0",
      "line": "You're restructuring. I'm already rebuilt.",
      "category": "TEMPO",
      "inspired_by": "Tech company announces layoffs"
    }
  ]
}
```

### API Configuration

The Forge Engine uses:
- **Model**: `claude-sonnet-4-20250514`
- **Tool**: `web_search_20250305` for real-time event scanning
- **Max tokens**: 1000
- **Response format**: Structured JSON with events and lines arrays

### Persistence

- Forged batches: last 20 retained in persistent storage (`forged-lines` key)
- Saved/starred lines: independent persistent collection (`saved-lines` key)
- Storage API: `window.storage.get()` / `window.storage.set()`

---

## Features

### Interaction Model

- **Tap to copy** — any line, any tab. Copies to clipboard with visual confirmation.
- **★ Save to collection** — star any line (core, deck, or forged) to build a personal curated set.
- **Category accordions** — expandable sections in the Deck tab with archetype context.
- **Source attribution** — forged lines show which headline inspired them.
- **Live status indicators** — neural activity visualization and pulse dot show forge engine state.

### Visual Design

- **Aesthetic**: Industrial/tactical dark interface — matte blacks, red accents, monospace typography
- **Typography**: IBM Plex Mono (body) + Outfit (headings) — precision meets confidence
- **Motion**: Scan-line animation, pulse rings on active forge, shimmer on CTA button, fade-in transitions
- **Color system**: CSS custom properties with category-specific accent colors

### Stats Dashboard

Header strip shows live counts:
- Core lines (fixed: 10)
- Deck lines (fixed: 60)
- Forged lines (cumulative)
- Saved lines (user-curated)

---

## Development

### Running Locally

This app is designed as a React artifact for the Claude.ai environment. To run standalone:

1. Set up a React project (Vite, CRA, or Next.js)
2. Copy `src/App.jsx` as your main component
3. Replace `window.storage` calls with localStorage or your preferred persistence layer
4. Configure Anthropic API access for the Forge Engine (requires API key)

### Environment Requirements

- React 18+
- Anthropic API access (for Forge Engine)
- Google Fonts CDN access (IBM Plex Mono, Outfit)

---

## Version History

| Version | Changes |
|---------|---------|
| **v1.0** | Initial 10-line set with static reference card |
| **v2.0** | Expanded to 60 lines across 10 categories, added Forge Engine with live event scanning, persistent storage, save-to-collection, auto-forge mode |

---

## Design Iterations

### v1 → v2 Refinement Log

Several lines were refined through iterative design:

- **#1**: Added "lower the difficulty" framing (originally "compete with me")
- **#3**: Replaced verbose "dream about it" line with Wick-cold "let you watch"
- **#5**: Changed "part of the route" to "keep forgetting you're here" (pure erasure > acknowledgment)
- **#6**: Added "different difficulty" callback to #1 for structural echo
- **#7**: Changed "get ahead" to "get distance" (dimensional > directional)
- **#9**: Changed "set them" to "see the board" (seeing implies complete awareness)
- **#10**: Replaced problem/solution construct with Durden mirror ("afraid of what I prove about you")

### New Category: IDENTITY

Added in v2 as the 10th category to cover self-definition lines — the only offensive vector that doesn't require an opponent. Represents the fusion of all three archetypes: Wick's reputation, Durden's philosophy, Harvey's brand.

---

## License

MIT

---

<p align="center">
  <strong>功</strong><br/>
  <em>"I don't chase. I arrive — and everything rearranges."</em>
</p>
