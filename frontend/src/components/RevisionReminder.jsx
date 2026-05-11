// RevisionReminder.jsx — spaced repetition reminders
// Place in: src/components/RevisionReminder.jsx
// Shows topics due for revision based on completion dates

import { useState, useEffect } from "react"

// Spaced repetition intervals in days
const INTERVALS = [3, 7, 14]

export default function RevisionReminder() {
  const [dueTopics, setDueTopics] = useState([])
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    const tasks     = JSON.parse(localStorage.getItem("tasks")         || "[]")
    const history   = JSON.parse(localStorage.getItem("planHistory")   || "[]")
    const completed = JSON.parse(localStorage.getItem("completedDays") || "[]")

    const today = new Date()
    today.setHours(0,0,0,0)
    const due   = []

    // Check each completed day's topics
    completed.forEach(entry => {
      const doneDate = new Date(entry.date)
      doneDate.setHours(0,0,0,0)
      const daysDiff = Math.floor((today - doneDate) / (1000*60*60*24))

      if (INTERVALS.includes(daysDiff)) {
        due.push({
          daysDiff,
          subject: entry.subject || "Study",
          topics:  entry.topics  || [],
          date:    entry.date,
        })
      }
    })

    setDueTopics(due)
  }, [])

  if (dueTopics.length === 0 || dismissed) return null

  return (
    <div style={{
      background:   "var(--indigo-light)",
      border:       "0.5px solid var(--indigo-mid)",
      borderRadius: "var(--r-lg)",
      padding:      "14px 16px",
      marginBottom: "16px",
      position:     "relative",
    }}>
      <button
        onClick={() => setDismissed(true)}
        style={{ position:"absolute",top:"10px",right:"12px",background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:"16px",lineHeight:1 }}
      >×</button>

      <div style={{ display:"flex",alignItems:"center",gap:"8px",marginBottom:"10px" }}>
        <span style={{ fontSize:"18px" }}>🔁</span>
        <div>
          <div style={{ fontSize:"13px",fontWeight:600,color:"var(--ink)" }}>
            Revision due today
          </div>
          <div style={{ fontSize:"11px",color:"var(--indigo-dark)" }}>
            Spaced repetition keeps knowledge fresh
          </div>
        </div>
      </div>

      <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
        {dueTopics.slice(0, 3).map((t, i) => (
          <div key={i} style={{
            background:   "var(--white)",
            border:       "0.5px solid var(--border)",
            borderRadius: "var(--r-md)",
            padding:      "9px 12px",
            display:      "flex",
            alignItems:   "center",
            justifyContent:"space-between",
          }}>
            <div>
              <div style={{ fontSize:"12px",fontWeight:500,color:"var(--ink)" }}>
                {t.subject}
              </div>
              {t.topics.length > 0 && (
                <div style={{ fontSize:"11px",color:"var(--muted)",marginTop:"1px" }}>
                  {t.topics.slice(0,2).join(", ")}
                  {t.topics.length > 2 && ` +${t.topics.length-2} more`}
                </div>
              )}
            </div>
            <span style={{
              fontSize:"10px",fontWeight:500,
              padding:"2px 7px",borderRadius:"100px",
              background:"var(--indigo-light)",color:"var(--indigo-dark)",
              border:"0.5px solid var(--indigo-mid)",whiteSpace:"nowrap",
            }}>
              {t.daysDiff}d ago
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}