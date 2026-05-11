// Profile.jsx — XP + Level + Rewards (badges removed for now)
import { useState, useEffect }  from "react"
import StreakCalendar            from "../components/StreakCalendar"
import ShareCard                 from "../components/ShareCard"
import LeaderboardPlaceholder   from "../components/LeaderboardPlaceholder"
import { getLevelFromXP, getNextLevel, getXPProgress, LEVEL_PRIZES } from "../utils/xpSystem"
import logo                      from "../assets/logo.png"

const EXAM_OPTIONS  = ["JEE","NEET","Boards","UPSC","CAT","Other"]
const BOARD_OPTIONS = ["CBSE","ICSE","State Board","IB","Other"]

function ProfilePic({ name, levelInfo, size=84 }) {
  const initial = name?.[0]?.toUpperCase() || "?"
  const color   = levelInfo?.color || "#4F46E5"
  return (
    <div style={{ position:"relative", display:"inline-block" }}>
      <div style={{ width:size, height:size, borderRadius:"50%", background:`linear-gradient(135deg,${color}22,${color}44)`, border:`3px solid ${color}`, display:"flex", alignItems:"center", justifyContent:"center", fontSize:size*0.38, fontWeight:800, color, boxShadow:`0 0 0 4px ${color}22,0 8px 24px ${color}33` }}>
        {initial}
      </div>
      <div style={{ position:"absolute", top:"-4px", right:"-4px", background:`linear-gradient(135deg,${color},${color}cc)`, borderRadius:"100px", padding:"3px 7px", border:"2px solid white", display:"flex", alignItems:"center", gap:"3px", boxShadow:"0 2px 8px rgba(0,0,0,0.15)", minWidth:"28px", justifyContent:"center" }}>
        <span style={{ fontSize:"9px" }}>{levelInfo?.emoji||"🌱"}</span>
        <span style={{ fontSize:"9px", fontWeight:800, color:"white" }}>{levelInfo?.level||1}</span>
      </div>
    </div>
  )
}

function XPBar({ xp }) {
  const levelInfo = getLevelFromXP(xp)
  const next      = getNextLevel(xp)
  const progress  = getXPProgress(xp)
  return (
    <div style={{ background:"var(--white)", border:"0.5px solid var(--border)", borderRadius:"var(--r-lg)", padding:"14px 16px", marginBottom:"16px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:"8px" }}>
        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
          <span style={{ fontSize:"20px" }}>{levelInfo.emoji}</span>
          <div>
            <div style={{ fontSize:"13px", fontWeight:700, color:"var(--ink)" }}>Level {levelInfo.level} · {levelInfo.title}</div>
            <div style={{ fontSize:"11px", color:"var(--muted)" }}>{xp} XP total</div>
          </div>
        </div>
        {next && (
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:"10px", color:"var(--muted)" }}>Next level</div>
            <div style={{ fontSize:"11px", fontWeight:600, color:levelInfo.color }}>{next.title} {next.emoji}</div>
          </div>
        )}
      </div>
      <div style={{ height:"8px", borderRadius:"4px", background:"var(--surface)", border:"0.5px solid var(--border)", overflow:"hidden" }}>
        <div style={{ height:"100%", borderRadius:"4px", background:`linear-gradient(90deg,${levelInfo.color},${levelInfo.color}bb)`, width:`${progress.pct}%`, transition:"width 0.8s ease", boxShadow:`0 0 8px ${levelInfo.color}60` }}/>
      </div>
      {next && (
        <div style={{ display:"flex", justifyContent:"space-between", marginTop:"5px" }}>
          <span style={{ fontSize:"10px", color:"var(--muted)" }}>{progress.currentXP} XP</span>
          <span style={{ fontSize:"10px", color:"var(--muted)" }}>{progress.needed} XP to go</span>
        </div>
      )}
      {!next && <div style={{ marginTop:"5px", fontSize:"11px", color:levelInfo.color, fontWeight:600, textAlign:"center" }}>🌟 MAX LEVEL — Dhruva Legend!</div>}
    </div>
  )
}

function PrizesSection({ currentLevel }) {
  return (
    <div style={{ marginBottom:"16px" }}>
      <div className="section-label">Level Rewards</div>
      {Object.entries(LEVEL_PRIZES).map(([lvl, prize]) => {
        const unlocked = currentLevel >= parseInt(lvl)
        return (
          <div key={lvl} style={{ display:"flex", alignItems:"center", gap:"12px", padding:"11px 14px", background:unlocked?"var(--jade-light)":"var(--white)", border:`0.5px solid ${unlocked?"#A7F3D0":"var(--border)"}`, borderRadius:"var(--r-md)", marginBottom:"8px", opacity:unlocked?1:0.7 }}>
            <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:unlocked?"#10B981":"var(--surface)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"16px", flexShrink:0 }}>{unlocked?"✅":"🔒"}</div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:"12px", fontWeight:700, color:"var(--ink)" }}>{prize.title}</div>
              <div style={{ fontSize:"11px", color:"var(--muted)" }}>{prize.desc}</div>
            </div>
            <div style={{ fontSize:"11px", fontWeight:700, color:unlocked?"#10B981":"var(--muted)" }}>Lv.{lvl}</div>
          </div>
        )
      })}
    </div>
  )
}

