import { useState, useEffect, useCallback, useMemo } from "react";

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function saveJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

export function useSavedLines() {
  const [savedLines, setSavedLines] = useState([]);

  useEffect(() => { setSavedLines(loadJSON("saved-lines", [])); }, []);

  const savedSet = useMemo(() => new Set(savedLines.map(s => s.line)), [savedLines]);

  const toggleSave = useCallback((line, category) => {
    setSavedLines(prev => {
      const exists = prev.some(s => s.line === line);
      const next = exists
        ? prev.filter(s => s.line !== line)
        : [...prev, { line, category, savedAt: Date.now() }];
      saveJSON("saved-lines", next);
      return next;
    });
  }, []);

  return { savedLines, savedSet, toggleSave };
}

export function useForgedBatches() {
  const [batches, setBatches] = useState([]);

  useEffect(() => { setBatches(loadJSON("forged-lines", [])); }, []);

  const addBatch = useCallback((batch) => {
    setBatches(prev => {
      const next = [batch, ...prev].slice(0, 20);
      saveJSON("forged-lines", next);
      return next;
    });
  }, []);

  const deleteBatch = useCallback((batchId) => {
    setBatches(prev => {
      const next = prev.filter(b => b.id !== batchId);
      saveJSON("forged-lines", next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setBatches([]);
    saveJSON("forged-lines", []);
  }, []);

  return { batches, addBatch, deleteBatch, clearAll };
}

export function useApiKey() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    try { setApiKey(localStorage.getItem("anthropic-api-key") || ""); } catch {}
  }, []);

  const saveKey = useCallback((key) => {
    setApiKey(key);
    try { localStorage.setItem("anthropic-api-key", key); } catch {}
  }, []);

  const clearKey = useCallback(() => {
    setApiKey("");
    try { localStorage.removeItem("anthropic-api-key"); } catch {}
  }, []);

  return { apiKey, saveKey, clearKey };
}
