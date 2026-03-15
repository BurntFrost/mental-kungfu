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

export const EMOTION_META = {
  Angry:          { icon: "🔥", color: "#ef4444" },
  Insecure:       { icon: "🪞", color: "#a855f7" },
  Disrespected:   { icon: "⚡", color: "#f59e0b" },
  Anxious:        { icon: "🌀", color: "#06b6d4" },
  Challenged:     { icon: "⚔️", color: "#ec4899" },
  Underestimated: { icon: "🧊", color: "#3b82f6" },
};