export default function Profile({ progress=0, streakCount=0, streakHistory={}, tasks=[], setExamDate }) {
  const [profile,  setProfile]  = useState({ name:"", class:"", exam:"", board:"", goal:"", examDate:"" })
  const [editMode, setEditMode] = useState(false)
  const [saved,    setSaved]    = useState(false)
  const [showShare,setShowShare]= useState(false)
  const [xp,       setXP]       = useState(0)
  const [tab,      setTab]      = useState("stats")

  useEffect(() => {
    const p = localStorage.getItem("profile"); if (p) setProfile(JSON.parse(p))
    setXP(parseInt(localStorage.getItem("xp") || "0"))
  }, [])

  const levelInfo = getLevelFromXP(xp)

  function saveProfile() {
    localStorage.setItem("profile", JSON.stringify(profile))
    if (setExamDate) setExamDate(profile.examDate || "")
    setEditMode(false); setSaved(true); setTimeout(() => setSaved(false), 2000)
  }

  function pillStyle(active) {
    return { fontFamily:"var(--font-body)", fontSize:"12px", fontWeight:500, padding:"6px 14px", borderRadius:"var(--r-pill)", border:"0.5px solid", cursor:"pointer", transition:"all 0.15s", background:active?"var(--indigo)":"var(--white)", color:active?"#fff":"var(--slate)", borderColor:active?"var(--indigo)":"var(--border)" }
  }

  return (
    <>
      {showShare && <ShareCard profile={profile} streak={streakCount} progress={progress} tasks={tasks} onClose={() => setShowShare(false)}/>}

      <div className="top-bar">
        <div className="top-bar-logo">
          <img src={logo} alt="Dhruva" style={{ height:"28px", width:"auto", objectFit:"contain" }}/>
        </div>
        <button
          onClick={() => editMode ? saveProfile() : setEditMode(true)}
          style={{ background:editMode?"var(--indigo)":"var(--surface)", border:"0.5px solid var(--border)", borderRadius:"var(--r-md)", padding:"6px 12px", fontSize:"12px", fontWeight:500, color:editMode?"#fff":"var(--slate)", cursor:"pointer", display:"flex", alignItems:"center", gap:"5px", fontFamily:"var(--font-body)", transition:"all 0.15s" }}
        >
          {editMode ? "✓ Save" : "✏️ Edit"}
        </button>
      </div>

      <div className="page">
        {/* Hero */}
        <div className="fade-up" style={{ textAlign:"center", padding:"20px 0 16px" }}>
          <div style={{ display:"flex", justifyContent:"center", marginBottom:"12px" }}>
            <ProfilePic name={profile.name} levelInfo={levelInfo} size={84}/>
          </div>
          <div className="profile-name">{profile.name || "Your Name"}</div>
          <div className="profile-sub">{profile.exam ? `${profile.exam}${profile.class ? ` · Class ${profile.class}` : ""}` : ""}</div>
          <div style={{ marginTop:"8px", display:"flex", justifyContent:"center", gap:"6px", flexWrap:"wrap" }}>
            <span style={{ display:"inline-flex", alignItems:"center", gap:"4px", background:`${levelInfo.color}18`, border:`1px solid ${levelInfo.color}44`, borderRadius:"100px", padding:"4px 12px", fontSize:"12px", fontWeight:700, color:levelInfo.color }}>
              {levelInfo.emoji} {levelInfo.title} · Lv.{levelInfo.level}
            </span>
            {profile.board && <span className="streak-badge">🏫 {profile.board}</span>}
          </div>
          {profile.examDate && (() => {
            const days = Math.ceil((new Date(profile.examDate) - new Date()) / (1000*60*60*24))
            return days > 0 ? (
              <div style={{ marginTop:"8px" }}>
                <span className="streak-badge" style={{ background:"var(--rose-light)", color:"var(--rose)", border:"0.5px solid #FECDD3" }}>
                  📅 {days} days to {profile.exam || "exam"}
                </span>
              </div>
            ) : null
          })()}
          {!profile.name && !editMode && (
            <div style={{ marginTop:"12px", background:"var(--amber-light)", border:"0.5px solid #FDE68A", borderRadius:"var(--r-md)", padding:"10px 14px", fontSize:"12px", color:"#92400E" }}>
              ⚠️ Complete your profile so Diva can personalise ur plan
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="profile-stats fade-up fade-up-1">
          <div className="profile-stat"><div className="profile-stat-val">🔥 {streakCount}</div><div className="profile-stat-label">Day Streak</div></div>
          <div className="profile-stat"><div className="profile-stat-val">{progress}%</div><div className="profile-stat-label">Plan Done</div></div>
          <div className="profile-stat"><div className="profile-stat-val">⭐ {xp}</div><div className="profile-stat-label">Total XP</div></div>
        </div>

        {!editMode && <XPBar xp={xp}/>}

        {(streakCount > 0 || progress > 0) && !editMode && (
          <button onClick={() => setShowShare(true)} style={{ width:"100%", marginBottom:"16px", background:"linear-gradient(135deg,#4F46E5,#7C3AED)", color:"#fff", border:"none", borderRadius:"var(--r-md)", padding:"12px", fontFamily:"var(--font-body)", fontSize:"13px", fontWeight:600, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:"8px" }}>
            📤 Share My Progress Card
          </button>
        )}

        {saved && (
          <div style={{ background:"var(--jade-light)", border:"0.5px solid #A7F3D0", borderRadius:"var(--r-md)", padding:"10px 14px", fontSize:"13px", color:"#065F46", textAlign:"center", marginBottom:"14px" }}>
            ✓ Profile saved
          </div>
        )}

        {!editMode && (
          <>
            <div style={{ display:"flex", gap:"3px", background:"var(--surface)", border:"0.5px solid var(--border)", borderRadius:"var(--r-md)", padding:"3px", marginBottom:"16px" }}>
              {[{k:"stats",l:"Stats"},{k:"rewards",l:"Rewards"}].map(({k,l}) => (
                <button key={k} onClick={() => setTab(k)} style={{ flex:1, fontFamily:"var(--font-body)", fontSize:"11px", fontWeight:500, padding:"7px 4px", border:"none", borderRadius:"var(--r-sm)", cursor:"pointer", transition:"all 0.15s", background:tab===k?"var(--white)":"transparent", color:tab===k?"var(--indigo)":"var(--muted)", boxShadow:tab===k?"0 1px 3px rgba(0,0,0,0.08)":"none" }}>{l}</button>
              ))}
            </div>

            {tab === "stats" && (
              <>
                <div className="section-label">Study History</div>
                <StreakCalendar streakHistory={streakHistory}/>
                <LeaderboardPlaceholder currentStreak={streakCount}/>
                <div className="section-label">Profile Info</div>
                <div style={{ border:"0.5px solid var(--border)", borderRadius:"var(--r-lg)", overflow:"hidden", marginBottom:"14px" }}>
                  {[
                    { label:"Name",        val:profile.name  || "—" },
                    { label:"Class",        val:profile.class || "—" },
                    { label:"Target Exam",  val:profile.exam  || "—" },
                    { label:"Board",        val:profile.board || "—" },
                    { label:"Study Goal",   val:profile.goal  || "—" },
                    { label:"Exam Date",    val:profile.examDate ? new Date(profile.examDate).toLocaleDateString("en-IN",{day:"numeric",month:"long",year:"numeric"}) : "—" },
                  ].map(({label,val},i,arr) => (
                    <div key={label} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 16px", borderBottom:i<arr.length-1?"0.5px solid var(--border)":"none", background:"var(--white)" }}>
                      <span style={{ fontSize:"12px", color:"var(--muted)" }}>{label}</span>
                      <span style={{ fontSize:"13px", fontWeight:500, color:"var(--ink)" }}>{val}</span>
                    </div>
                  ))}
                </div>
                <button className="btn-primary full" onClick={() => setEditMode(true)} style={{ marginBottom:"20px" }}>Edit Profile</button>
              </>
            )}

            {tab === "rewards" && <PrizesSection currentLevel={levelInfo.level}/>}
          </>
        )}

        {editMode && (
          <div className="fade-up">
            <div className="section-label">Edit Profile</div>
            <div className="profile-edit">
              <div className="input-group"><label className="input-label">Your Name</label><input className="dh-input" placeholder="e.g. Priya Sharma" value={profile.name} onChange={e => setProfile({...profile,name:e.target.value})}/></div>
              <div className="input-group"><label className="input-label">Class / Year</label><input className="dh-input" placeholder="e.g. 12, 11" value={profile.class} onChange={e => setProfile({...profile,class:e.target.value})}/></div>
              <div className="input-group">
                <label className="input-label">Target Exam</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"2px" }}>
                  {EXAM_OPTIONS.map(opt => <button key={opt} type="button" onClick={() => setProfile({...profile,exam:opt})} style={pillStyle(profile.exam===opt)}>{opt}</button>)}
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Board</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:"6px", marginTop:"2px" }}>
                  {BOARD_OPTIONS.map(opt => <button key={opt} type="button" onClick={() => setProfile({...profile,board:opt})} style={pillStyle(profile.board===opt)}>{opt}</button>)}
                </div>
              </div>
              <div className="input-group"><label className="input-label">Exam Date</label><input className="dh-input" type="date" value={profile.examDate||""} min={new Date().toISOString().split("T")[0]} onChange={e => setProfile({...profile,examDate:e.target.value})}/></div>
              <div className="input-group"><label className="input-label">Study Goal</label><input className="dh-input" placeholder="e.g. Score 95% in boards" value={profile.goal} onChange={e => setProfile({...profile,goal:e.target.value})}/></div>
              <button className="btn-primary full" onClick={saveProfile}>Save Profile</button>
              <button className="btn-ghost" style={{ width:"100%", justifyContent:"center" }} onClick={() => setEditMode(false)}>Cancel</button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}