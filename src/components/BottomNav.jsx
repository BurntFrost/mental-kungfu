export default function BottomNav({ onHome, onForge, onSettings }) {
  return (
    <div style={{
      position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 50,
      background: "rgba(8,8,12,0.95)", borderTop: "1px solid rgba(255,255,255,0.06)",
      backdropFilter: "blur(10px)", display: "flex", padding: "10px 0 14px",
      maxWidth: 480, margin: "0 auto",
    }}>
      <button onClick={onHome} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center",
      }}>
        <div style={{ fontSize: 16, marginBottom: 2 }}>🏠</div>
        <div style={{ fontSize: 8, color: "#6b7280", fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>HOME</div>
      </button>
      <button onClick={onForge} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center",
      }}>
        <div style={{
          width: 40, height: 40, margin: "-18px auto 0",
          background: "linear-gradient(135deg, #ef4444, #dc2626)", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 18, boxShadow: "0 0 20px rgba(239,68,68,0.3)",
        }}>⚡</div>
        <div style={{ fontSize: 8, color: "#ef4444", fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>FORGE</div>
      </button>
      <button onClick={onSettings} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center",
      }}>
        <div style={{ fontSize: 16, marginBottom: 2 }}>⚙️</div>
        <div style={{ fontSize: 8, color: "#6b7280", fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>SETTINGS</div>
      </button>
    </div>
  );
}
