// Analysis.jsx — with Weak Topic Detection tab
import { useState, useEffect } from "react"
import logo from "../assets/logo.png"

function StatCard({ value, label, color = "var(--indigo)" }) {
  return (
    <div className="analytics-card">
      <div className="analytics-val" style={{ color }}>{value}</div>
      <div className="analytics-label">{label}</div>
    </div>
  )
}

function SubjectDot({ subject }) {
  const colors = {
    Physics:"#6366F1", Mathematics:"#0EA5E9", Chemistry:"#F59E0B",
    Biology:"#10B981", English:"#EC4899", History:"#8B5CF6",
    Geography:"#14B8A6", "Computer Science":"#F97316", Economics:"#64748B",
  }
  const c = colors[subject] || "var(--indigo)"
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:"5px", fontSize:"12px", fontWeight:500, color:c }}>
      <span style={{ width:"7px", height:"7px", borderRadius:"50%", background:c, flexShrink:0 }}/>
      {subject}
    </span>
  )
}

function WeakTopicPanel({ tasks, setTasks }) {
  const weakTasks   = tasks.filter(t => t.completed && t.confidence && t.confidence < 3)
  const strongTasks = tasks.filter(t => t.completed && t.confidence === 3)

  const CONFIDENCE_LABELS = { 1:"Struggling 😓", 2:"Getting there 🤔", 3:"Got it! 💪" }
  const CONFIDENCE_COLORS = { 1:"#EF4444", 2:"#F59E0B", 3:"#10B981" }
  const CONFIDENCE_BG     = { 1:"#FEF2F2", 2:"#FFFBEB", 3:"#ECFDF5" }

  function addRevisionDay(task) {
    const maxDay = tasks.reduce((a, t) => Math.max(a, t.day), 0)
    const revisionDay = { day:maxDay+1, tasks:task.tasks.map(t=>`📌 Revision: ${t}`), completed:false, isRevision:true }
    setTasks(prev => [...prev, revisionDay])
  }

  if (tasks.filter(t => t.completed).length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-title">No data yet</div>
        <div className="empty-sub">Complete some tasks and rate your confidence to see weak topic detection.</div>
      </div>
    )
  }

  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"10px", marginBottom:"20px" }}>
        <div style={{ background:"#FEF2F2", border:"0.5px solid #FECDD3", borderRadius:"var(--r-md)", padding:"14px", textAlign:"center" }}>
          <div style={{ fontSize:"24px", fontWeight:800, color:"#EF4444" }}>{weakTasks.length}</div>
          <div style={{ fontSize:"11px", color:"#B91C1C", marginTop:"2px" }}>Weak Days</div>
        </div>
        <div style={{ background:"#ECFDF5", border:"0.5px solid #A7F3D0", borderRadius:"var(--r-md)", padding:"14px", textAlign:"center" }}>
          <div style={{ fontSize:"24px", fontWeight:800, color:"#10B981" }}>{strongTasks.length}</div>
          <div style={{ fontSize:"11px", color:"#065F46", marginTop:"2px" }}>Strong Days</div>
        </div>
      </div>

      {weakTasks.length > 0 && (
        <div style={{ marginBottom:"20px" }}>
          <div className="section-label" style={{ color:"#EF4444" }}>⚠️ Needs Revision</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"8px" }}>
            {weakTasks.map((task, i) => (
              <div key={i} style={{ border:`1px solid ${CONFIDENCE_COLORS[task.confidence]}40`, borderRadius:"var(--r-md)", background:CONFIDENCE_BG[task.confidence], overflow:"hidden" }}>
                <div style={{ padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <div>
                    <div style={{ fontSize:"13px", fontWeight:600, color:"var(--ink)" }}>Day {task.day}</div>
                    <div style={{ fontSize:"11px", color:CONFIDENCE_COLORS[task.confidence], fontWeight:500, marginTop:"2px" }}>
                      {"⭐".repeat(task.confidence)} {CONFIDENCE_LABELS[task.confidence]}
                    </div>
                  </div>
                  <button onClick={() => addRevisionDay(task)} style={{ background:CONFIDENCE_COLORS[task.confidence], color:"#fff", border:"none", borderRadius:"var(--r-sm)", padding:"6px 12px", fontSize:"11px", fontWeight:600, cursor:"pointer", fontFamily:"var(--font-body)" }}>
                    + Add Revision
                  </button>
                </div>
                <div style={{ padding:"0 14px 10px" }}>
                  {task.tasks.slice(0,2).map((t,j) => (
                    <div key={j} style={{ fontSize:"11px", color:"var(--slate)", marginBottom:"2px" }}>• {t.length>55?t.slice(0,55)+"…":t}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {weakTasks.length > 0 && (
        <div style={{ background:"linear-gradient(135deg,var(--indigo-light),#EDE9FE)", border:"0.5px solid var(--indigo)", borderRadius:"var(--r-md)", padding:"14px", marginBottom:"20px" }}>
          <div style={{ fontSize:"12px", fontWeight:700, color:"var(--indigo-dark)", marginBottom:"4px" }}>🤖 AI Suggestion</div>
          <div style={{ fontSize:"11px", color:"var(--indigo-dark)", lineHeight:1.5 }}>
            You have {weakTasks.length} day{weakTasks.length>1?"s":""} with low confidence.
            Tap "+ Add Revision" to schedule a dedicated revision session for those topics at the end of your plan.
            Spaced repetition improves retention by up to 80%!
          </div>
        </div>
      )}

      {strongTasks.length > 0 && (
        <div>
          <div className="section-label" style={{ color:"#10B981" }}>✅ Strong Areas</div>
          <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
            {strongTasks.map((task, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 14px", background:"#ECFDF5", border:"0.5px solid #A7F3D0", borderRadius:"var(--r-md)" }}>
                <div style={{ fontSize:"13px", fontWeight:500, color:"var(--ink)" }}>Day {task.day}</div>
                <span style={{ fontSize:"12px", color:"#10B981", fontWeight:600 }}>⭐⭐⭐ Got it!</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {weakTasks.length === 0 && strongTasks.length === 0 && (
        <div style={{ textAlign:"center", padding:"20px", background:"var(--surface)", borderRadius:"var(--r-md)" }}>
          <div style={{ fontSize:"24px", marginBottom:"8px" }}>📊</div>
          <div style={{ fontSize:"13px", fontWeight:600, color:"var(--ink)", marginBottom:"4px" }}>No confidence ratings yet</div>
          <div style={{ fontSize:"11px", color:"var(--muted)" }}>Rate your confidence after completing each day's tasks to unlock weak topic detection.</div>
        </div>
      )}
    </div>
  )
}

export default function Analysis({ tasks=[], setTasks }) {
  const [history, setHistory] = useState([])
  const [profile, setProfile] = useState(null)
  const [tab,     setTab]     = useState("current")

  useEffect(() => {
    const h = localStorage.getItem("planHistory"); if (h) setHistory(JSON.parse(h))
    const p = localStorage.getItem("profile");     if (p) setProfile(JSON.parse(p))
  }, [])

  const total          = tasks.length
  const completed      = tasks.filter(t => t.completed).length
  const remaining      = total - completed
  const progress       = total === 0 ? 0 : Math.round((completed/total)*100)
  const totalTaskItems = tasks.reduce((a,t) => a+t.tasks.length, 0)
  const avgPerDay      = total === 0 ? 0 : Math.round(totalTaskItems/total)

  function statusLabel() {
    if (total===0)       return null
    if (progress===100)  return { text:"Completed 🎉" }
    if (progress>=60)    return { text:"Great progress!" }
    if (progress>=30)    return { text:"Keep going 💪" }
    return                      { text:"Just started" }
  }
  const status = statusLabel()

  function clearHistory() {
    if (window.confirm("Clear all plan history?")) { localStorage.removeItem("planHistory"); setHistory([]) }
  }

  const TABS = [
    { key:"current", label:"Current Plan" },
    { key:"weak",    label:"Weak Topics" },
    { key:"history", label:`History (${history.length})` },
  ]

  return (
    <>
      <div className="top-bar">
        <div className="top-bar-logo">
          <img src={logo} alt="Dhruva" style={{ height:"28px", width:"auto", objectFit:"contain" }}/>
        </div>
        {profile?.name && <div className="top-bar-avatar">{profile.name[0].toUpperCase()}</div>}
      </div>

      <div className="page">
        <div className="page-header fade-up">
          <div className="page-title">Analysis</div>
          <div className="page-sub">
            {profile?.exam ? `${profile.exam} prep · ` : ""}{history.length} plan{history.length!==1?"s":""} total
          </div>
        </div>

        {!tasks.length && !history.length && (
          <div className="empty-state fade-up">
            <div className="empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 20h18M5 20V10l4-4 4 4 4-6" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="empty-title">No Data Yet</div>
            <div className="empty-sub">Generate your first study plan to see analytics here.</div>
          </div>
        )}

        <div className="fade-up fade-up-1" style={{ display:"flex", gap:"3px", background:"var(--surface)", border:"0.5px solid var(--border)", borderRadius:"var(--r-md)", padding:"3px", marginBottom:"20px", overflowX:"auto" }}>
          {TABS.map(({key,label}) => (
            <button key={key} onClick={() => setTab(key)} style={{ flex:1, minWidth:"80px", fontFamily:"var(--font-body)", fontSize:"11px", fontWeight:500, padding:"7px 4px", border:"none", borderRadius:"var(--r-sm)", cursor:"pointer", transition:"all 0.15s", background:tab===key?"var(--white)":"transparent", color:tab===key?"var(--indigo)":"var(--muted)", boxShadow:tab===key?"0 1px 3px rgba(0,0,0,0.08)":"none", whiteSpace:"nowrap" }}>
              {label}
            </button>
          ))}
        </div>

        {/* Current Plan tab */}
        {tab==="current" && (
          !tasks.length ? (
            <div className="empty-state"><div className="empty-title">No Active Plan</div><div className="empty-sub">Your current plan stats will appear here.</div></div>
          ) : (
            <>
              <div className="progress-card fade-up">
                <div className="progress-card-label">Overall Completion</div>
                <div className="progress-card-row">
                  <div className="progress-card-pct">{progress}%</div>
                  {status && <span style={{ fontSize:"11px", background:"rgba(255,255,255,0.15)", color:"#fff", padding:"3px 10px", borderRadius:"100px", fontWeight:500 }}>{status.text}</span>}
                </div>
                <div className="progress-track"><div className="progress-fill" style={{ width:`${progress}%` }}/></div>
              </div>

              <div className="analytics-grid fade-up fade-up-1">
                <StatCard value={total}     label="Total Days"  color="var(--ink)"    />
                <StatCard value={completed} label="Completed"   color="var(--jade)"   />
                <StatCard value={remaining} label="Remaining"   color="var(--amber)"  />
                <StatCard value={avgPerDay} label="Tasks / Day" color="var(--indigo)" />
              </div>

              <div className="fade-up fade-up-2" style={{ marginTop:"20px" }}>
                <div className="section-label">Day-by-Day</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"6px" }}>
                  {tasks.map(t => (
                    <div key={t.day} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"11px 14px", borderRadius:"var(--r-md)", border:"0.5px solid var(--border)", background:t.completed?"var(--jade-light)":"var(--white)" }}>
                      <div>
                        <div style={{ fontSize:"13px", fontWeight:500, color:"var(--ink)" }}>Day {t.day}</div>
                        <div style={{ fontSize:"11px", color:"var(--muted)", marginTop:"1px" }}>{t.tasks.length} task{t.tasks.length!==1?"s":""}</div>
                      </div>
                      <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                        {t.confidence && <span style={{ fontSize:"11px" }}>{"⭐".repeat(t.confidence)}</span>}
                        <span style={{ fontSize:"11px", fontWeight:500, padding:"3px 8px", borderRadius:"100px", background:t.completed?"var(--jade-light)":"var(--amber-light)", color:t.completed?"#065F46":"#92400E", border:`0.5px solid ${t.completed?"#A7F3D0":"#FDE68A"}` }}>
                          {t.completed ? "✓ Done" : "Pending"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )
        )}

        {/* Weak Topics tab */}
        {tab==="weak" && <WeakTopicPanel tasks={tasks} setTasks={setTasks}/>}

        {/* History tab */}
        {tab==="history" && (
          !history.length ? (
            <div className="empty-state"><div className="empty-title">No History Yet</div><div className="empty-sub">Past plans will appear here after you generate them.</div></div>
          ) : (
            <>
              <div className="analytics-grid fade-up" style={{ marginBottom:"20px" }}>
                <StatCard value={history.length} label="Plans Generated" color="var(--indigo)" />
                <StatCard value={[...new Set(history.map(h=>h.subject))].length} label="Subjects" color="var(--jade)" />
                <StatCard value={history.reduce((a,h)=>a+h.weeks,0)} label="Weeks Planned" color="var(--amber)" />
                <StatCard value={history[0]?.exam||"—"} label="Target Exam" color="var(--ink)" />
              </div>

              {(() => {
                const sc = {}
                history.forEach(h => { sc[h.subject]=(sc[h.subject]||0)+1 })
                const max = Math.max(...Object.values(sc))
                return (
                  <div className="fade-up fade-up-1" style={{ marginBottom:"20px" }}>
                    <div className="section-label">Subjects studied</div>
                    {Object.entries(sc).map(([subj,count]) => (
                      <div key={subj} style={{ marginBottom:"10px" }}>
                        <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"4px" }}>
                          <SubjectDot subject={subj}/>
                          <span style={{ fontSize:"11px", color:"var(--muted)" }}>{count} plan{count!==1?"s":""}</span>
                        </div>
                        <div className="prog-track-outer"><div className="prog-track-inner" style={{ width:`${(count/max)*100}%` }}/></div>
                      </div>
                    ))}
                  </div>
                )
              })()}

              <div className="fade-up fade-up-2">
                <div className="section-label">Plan Timeline</div>
                <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                  {history.map((plan,i) => (
                    <div key={plan.id} style={{ border:"0.5px solid var(--border)", borderRadius:"var(--r-lg)", background:"var(--white)", overflow:"hidden" }}>
                      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 14px", borderBottom:"0.5px solid var(--border-soft)" }}>
                        <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
                          <span style={{ width:"22px", height:"22px", borderRadius:"50%", background:i===0?"var(--indigo)":"var(--surface)", border:"0.5px solid var(--border)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"10px", fontWeight:600, color:i===0?"#fff":"var(--muted)", flexShrink:0 }}>{history.length-i}</span>
                          <div>
                            <SubjectDot subject={plan.subject}/>
                            <div style={{ fontSize:"11px", color:"var(--muted)", marginTop:"1px" }}>{new Date(plan.date).toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})}</div>
                          </div>
                        </div>
                        {i===0 && <span style={{ fontSize:"10px", fontWeight:500, padding:"2px 7px", borderRadius:"100px", background:"var(--indigo-light)", color:"var(--indigo-dark)" }}>Latest</span>}
                      </div>
                      <div style={{ padding:"10px 14px", display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"8px" }}>
                        {[{label:"Weeks",val:`${plan.weeks}w`},{label:"Hrs/day",val:`${plan.hours}h`},{label:"Exam",val:plan.exam||"—"}].map(({label,val}) => (
                          <div key={label} style={{ textAlign:"center" }}>
                            <div style={{ fontSize:"13px", fontWeight:600, color:"var(--ink)" }}>{val}</div>
                            <div style={{ fontSize:"10px", color:"var(--muted)", marginTop:"1px" }}>{label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <button onClick={clearHistory} style={{ marginTop:"16px", width:"100%", fontFamily:"var(--font-body)", fontSize:"12px", fontWeight:500, padding:"9px", border:"0.5px solid #FECDD3", borderRadius:"var(--r-md)", background:"var(--rose-light)", color:"var(--rose)", cursor:"pointer" }}>
                  Clear History
                </button>
              </div>
            </>
          )
        )}
      </div>
    </>
  )
}