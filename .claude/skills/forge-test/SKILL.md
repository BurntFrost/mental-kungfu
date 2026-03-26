---
name: forge-test
description: Test Forge Engine JSON parsing with sample API responses — validates both direct parse and regex fallback paths without burning API credits
disable-model-invocation: true
---

# Forge Test

Test the Forge Engine's response parsing logic against sample payloads to verify both the happy path (direct JSON.parse) and fallback path (regex extraction).

## What This Tests

The forge pipeline in `src/lib/forge-api.js` has a two-pass parser:
1. **Direct parse**: `JSON.parse(textBlocks.trim())`
2. **Regex fallback**: Extract `{..."lines"...}` pattern when direct parse fails (common when the API wraps JSON in markdown fences or adds preamble)

## Steps

1. Read `src/lib/forge-api.js` to understand the current parsing logic
2. Read `src/data/categories.js` for valid `CATEGORY_KEYS`
3. Read `src/data/characters.js` for valid character IDs
4. Create a temporary test script at `src/lib/__forge-test.mjs` that:
   - Imports the parsing logic (or replicates it for isolation)
   - Tests these scenarios:

### Test Cases

| # | Scenario | Input | Expected |
|---|----------|-------|----------|
| 1 | Clean JSON | `{"events":[...],"lines":[...]}` | Parses successfully |
| 2 | Markdown-wrapped | ````json\n{...}\n```` | Regex fallback succeeds |
| 3 | Preamble + JSON | `Here are the lines:\n{...}` | Regex fallback succeeds |
| 4 | Invalid category | `"category": "NONEXISTENT"` | Detected and flagged |
| 5 | Invalid character | `"character": "nobody"` | Detected and flagged |
| 6 | Empty lines array | `{"events":[],"lines":[]}` | Handled gracefully |
| 7 | Malformed JSON | `{events: [broken` | Throws descriptive error |

5. Run the test script with `node src/lib/__forge-test.mjs`
6. Report results as a table
7. Delete the test script when done

## Sample Payload

Use this as the base for test variations:

```json
{
  "events": [
    {
      "headline": "Test headline",
      "source": "Test Source",
      "vulnerability": "ego fragility"
    }
  ],
  "lines": [
    {
      "line": "Your ceiling is my foundation.",
      "category": "SCALE",
      "character": "wick",
      "inspired_by": "Test headline",
      "target": "status anxiety"
    }
  ]
}
```

## Validation Checklist

After parsing, verify each line object has:
- [ ] `line` — non-empty string, under 20 words
- [ ] `category` — exists in `CATEGORY_KEYS`
- [ ] `character` — exists in `CHARACTER_IDS`
- [ ] `inspired_by` — non-empty string
- [ ] `target` — non-empty string
