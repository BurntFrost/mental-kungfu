import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import LineCard from "./LineCard.jsx";
import { CATEGORY_META } from "../data/moods.js";
import { CHARACTERS } from "../data/characters.js";

/**
 * Interleave lines so no two consecutive share the same category or character.
 * Fisher-Yates with constraint retry.
 */
function interleaveShuffle(lines) {
  if (lines.length <= 1) return [...lines];
  const pool = [...lines];
  const result = [];
  let lastCat = null;
  let lastChar = null;
  let retries = 0;
  const maxRetries = lines.length * 3;

  while (pool.length > 0 && retries < maxRetries) {
    const idx = Math.floor(Math.random() * pool.length);
    const candidate = pool[idx];
    if (pool.length > 1 && (candidate.category === lastCat || candidate.character === lastChar)) {
      retries++;
      continue;
    }
    result.push(candidate);
    pool.splice(idx, 1);
    lastCat = candidate.category;
    lastChar = candidate.character;
    retries = 0;
  }
  // Push any remaining (constraint couldn't be met)
  result.push(...pool);
  return result;
}

function HeroQuote({ line, animState, onCopy, onSave, saved, copiedId }) {
  const cat = CATEGORY_META[line.category] || { icon: "?", color: "#666", desc: "" };
  const char = CHARACTERS[line.character] || { name: "Unknown", icon: "?", source: "" };

  return (
    <div
      className={`hero-quote hero-quote--${animState}`}
      onClick={() => onCopy(line.line, line.id)}
      onKeyDown={e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onCopy(line.line, line.id); } }}
      role="button"
      tabIndex={0}
      aria-label={`Copy: ${line.line}`}
    >
      {/* Category accent bar */}
      <div className="hero-accent" style={{ background: `linear-gradient(180deg, ${cat.color}, ${cat.color}44)` }} />

      <div className="hero-content">
        <div className="hero-text">"{line.line}"</div>
        <div className="hero-meta">
          <span className="hero-category" style={{ color: cat.color, background: `${cat.color}12` }}>
            {cat.icon} {line.category}
          </span>
          <span className="hero-character">
            {char.icon} {char.name}
          </span>
          {line.source === "forged" && (
            <span className="hero-forged">FORGED</span>
          )}
          <button
            onClick={e => { e.stopPropagation(); onSave(line.line, line.category); }}
            className="hero-save"
            style={{ color: saved ? "#f59e0b" : "#333" }}
            aria-label={saved ? "Unsave" : "Save"}
          >
            {saved ? "★" : "☆"}
          </button>
        </div>
        {copiedId === line.id && (
          <span className="hero-copied">✓ COPIED</span>
        )}
      </div>
    </div>
  );
}

function ProgressDots({ total, current, onSelect, paused }) {
  return (
    <div className="hero-dots">
      {Array.from({ length: total }, (_, i) => (
        <button
          key={i}
          onClick={() => onSelect(i)}
          className={`hero-dot ${i === current ? "hero-dot--active" : ""}`}
          aria-label={`Quote ${i + 1}`}
        >
          {i === current && !paused && <div className="hero-dot-fill" key={current} />}
        </button>
      ))}
    </div>
  );
}

const ROTATE_INTERVAL = 6000;
const HERO_POOL_SIZE = 8;

const FEED_PADDING = { padding: "14px 16px 0" };
const EMPTY_STATE = { textAlign: "center", padding: "60px 20px", color: "#3a3a4a", fontFamily: "'Outfit',sans-serif" };
const EMPTY_ICON = { fontSize: 32, marginBottom: 10 };
const EMPTY_TEXT = { fontSize: 14, color: "#6b7280" };
const EMPTY_HINT = { fontSize: 12, color: "#4b5563", marginTop: 4 };
const CONTROLS_ROW = { display: "flex", alignItems: "center", gap: 8 };
const FEED_CONTROLS = { display: "flex", gap: 6, alignItems: "center" };

