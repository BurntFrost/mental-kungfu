# Forge Engine — Technical Documentation

## Overview

The Forge Engine is the AI-powered generative component of Mental Kung Fu. It scans live current events via web search, identifies metaphor potential in headlines, and generates new tactical one-liners mapped to the category taxonomy.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    USER INTERFACE                     │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────┐  │
│  │ FORGE NOW│  │ AUTO: ON  │  │ Status Indicators│  │
│  └─────┬────┘  └─────┬─────┘  └──────────────────┘  │
│        │              │                               │
│        ▼              ▼                               │
│  ┌─────────────────────────────┐                     │
│  │       runForge()            │                     │
│  │  (debounced, single-flight) │                     │
│  └─────────────┬───────────────┘                     │
│                │                                      │
├────────────────┼──────────────────────────────────────┤
│   API LAYER    │                                      │
│                ▼                                      │
│  ┌─────────────────────────────┐                     │
│  │  Anthropic Messages API     │                     │
│  │  model: claude-sonnet-4     │                     │
│  │  tools: [web_search]        │                     │
│  └─────────────┬───────────────┘                     │
│                │                                      │
│                ▼                                      │
│  ┌─────────────────────────────┐                     │
│  │  Claude executes:           │                     │
│  │  1. web_search (headlines)  │                     │
│  │  2. Analyze metaphor value  │                     │
│  │  3. Generate 5 lines        │                     │
│  │  4. Map to categories       │                     │
│  │  5. Return structured JSON  │                     │
│  └─────────────┬───────────────┘                     │
│                │                                      │
├────────────────┼──────────────────────────────────────┤
│   STORAGE      │                                      │
│                ▼                                      │
│  ┌─────────────────────────────┐                     │
│  │  Persistent Storage API     │                     │
│  │  key: "forged-lines"        │                     │
│  │  format: JSON batch array   │                     │
│  │  retention: last 20 batches │                     │
│  └─────────────────────────────┘                     │
└─────────────────────────────────────────────────────┘
```

## API Call Structure

### Request

```javascript
{
  model: "claude-sonnet-4-20250514",
  max_tokens: 1000,
  tools: [{
    type: "web_search_20250305",
    name: "web_search"
  }],
  messages: [{
    role: "user",
    content: "<system prompt with category list and output format>"
  }]
}
```

### System Prompt

The forge prompt instructs Claude to:

1. **Search** for today's current events, headlines, and trending topics
2. **Generate** exactly 5 aggressive one-liners inspired by specific events
3. **Constraint**: cold, surgical, confident — never loud or angry
4. **Constraint**: weaponize the metaphor — don't just comment on the news
5. **Constraint**: standalone — works without needing the news context
6. **Constraint**: under 20 words each
7. **Constraint**: each line mapped to a different category
8. **Return**: structured JSON with events array and lines array

### Response Processing

The API response contains multiple content blocks:

```javascript
// Response may contain: text, tool_use, tool_result blocks
const textBlocks = data.content
  .filter(item => item.type === "text")
  .map(item => item.text)
  .join("\n");
```

JSON extraction uses a two-pass approach:
1. Direct `JSON.parse()` on trimmed text
2. Fallback regex extraction: `/\{[\s\S]*"lines"[\s\S]*\}/`

### Expected Output Format

```json
{
  "events": [
    { "headline": "Short headline text", "source": "Source name" }
  ],
  "lines": [
    {
      "line": "The generated one-liner",
      "category": "CATEGORY_NAME",
      "inspired_by": "Which headline inspired this"
    }
  ]
}
```

## Batch Management

### Structure

Each forge run produces a batch:

```javascript
{
  id: Date.now(),                    // Unique timestamp ID
  timestamp: new Date().toISOString(), // ISO timestamp
  events: [...],                     // Source events from web search
  lines: [                          // Generated lines
    {
      id: `${Date.now()}-${index}`, // Unique line ID
      line: "...",                  // The one-liner
      category: "REFRAME",         // Mapped category
      inspired_by: "..."           // Source headline
    }
  ]
}
```

### Retention Policy

- Maximum 20 batches retained
- Oldest batches pruned on each new forge
- Each batch produces ~5 lines
- Maximum ~100 forged lines in storage at any time

### Storage Keys

| Key | Scope | Content |
|-----|-------|---------|
| `forged-lines` | Personal | Array of forge batches (max 20) |
| `saved-lines` | Personal | Array of user-starred lines |

## Auto-Forge Mode

When enabled:
- Fires immediately on toggle
- Repeats every 90 seconds via `setInterval`
- Cleared on toggle off or component unmount
- Visual indicators: neural activity bars + pulse dot
- Each run is independent — no context carried between runs

### Rate Considerations

- Each forge = 1 API call with web search
- Auto-forge at 90s interval = ~40 calls/hour maximum
- Web search tool adds latency (~3-5 seconds per call)
- Single-flight lock prevents overlapping requests

## Error Handling

```javascript
try {
  const result = await forgeNewLines();
  // Process batch...
} catch (err) {
  setForgeError(err.message || "Forge failed. Retrying...");
}
```

Errors displayed in-UI with red alert banner. Auto-forge continues despite individual failures.

## UI Integration

### Status Indicators

| Indicator | State | Meaning |
|-----------|-------|---------|
| Neural bars (animated) | Forging or Auto ON | Engine is active |
| Pulse dot | Forging or Auto ON | Heartbeat signal |
| Shimmer button | Idle | Ready to forge |
| Gray button | Forging | Request in flight |

### Line Attribution

Each forged line displays:
- `⚡ FORGED` badge — distinguishes from static deck lines
- `← headline text` — shows which event inspired the line
- Category tag — maps to the 10-category taxonomy
- ★ save button — adds to persistent saved collection
