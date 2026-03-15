/**
 * Emotion Filter — "I'm feeling X" → surface lines that address that state.
 * Maps user emotions to the categories whose lines best counter or channel them.
 */

export const EMOTION_MAP = {
  Angry:         ["STOIC", "INDIFFERENCE", "CONTROL"],
  Insecure:      ["IDENTITY", "SCALE"],
  Disrespected:  ["DISMISSAL", "REFRAME"],
  Anxious:       ["CONTROL", "INEVITABILITY", "STOIC"],
  Challenged:    ["TEMPO", "EXISTENTIAL", "REFRAME"],
  Underestimated:["SCALE", "INEVITABILITY", "IDENTITY"],
};

export const EMOTION_NAMES = Object.keys(EMOTION_MAP);

/** Reverse lookup: category → list of emotions that include it */
export function getEmotionsForCategory(category) {
  const result = [];
  for (const [emotion, cats] of Object.entries(EMOTION_MAP)) {
    if (cats.includes(category)) result.push(emotion);
  }
  return result;
}

export const EMOTION_META = {
  Angry:          { icon: "😠", color: "#ef4444", desc: "Lines that neutralize rage with cold control" },
  Insecure:       { icon: "😟", color: "#a855f7", desc: "Lines that rebuild unshakeable self-belief" },
  Disrespected:   { icon: "😤", color: "#f59e0b", desc: "Lines that reframe disrespect as irrelevance" },
  Anxious:        { icon: "😰", color: "#06b6d4", desc: "Lines that replace anxiety with certainty" },
  Challenged:     { icon: "⚔️", color: "#ec4899", desc: "Lines that turn confrontation into dominance" },
  Underestimated: { icon: "😏", color: "#3b82f6", desc: "Lines that make them regret counting you out" },
};
