export default function SettingsPanel({ visible, onClose, apiKey, onSaveKey, onClearKey, onToast }) {
  if (!visible) return null;

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 100,
        background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
        display: "flex", alignItems: "flex-end", justifyContent: "center",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: "100%", maxWidth: 480,
          background: "#0e0e14", borderRadius: "16px 16px 0 0",
          padding: "20px 16px 32px", animation: "fade-in 0.2s ease-out",
        }}
      >
        <div style={{
          width: 32, height: 3, borderRadius: 2, background: "rgba(255,255,255,0.1)",
          margin: "0 auto 16px",
        }} />

        <div style={{
          fontSize: 14, fontWeight: 800, color: "#f5f5f7",
          fontFamily: "'Outfit',sans-serif", marginBottom: 14,
        }}>
          ⚙️ Settings
        </div>

        <div style={{
          fontSize: 11, fontWeight: 700, color: "#6b7280",
          fontFamily: "'Outfit',sans-serif", marginBottom: 8,
        }}>
          API Key
        </div>

        <div style={{
          fontSize: 9, color: "#4b5563", marginBottom: 8,
          fontFamily: "'Outfit',sans-serif", lineHeight: 1.5,
        }}>
          Enter your Anthropic API key for the Forge Engine. Stored locally — never sent anywhere except Anthropic's API.
          Get one at <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer"
            style={{ color: "#ef4444", textDecoration: "none" }}>console.anthropic.com</a>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            type="password"
            value={apiKey}
            onChange={e => onSaveKey(e.target.value)}
            placeholder="sk-ant-..."
            style={{
              flex: 1, padding: "8px 10px", fontSize: 12,
              background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 6, color: "#f5f5f7", fontFamily: "monospace", outline: "none",
            }}
          />
          {apiKey && (
            <button onClick={() => { onClearKey(); onToast("API key removed"); }} style={{
              background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)",
              borderRadius: 6, color: "#ef4444", fontSize: 10, padding: "0 10px",
              cursor: "pointer", fontFamily: "'Outfit',sans-serif",
            }}>
              Clear
            </button>
          )}
        </div>

        <div style={{
          marginTop: 24, paddingTop: 16,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          fontSize: 10, color: "#4b5563", fontFamily: "'Outfit',sans-serif",
          textAlign: "center",
        }}>
          Mental Kung Fu v3.0 — Tactical Mindset Engine
        </div>
      </div>
    </div>
  );
}
