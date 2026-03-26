import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { useSavedLines, useForgedBatches, useApiKey } from "./hooks/useStorage.js";
import { useForge } from "./hooks/useForge.js";
import { getAllLines, filterLines } from "./lib/lines.js";
import LeftPanel from "./components/LeftPanel.jsx";
import RightPanel from "./components/RightPanel.jsx";
import TrendingToday from "./components/TrendingToday.jsx";
import LineFeed from "./components/LineFeed.jsx";
import RotatingFeed from "./components/RotatingFeed.jsx";
import CharacterProfile from "./components/CharacterProfile.jsx";
import ForgePanel from "./components/ForgePanel.jsx";
import SettingsPanel from "./components/SettingsPanel.jsx";
import BottomNav from "./components/BottomNav.jsx";
import Toast from "./components/Toast.jsx";

const CSS = `
* { margin: 0; padding: 0; box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
:root {
  --bg-0: #08080c; --bg-1: #0e0e14; --bg-2: #14141c; --bg-3: #1a1a24;
  --text-0: #f0f0f5; --text-1: #c0c0cc; --text-2: #808098; --text-3: #50506a;
  --red: #ef4444; --red-dim: rgba(239,68,68,0.12); --accent: #ef4444;
  --panel-w: 230px;
}
html, body { height: 100%; overflow: hidden; }
body { background: var(--bg-0); color: var(--text-1); }

@keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
@keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes breathe { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
@keyframes toast-in { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes toast-out { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px) scale(0.95); } }

.fade-in { animation: fade-in 0.35s ease-out both; }

/* Section grid — collapsed sections as cards */
.section-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 8px; margin: 10px 0;
}
.grid-section-card {
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  padding: 14px 10px; border-radius: 10px; cursor: pointer;
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.2s ease; position: relative; overflow: hidden;
  text-align: center; width: 100%;
}
.grid-section-card:hover {
  background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1);
  transform: translateY(-2px); box-shadow: 0 4px 16px rgba(0,0,0,0.3);
}
.grid-section-icon {
  width: 36px; height: 36px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  font-size: 18px; flex-shrink: 0;
}
.grid-section-label {
  font-size: 12px; font-weight: 800; font-family: 'Outfit',sans-serif;
  letter-spacing: 0.3px;
}
.grid-section-desc {
  font-size: 10px; color: #6b7280; font-family: 'Outfit',sans-serif;
  line-height: 1.3; display: -webkit-box; -webkit-line-clamp: 2;
  -webkit-box-orient: vertical; overflow: hidden;
}
.grid-section-count {
  font-size: 10px; font-weight: 700; font-family: 'Outfit',sans-serif;
  padding: 2px 8px; border-radius: 10px; margin-top: 2px;
}
.grid-section-active {
  position: absolute; bottom: 0; left: 20%; right: 20%;
  height: 2px; border-radius: 2px;
}

/* Quote layout modes */
.quote-list { display: flex; flex-direction: column; }
.quote-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px; }
.quote-grid .line-card { margin-bottom: 0; display: flex; flex-direction: column; }
.quote-grid .line-card > div:first-child { flex: 1; }

.line-card { transition: all 0.2s ease; cursor: pointer; position: relative; }
.line-card:hover { background: rgba(255,255,255,0.04) !important; }
.line-card:active { transform: scale(0.985); }
.line-card:focus-visible { outline: 2px solid var(--red); outline-offset: -2px; border-radius: 10px; }
.forge-pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--red); position: relative; }
.forge-pulse::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; border: 1px solid var(--red); animation: pulse-ring 2s ease-out infinite; }
.shimmer-btn { background: linear-gradient(90deg, #ef4444, #dc2626, #b91c1c, #dc2626, #ef4444); background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite; }
.toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); z-index: 200; animation: toast-in 0.3s ease-out; pointer-events: none; }
.toast--exit { animation: toast-out 0.25s ease-in forwards; }

/* === ROTATING FEED === */
@keyframes hero-in { from { opacity: 0; transform: translateY(12px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes hero-out { from { opacity: 1; transform: translateY(0) scale(1); } to { opacity: 0; transform: translateY(-8px) scale(0.98); } }
@keyframes feed-card-in { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
@keyframes dot-fill { from { width: 0%; } to { width: 100%; } }
@keyframes live-pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.3; } }

.hero-container {
  margin-bottom: 20px; padding: 2px;
  border-radius: 14px;
  background: linear-gradient(135deg, rgba(239,68,68,0.06), rgba(139,92,246,0.04));
  border: 1px solid rgba(255,255,255,0.04);
}
.hero-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 14px 0;
}
.hero-label {
  font-size: 11px; font-weight: 800; letter-spacing: 1.5px;
  color: #ef4444; font-family: 'Outfit',sans-serif;
  display: flex; align-items: center; gap: 6px;
}
.hero-label-dot {
  width: 6px; height: 6px; border-radius: 50%; background: #ef4444;
  animation: live-pulse 2s ease-in-out infinite;
}
.hero-paused-badge {
  font-size: 9px; font-weight: 700; color: #6b7280;
  font-family: 'Outfit',sans-serif; letter-spacing: 0.5px;
  padding: 2px 6px; border-radius: 4px;
  background: rgba(255,255,255,0.04);
}
.hero-control {
  background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 6px; padding: 4px 10px; cursor: pointer;
  font-size: 11px; color: #6b7280; transition: all 0.2s ease;
  font-family: 'Outfit',sans-serif;
}
.hero-control:hover { background: rgba(255,255,255,0.08); color: #f5f5f7; }

.hero-quote {
  padding: 20px 16px 14px; cursor: pointer; position: relative; overflow: hidden;
}
.hero-quote--in { animation: hero-in 0.4s ease-out both; }
.hero-quote--out { animation: hero-out 0.3s ease-in both; }
.hero-accent {
  position: absolute; left: 0; top: 16px; bottom: 16px; width: 3px; border-radius: 3px;
}
.hero-content { padding-left: 14px; }
.hero-text {
  font-size: 22px; font-weight: 600; color: #f5f5f7; line-height: 1.5;
  font-family: 'Outfit',sans-serif; letter-spacing: -0.2px;
}
.hero-meta {
  display: flex; align-items: center; gap: 8px; margin-top: 12px; flex-wrap: wrap;
}
.hero-category {
  font-size: 11px; font-weight: 700; padding: 3px 8px; border-radius: 5px;
  font-family: 'Outfit',sans-serif;
}
.hero-character {
  font-size: 12px; color: #888; font-family: 'Outfit',sans-serif;
}
.hero-forged {
  font-size: 10px; font-weight: 800; color: #ef4444;
  background: rgba(239,68,68,0.1); padding: 2px 6px; border-radius: 4px;
  font-family: 'Outfit',sans-serif; letter-spacing: 0.5px;
}
.hero-save {
  margin-left: auto; background: none; border: none;
  cursor: pointer; font-size: 18px; padding: 2px 4px;
  transition: transform 0.2s ease;
}
.hero-save:hover { transform: scale(1.2); }
.hero-copied {
  position: absolute; top: 12px; right: 14px;
  font-size: 11px; color: #22c55e; font-weight: 700;
  font-family: 'Outfit',sans-serif;
}

/* Progress dots */
.hero-dots {
  display: flex; justify-content: center; gap: 4px;
  padding: 8px 14px 12px;
}
.hero-dot {
  width: 24px; height: 3px; border-radius: 3px; border: none; padding: 0;
  background: rgba(255,255,255,0.08); cursor: pointer;
  position: relative; overflow: hidden; transition: background 0.2s ease;
}
.hero-dot:hover { background: rgba(255,255,255,0.15); }
.hero-dot--active { background: rgba(239,68,68,0.2); }
.hero-dot-fill {
  position: absolute; left: 0; top: 0; bottom: 0;
  background: #ef4444; border-radius: 3px;
  animation: dot-fill 5.65s linear;
}

/* Feed toolbar */
.feed-toolbar {
  display: flex; align-items: center; justify-content: space-between;
  margin-bottom: 10px; gap: 8px;
}
.feed-toolbar-left { display: flex; align-items: center; gap: 8px; }
.feed-toolbar-label {
  font-size: 13px; font-weight: 800; color: #6b7280;
  letter-spacing: 0.5px; font-family: 'Outfit',sans-serif;
}
.feed-toolbar-count {
  font-size: 11px; color: #4b5563; font-family: 'Outfit',sans-serif;
  background: rgba(255,255,255,0.04); padding: 2px 6px; border-radius: 8px;
}
.feed-search {
  padding: 7px 12px; font-size: 12px; width: 160px;
  background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 8px; color: #f5f5f7; font-family: 'Outfit',sans-serif;
  outline: none; transition: border-color 0.2s ease;
}
.feed-search:focus { border-color: rgba(239,68,68,0.3); }
.feed-shuffle-btn {
  background: rgba(239,68,68,0.06); border: 1px solid rgba(239,68,68,0.12);
  border-radius: 8px; padding: 7px 12px; cursor: pointer;
  font-size: 11px; font-weight: 700; font-family: 'Outfit',sans-serif;
  color: #ef4444; transition: all 0.2s ease; white-space: nowrap;
}
.feed-shuffle-btn:hover { background: rgba(239,68,68,0.12); border-color: rgba(239,68,68,0.25); }

/* Feed grid */
.rotating-feed-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 8px;
}
.feed-card-wrapper {
  animation: feed-card-in 0.4s ease-out both;
}

/* View toggle in header */
.view-toggle-bar {
  display: flex; align-items: center; gap: 2px;
  background: rgba(255,255,255,0.03); border-radius: 8px; padding: 2px;
}
.view-toggle-btn {
  background: transparent; border: none; border-radius: 6px;
  padding: 5px 12px; cursor: pointer; font-size: 11px; font-weight: 600;
  font-family: 'Outfit',sans-serif; color: #4b5563;
  transition: all 0.2s ease; display: flex; align-items: center; gap: 4px;
}
.view-toggle-btn:hover { color: #9ca3af; }
.view-toggle-btn--active {
  background: rgba(255,255,255,0.08); color: #f5f5f7;
}

.cat-tag { position: relative; cursor: help; }
.cat-tag .cat-tip { visibility: hidden; opacity: 0; position: absolute; bottom: calc(100% + 6px); left: 0; white-space: nowrap; padding: 5px 10px; border-radius: 6px; background: #1e1e2e; border: 1px solid rgba(255,255,255,0.1); color: #c0c0cc; font-size: 13px; font-weight: 500; font-family: 'Outfit',sans-serif; pointer-events: none; transition: opacity 0.15s ease, visibility 0.15s ease; z-index: 30; box-shadow: 0 4px 12px rgba(0,0,0,0.4); }
.cat-tag .cat-tip::after { content: ''; position: absolute; top: 100%; left: 12px; border: 4px solid transparent; border-top-color: #1e1e2e; }
.cat-tag:hover .cat-tip { visibility: visible; opacity: 1; }

/* Inline character pill tooltip (line cards) */
.char-pill { position: relative; cursor: help; }
.char-pill .char-pill-tip { visibility: hidden; opacity: 0; position: absolute; bottom: calc(100% + 8px); left: 50%; transform: translateX(-50%); white-space: nowrap; padding: 5px 10px; border-radius: 6px; background: #1e1e2e; border: 1px solid rgba(255,255,255,0.15); color: #e0e0ea; font-size: 12px; font-weight: 500; font-family: 'Outfit',sans-serif; pointer-events: none; transition: opacity 0.15s ease, visibility 0.15s ease; z-index: 30; box-shadow: 0 4px 12px rgba(0,0,0,0.5); }
.char-pill .char-pill-tip::after { content: ''; position: absolute; top: 100%; left: 50%; transform: translateX(-50%); border: 4px solid transparent; border-top-color: #1e1e2e; }
.char-pill:hover .char-pill-tip { visibility: visible; opacity: 1; }

/* Easter egg: build version tooltip on logo */
.version-tooltip::after { content: attr(data-version); visibility: hidden; opacity: 0; position: absolute; top: calc(100% + 8px); left: 50%; transform: translateX(-50%); white-space: nowrap; padding: 5px 10px; border-radius: 6px; background: linear-gradient(135deg, #1e1e2e, #2a1a2e); border: 1px solid rgba(239,68,68,0.25); color: #ef4444; font-size: 11px; font-weight: 600; font-family: 'Outfit',monospace; letter-spacing: 0.5px; pointer-events: none; transition: opacity 0.2s ease, visibility 0.2s ease; z-index: 50; box-shadow: 0 4px 16px rgba(239,68,68,0.15); }
.version-tooltip::before { content: ''; visibility: hidden; opacity: 0; position: absolute; top: calc(100% + 2px); left: 50%; transform: translateX(-50%); border: 5px solid transparent; border-bottom-color: rgba(239,68,68,0.25); z-index: 50; transition: opacity 0.2s ease, visibility 0.2s ease; }
.version-tooltip:hover::after, .version-tooltip:hover::before { visibility: visible; opacity: 1; }

/* === 3-PANEL LAYOUT === */
.app-shell {
  display: flex; height: 100vh; width: 100%;
  font-family: 'Outfit', sans-serif;
}

/* Sidebar shared */
.left-panel, .right-panel {
  width: var(--panel-w); flex-shrink: 0;
  height: 100vh; overflow-y: auto;
  scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.06) transparent;
  border-right: 1px solid rgba(255,255,255,0.04);
  background: linear-gradient(180deg, var(--bg-1) 0%, var(--bg-0) 100%);
  padding: 16px 10px 80px;
}
.left-panel::-webkit-scrollbar, .right-panel::-webkit-scrollbar { width: 4px; }
.left-panel::-webkit-scrollbar-thumb, .right-panel::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.06); border-radius: 4px;
}
.right-panel {
  border-right: none; border-left: 1px solid rgba(255,255,255,0.04);
}

.panel-label {
  font-size: 11px; font-weight: 800; color: #4b5563;
  letter-spacing: 1.2px; margin-bottom: 10px;
  padding: 0 4px; font-family: 'Outfit', sans-serif;
}
.panel-hint {
  font-size: 10px; color: #333; text-align: center;
  margin-top: 12px; font-style: italic;
}
.panel-section { margin-bottom: 20px; }

/* Left panel — characters */
.char-list { display: flex; flex-direction: column; gap: 4px; }
.char-item {
  display: flex; align-items: center; gap: 8px;
  padding: 7px 8px; border-radius: 8px; cursor: pointer;
  user-select: none; transition: all 0.2s ease;
  border: 1px solid transparent;
  background: transparent;
}
.char-item:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.08);
  transform: translateX(3px);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}
.char-item:hover .char-item-name { color: #fff; }
.char-item:hover .char-item-energy { color: #888; }
.char-item--active {
  background: linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04));
  border-color: rgba(239,68,68,0.2);
}
.char-item--active:hover {
  background: linear-gradient(135deg, rgba(239,68,68,0.18), rgba(239,68,68,0.08));
  border-color: rgba(239,68,68,0.3);
  box-shadow: 0 2px 12px rgba(239,68,68,0.15);
}
.char-item-icon { font-size: 20px; flex-shrink: 0; width: 28px; text-align: center; }
.char-item-info { min-width: 0; }
.char-item-name {
  font-size: 13px; font-weight: 800; color: #e5e5ea;
  letter-spacing: 0.3px; font-family: 'Outfit', sans-serif;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.char-item-energy {
  font-size: 10px; color: #555; font-family: 'Outfit', sans-serif;
  white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.char-item-energy--active { color: #ef4444; }
.char-item-source {
  font-size: 9px; color: transparent; font-family: 'Outfit', sans-serif;
  font-style: italic; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  transition: color 0.2s ease; max-height: 0; overflow: hidden;
  transition: color 0.2s ease, max-height 0.2s ease;
}
.char-item:hover .char-item-source { color: #666; max-height: 14px; }

/* Right panel — filter chips */
.filter-stack { display: flex; flex-direction: column; gap: 3px; }
.sidebar-chip {
  display: flex; align-items: center; gap: 6px;
  width: 100%; padding: 6px 10px; border-radius: 8px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  cursor: pointer; transition: all 0.2s ease;
  font-family: 'Outfit', sans-serif;
  text-align: left;
}
.sidebar-chip:hover {
  background: rgba(255,255,255,0.06);
  border-color: rgba(255,255,255,0.1);
  transform: translateX(2px);
  box-shadow: 0 2px 6px rgba(0,0,0,0.15);
}
.sidebar-chip:hover .sidebar-chip-text { color: #a0a0b0; }
.sidebar-chip:hover .sidebar-chip-icon { opacity: 1; }
.sidebar-chip--active:hover {
  background: color-mix(in srgb, var(--chip-color) 15%, transparent);
  border-color: color-mix(in srgb, var(--chip-color) 35%, transparent);
  box-shadow: 0 2px 10px color-mix(in srgb, var(--chip-color) 15%, transparent);
}
.sidebar-chip--active {
  background: color-mix(in srgb, var(--chip-color) 10%, transparent);
  border-color: color-mix(in srgb, var(--chip-color) 25%, transparent);
}
.sidebar-chip--active .sidebar-chip-text { color: var(--chip-color); }
.sidebar-chip--active .sidebar-chip-icon { opacity: 1; }
.sidebar-chip-icon { font-size: 16px; flex-shrink: 0; opacity: 0.7; }
.sidebar-chip-text {
  font-size: 13px; font-weight: 600; color: #6b7280;
  transition: color 0.2s ease;
}

/* Center column */
.center-column {
  flex: 1; min-width: 0; height: 100vh;
  overflow-y: auto; padding-bottom: 80px;
  scrollbar-width: thin; scrollbar-color: rgba(255,255,255,0.06) transparent;
}
.center-column::-webkit-scrollbar { width: 6px; }
.center-column::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.06); border-radius: 4px;
}

/* Bottom nav adjustments for full-width layout */
.bottom-nav-bar {
  position: fixed; bottom: 0; left: var(--panel-w); right: var(--panel-w);
  z-index: 50; background: rgba(8,8,12,0.95);
  border-top: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(10px); display: flex; padding: 10px 0 14px;
}

/* Responsive: collapse sidebars on narrow screens */
@media (max-width: 900px) {
  :root { --panel-w: 190px; }
}
@media (max-width: 700px) {
  .app-shell { flex-direction: column; }
  .left-panel, .right-panel {
    width: 100%; height: auto; overflow-y: visible;
    border-right: none; border-left: none;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    padding: 10px 12px;
  }
  .right-panel { border-bottom: none; border-top: 1px solid rgba(255,255,255,0.04); }
  .char-list { flex-direction: row; flex-wrap: wrap; }
  .filter-stack { flex-direction: row; flex-wrap: wrap; }
  .sidebar-chip { width: auto; }
  .center-column { height: auto; overflow-y: visible; }
  .bottom-nav-bar { left: 0; right: 0; }
  .app-shell { height: auto; overflow-y: auto; }
  html, body { overflow: auto; }
}
`;

