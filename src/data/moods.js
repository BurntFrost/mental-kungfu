export const MOOD_MAP = {
  Cold: ["TEMPO", "INDIFFERENCE"],
  Calculated: ["CONTROL", "INEVITABILITY"],
  Existential: ["EXISTENTIAL", "IDENTITY"],
  Dismissive: ["DISMISSAL", "REFRAME"],
  Stoic: ["STOIC", "SCALE"],
};

export const MOOD_META = {
  Cold:         { icon: "🧊", desc: "Icy precision, zero warmth" },
  Calculated:   { icon: "🧮", desc: "Every move is deliberate" },
  Existential:  { icon: "🕳️", desc: "Turn their reality inside out" },
  Dismissive:   { icon: "🤚", desc: "Acknowledge and discard" },
  Stoic:        { icon: "🗿", desc: "Immovable, unshakeable" },
};

export const MOOD_NAMES = Object.keys(MOOD_MAP);

/** Given a category string, return its mood */
export function getMoodForCategory(category) {
  for (const [mood, cats] of Object.entries(MOOD_MAP)) {
    if (cats.includes(category)) return mood;
  }
  return null;
}

/** Category display metadata (icon, color, description) */
export const CATEGORY_META = {
  REFRAME:       { icon: "🔄", color: "#3b82f6", desc: "Flip their attack into your advantage" },
  SCALE:         { icon: "⛰️", color: "#8b5cf6", desc: "Establish you operate on a different plane" },
  TEMPO:         { icon: "⚡", color: "#ef4444", desc: "Show you're already three moves ahead" },
  INDIFFERENCE:  { icon: "🫥", color: "#64748b", desc: "Erase them from the equation entirely" },
  DISMISSAL:     { icon: "✋", color: "#f59e0b", desc: "Acknowledge and discard in one breath" },
  STOIC:         { icon: "🪨", color: "#06b6d4", desc: "Weaponize calm — let stillness do the damage" },
  INEVITABILITY: { icon: "⏳", color: "#10b981", desc: "Frame the outcome as already decided" },
  CONTROL:       { icon: "🎯", color: "#ec4899", desc: "Mastery over the system itself" },
  EXISTENTIAL:   { icon: "🪞", color: "#f43f5e", desc: "Turn their own mind against them" },
  IDENTITY:      { icon: "👑", color: "#a855f7", desc: "Define yourself so completely they can't" },
};
