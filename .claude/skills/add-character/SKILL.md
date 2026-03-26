---
name: add-character
description: Add a new character archetype — creates entry in characters.js, maps to categories, updates forge prompt, and verifies consistency
disable-model-invocation: true
---

# Add Character

Add a new character archetype to the Mental Kung Fu roster.

## Arguments

- `name` (required): Display name (e.g., "Sherlock Holmes")
- `id` (required): Lowercase key (e.g., "sherlock")
- `source` (required): Origin franchise (e.g., "Sherlock")
- `energy` (optional): 1-2 word energy label (e.g., "Deductive supremacy")

## Checklist

### 1. Character Metadata — `src/data/characters.js`

Add entry to `CHARACTERS` object:

```js
characterId: {
  id: "characterId",
  name: "Display Name",
  icon: "🔮",           // HD emoji that captures essence
  energy: "Energy label",
  philosophy: "2-3 sentences explaining their psychological framework and how they weaponize it.",
  source: "Franchise Name",
  signatureQuote: "Their most iconic line.",
},
```

**Icon guidelines**: Use a single emoji that is:
- Visually distinct from existing character icons
- Thematically connected to the character (not generic)
- High-definition (avoid basic unicode symbols)

### 2. Category Lines — `src/data/categories.js`

Add 2-4 lines across different categories that match the character's energy:

| Character Energy | Best-fit Categories |
|-----------------|-------------------|
| Silent force / stoic | STOIC, SCALE, INDIFFERENCE |
| Intellectual / analytical | REFRAME, TEMPO, DISMISSAL |
| Chaos / system-breaking | CONTROL, EXISTENTIAL, REFRAME |
| Dominance / authority | SCALE, DISMISSAL, INEVITABILITY |
| Philosophical / identity | IDENTITY, EXISTENTIAL, STOIC |

Each line must:
- Be under 20 words
- Sound like the character would say it
- Hit a specific psychological pressure point
- Work standalone without context

### 3. Forge Prompt — `src/lib/forge-api.js`

Add the character to the prompt's character list:
```
- characterId: energy description, tactical approach
```

### 4. Verification

After all edits, verify:
- [ ] Character ID is lowercase, no spaces
- [ ] `CHARACTER_IDS` array auto-populates (uses `Object.keys`)
- [ ] No duplicate icons with existing characters
- [ ] Lines attributed to new character use correct `character` key
- [ ] Forge prompt character list matches `characters.js` entries
- [ ] Run `npm run build` to verify no import errors

### 5. Existing Characters Reference

Check `src/data/characters.js` for current roster to avoid:
- Duplicate character archetypes/energies
- Icon collisions
- Overlapping philosophical frameworks
