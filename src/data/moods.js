export const MOOD_MAP = {
  Cold: ["TEMPO", "INDIFFERENCE"],
  Calculated: ["CONTROL", "INEVITABILITY"],
  Existential: ["EXISTENTIAL", "IDENTITY"],
  Dismissive: ["DISMISSAL", "REFRAME"],
  Stoic: ["STOIC", "SCALE"],
};

export const MOOD_NAMES = Object.keys(MOOD_MAP);

/** Given a category string, return its mood */
export function getMoodForCategory(category) {
  for (const [mood, cats] of Object.entries(MOOD_MAP)) {
    if (cats.includes(category)) return mood;
  }
  return null;
}

/** Category display metadata (icon + color) */
export const CATEGORY_META = {
  REFRAME:       { icon: "↻", color: "#3b82f6" },
  SCALE:         { icon: "△", color: "#8b5cf6" },
  TEMPO:         { icon: "◉", color: "#ef4444" },
  INDIFFERENCE:  { icon: "◌", color: "#64748b" },
  DISMISSAL:     { icon: "⊘", color: "#f59e0b" },
  STOIC:         { icon: "◇", color: "#06b6d4" },
  INEVITABILITY: { icon: "⊞", color: "#10b981" },
  CONTROL:       { icon: "⊕", color: "#ec4899" },
  EXISTENTIAL:   { icon: "◈", color: "#f43f5e" },
  IDENTITY:      { icon: "⬡", color: "#a855f7" },
};
