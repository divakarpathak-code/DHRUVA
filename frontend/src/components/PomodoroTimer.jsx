// PomodoroTimer.jsx — inline focus timer for each task
// Place in: src/components/PomodoroTimer.jsx
// Usage: <PomodoroTimer taskName="Physics – Laws of Motion"/>

import { useState, useEffect, useRef, useCallback } from "react"

const MODES = {
  focus: { label: "Focus",      duration: 25 * 60, color: "var(--indigo)"  },
  short: { label: "Short Break", duration:  5 * 60, color: "var(--jade)"   },
  long:  { label: "Long Break",  duration: 15 * 60, color: "var(--amber)"  },
}

function pad(n) { return String(n).padStart(2, "0") }

// Tiny audio beep using Web Audio API — no file needed
function playBeep() {
  try {
    const ctx  = new (window.AudioContext || window.webkitAudioContext)()
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.setValueAtTime(0.3, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8)
    osc.start(ctx.currentTime)
    osc.stop(ctx.currentTime + 0.8)
  } catch {}
}

export default function PomodoroTimer({ taskName = "" }) {
  const [mode,      setMode]      = useState("focus")
  const [timeLeft,  setTimeLeft]  = useState(MODES.focus.duration)
  const [running,   setRunning]   = useState(false)
  const [sessions,  setSessions]  = useState(0)
  const [expanded,  setExpanded]  = useState(false)
  const intervalRef               = useRef(null)

  const total = MODES[mode].duration

  const tick = useCallback(() => {
    setTimeLeft(t => {
      if (t <= 1) {
        clearInterval(intervalRef.current)
        setRunning(false)
        playBeep()
        if (mode === "focus") setSessions(s => s + 1)
        return 0
      }
      return t - 1
    })
  }, [mode])

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [running, tick])

  function switchMode(m) {
    setMode(m)
    setTimeLeft(MODES[m].duration)
    setRunning(false)
    clearInterval(intervalRef.current)
  }

  function reset() {
    setTimeLeft(MODES[mode].duration)
    setRunning(false)
    clearInterval(intervalRef.current)
  }

  const pct     = ((total - timeLeft) / total) * 100
  const mins    = Math.floor(timeLeft / 60)
  const secs    = timeLeft % 60
  const modeObj = MODES[mode]

  // Collapsed view — just a small timer chip
  if (!expanded) {
    return (
      <button
        onClick={() => setExpanded(true)}
        style={{
          display:      "inline-flex",
          alignItems:   "center",
          gap:          "6px",
          fontFamily:   "var(--font-body)",
          fontSize:     "11px",
          fontWeight:   500,
          padding:      "4px 10px",
          borderRadius: "var(--r-pill)",
          border:       `0.5px solid ${running ? modeObj.color : "var(--border)"}`,
          background:   running ? "var(--indigo-light)" : "var(--surface)",
          color:        running ? "var(--indigo)" : "var(--muted)",
          cursor:       "pointer",
          transition:   "all 0.15s",
        }}
      >
        {/* Timer icon */}
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="12" cy="12" r="10"/>
          <path d="M12 6v6l4 2"/>
        </svg>
        {running ? `${pad(mins)}:${pad(secs)}` : "Focus Timer"}
        {sessions > 0 && (
          <span style={{ background:modeObj.color,color:"#fff",borderRadius:"100px",padding:"0px 5px",fontSize:"10px" }}>
            {sessions}
          </span>
        )}
      </button>
    )
  }

  // Expanded view
  return (
    <div style={{
      background:   "var(--white)",
      border:       `0.5px solid ${modeObj.color}`,
      borderRadius: "var(--r-lg)",
      padding:      "16px",
      marginTop:    "12px",
      position:     "relative",
    }}>
      {/* Close */}
      <button
        onClick={() => setExpanded(false)}
        style={{ position:"absolute",top:"10px",right:"10px",background:"none",border:"none",cursor:"pointer",color:"var(--muted)",fontSize:"16px",lineHeight:1,padding:"2px" }}
      >×</button>

      {/* Mode tabs */}
      <div style={{ display:"flex",gap:"4px",marginBottom:"14px" }}>
        {Object.entries(MODES).map(([key, m]) => (
          <button key={key} onClick={() => switchMode(key)} style={{
            fontFamily:"var(--font-body)",fontSize:"11px",fontWeight:500,
            padding:"5px 10px",borderRadius:"var(--r-pill)",border:"0.5px solid",
            cursor:"pointer",transition:"all 0.15s",
            background: mode===key ? m.color : "var(--white)",
            color:      mode===key ? "#fff"   : "var(--muted)",
            borderColor:mode===key ? m.color  : "var(--border)",
          }}>{m.label}</button>
        ))}
      </div>

      {/* Task name */}
      {taskName && (
        <div style={{ fontSize:"11px",color:"var(--muted)",marginBottom:"12px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap" }}>
          📚 {taskName}
        </div>
      )}

      {/* Circular progress */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"center",marginBottom:"14px" }}>
        <div style={{ position:"relative",width:"110px",height:"110px" }}>
          <svg width="110" height="110" viewBox="0 0 110 110" style={{ transform:"rotate(-90deg)" }}>
            <circle cx="55" cy="55" r="48" fill="none" stroke="var(--border)" strokeWidth="6"/>
            <circle
              cx="55" cy="55" r="48"
              fill="none"
              stroke={modeObj.color}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${2 * Math.PI * 48}`}
              strokeDashoffset={`${2 * Math.PI * 48 * (1 - pct / 100)}`}
              style={{ transition:"stroke-dashoffset 0.5s ease" }}
            />
          </svg>
          <div style={{ position:"absolute",inset:0,display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center" }}>
            <div style={{ fontFamily:"var(--font-display)",fontSize:"26px",fontWeight:700,color:"var(--ink)",lineHeight:1 }}>
              {pad(mins)}:{pad(secs)}
            </div>
            <div style={{ fontSize:"10px",color:modeObj.color,fontWeight:500,marginTop:"2px" }}>
              {modeObj.label.toUpperCase()}
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display:"flex",gap:"8px",justifyContent:"center" }}>
        <button onClick={reset} style={{
          fontFamily:"var(--font-body)",fontSize:"12px",fontWeight:500,
          padding:"8px 16px",borderRadius:"var(--r-md)",
          border:"0.5px solid var(--border)",background:"var(--surface)",
          color:"var(--slate)",cursor:"pointer",
        }}>Reset</button>

        <button onClick={() => setRunning(r => !r)} style={{
          fontFamily:"var(--font-body)",fontSize:"12px",fontWeight:600,
          padding:"8px 24px",borderRadius:"var(--r-md)",
          border:"none",background:modeObj.color,
          color:"#fff",cursor:"pointer",minWidth:"80px",
          boxShadow:`0 2px 8px ${modeObj.color}55`,
        }}>
          {running ? "Pause" : timeLeft === MODES[mode].duration ? "Start" : "Resume"}
        </button>
      </div>

      {/* Sessions */}
      {sessions > 0 && (
        <div style={{ textAlign:"center",marginTop:"12px",fontSize:"11px",color:"var(--muted)" }}>
          {sessions} focus session{sessions !== 1 ? "s" : ""} completed today
          {sessions >= 4 && " · 🔥 Deep work mode!"}
        </div>
      )}
    </div>
  )
}