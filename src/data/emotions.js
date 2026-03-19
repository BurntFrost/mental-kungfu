/**
 * Emotion Filter — "I'm feeling X" → surface lines that address that state.
 * Maps user emotions to the categories whose lines best counter or channel them.
 */

export const EMOTION_MAP = {
  Angry:         ["STOIC", "INDIFFERENCE", "DISMISSAL"],
  Insecure:      ["IDENTITY", "SCALE"],
  Disrespected:  ["DISMISSAL", "REFRAME"],
  Anxious:       ["CONTROL", "STOIC", "TEMPO"],
  Challenged:    ["TEMPO", "EXISTENTIAL", "REFRAME"],
  Underestimated:["SCALE", "INEVITABILITY", "IDENTITY"],
  Betrayed:      ["INDIFFERENCE", "REFRAME", "EXISTENTIAL"],
  Overwhelmed:   ["STOIC", "SCALE", "DISMISSAL"],
  Humiliated:    ["IDENTITY", "DISMISSAL", "REFRAME"],
  Frustrated:    ["TEMPO", "STOIC", "INDIFFERENCE"],
  Powerless:     ["SCALE", "CONTROL", "EXISTENTIAL"],
  Lost:          ["EXISTENTIAL", "IDENTITY", "INEVITABILITY"],
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
  Betrayed:       { icon: "🗡️", color: "#64748b", desc: "Lines that turn betrayal into indifference" },
  Overwhelmed:    { icon: "🌊", color: "#0ea5e9", desc: "Lines that cut through chaos with clarity" },
  Humiliated:     { icon: "🔥", color: "#f43f5e", desc: "Lines that rise from the ashes untouchable" },
  Frustrated:     { icon: "💢", color: "#f97316", desc: "Lines that channel frustration into precision" },
  Powerless:      { icon: "⛓️", color: "#8b5cf6", desc: "Lines that reclaim agency from nothing" },
  Lost:           { icon: "🧭", color: "#10b981", desc: "Lines that forge direction from uncertainty" },
};
