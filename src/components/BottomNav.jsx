export default function BottomNav({ onHome, onForge, onSettings }) {
  return (
    <div className="bottom-nav-bar">
      <button onClick={onHome} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center",
      }}>
        <div style={{ fontSize: 16, marginBottom: 2 }}>🏠</div>
        <div style={{ fontSize: 10, color: "#6b7280", fontWeight: 700, fontFamily: "'Outfit',sans-serif" }}>HOME</div>
      </button>
      <button onClick={onForge} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer", textAlign: "center",
      }}>
        <div style={{
          width: 44, height: 44, margin: "-18px auto 0",
          background: "linear-gradient(135deg, #ef4444, #dc2626)", borderRadius: "50%",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20, boxShadow: "0 0 20px rgba(239,68,68,0.3)",
        }}>⚡</div>
        <div style={{ fontSize: 10, color: "#ef4444", fontWeight: 700, fontFamily: "'Outfit',sans-serif", marginTop: 2 }}>FORGE</div>
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
