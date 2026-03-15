/**
 * Mental Kung Fu — Category Taxonomy
 * 10 psychological categories × 6 lines each = 60 total lines
 */

export const CATEGORIES = {
  REFRAME: {
    icon: "↻",
    color: "#3b82f6",
    desc: "Flip their attack into your advantage",
    archetype: "Harvey Specter — redirect the courtroom",
    lines: [
      "You don't like me? Want me to lower the difficulty for your comfort?",
      "Your criticism is just a map of your limitations.",
      "You didn't offend me. You auditioned — and didn't get a callback.",
      "That was supposed to hurt? Recalibrate.",
      "You tried to expose me. All you did was advertise me.",
      "You think you're testing me. I'm the one grading.",
    ],
  },
  SCALE: {
    icon: "△",
    color: "#8b5cf6",
    desc: "Establish you operate on a different plane",
    archetype: "John Wick — the legend precedes the man",
    lines: [
      "I'm not intimidating. You're just underprepared for the room you walked into.",
      "You can't put me in a box — I built the warehouse.",
      "You brought a ladder. I own the building.",
      "Your ceiling is my foundation.",
      "You measured the room. I designed the blueprint.",
      "You're competing for a seat. I built the table.",
    ],
  },
  TEMPO: {
    icon: "◉",
    color: "#ef4444",
    desc: "Show you're already three moves ahead",
    archetype: "Wick silence — action already in motion",
    lines: [
      "I don't talk about what I'm going to do. I just let you watch.",
      "By the time you understood the move, I'd already made the next three.",
      "You're rehearsing. I'm already in post-production.",
      "You're loading. I've already shipped.",
      "You finished planning. I finished executing. Tuesday.",
      "You're building momentum. I'm already coasting on results.",
    ],
  },
  INDIFFERENCE: {
    icon: "◌",
    color: "#64748b",
    desc: "Erase them from the equation entirely",
    archetype: "Wick walking past the body",
    lines: [
      "You're not in my way. I just keep forgetting you're here.",
      "I'd explain, but I don't onboard tourists.",
      "You're not background noise. Background noise is consistent.",
      "I don't have enemies. I have people I haven't noticed yet.",
      "I didn't ignore you on purpose. You just weren't a variable.",
      "You keep showing up. I keep not adjusting.",
    ],
  },
  DISMISSAL: {
    icon: "⊘",
    color: "#f59e0b",
    desc: "Acknowledge and discard in one breath",
    archetype: "Harvey's 'get out of my office'",
    lines: [
      "Nothing personal. You're just playing a different game at a different difficulty.",
      "I don't punch down. I don't even look down.",
      "You came to compete. I came to collect.",
      "Cute strategy. Did it come with instructions?",
      "Your best move was interesting. My default was better.",
      "That was your A-game? I was warming up the bench.",
    ],
  },
  STOIC: {
    icon: "◇",
    color: "#06b6d4",
    desc: "Weaponize calm — let stillness do the damage",
    archetype: "Marcus Aurelius — the emperor doesn't flinch",
    lines: [
      "I don't get even. I get distance. The gap is the punishment.",
      "Your chaos isn't my emergency.",
      "I don't react. I adjust. There's a difference you'll learn too late.",
      "Pressure doesn't build diamonds. Discipline does. I'm the proof.",
      "I removed you from the equation. The math got better.",
      "Your turbulence is not my weather.",
    ],
  },
  INEVITABILITY: {
    icon: "⊞",
    color: "#10b981",
    desc: "Frame the outcome as already decided",
    archetype: "Wick's pencil — always going to end this way",
    lines: [
      "I already know how this ends — you're still hoping.",
      "This isn't a contest. It's a schedule — and you're not on it.",
      "You're still in the negotiation phase. I'm in the delivery phase.",
      "I don't rush because the outcome already has my name on it.",
      "The result was decided before you entered the room. I just haven't filed the paperwork.",
      "I don't race. I set the finish line.",
    ],
  },
  CONTROL: {
    icon: "⊕",
    color: "#ec4899",
    desc: "Mastery over the system itself",
    archetype: "Tyler Durden — I rewrote the rules",
    lines: [
      "I don't play the odds. I already see the board.",
      "You follow the playbook. I write the errata.",
      "You learned the rules. I designed the constraints.",
      "You found a loophole. I built the loop.",
      "You're playing chess. I'm playing the chess player.",
      "The game changed. You weren't notified.",
    ],
  },
  EXISTENTIAL: {
    icon: "◈",
    color: "#f43f5e",
    desc: "Turn their own mind against them",
    archetype: "Tyler Durden — the mirror that fights back",
    lines: [
      "You're not afraid of me. You're afraid of what I prove about you.",
      "I didn't break your confidence. I just showed you where it was already cracked.",
      "You don't hate me. You hate that I'm the standard you can't meet.",
      "Every time you doubt me, you're really confessing about yourself.",
      "I'm not your enemy. I'm the mirror you keep trying to walk past.",
      "You wanted to find my weakness. You found your own instead.",
    ],
  },
  IDENTITY: {
    icon: "⬡",
    color: "#a855f7",
    desc: "Define yourself so completely they can't",
    archetype: "Wick + Durden + Harvey — reputation, philosophy, brand",
    lines: [
      "I'm not motivated. I'm engineered.",
      "I wasn't built for comfort. I was built for output.",
      "I don't have a backup plan. The first one works.",
      "I'm not lucky. I'm what prepared looks like from the outside.",
      "I don't fit in. I was never designed to.",
      "They didn't make me. I compiled myself.",
    ],
  },
};

export const CATEGORY_KEYS = Object.keys(CATEGORIES);
