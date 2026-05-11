// ConfidenceRater.jsx
// Shows after a task day is marked complete
// onRate(dayIndex, rating) — rating is 1, 2, or 3
// onClose() — dismiss without rating

export default function ConfidenceRater({ task, dayIndex, onRate, onClose }) {
  if (!task) return null

  const labels = ["", "Struggling 😓", "Getting there 🤔", "Got it! 💪"]
  const colors = ["", "#EF4444", "#F59E0B", "#10B981"]
  const bgColors = ["", "#FEF2F2", "#FFFBEB", "#ECFDF5"]

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.45)",
      display: "flex", alignItems: "flex-end", justifyContent: "center",
      backdropFilter: "blur(2px)",
      animation: "fadeIn 0.15s ease",
    }}>
      <div style={{
        background: "var(--white)",
        borderRadius: "var(--r-xl) var(--r-xl) 0 0",
        padding: "24px 20px 36px",
        width: "100%", maxWidth: "480px",
        animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
      }}>
        {/* Handle */}
        <div style={{ width: "36px", height: "4px", borderRadius: "2px", background: "var(--border)", margin: "0 auto 20px" }}/>

        <div style={{ textAlign: "center", marginBottom: "20px" }}>
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>📊</div>
          <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>
            Rate your confidence
          </div>
          <div style={{ fontSize: "12px", color: "var(--muted)" }}>
            Day {task.day} · How well did you understand today's topics?
          </div>
        </div>

        {/* Topics preview */}
        {task.tasks?.slice(0, 2).map((t, i) => (
          <div key={i} style={{
            fontSize: "11px", color: "var(--slate)",
            background: "var(--surface)", borderRadius: "var(--r-sm)",
            padding: "6px 10px", marginBottom: "5px",
          }}>
            {t.length > 60 ? t.slice(0, 60) + "…" : t}
          </div>
        ))}

        {/* Rating buttons */}
        <div style={{ display: "flex", gap: "8px", marginTop: "18px" }}>
          {[1, 2, 3].map(r => (
            <button
              key={r}
              onClick={() => onRate(dayIndex, r)}
              style={{
                flex: 1, padding: "14px 8px",
                borderRadius: "var(--r-md)",
                border: `1.5px solid ${colors[r]}`,
                background: bgColors[r],
                cursor: "pointer",
                fontFamily: "var(--font-body)",
                transition: "all 0.15s",
                display: "flex", flexDirection: "column",
                alignItems: "center", gap: "6px",
              }}
            >
              <div style={{ display: "flex", gap: "2px" }}>
                {[1, 2, 3].map(s => (
                  <span key={s} style={{ fontSize: "14px", opacity: s <= r ? 1 : 0.25 }}>⭐</span>
                ))}
              </div>
              <span style={{ fontSize: "11px", fontWeight: 600, color: colors[r] }}>{labels[r]}</span>
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          style={{
            width: "100%", marginTop: "12px",
            fontFamily: "var(--font-body)", fontSize: "12px",
            color: "var(--muted)", background: "transparent",
            border: "none", cursor: "pointer", padding: "8px",
          }}
        >
          Skip for now
        </button>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp { from { transform:translateY(100%) } to { transform:translateY(0) } }
      `}</style>
    </div>
  )
}