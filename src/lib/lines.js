import { CATEGORIES, CATEGORY_KEYS } from "../data/categories.js";
import { MOOD_MAP } from "../data/moods.js";
import { EMOTION_MAP } from "../data/emotions.js";

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
export function filterLines(lines, { characters, moods, emotions, categories, savedOnly, savedSet, search }) {
  let result = lines;

  if (characters.size > 0) {
    result = result.filter(l => characters.has(l.character));
  }

  // Combine mood + emotion + direct category filters (union of all)
  const allowedCats = new Set();
  if (moods.size > 0) {
    for (const mood of moods) {
      for (const cat of (MOOD_MAP[mood] || [])) {
        allowedCats.add(cat);
      }
    }
  }
  if (emotions.size > 0) {
    for (const emotion of emotions) {
      for (const cat of (EMOTION_MAP[emotion] || [])) {
        allowedCats.add(cat);
      }
    }
  }
  if (categories.size > 0) {
    for (const cat of categories) {
      allowedCats.add(cat);
    }
  }
  if (allowedCats.size > 0) {
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
