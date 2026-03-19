import { useState, useMemo, useCallback } from "react";
import LineCard from "./LineCard.jsx";
import { groupLinesByCategory } from "../lib/lines.js";
import { CHARACTERS } from "../data/characters.js"; // used by groupLinesByCharacter

const VIEW_MODES = [
  { key: "grouped", label: "By Category", icon: "▦" },
  { key: "character", label: "By Character", icon: "👤" },
  { key: "shuffle", label: "Shuffle", icon: "⟳" },
];

const LAYOUT_MODES = [
  { key: "list", icon: "☰" },
  { key: "grid", icon: "⊞" },
];

function shuffleArray(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function groupLinesByCharacter(lines) {
  const buckets = new Map();
  for (const line of lines) {
    const charId = line.character || "wick";
    if (!buckets.has(charId)) buckets.set(charId, []);
    buckets.get(charId).push(line);
  }
  return Array.from(buckets.entries())
    .sort((a, b) => b[1].length - a[1].length)
    .map(([charId, charLines]) => {
      const char = CHARACTERS[charId] || { name: charId, icon: "?", energy: "" };
      return { key: charId, meta: { icon: char.icon, color: "#888", desc: char.energy }, label: char.name, lines: charLines };
    });
}

function SectionHeader({ icon, label, desc, color, count, expanded, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "10px 14px", marginBottom: expanded ? 8 : 2, marginTop: 12,
        background: `linear-gradient(135deg, ${color}0a, ${color}04)`,
        border: `1px solid ${color}20`,
        borderRadius: 10, cursor: "pointer",
        transition: "all 0.25s ease",
      }}
    >
      <div style={{
        width: 30, height: 30, borderRadius: 8,
        background: `${color}15`, display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, flexShrink: 0,
      }}>
        {icon}
      </div>
      <div style={{ flex: 1, textAlign: "left" }}>
        <div style={{
          fontSize: 13, fontWeight: 800, color: color,
          fontFamily: "'Outfit',sans-serif", letterSpacing: 0.3,
        }}>
          {label}
        </div>
        {desc && (
          <div style={{
            fontSize: 11, color: "#6b7280", fontFamily: "'Outfit',sans-serif",
            marginTop: 1,
          }}>
            {desc}
          </div>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: `${color}99`,
          fontFamily: "'Outfit',sans-serif",
          background: `${color}10`, padding: "2px 7px", borderRadius: 10,
        }}>
          {count}
        </span>
        <span style={{
          fontSize: 10, color: "#4b5563",
          transform: expanded ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform 0.25s ease",
          display: "inline-block",
        }}>
          ▾
        </span>
      </div>
    </button>
  );
}

function GridSectionCard({ icon, label, desc, color, count, expanded, onToggle }) {
  return (
    <button onClick={onToggle} className="grid-section-card" style={{ "--sec-color": color }}>
      <div className="grid-section-icon" style={{ background: `${color}15` }}>{icon}</div>
      <div className="grid-section-label" style={{ color }}>{label}</div>
      <div className="grid-section-desc">{desc}</div>
      <div className="grid-section-count" style={{ background: `${color}10`, color: `${color}cc` }}>
        {count}
      </div>
      {expanded && <div className="grid-section-active" style={{ background: color }} />}
    </button>
  );
}

