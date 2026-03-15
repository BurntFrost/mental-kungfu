import { useState, useCallback, useMemo, useRef } from "react";
import { useSavedLines, useForgedBatches, useApiKey } from "./hooks/useStorage.js";
import { useForge } from "./hooks/useForge.js";
import { getAllLines, filterLines } from "./lib/lines.js";
import CharacterGrid from "./components/CharacterGrid.jsx";
import MoodChips from "./components/MoodChips.jsx";
import TrendingToday from "./components/TrendingToday.jsx";
import LineFeed from "./components/LineFeed.jsx";
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
}
body { background: var(--bg-0); color: var(--text-1); }

@keyframes pulse-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
@keyframes fade-in { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes breathe { 0%, 100% { opacity: 0.4; } 50% { opacity: 1; } }
@keyframes toast-in { from { opacity: 0; transform: translateY(20px) scale(0.95); } to { opacity: 1; transform: translateY(0) scale(1); } }
@keyframes toast-out { from { opacity: 1; } to { opacity: 0; transform: translateY(-10px) scale(0.95); } }

.fade-in { animation: fade-in 0.35s ease-out both; }
.line-card { transition: all 0.2s ease; cursor: pointer; position: relative; }
.line-card:hover { background: rgba(255,255,255,0.04) !important; }
.line-card:active { transform: scale(0.985); }
.line-card:focus-visible { outline: 2px solid var(--red); outline-offset: -2px; border-radius: 10px; }
.forge-pulse { width: 8px; height: 8px; border-radius: 50%; background: var(--red); position: relative; }
.forge-pulse::after { content: ''; position: absolute; inset: -3px; border-radius: 50%; border: 1px solid var(--red); animation: pulse-ring 2s ease-out infinite; }
.shimmer-btn { background: linear-gradient(90deg, #ef4444, #dc2626, #b91c1c, #dc2626, #ef4444); background-size: 200% 100%; animation: shimmer 3s ease-in-out infinite; }
.toast { position: fixed; bottom: 80px; left: 50%; transform: translateX(-50%); z-index: 200; animation: toast-in 0.3s ease-out; pointer-events: none; }
.toast--exit { animation: toast-out 0.25s ease-in forwards; }
`;

const ALL_LINES = getAllLines();

export default function MentalKungFuApp() {
  // Filters
  const [activeCharacters, setActiveCharacters] = useState(new Set());
  const [activeMoods, setActiveMoods] = useState(new Set());
  const [savedOnly, setSavedOnly] = useState(false);
  const [search, setSearch] = useState("");

  // UI state
  const [copiedId, setCopiedId] = useState(null);
  const [toast, setToast] = useState({ message: "", visible: false });
  const [profileChar, setProfileChar] = useState(null);
  const [forgeOpen, setForgeOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const toastTimer = useRef(null);
  const scrollRef = useRef(null);

  // Data hooks
  const { savedLines, savedSet, toggleSave } = useSavedLines();
  const { batches, addBatch, deleteBatch, clearAll } = useForgedBatches();
  const { apiKey, saveKey, clearKey } = useApiKey();

  const showToast = useCallback((message) => {
    clearTimeout(toastTimer.current);
    setToast({ message, visible: true });
    toastTimer.current = setTimeout(() => setToast(t => ({ ...t, visible: false })), 1800);
    setTimeout(() => setToast({ message: "", visible: false }), 2100);
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
    setTimeout(() => setCopiedId(null), 2000);
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

  // Filtered lines
  const filteredLines = useMemo(() => {
    const combined = [...forgedFeedLines, ...ALL_LINES];
    return filterLines(combined, {
      characters: activeCharacters,
      moods: activeMoods,
      savedOnly,
      savedSet,
      search,
    });
  }, [activeCharacters, activeMoods, savedOnly, savedSet, search, forgedFeedLines]);

  const handleHome = useCallback(() => {
    setActiveCharacters(new Set());
    setActiveMoods(new Set());
    setSavedOnly(false);
    setSearch("");
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <style>{CSS}</style>
      <div ref={scrollRef} style={{
        maxWidth: 480, margin: "0 auto", minHeight: "100vh",
        paddingBottom: 70, fontFamily: "'Outfit',sans-serif",
      }}>
        {/* Header */}
        <div style={{ padding: "16px 16px 0", textAlign: "center" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 7,
              background: "linear-gradient(135deg, #ef4444, #991b1b)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 14,
            }}>⚡</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#f5f5f7", letterSpacing: -0.5 }}>
              Mental Kung Fu
            </div>
          </div>
          <div style={{ fontSize: 9, color: "#4b5563", marginTop: 3, letterSpacing: 1, textTransform: "uppercase" }}>
            Tactical Mindset Engine
          </div>
        </div>

        <CharacterGrid
          activeCharacters={activeCharacters}
          onToggle={toggleCharacter}
          onProfile={setProfileChar}
        />

        <MoodChips
          activeMoods={activeMoods}
          onToggle={toggleMood}
          savedActive={savedOnly}
          onToggleSaved={() => setSavedOnly(v => !v)}
        />

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