const ALL_LINES = getAllLines();

const HEADER_WRAP = { padding: "16px 16px 0", textAlign: "center" };
const HEADER_ROW = { display: "flex", alignItems: "center", justifyContent: "center", gap: 8 };
const HEADER_TITLE = { fontSize: 18, fontWeight: 800, color: "#f5f5f7", letterSpacing: -0.5 };
const HEADER_SUB = { fontSize: 10, color: "#4b5563", marginTop: 3, letterSpacing: 1, textTransform: "uppercase" };
const HEADER_TOGGLE_WRAP = { display: "flex", justifyContent: "center", marginTop: 10 };
const LOGO_STYLE = {
  width: 28, height: 28, borderRadius: 7,
  background: "linear-gradient(135deg, #ef4444, #991b1b)",
  display: "flex", alignItems: "center", justifyContent: "center",
  fontSize: 14, cursor: "pointer", userSelect: "none", position: "relative",
};

export default function MentalKungFuApp() {
  // Filters
  const [activeCharacters, setActiveCharacters] = useState(new Set());
  const [activeMoods, setActiveMoods] = useState(new Set());
  const [activeEmotions, setActiveEmotions] = useState(new Set());
  const [activeCategories, setActiveCategories] = useState(new Set());
  const [savedOnly, setSavedOnly] = useState(false);
  const [search, setSearch] = useState("");

  // UI state
  const [viewStyle, setViewStyle] = useState("feed"); // "feed" | "classic"
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [profileChar, setProfileChar] = useState(null);
  const [forgeOpen, setForgeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toastTimer = useRef(null);
  const toastClearTimer = useRef(null);
  const copyTimer = useRef(null);
  const scrollRef = useRef(null);

  // Easter egg: click logo 10 times to reveal build version
  const [logoClicks, setLogoClicks] = useState(0);
  const [versionUnlocked, setVersionUnlocked] = useState(false);
  const clickTimer = useRef(null);
  const handleLogoClick = useCallback(() => {
    setLogoClicks(prev => {
      const next = prev + 1;
      if (next >= 10) {
        setVersionUnlocked(true);
        return 0;
      }
      return next;
    });
    clearTimeout(clickTimer.current);
    clickTimer.current = setTimeout(() => setLogoClicks(0), 2000);
  }, []);

  // Cleanup untracked timers on unmount
  useEffect(() => {
    return () => {
      clearTimeout(clickTimer.current);
      clearTimeout(copyTimer.current);
    };
  }, []);

  // Data hooks
  const { savedLines, savedSet, toggleSave } = useSavedLines();
  const { batches, addBatch, deleteBatch, clearAll } = useForgedBatches();
  const { apiKey, saveKey, clearKey } = useApiKey();

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    clearTimeout(toastClearTimer.current);
    setToast({ message, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 1800);
    toastClearTimer.current = setTimeout(() => setToast({ message: "", visible: false }), 2100);
  }, []);

  const { forging, forgeError, forgeStatus, autoForge, runForge, toggleAuto } = useForge({
    apiKey,
    onBatch: addBatch,
    onToast: showToast,
  });

  // Copy handler
  const copyLine = useCallback((line, id) => {
    navigator.clipboard?.writeText(line);
    setCopiedId(id);
    showToast("Copied to clipboard");
    clearTimeout(copyTimer.current);
    copyTimer.current = setTimeout(() => setCopiedId(null), 2000);
  }, [showToast]);

  // Filter toggles
  const toggleCharacter = useCallback((id) => {
    setActiveCharacters(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const toggleMood = useCallback((mood) => {
    setActiveMoods(prev => {
      const next = new Set(prev);
      next.has(mood) ? next.delete(mood) : next.add(mood);
      return next;
    });
  }, []);

  const toggleEmotion = useCallback((emotion) => {
    setActiveEmotions(prev => {
      const next = new Set(prev);
      next.has(emotion) ? next.delete(emotion) : next.add(emotion);
      return next;
    });
  }, []);

  const toggleCategory = useCallback((cat) => {
    setActiveCategories(prev => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });
  }, []);

  // Build forged lines for the unified feed
  const forgedFeedLines = useMemo(() => {
    const lines = [];
    for (const batch of batches) {
      for (const item of batch.lines) {
        lines.push({
          ...item,
          character: item.character || "wick",
          source: "forged",
        });
      }
    }
    return lines;
  }, [batches]);

  // Filtered lines (static)
  const filteredLines = useMemo(() => {
    return filterLines(ALL_LINES, {
      characters: activeCharacters,
      moods: activeMoods,
      emotions: activeEmotions,
      categories: activeCategories,
      savedOnly,
      savedSet,
      search,
    });
  }, [activeCharacters, activeMoods, activeEmotions, activeCategories, savedOnly, savedSet, search]);

  // Filtered forged lines (same filters as static)
  const filteredForgedLines = useMemo(() => {
    return filterLines(forgedFeedLines, {
      characters: activeCharacters,
      moods: activeMoods,
      emotions: activeEmotions,
      categories: activeCategories,
      savedOnly,
      savedSet,
      search,
    });
  }, [forgedFeedLines, activeCharacters, activeMoods, activeEmotions, activeCategories, savedOnly, savedSet, search]);

  // Combined feed: forged + static
  const combinedFeed = useMemo(() => {
    return [...filteredForgedLines, ...filteredLines];
  }, [filteredForgedLines, filteredLines]);

  const handleHome = useCallback(() => {
    setActiveCharacters(new Set());
    setActiveMoods(new Set());
    setActiveEmotions(new Set());
    setActiveCategories(new Set());
    setSavedOnly(false);
    setSearch("");
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div className="app-shell">
        <RightPanel
          activeEmotions={activeEmotions}
          onToggleEmotion={toggleEmotion}
          activeMoods={activeMoods}
          onToggleMood={toggleMood}
          activeCategories={activeCategories}
          onToggleCategory={toggleCategory}
          savedActive={savedOnly}
          onToggleSaved={() => setSavedOnly(v => !v)}
        />

        <div ref={scrollRef} className="center-column">
          {/* Header */}
          <div style={HEADER_WRAP}>
            <div style={HEADER_ROW}>
              <div
                onClick={handleLogoClick}
                className={versionUnlocked ? "version-tooltip" : ""}
                data-version={`v${__APP_VERSION__} · build ${__BUILD_NUMBER__} · ${new Date(__BUILD_TIME__).toLocaleDateString()}`}
                style={LOGO_STYLE}
              >⚡</div>
              <div style={HEADER_TITLE}>Mental Kung Fu</div>
            </div>
            <div style={HEADER_SUB}>Tactical Mindset Engine</div>
            {/* View style toggle */}
            <div style={HEADER_TOGGLE_WRAP}>
              <div className="view-toggle-bar">
                <button
                  className={`view-toggle-btn ${viewStyle === "feed" ? "view-toggle-btn--active" : ""}`}
                  onClick={() => setViewStyle("feed")}
                >
                  <span style={{ fontSize: 12 }}>◉</span> Feed
                </button>
                <button
                  className={`view-toggle-btn ${viewStyle === "classic" ? "view-toggle-btn--active" : ""}`}
                  onClick={() => setViewStyle("classic")}
                >
                  <span style={{ fontSize: 11 }}>▦</span> Classic
                </button>
              </div>
            </div>
          </div>

          {viewStyle === "feed" ? (
            <RotatingFeed
              lines={combinedFeed}
              copiedId={copiedId}
              onCopy={copyLine}
              onSave={toggleSave}
              savedSet={savedSet}
              search={search}
              onSearchChange={setSearch}
            />
          ) : (
            <>
              <TrendingToday
                batches={batches}
                copiedId={copiedId}
                onCopy={copyLine}
                onSave={toggleSave}
                savedSet={savedSet}
              />
              <LineFeed
                lines={filteredLines}
                copiedId={copiedId}
                onCopy={copyLine}
                onSave={toggleSave}
                savedSet={savedSet}
                search={search}
                onSearchChange={setSearch}
              />
            </>
          )}
        </div>

        <LeftPanel
          activeCharacters={activeCharacters}
          onToggle={toggleCharacter}
          onProfile={setProfileChar}
        />
      </div>

      <BottomNav
        onHome={handleHome}
        onForge={() => setForgeOpen(true)}
        onSettings={() => setSettingsOpen(true)}
      />

      <ForgePanel
        visible={forgeOpen}
        onClose={() => setForgeOpen(false)}
        forging={forging}
        forgeStatus={forgeStatus}
        forgeError={forgeError}
        onForge={runForge}
        autoForge={autoForge}
        onToggleAuto={toggleAuto}
      />

      <SettingsPanel
        visible={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        apiKey={apiKey}
        onSaveKey={saveKey}
        onClearKey={clearKey}
        onToast={showToast}
      />

      {profileChar && (
        <CharacterProfile
          characterId={profileChar}
          lines={ALL_LINES}
          onClose={() => setProfileChar(null)}
          onCopy={copyLine}
          copiedId={copiedId}
          onSave={toggleSave}
          savedSet={savedSet}
        />
      )}

      <Toast message={toast.message} visible={toast.visible} />
    </>
  );
}
