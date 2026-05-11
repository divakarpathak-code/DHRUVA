// Onboarding.jsx — 3-screen welcome flow with Diva
// Screen 1: Welcome + Diva waves
// Screen 2: What's your name? Diva writes it in her notebook
// Screen 3: Pick your exam + class → push to planner

import { useState, useEffect } from "react"
import { useNavigate }         from "react-router-dom"
import DivaAvatar              from "../components/DivaAvatar"

const EXAM_OPTIONS = ["JEE", "NEET", "Boards", "UPSC", "CAT", "Other"]

// Tiny animated speech bubble from Diva
function DivaSays({ text, animate = true }) {
  return (
    <div style={{
      background:   "white",
      border:       "1.5px solid #E0DBFF",
      borderRadius: "16px 16px 16px 4px",
      padding:      "12px 16px",
      fontSize:     "13px",
      color:        "#1E1B4B",
      lineHeight:   1.55,
      maxWidth:     "260px",
      boxShadow:    "0 4px 16px rgba(79,70,229,0.08)",
      animation:    animate ? "divaBubble 0.3s cubic-bezier(0.34,1.56,0.64,1) both" : "none",
      position:     "relative",
    }}>
      {text}
      <style>{`
        @keyframes divaBubble {
          from { opacity:0; transform:translateY(8px) scale(0.95); }
          to   { opacity:1; transform:translateY(0)  scale(1);    }
        }
      `}</style>
    </div>
  )
}

// Progress dots
function Dots({ current, total }) {
  return (
    <div style={{ display:"flex", gap:"6px", justifyContent:"center", marginBottom:"28px" }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{
          width:        i === current ? "20px" : "7px",
          height:       "7px",
          borderRadius: "4px",
          background:   i === current ? "#4F46E5" : "#C7D2FE",
          transition:   "all 0.3s ease",
        }}/>
      ))}
    </div>
  )
}

