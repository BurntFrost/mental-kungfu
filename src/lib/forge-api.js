import { CATEGORY_KEYS } from "../data/categories.js";

export async function forgeNewLines(apiKey, count = 2, onProgress) {
  if (!apiKey) {
    throw new Error("API key required. Add your Anthropic API key in Settings.");
  }

  onProgress?.("connecting");
  const catList = CATEGORY_KEYS.join(", ");
  onProgress?.("searching");
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "anthropic-dangerous-direct-browser-access": "true",
    },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      tools: [{ type: "web_search_20250305", name: "web_search" }],
      messages: [{
        role: "user",
        content: `You are a psychological warfare specialist and tactical mindset coach. You create cold, surgical one-liners in the style of John Wick, Tyler Durden, and Harvey Specter — lines that land like a scalpel, not a sledgehammer.

STEP 1: Search for today's most interesting current events, news headlines, trending topics, or cultural moments.

STEP 2: For each event, perform a psychological deconstruction:
- Identify the CORE VULNERABILITY it exposes (fear of irrelevance, loss of control, ego fragility, identity crisis, status anxiety)
- Find the PRESSURE POINT — the specific insecurity most people won't say out loud but instantly recognize
- Extract the POWER DYNAMIC — who has leverage, who's pretending, who's exposed
- Locate the METAPHOR WEAPON — the element of the event that can be turned into a universal psychological strike

STEP 3: Generate exactly ${count} one-liners that EXPLOIT these psychological findings. Each line must:
- Target a specific cognitive vulnerability (not generic confidence — precision damage)
- Use the event's metaphor to trigger self-doubt, inadequacy, or forced reframing in the listener
- Hit the gap between who someone thinks they are and who they actually are
- Be cold, surgical, confident — never loud or angry. Calm is the weapon.
- Work as standalone statements without needing to know the news context
- Be under 20 words each
- Each belong to a different category from: ${catList}
- Assign each line a character energy from: wick, durden, six, specter, seven, slevin, capa
  - wick: silent force, implied capability
  - durden: existential mirror, system destruction
  - six: ghost professionalism, zero ego
  - specter: dominance, procedural certainty
  - seven: cold logic, emotional irrelevance
  - slevin: casual misdirection, hidden hand
  - capa: cosmic perspective, existential weight

STEP 4: Return ONLY valid JSON with no markdown formatting, no backticks, no preamble. Just raw JSON:
{"events":[{"headline":"short headline","source":"source name","vulnerability":"the core psychological vulnerability identified"}],"lines":[{"line":"the one-liner","category":"CATEGORY_NAME","character":"character_id","inspired_by":"which headline inspired this","target":"what psychological pressure point this exploits"}]}`
      }]
    })
  });

  if (!response.ok) {
    const errBody = await response.text().catch(() => "");
    throw new Error(`API error ${response.status}: ${errBody.slice(0, 100)}`);
  }

  onProgress?.("processing");
  const data = await response.json();
  const textBlocks = (data.content || [])
    .filter(item => item.type === "text")
    .map(item => item.text)
    .join("\n");

  let parsed;
  try {
    parsed = JSON.parse(textBlocks.trim());
  } catch {
    const jsonMatch = textBlocks.match(/\{[\s\S]*"lines"[\s\S]*\}/);
    if (jsonMatch) {
      parsed = JSON.parse(jsonMatch[0]);
    } else {
      throw new Error("Could not parse forge response");
    }
  }

  return parsed;
}
