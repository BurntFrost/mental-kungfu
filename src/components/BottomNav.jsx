export default function BottomNav({ onHome, onForge, onSettings }) {
  return (
    <div className="bottom-nav-bar">
      <button onClick={onHome} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center",
      }}>
        <div style={{ fontSize: 18, marginBottom: 2 }}>🏠</div>
        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>HOME</div>
      </button>
      <button onClick={onForge} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center",
        position: "relative",
      }}>
        {/* Glow ring behind button */}
        <div style={{
          position: "absolute", left: "50%", top: -18,
          width: 56, height: 56, borderRadius: "50%",
          transform: "translateX(-50%)",
          background: "radial-gradient(circle, rgba(239,68,68,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          width: 48, height: 48, margin: "-20px auto 0",
          background: "linear-gradient(135deg, #ef4444, #dc2626)",
          borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 22,
          boxShadow: "0 0 20px rgba(239,68,68,0.35), 0 4px 12px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.15)",
          border: "2px solid rgba(239,68,68,0.5)",
          position: "relative",
        }}>⚡</div>
        <div style={{
          fontSize: 10, color: "#ef4444", fontWeight: 800, fontFamily: "'Outfit',sans-serif",
          marginTop: 3, letterSpacing: 0.5,
        }}>FORGE</div>
      </button>
      <button onClick={onSettings} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center",
      }}>
        <div style={{ fontSize: 18, marginBottom: 2 }}>⚙️</div>
        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>SETTINGS</div>
      </button>
    </div>
  );
}