export default function LineFeed({ lines, copiedId, onCopy, onSave, savedSet, search, onSearchChange }) {
  const [viewMode, setViewMode] = useState("grouped");
  const [layout, setLayout] = useState("grid");
  // Start with all sections collapsed
  const [expanded, setExpanded] = useState(new Set());
  const [shuffleSeed, setShuffleSeed] = useState(0);

  const toggleSection = useCallback((key) => {
    setExpanded(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const expandAll = useCallback(() => {
    const allKeys = viewMode === "character"
      ? byCharacterRef.current.map(g => `char-${g.key}`)
      : groupedRef.current.map(g => g.key);
    setExpanded(new Set(allKeys));
  }, [viewMode]);

  const collapseAll = useCallback(() => {
    setExpanded(new Set());
  }, []);

  const grouped = useMemo(() => groupLinesByCategory(lines), [lines]);
  const byCharacter = useMemo(() => groupLinesByCharacter(lines), [lines]);
  const shuffled = useMemo(() => shuffleArray(lines), [lines, shuffleSeed]);

  // Refs for expand/collapse all
  const groupedRef = { current: grouped };
  const byCharacterRef = { current: byCharacter };

  const handleViewChange = useCallback((mode) => {
    setViewMode(mode);
    setExpanded(new Set());
    if (mode === "shuffle") setShuffleSeed(s => s + 1);
  }, []);

  const renderLineCard = (l) => (
    <LineCard
      key={l.id}
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
  );

  const renderCards = (items) => (
    <div className={`fade-in ${layout === "grid" ? "quote-grid" : "quote-list"}`}>
      {items.map(renderLineCard)}
    </div>
  );

  const allExpanded = viewMode === "character"
    ? byCharacter.every(g => expanded.has(`char-${g.key}`))
    : grouped.every(g => expanded.has(g.key));

  return (
    <div style={{ padding: "14px 16px 0" }}>
      {/* Header row */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        marginBottom: 10,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            fontSize: 13, fontWeight: 800, color: "#6b7280",
            letterSpacing: 0.5, fontFamily: "'Outfit',sans-serif",
          }}>
            ALL LINES
          </div>
          <div style={{
            fontSize: 11, color: "#4b5563", fontFamily: "'Outfit',sans-serif",
            background: "rgba(255,255,255,0.04)", padding: "2px 6px", borderRadius: 8,
          }}>
            {lines.length}
          </div>
        </div>

        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          {/* Layout toggle */}
          <div style={{ display: "flex", gap: 1, background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: 2 }}>
            {LAYOUT_MODES.map(m => (
              <button
                key={m.key}
                onClick={() => setLayout(m.key)}
                title={m.key === "list" ? "List view" : "Grid view"}
                style={{
                  background: layout === m.key ? "rgba(255,255,255,0.1)" : "transparent",
                  border: "none", borderRadius: 4, padding: "3px 8px",
                  fontSize: 13, color: layout === m.key ? "#f5f5f7" : "#4b5563",
                  cursor: "pointer", transition: "all 0.2s ease",
                  lineHeight: 1,
                }}
              >
                {m.icon}
              </button>
            ))}
          </div>

          {/* View mode toggle */}
          <div style={{ display: "flex", gap: 2, background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: 2 }}>
            {VIEW_MODES.map(m => (
              <button
                key={m.key}
                onClick={() => handleViewChange(m.key)}
                title={m.label}
                style={{
                  background: viewMode === m.key ? "rgba(255,255,255,0.08)" : "transparent",
                  border: "none", borderRadius: 6, padding: "4px 10px",
                  fontSize: 11, fontFamily: "'Outfit',sans-serif", fontWeight: 600,
                  color: viewMode === m.key ? "#f5f5f7" : "#4b5563",
                  cursor: "pointer", transition: "all 0.2s ease",
                  display: "flex", alignItems: "center", gap: 3,
                }}
              >
                <span style={{ fontSize: 11 }}>{m.icon}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search + expand/collapse controls */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10, alignItems: "center" }}>
        <input
          type="text"
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          placeholder="Search lines..."
          style={{
            flex: 1, padding: "9px 14px", fontSize: 13,
            background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 8, color: "#f5f5f7", fontFamily: "'Outfit',sans-serif",
            outline: "none",
          }}
        />
        {viewMode !== "shuffle" && (
          <button
            onClick={allExpanded ? collapseAll : expandAll}
            title={allExpanded ? "Collapse all" : "Expand all"}
            style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8, padding: "9px 12px", cursor: "pointer",
              fontSize: 11, fontWeight: 700, fontFamily: "'Outfit',sans-serif",
              color: "#6b7280", transition: "all 0.2s ease",
              whiteSpace: "nowrap",
            }}
          >
            {allExpanded ? "▲ Collapse" : "▼ Expand all"}
          </button>
        )}
      </div>

      {/* Empty state */}
      {lines.length === 0 && (
        <div style={{
          textAlign: "center", padding: "40px 20px",
          color: "#3a3a4a", fontFamily: "'Outfit',sans-serif",
        }}>
          <div style={{ fontSize: 24, marginBottom: 8 }}>◌</div>
          <div style={{ fontSize: 13, color: "#6b7280" }}>No lines match your filters</div>
          <div style={{ fontSize: 12, color: "#4b5563", marginTop: 4 }}>Try adjusting your character or mood filters</div>
        </div>
      )}

      {/* Grouped by Category */}
      {viewMode === "grouped" && (
        <>
          {/* Collapsed section cards */}
          {layout === "grid" ? (
            <div className="section-grid">
              {grouped.filter(g => !expanded.has(g.key)).map(group => (
                <GridSectionCard
                  key={group.key}
                  icon={group.meta.icon}
                  label={group.key.charAt(0) + group.key.slice(1).toLowerCase()}
                  desc={group.meta.desc}
                  color={group.meta.color}
                  count={group.lines.length}
                  expanded={false}
                  onToggle={() => toggleSection(group.key)}
                />
              ))}
            </div>
          ) : (
            grouped.filter(g => !expanded.has(g.key)).map(group => (
              <SectionHeader
                key={group.key}
                icon={group.meta.icon}
                label={group.key.charAt(0) + group.key.slice(1).toLowerCase()}
                desc={group.meta.desc}
                color={group.meta.color}
                count={group.lines.length}
                expanded={false}
                onToggle={() => toggleSection(group.key)}
              />
            ))
          )}
          {/* Expanded sections — always full width */}
          {grouped.filter(g => expanded.has(g.key)).map(group => (
            <div key={group.key}>
              <SectionHeader
                icon={group.meta.icon}
                label={group.key.charAt(0) + group.key.slice(1).toLowerCase()}
                desc={group.meta.desc}
                color={group.meta.color}
                count={group.lines.length}
                expanded={true}
                onToggle={() => toggleSection(group.key)}
              />
              {renderCards(group.lines)}
            </div>
          ))}
        </>
      )}

      {/* Grouped by Character */}
      {viewMode === "character" && (
        <>
          {layout === "grid" ? (
            <div className="section-grid">
              {byCharacter.filter(g => !expanded.has(`char-${g.key}`)).map(group => (
                <GridSectionCard
                  key={group.key}
                  icon={group.meta.icon}
                  label={group.label}
                  desc={group.meta.desc}
                  color={group.meta.color}
                  count={group.lines.length}
                  expanded={false}
                  onToggle={() => toggleSection(`char-${group.key}`)}
                />
              ))}
            </div>
          ) : (
            byCharacter.filter(g => !expanded.has(`char-${g.key}`)).map(group => (
              <SectionHeader
                key={group.key}
                icon={group.meta.icon}
                label={group.label}
                desc={group.meta.desc}
                color={group.meta.color}
                count={group.lines.length}
                expanded={false}
                onToggle={() => toggleSection(`char-${group.key}`)}
              />
            ))
          )}
          {byCharacter.filter(g => expanded.has(`char-${g.key}`)).map(group => (
            <div key={group.key}>
              <SectionHeader
                icon={group.meta.icon}
                label={group.label}
                desc={group.meta.desc}
                color={group.meta.color}
                count={group.lines.length}
                expanded={true}
                onToggle={() => toggleSection(`char-${group.key}`)}
              />
              {renderCards(group.lines)}
            </div>
          ))}
        </>
      )}

      {/* Shuffled flat list */}
      {viewMode === "shuffle" && (
        <>
          <div style={{ textAlign: "center", marginBottom: 10 }}>
            <button
              onClick={() => setShuffleSeed(s => s + 1)}
              style={{
                background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
                borderRadius: 8, padding: "6px 16px", cursor: "pointer",
                fontSize: 10, fontWeight: 700, fontFamily: "'Outfit',sans-serif",
                color: "#ef4444", transition: "all 0.2s ease",
              }}
            >
              ⟳ Reshuffle
            </button>
          </div>
          {renderCards(shuffled)}
        </>
      )}
    </div>
  );
}
