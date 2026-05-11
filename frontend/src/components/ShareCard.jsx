// ShareCard.jsx — Screenshot-ready shareable progress card
// profile = { name, exam, goal }
// streak = number
// progress = 0-100
// tasks = array (to compute subjects)

import { useRef } from "react"

export default function ShareCard({ profile, streak, progress, tasks, onClose }) {
  const cardRef = useRef(null)

  // Extract unique subjects from tasks
  const subjects = [...new Set(
    tasks.flatMap(t => t.tasks.map(task => task.split("–")[0]?.trim()).filter(Boolean))
  )].slice(0, 3)

  const done = tasks.filter(t => t.completed).length
  const total = tasks.length

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: "My Study Progress — Dhruva",
        text: `🔥 ${streak} day streak · ${progress}% complete on my ${profile?.exam || "exam"} prep! Studying with Dhruva.`,
      }).catch(() => {})
    } else {
      // Fallback: copy text
      const text = `🔥 ${streak} day streak · ${progress}% complete!\nStudying for ${profile?.exam || "my exam"} with Dhruva 📚`
      navigator.clipboard.writeText(text).then(() => alert("Copied to clipboard!"))
    }
  }

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 1000,
      background: "rgba(0,0,0,0.6)",
      display: "flex", alignItems: "center", justifyContent: "center",
      backdropFilter: "blur(4px)",
      padding: "20px",
      animation: "fadeIn 0.15s ease",
    }}>
      <div style={{ width: "100%", maxWidth: "380px" }}>

        {/* The Card — screenshot-ready */}
        <div ref={cardRef} style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 50%, #0EA5E9 100%)",
          borderRadius: "20px",
          padding: "28px 24px",
          position: "relative",
          overflow: "hidden",
          boxShadow: "0 25px 60px rgba(79,70,229,0.4)",
        }}>
          {/* Background decoration */}
          <div style={{
            position: "absolute", top: "-40px", right: "-40px",
            width: "160px", height: "160px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.07)",
          }}/>
          <div style={{
            position: "absolute", bottom: "-30px", left: "-30px",
            width: "120px", height: "120px",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.05)",
          }}/>

          {/* Top row */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "rgba(255,255,255,0.2)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "14px", fontWeight: 700, color: "#fff",
              }}>
                {profile?.name?.[0]?.toUpperCase() || "D"}
              </div>
              <div>
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>
                  {profile?.name || "Student"}
                </div>
                <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)" }}>
                  {profile?.exam || "Exam"} Prep
                </div>
              </div>
            </div>
            <div style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "100px",
              padding: "4px 10px",
              fontSize: "11px", fontWeight: 600, color: "#fff",
            }}>
              Dhruva 🌟
            </div>
          </div>

          {/* Streak — big number */}
          <div style={{ textAlign: "center", marginBottom: "20px" }}>
            <div style={{ fontSize: "64px", lineHeight: 1, marginBottom: "4px" }}>🔥</div>
            <div style={{ fontSize: "52px", fontWeight: 900, color: "#fff", lineHeight: 1 }}>
              {streak}
            </div>
            <div style={{ fontSize: "14px", color: "rgba(255,255,255,0.75)", marginTop: "4px", fontWeight: 500 }}>
              day streak
            </div>
          </div>

          {/* Progress bar */}
          <div style={{ marginBottom: "18px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ fontSize: "11px", color: "rgba(255,255,255,0.7)" }}>Plan Progress</span>
              <span style={{ fontSize: "12px", fontWeight: 700, color: "#fff" }}>{progress}%</span>
            </div>
            <div style={{ height: "6px", borderRadius: "3px", background: "rgba(255,255,255,0.2)" }}>
              <div style={{
                height: "100%", borderRadius: "3px",
                background: "#fff",
                width: `${progress}%`,
                transition: "width 0.5s ease",
              }}/>
            </div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", marginTop: "4px" }}>
              {done} of {total} days completed
            </div>
          </div>

          {/* Subjects pills */}
          {subjects.length > 0 && (
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
              {subjects.map(s => (
                <span key={s} style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "0.5px solid rgba(255,255,255,0.2)",
                  borderRadius: "100px",
                  padding: "3px 10px",
                  fontSize: "10px", fontWeight: 500, color: "#fff",
                }}>
                  {s}
                </span>
              ))}
            </div>
          )}

          {/* Bottom */}
          <div style={{
            paddingTop: "12px",
            borderTop: "0.5px solid rgba(255,255,255,0.2)",
            display: "flex", justifyContent: "space-between", alignItems: "center",
          }}>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.5)" }}>
              {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.6)", fontWeight: 600 }}>
              dhruva.app
            </span>
          </div>
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: "10px", marginTop: "16px" }}>
          <button
            onClick={handleShare}
            style={{
              flex: 1, padding: "14px",
              background: "var(--indigo)", color: "#fff",
              border: "none", borderRadius: "var(--r-md)",
              fontFamily: "var(--font-body)", fontSize: "13px", fontWeight: 600,
              cursor: "pointer",
            }}
          >
            📤 Share
          </button>
          <button
            onClick={onClose}
            style={{
              padding: "14px 18px",
              background: "var(--white)", color: "var(--slate)",
              border: "0.5px solid var(--border)", borderRadius: "var(--r-md)",
              fontFamily: "var(--font-body)", fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Close
          </button>
        </div>

        <p style={{ textAlign: "center", fontSize: "11px", color: "rgba(255,255,255,0.6)", marginTop: "10px" }}>
          Screenshot the card above to share on Instagram / WhatsApp
        </p>
      </div>

      <style>{`@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }`}</style>
    </div>
  )
}