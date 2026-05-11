// ExamCountdown.jsx — exam date countdown banner
// Place in: src/components/ExamCountdown.jsx

export default function ExamCountdown({ examDate, examName = "Exam" }) {
  if (!examDate) return null

  const today    = new Date()
  today.setHours(0, 0, 0, 0)
  const target   = new Date(examDate)
  target.setHours(0, 0, 0, 0)
  const diffMs   = target - today
  const days     = Math.ceil(diffMs / (1000 * 60 * 60 * 24))

  if (days < 0) return null  // exam passed

  // Urgency levels
  let bg, border, color, emoji, label
  if (days <= 7) {
    bg = "var(--rose-light)"; border = "#FECDD3"; color = "var(--rose)"
    emoji = "🚨"; label = "Final stretch!"
  } else if (days <= 30) {
    bg = "var(--amber-light)"; border = "#FDE68A"; color = "#92400E"
    emoji = "⚡"; label = "Intensive phase"
  } else if (days <= 90) {
    bg = "var(--indigo-light)"; border = "var(--indigo-mid)"; color = "var(--indigo-dark)"
    emoji = "📅"; label = "Steady pace"
  } else {
    bg = "var(--surface)"; border = "var(--border)"; color = "var(--muted)"
    emoji = "🎯"; label = "Long game"
  }

  return (
    <div style={{
      display:      "flex",
      alignItems:   "center",
      justifyContent:"space-between",
      background:   bg,
      border:       `0.5px solid ${border}`,
      borderRadius: "var(--r-md)",
      padding:      "11px 14px",
      marginBottom: "16px",
    }}>
      <div style={{ display:"flex",alignItems:"center",gap:"8px" }}>
        <span style={{ fontSize:"18px" }}>{emoji}</span>
        <div>
          <div style={{ fontSize:"13px",fontWeight:600,color:"var(--ink)" }}>
            {days} day{days !== 1 ? "s" : ""} to {examName}
          </div>
          <div style={{ fontSize:"11px",color,marginTop:"1px" }}>{label}</div>
        </div>
      </div>
      <div style={{
        fontFamily:"var(--font-display)",fontSize:"22px",fontWeight:700,
        color,lineHeight:1,
      }}>
        {days}
      </div>
    </div>
  )
}