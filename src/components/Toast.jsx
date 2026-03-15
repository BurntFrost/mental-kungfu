export default function Toast({ message, visible }) {
  if (!message) return null;
  return (
    <div className={`toast ${visible ? "" : "toast--exit"}`}>
      <div style={{
        padding: "10px 20px", borderRadius: 10,
        background: "rgba(15,15,25,0.95)", border: "1px solid rgba(239,68,68,0.15)",
        color: "#f5f5f7", fontSize: 12, fontFamily: "'Outfit',sans-serif",
        boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
      }}>{message}</div>
    </div>
  );
}