export default function RotatingFeed({ lines, copiedId, onCopy, onSave, savedSet, search, onSearchChange }) {
  const [heroIdx, setHeroIdx] = useState(0);
  const [animState, setAnimState] = useState("in");
  const [paused, setPaused] = useState(false);
  const [shuffleSeed, setShuffleSeed] = useState(0);
  const timerRef = useRef(null);
  const animTimer = useRef(null);
  const heroIdxRef = useRef(heroIdx);
  heroIdxRef.current = heroIdx;

  // Interleaved feed — reshuffles when lines change or seed changes
  const feed = useMemo(() => interleaveShuffle(lines), [lines, shuffleSeed]);

  // Hero pool: first N items from the interleaved feed
  const heroPool = useMemo(() => feed.slice(0, Math.min(HERO_POOL_SIZE, feed.length)), [feed]);

  // Rest of feed (below hero)
  const belowFeed = useMemo(() => feed.slice(HERO_POOL_SIZE), [feed]);

  // Reset hero index when feed identity changes (remix, filter change, etc.)
  useEffect(() => {
    setHeroIdx(0);
    setAnimState("in");
  }, [feed]);

  // Cleanup animation timer on unmount
  useEffect(() => {
    return () => clearTimeout(animTimer.current);
  }, []);

  // Auto-rotate
  const advance = useCallback(() => {
    if (heroPool.length <= 1) return;
    clearTimeout(animTimer.current);
    setAnimState("out");
    animTimer.current = setTimeout(() => {
      setHeroIdx(prev => (prev + 1) % heroPool.length);
      setAnimState("in");
    }, 350);
  }, [heroPool.length]);

  useEffect(() => {
    if (paused || heroPool.length <= 1) return;
    timerRef.current = setInterval(advance, ROTATE_INTERVAL);
    return () => clearInterval(timerRef.current);
  }, [paused, advance, heroPool.length]);

  const goTo = useCallback((idx) => {
    if (idx === heroIdxRef.current) return;
    clearTimeout(animTimer.current);
    setAnimState("out");
    animTimer.current = setTimeout(() => {
      setHeroIdx(idx);
      setAnimState("in");
    }, 350);
  }, []);

  const heroLine = heroPool[heroIdx];

  if (lines.length === 0) {
    return (
      <div style={FEED_PADDING}>
        <div style={EMPTY_STATE}>
          <div style={EMPTY_ICON}>◌</div>
          <div style={EMPTY_TEXT}>No lines match your filters</div>
          <div style={EMPTY_HINT}>Try adjusting your character or mood filters</div>
        </div>
      </div>
    );
  }

  return (
    <div style={FEED_PADDING}>
      {/* Hero rotator */}
      {heroLine && (
        <div
          className="hero-container"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="hero-header">
            <div className="hero-label">
              <span className="hero-label-dot" />
              LIVE FEED
            </div>
            <div style={CONTROLS_ROW}>
              {paused && <span className="hero-paused-badge">PAUSED</span>}
              <button
                onClick={() => setPaused(p => !p)}
                className="hero-control"
                aria-label={paused ? "Resume" : "Pause"}
              >
                {paused ? "▶" : "❚❚"}
              </button>
              <button
                onClick={advance}
                className="hero-control"
                aria-label="Next quote"
              >
                →
              </button>
            </div>
          </div>

          <HeroQuote
            line={heroLine}
            animState={animState}
            onCopy={onCopy}
            onSave={onSave}
            saved={savedSet.has(heroLine.line)}
            copiedId={copiedId}
          />

          <ProgressDots
            total={heroPool.length}
            current={heroIdx}
            onSelect={goTo}
            paused={paused}
          />
        </div>
      )}

      {/* Feed controls */}
      <div className="feed-toolbar">
        <div className="feed-toolbar-left">
          <span className="feed-toolbar-label">THE FEED</span>
          <span className="feed-toolbar-count">{belowFeed.length}</span>
        </div>
        <div style={FEED_CONTROLS}>
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search..."
            className="feed-search"
          />
          <button
            onClick={() => setShuffleSeed(s => s + 1)}
            className="feed-shuffle-btn"
            title="Remix the feed"
          >
            ⟳ Remix
          </button>
        </div>
      </div>

      {/* Interleaved feed */}
      <div className="rotating-feed-grid">
        {belowFeed.map((l, i) => (
          <div key={l.id} className="feed-card-wrapper" style={{ animationDelay: `${Math.min(i * 0.04, 0.6)}s` }}>
            <LineCard
              line={l.line}
              category={l.category}
              character={l.character || "wick"}
              copied={copiedId === l.id}
              onCopy={() => onCopy(l.line, l.id)}
              onSave={onSave}
              saved={savedSet.has(l.line)}
              extra={l.inspired_by ? `← ${l.inspired_by}` : undefined}
              forged={l.source === "forged"}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
