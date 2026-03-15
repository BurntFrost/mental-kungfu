import { useState, useCallback, useRef, useEffect } from "react";
import { forgeNewLines } from "../lib/forge-api.js";

export function useForge({ apiKey, onBatch, onToast }) {
  const [forging, setForging] = useState(false);
  const [forgeError, setForgeError] = useState(null);
  const [forgeStatus, setForgeStatus] = useState(null);
  const [autoForge, setAutoForge] = useState(false);
  const forgingRef = useRef(false);
  const timerRef = useRef(null);
  const autoRef = useRef(null);

  const runForge = useCallback(async () => {
    if (forgingRef.current) return;
    forgingRef.current = true;
    setForging(true);
    setForgeError(null);
    const startTime = Date.now();
    setForgeStatus({ stage: "connecting", elapsed: 0 });

    timerRef.current = setInterval(() => {
      setForgeStatus(prev => prev ? { ...prev, elapsed: Date.now() - startTime } : null);
    }, 100);

    const setStage = (stage) => setForgeStatus(prev => prev ? { ...prev, stage } : null);

    try {
      setStage("searching");
      const result = await forgeNewLines(apiKey, 2);
      setStage("processing");
      const batch = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        events: result.events || [],
        lines: (result.lines || []).map((l, i) => ({
          ...l,
          id: `${Date.now()}-${i}`,
          category: (l.category || "REFRAME").toUpperCase(),
          character: l.character || "wick",
        })),
      };
      setStage("complete");
      onBatch(batch);
      onToast(`Forged ${batch.lines.length} new lines from ${batch.events.length} events`);
    } catch (err) {
      setForgeError(err.message || "Forge failed");
    }
    clearInterval(timerRef.current);
    setForgeStatus(null);
    setForging(false);
    forgingRef.current = false;
  }, [apiKey, onBatch, onToast]);

  // Auto-forge interval
  useEffect(() => {
    if (autoForge) {
      runForge();
      autoRef.current = setInterval(runForge, 90000);
      return () => clearInterval(autoRef.current);
    } else {
      clearInterval(autoRef.current);
    }
  }, [autoForge, runForge]);

  return {
    forging, forgeError, forgeStatus, autoForge,
    runForge,
    toggleAuto: () => setAutoForge(v => !v),
  };
}
