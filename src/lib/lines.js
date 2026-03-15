import { CATEGORIES, CATEGORY_KEYS } from "../data/categories.js";
import { MOOD_MAP } from "../data/moods.js";

/**
 * Build flat array of all static lines from categories.
 * Each line: { id, line, category, character }
 */
export function getAllLines() {
  const lines = [];
  for (const cat of CATEGORY_KEYS) {
    for (const [i, item] of CATEGORIES[cat].lines.entries()) {
      lines.push({
        id: `${cat}-${i}`,
        line: item.line,
        category: cat,
        character: item.character,
      });
    }
  }
  return lines;
}

/**
 * Filter lines by active characters, moods, saved state, and search text.
 */
export function filterLines(lines, { characters, moods, savedOnly, savedSet, search }) {
  let result = lines;

  if (characters.size > 0) {
    result = result.filter(l => characters.has(l.character));
  }

  if (moods.size > 0) {
    const allowedCats = new Set();
    for (const mood of moods) {
      for (const cat of (MOOD_MAP[mood] || [])) {
        allowedCats.add(cat);
      }
    }
    result = result.filter(l => allowedCats.has(l.category));
  }

  if (savedOnly) {
    result = result.filter(l => savedSet.has(l.line));
  }

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(l => l.line.toLowerCase().includes(q));
  }

  return result;
}