export default function Onboarding({ onComplete }) {
  const [step,      setStep]      = useState(0)   // 0,1,2
  const [name,      setName]      = useState("")
  const [exam,      setExam]      = useState("")
  const [cls,       setCls]       = useState("")
  const [divaMsg,   setDivaMsg]   = useState("")
  const [divaPose,  setDivaPose]  = useState("wave")
  const [typingKey, setTypingKey] = useState(0)
  const [saving,    setSaving]    = useState(false)
  const navigate = useNavigate()

  // When name changes, Diva writes it (change pose + show preview)
  useEffect(() => {
    if (step !== 1) return
    if (name.length > 0) {
      setDivaPose("write")
      setDivaMsg(`"${name}"... ✏️ Got it!`)
    } else {
      setDivaPose("idle")
      setDivaMsg("Type your name and I'll write it down!")
    }
  }, [name, step])

  function handleNext() {
    if (step === 0) {
      setStep(1)
      setDivaPose("idle")
      setDivaMsg("Type your name and I'll write it down!")
      setTypingKey(k => k + 1)
    } else if (step === 1) {
      if (!name.trim()) return
      setStep(2)
      setDivaPose("think")
      setDivaMsg(`Nice to meet you, ${name.split(" ")[0]}! 🎓 What are you preparing for?`)
      setTypingKey(k => k + 1)
    } else {
      // Step 2 — save and go
      if (!exam) return
      setSaving(true)
      const profile = { name: name.trim(), exam, class: cls, board: "", goal: "", examDate: "" }
      localStorage.setItem("profile",     JSON.stringify(profile))
      localStorage.setItem("onboarded",   "true")
      localStorage.setItem("streak",      "0")
      localStorage.setItem("streakHistory", "{}")

      setTimeout(() => {
        onComplete?.()
        navigate("/planner")
      }, 600)
    }
  }

  function pillStyle(active) {
    return {
      fontFamily:  "var(--font-body)",
      fontSize:    "13px",
      fontWeight:  500,
      padding:     "8px 18px",
      borderRadius:"100px",
      border:      "1.5px solid",
      cursor:      "pointer",
      transition:  "all 0.15s",
      background:  active ? "#4F46E5" : "white",
      color:       active ? "#fff"    : "#6B7280",
      borderColor: active ? "#4F46E5" : "#E5E7EB",
      boxShadow:   active ? "0 4px 12px rgba(79,70,229,0.25)" : "none",
    }
  }

  return (
    <div style={{
      minHeight:       "100dvh",
      background:      "linear-gradient(160deg, #F5F3FF 0%, #EEF2FF 50%, #F0F9FF 100%)",
      display:         "flex",
      flexDirection:   "column",
      alignItems:      "center",
      justifyContent:  "center",
      padding:         "24px 20px",
      fontFamily:      "var(--font-body)",
      position:        "relative",
      overflow:        "hidden",
    }}>

      {/* Background decoration */}
      <div style={{ position:"absolute", top:"-60px", right:"-60px", width:"200px", height:"200px", borderRadius:"50%", background:"rgba(99,102,241,0.06)", pointerEvents:"none" }}/>
      <div style={{ position:"absolute", bottom:"-40px", left:"-40px", width:"160px", height:"160px", borderRadius:"50%", background:"rgba(139,92,246,0.05)", pointerEvents:"none" }}/>

      {/* Logo top */}
      <div style={{ position:"absolute", top:"20px", left:"50%", transform:"translateX(-50%)", display:"flex", alignItems:"center", gap:"8px" }}>
        <div style={{ width:"28px", height:"28px", borderRadius:"8px", background:"#4F46E5", display:"flex", alignItems:"center", justifyContent:"center" }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5" r="2.5" fill="white" opacity="0.9"/>
            <path d="M2 13 Q8 7 14 13" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
          </svg>
        </div>
        <span style={{ fontSize:"15px", fontWeight:700, color:"#1E1B4B" }}>Dhruva</span>
      </div>

      <div style={{ width:"100%", maxWidth:"360px", animation:"slideIn 0.4s ease both" }}>
        <Dots current={step} total={3}/>

        {/* ── SCREEN 0: Welcome ── */}
        {step === 0 && (
          <div style={{ textAlign:"center" }}>
            <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:"16px", marginBottom:"28px" }}>
              <DivaAvatar pose="wave" size={110} animate/>
              <DivaSays text="Hey there! 👋 I'm Diva, your AI study buddy. I'll help you crush your exams!" animate/>
            </div>

            <h1 style={{ fontSize:"26px", fontWeight:800, color:"#1E1B4B", marginBottom:"8px", lineHeight:1.2 }}>
              Welcome to Dhruva ✨
            </h1>
            <p style={{ fontSize:"14px", color:"#6B7280", marginBottom:"32px", lineHeight:1.6 }}>
              Your personal AI-powered study planner. Let's set you up in 30 seconds!
            </p>

            {/* Feature bullets */}
            {[
              { icon:"📅", text:"AI study plan tailored to your exam" },
              { icon:"🔥", text:"Daily streak to keep you consistent" },
              { icon:"🤖", text:"Ask Diva any doubt, anytime" },
            ].map(({ icon, text }) => (
              <div key={text} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"10px 14px", background:"white", borderRadius:"12px", marginBottom:"8px", boxShadow:"0 1px 4px rgba(0,0,0,0.06)", border:"0.5px solid #E5E7EB" }}>
                <span style={{ fontSize:"18px" }}>{icon}</span>
                <span style={{ fontSize:"13px", color:"#374151", fontWeight:500 }}>{text}</span>
              </div>
            ))}

            <button onClick={handleNext} style={{
              width:"100%", marginTop:"24px", padding:"15px",
              background:"#4F46E5", color:"#fff",
              border:"none", borderRadius:"14px",
              fontSize:"15px", fontWeight:700,
              fontFamily:"var(--font-body)", cursor:"pointer",
              boxShadow:"0 6px 20px rgba(79,70,229,0.35)",
              transition:"transform 0.15s",
            }}
            onMouseOver={e => e.currentTarget.style.transform="scale(1.02)"}
            onMouseOut={e => e.currentTarget.style.transform="scale(1)"}
            >
              Let's go! 🚀
            </button>
          </div>
        )}

        {/* ── SCREEN 1: Name input with Diva writing ── */}
        {step === 1 && (
          <div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:"12px", marginBottom:"28px" }}>
              <DivaAvatar pose={divaPose} size={90} animate={divaPose === "write"}/>
              <DivaSays key={typingKey} text={divaMsg || "Type your name and I'll write it down!"} animate/>
            </div>

            <h2 style={{ fontSize:"22px", fontWeight:800, color:"#1E1B4B", marginBottom:"6px" }}>
              What's your name?
            </h2>
            <p style={{ fontSize:"13px", color:"#6B7280", marginBottom:"20px" }}>
              Diva will personalise your experience just for you.
            </p>

            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === "Enter" && name.trim() && handleNext()}
              placeholder="e.g. Aryan Singh"
              style={{
                width:"100%", padding:"14px 16px",
                fontSize:"15px", fontWeight:500,
                border:"2px solid",
                borderColor: name ? "#4F46E5" : "#E5E7EB",
                borderRadius:"12px",
                outline:"none",
                fontFamily:"var(--font-body)",
                color:"#1E1B4B",
                background:"white",
                transition:"border-color 0.2s, box-shadow 0.2s",
                boxShadow: name ? "0 0 0 4px rgba(79,70,229,0.12)" : "none",
                boxSizing:"border-box",
              }}
            />

            {/* Live name preview when typed */}
            {name.trim() && (
              <div style={{
                marginTop:"12px", padding:"10px 14px",
                background:"#F5F3FF", borderRadius:"10px",
                border:"1px solid #C7D2FE",
                fontSize:"13px", color:"#4338CA",
                animation:"divaBubble 0.25s ease both",
              }}>
                ✏️ Diva is writing: <strong>"{name}"</strong>
              </div>
            )}

            <button
              onClick={handleNext}
              disabled={!name.trim()}
              style={{
                width:"100%", marginTop:"20px", padding:"14px",
                background: name.trim() ? "#4F46E5" : "#E5E7EB",
                color:      name.trim() ? "#fff"    : "#9CA3AF",
                border:"none", borderRadius:"12px",
                fontSize:"14px", fontWeight:700,
                fontFamily:"var(--font-body)",
                cursor: name.trim() ? "pointer" : "not-allowed",
                transition:"all 0.15s",
                boxShadow: name.trim() ? "0 4px 16px rgba(79,70,229,0.3)" : "none",
              }}
            >
              Next →
            </button>
          </div>
        )}

        {/* ── SCREEN 2: Pick exam + class ── */}
        {step === 2 && (
          <div>
            <div style={{ display:"flex", alignItems:"flex-end", gap:"12px", marginBottom:"24px" }}>
              <DivaAvatar pose="think" size={90} animate/>
              <DivaSays key={typingKey} text={divaMsg} animate/>
            </div>

            <h2 style={{ fontSize:"22px", fontWeight:800, color:"#1E1B4B", marginBottom:"6px" }}>
              Your exam goal
            </h2>
            <p style={{ fontSize:"13px", color:"#6B7280", marginBottom:"18px" }}>
              Diva will tailor your study plan around this.
            </p>

            {/* Exam pills */}
            <div style={{ display:"flex", flexWrap:"wrap", gap:"8px", marginBottom:"20px" }}>
              {EXAM_OPTIONS.map(opt => (
                <button key={opt} type="button" onClick={() => setExam(opt)} style={pillStyle(exam === opt)}>
                  {opt}
                </button>
              ))}
            </div>

            {/* Class input */}
            <div style={{ marginBottom:"20px" }}>
              <label style={{ fontSize:"12px", fontWeight:600, color:"#374151", display:"block", marginBottom:"6px" }}>
                Class / Year (optional)
              </label>
              <input
                value={cls}
                onChange={e => setCls(e.target.value)}
                placeholder="e.g. 12, 11, 1st Year"
                style={{
                  width:"100%", padding:"11px 14px",
                  fontSize:"14px", border:"1.5px solid #E5E7EB",
                  borderRadius:"10px", outline:"none",
                  fontFamily:"var(--font-body)", color:"#1E1B4B",
                  background:"white", boxSizing:"border-box",
                  transition:"border-color 0.2s",
                }}
                onFocus={e => e.target.style.borderColor="#4F46E5"}
                onBlur={e  => e.target.style.borderColor="#E5E7EB"}
              />
            </div>

            <button
              onClick={handleNext}
              disabled={!exam || saving}
              style={{
                width:"100%", padding:"14px",
                background: exam ? "#4F46E5" : "#E5E7EB",
                color:      exam ? "#fff"    : "#9CA3AF",
                border:"none", borderRadius:"12px",
                fontSize:"15px", fontWeight:700,
                fontFamily:"var(--font-body)",
                cursor: exam ? "pointer" : "not-allowed",
                transition:"all 0.15s",
                boxShadow: exam ? "0 6px 20px rgba(79,70,229,0.35)" : "none",
                display:"flex", alignItems:"center", justifyContent:"center", gap:"8px",
              }}
            >
              {saving ? (
                <>
                  <span style={{ width:"16px", height:"16px", border:"2px solid rgba(255,255,255,0.4)", borderTopColor:"#fff", borderRadius:"50%", animation:"spin 0.7s linear infinite", display:"inline-block" }}/>
                  Setting up your plan…
                </>
              ) : (
                "Build my plan 🐘✨"
              )}
            </button>

            <p style={{ textAlign:"center", fontSize:"11px", color:"#9CA3AF", marginTop:"12px" }}>
              You can change these later in Profile
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes slideIn { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes divaBubble { from{opacity:0;transform:translateY(8px) scale(0.95)} to{opacity:1;transform:translateY(0) scale(1)} }
        @keyframes spin { to{transform:rotate(360deg)} }
      `}</style>
    </div>
  )
}