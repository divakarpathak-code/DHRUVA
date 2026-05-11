// StudyForm.jsx — multi-subject support, hours 3-10h
import { useState, useEffect } from "react"

const SUBJECT_OPTIONS = [
  "Physics","Mathematics","Chemistry",
  "Biology","English","History",
  "Geography","Computer Science","Economics",
]

const WEEK_OPTIONS = [1, 2, 3, 4, 6, 8]
const HOUR_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10]

// Subject accent colors
const SUBJECT_COLORS = {
  Physics:"#6366F1", Mathematics:"#0EA5E9", Chemistry:"#F59E0B",
  Biology:"#10B981", English:"#EC4899", History:"#8B5CF6",
  Geography:"#14B8A6","Computer Science":"#F97316", Economics:"#64748B",
}

export default function StudyForm({ onGenerate }) {
  const [subjects, setSubjects] = useState([])   // array now
  const [weeks,    setWeeks]    = useState("")
  const [hours,    setHours]    = useState("")
  const [loading,  setLoading]  = useState(false)
  const [profile,  setProfile]  = useState(null)
  const [error,    setError]    = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("profile")
    if (saved) setProfile(JSON.parse(saved))
  }, [])

  const profileComplete = profile?.name && profile?.exam

  function toggleSubject(s) {
    setSubjects(prev =>
      prev.includes(s)
        ? prev.filter(x => x !== s)
        : prev.length >= 3
          ? prev  // max 3 subjects
          : [...prev, s]
    )
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (subjects.length === 0 || !weeks || !hours) {
      setError("Please select at least one subject, weeks, and hours.")
      return
    }
    setError("")
    setLoading(true)

    const data = {
      subject:       subjects.length === 1 ? subjects[0] : subjects,
      weeks:         Number(weeks),
      hours_per_day: Number(hours),
      exam:          profile?.exam       || "",
      board:         profile?.board      || "",
      class_name:    profile?.class      || "",
      name:          profile?.name       || "",
    }

    try {
      await onGenerate(data)
    } catch (err) {
      console.error(err)
      setError("Something went wrong. Check your connection and try again.")
    }
    setLoading(false)
  }

  function pillStyle(active, color) {
    return {
      fontFamily:   "var(--font-body)",
      fontSize:     "12px",
      fontWeight:   500,
      padding:      "7px 14px",
      borderRadius: "var(--r-pill)",
      border:       "0.5px solid",
      cursor:       "pointer",
      transition:   "all 0.15s",
      background:   active ? (color || "var(--indigo)") : "var(--white)",
      color:        active ? "#fff" : "var(--slate)",
      borderColor:  active ? (color || "var(--indigo)") : "var(--border)",
    }
  }

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-logo">
          <div className="logo-mark">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="8" cy="5" r="2.5" fill="white" opacity="0.9"/>
              <path d="M2 13 Q8 7 14 13" stroke="white" strokeWidth="1.8" fill="none" strokeLinecap="round"/>
            </svg>
          </div>
          <span className="logo-wordmark">Dhruva</span>
        </div>
        {profile?.name && (
          <div className="top-bar-avatar">{profile.name[0].toUpperCase()}</div>
        )}
      </div>

      <div className="page">
        <div className="page-header fade-up">
          <div className="page-title">Create Plan</div>
          <div className="page-sub">AI builds a personalised day-by-day schedule</div>
        </div>

        {/* Profile banner */}
        {profileComplete ? (
          <div className="fade-up fade-up-1" style={{ background:"var(--indigo-light)",border:"0.5px solid var(--indigo-mid)",borderRadius:"var(--r-md)",padding:"11px 14px",marginBottom:"20px",display:"flex",alignItems:"center",gap:"8px",fontSize:"12px",color:"var(--indigo-dark)" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            AI personalised for&nbsp;<strong>{profile.name}</strong>&nbsp;·&nbsp;<strong>{profile.exam}</strong>
            {profile.class && <>&nbsp;·&nbsp;Class {profile.class}</>}
            {profile.board && <>&nbsp;·&nbsp;{profile.board}</>}
          </div>
        ) : (
          <div className="fade-up fade-up-1" style={{ background:"var(--amber-light)",border:"0.5px solid #FDE68A",borderRadius:"var(--r-md)",padding:"11px 14px",marginBottom:"20px",fontSize:"12px",color:"#92400E" }}>
            ⚠️ Set your exam in <strong>Profile</strong> tab for better AI results.
          </div>
        )}

        <form onSubmit={handleSubmit} className="planner-form fade-up fade-up-2">

          {/* Subject — multi select up to 3 */}
          <div className="input-group">
            <label className="input-label">
              Subjects&nbsp;
              <span style={{ fontWeight:400, color:"var(--muted)", textTransform:"none", letterSpacing:0 }}>
                (pick up to 3)
              </span>
            </label>

            {/* Selected subjects chips */}
            {subjects.length > 0 && (
              <div style={{ display:"flex",gap:"6px",flexWrap:"wrap",marginBottom:"8px",marginTop:"4px" }}>
                {subjects.map(s => (
                  <span key={s} onClick={() => toggleSubject(s)} style={{ display:"inline-flex",alignItems:"center",gap:"5px",fontSize:"12px",fontWeight:500,padding:"5px 10px",borderRadius:"var(--r-pill)",background:SUBJECT_COLORS[s]||"var(--indigo)",color:"#fff",cursor:"pointer" }}>
                    <span style={{ width:"6px",height:"6px",borderRadius:"50%",background:"rgba(255,255,255,0.5)" }}/>
                    {s}
                    <span style={{ fontSize:"14px",lineHeight:1,opacity:0.8 }}>×</span>
                  </span>
                ))}
                {subjects.length > 1 && (
                  <span style={{ fontSize:"11px",color:"var(--jade)",background:"var(--jade-light)",padding:"5px 10px",borderRadius:"var(--r-pill)",border:"0.5px solid #A7F3D0",fontWeight:500 }}>
                    Multi-subject plan ✓
                  </span>
                )}
              </div>
            )}

            <div style={{ display:"flex",flexWrap:"wrap",gap:"6px",marginTop:"4px" }}>
              {SUBJECT_OPTIONS.map(opt => {
                const active = subjects.includes(opt)
                const disabled = !active && subjects.length >= 3
                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={disabled}
                    onClick={() => toggleSubject(opt)}
                    style={{
                      ...pillStyle(active, SUBJECT_COLORS[opt]),
                      opacity: disabled ? 0.4 : 1,
                      cursor: disabled ? "not-allowed" : "pointer",
                    }}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Weeks */}
          <div className="input-group">
            <label className="input-label">Weeks to study</label>
            <div style={{ display:"flex",flexWrap:"wrap",gap:"6px",marginTop:"4px" }}>
              {WEEK_OPTIONS.map(w => (
                <button key={w} type="button" onClick={() => setWeeks(w)} style={pillStyle(weeks===w)}>
                  {w}w
                </button>
              ))}
            </div>
          </div>

          {/* Hours */}
          <div className="input-group">
            <label className="input-label">Hours per day</label>
            <div style={{ display:"flex",flexWrap:"wrap",gap:"6px",marginTop:"4px" }}>
              {HOUR_OPTIONS.map(h => (
                <button key={h} type="button" onClick={() => setHours(h)} style={pillStyle(hours===h)}>
                  {h}h
                </button>
              ))}
            </div>
          </div>

          {/* Preview */}
          {subjects.length > 0 && weeks && hours && (
            <div style={{ background:"var(--surface)",border:"0.5px solid var(--border)",borderRadius:"var(--r-md)",padding:"12px 14px",fontSize:"12px",color:"var(--slate)",lineHeight:1.7 }}>
              <div style={{ display:"flex",flexWrap:"wrap",gap:"6px",marginBottom:"6px" }}>
                {subjects.map(s => (
                  <span key={s} style={{ fontSize:"11px",fontWeight:500,padding:"2px 8px",borderRadius:"var(--r-pill)",background:SUBJECT_COLORS[s]||"var(--indigo)",color:"#fff" }}>{s}</span>
                ))}
              </div>
              📋 <strong>{weeks}-week</strong> plan · <strong>{hours}h/day</strong> · <strong>{weeks*7} days</strong>
              {profileComplete && <> · <strong>{profile.exam}</strong></>}
              {profile?.board && <> · <strong>{profile.board}</strong> chapter-mapped</>}
              {subjects.length > 1 && <> · <strong>Interleaved multi-subject</strong></>}
            </div>
          )}

          {error && (
            <div style={{ background:"var(--rose-light)",border:"0.5px solid #FECDD3",borderRadius:"var(--r-md)",padding:"10px 14px",fontSize:"12px",color:"var(--rose)" }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary full"
            disabled={loading}
            style={{ opacity:loading?0.7:1, cursor:loading?"not-allowed":"pointer" }}
          >
            {loading ? "Generating your plan…" : `Generate ${subjects.length > 1 ? "Multi-Subject " : ""}Study Plan`}
          </button>

        </form>
      </div>
    </>
  )
}