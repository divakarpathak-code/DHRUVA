// TaskLock.jsx — 24hr cooldown lock between tasks
// completedAt: ISO string of when previous task was completed
// onUnlock: called when timer hits 0

import { useState, useEffect } from "react"

function pad(n) { return String(n).padStart(2, "0") }

function getTimeLeft(completedAt) {
  if (!completedAt) return null
  const unlockTime = new Date(completedAt).getTime() + 24 * 60 * 60 * 1000
  const now = Date.now()
  const diff = unlockTime - now
  if (diff <= 0) return null // already unlocked
  const h = Math.floor(diff / (1000 * 60 * 60))
  const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const s = Math.floor((diff % (1000 * 60)) / 1000)
  return { h, m, s, diff }
}

export default function TaskLock({ completedAt, onUnlock, nextDay }) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(completedAt))

  useEffect(() => {
    if (!completedAt) return
    const interval = setInterval(() => {
      const t = getTimeLeft(completedAt)
      setTimeLeft(t)
      if (!t) {
        clearInterval(interval)
        onUnlock?.()
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [completedAt])

  // Already unlocked or no previous task
  if (!timeLeft) return null

  const pct = 1 - timeLeft.diff / (24 * 60 * 60 * 1000)
  const circumference = 2 * Math.PI * 28

  return (
    <div style={{
      background: "linear-gradient(135deg, #F8FAFC, #F1F5F9)",
      border: "1px solid var(--border)",
      borderRadius: "var(--r-lg)",
      padding: "20px 18px",
      textAlign: "center",
      marginBottom: "16px",
      position: "relative",
      overflow: "hidden",
    }}>
      {/* Subtle background pattern */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: "radial-gradient(circle at 20% 80%, rgba(79,70,229,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(124,58,237,0.04) 0%, transparent 50%)",
        pointerEvents: "none",
      }}/>

      {/* Lock icon + ring */}
      <div style={{ position: "relative", width: "72px", height: "72px", margin: "0 auto 14px" }}>
        <svg width="72" height="72" viewBox="0 0 72 72" style={{ transform: "rotate(-90deg)" }}>
          {/* Track */}
          <circle cx="36" cy="36" r="28" fill="none" stroke="var(--border)" strokeWidth="4"/>
          {/* Progress */}
          <circle
            cx="36" cy="36" r="28" fill="none"
            stroke="var(--indigo)" strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference * (1 - pct)}
            style={{ transition: "stroke-dashoffset 1s linear" }}
          />
        </svg>
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "24px",
        }}>
          🔒
        </div>
      </div>

      <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)", marginBottom: "4px" }}>
        Day {nextDay} unlocks in
      </div>

      {/* Countdown */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "4px", marginBottom: "10px" }}>
        {[
          { val: timeLeft.h, label: "hr" },
          { val: timeLeft.m, label: "min" },
          { val: timeLeft.s, label: "sec" },
        ].map(({ val, label }, i) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: "4px" }}>
            <div style={{
              background: "var(--indigo)",
              color: "#fff",
              borderRadius: "8px",
              padding: "6px 10px",
              minWidth: "38px",
              textAlign: "center",
            }}>
              <div style={{ fontSize: "18px", fontWeight: 800, lineHeight: 1, fontVariantNumeric: "tabular-nums" }}>
                {pad(val)}
              </div>
              <div style={{ fontSize: "9px", opacity: 0.75, marginTop: "1px" }}>{label}</div>
            </div>
            {i < 2 && <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--muted)", marginBottom: "10px" }}>:</span>}
          </div>
        ))}
      </div>

      <div style={{ fontSize: "11px", color: "var(--muted)", lineHeight: 1.5 }}>
        ⏳ Space your study sessions for better retention.<br/>
        Come back tomorrow to continue!
      </div>
    </div>
  )
}