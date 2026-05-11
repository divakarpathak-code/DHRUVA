// PlanPreview.jsx — Dhruva-styled plan preview (no Bootstrap)
import { useNavigate } from "react-router-dom"

export default function PlanPreview({ plan, setTasks }) {
  const navigate = useNavigate()

  if (!plan) {
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
        </div>
        <div className="page">
          <div className="empty-state" style={{ marginTop:"40px" }}>
            <div className="empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="3"/>
                <path d="M16 2v4M8 2v4M3 10h18"/>
              </svg>
            </div>
            <div className="empty-title">No Plan Generated</div>
            <div className="empty-sub">Go back to the Planner and generate a study plan first.</div>
            <button className="btn-primary" style={{ marginTop:"12px" }} onClick={() => navigate("/planner")}>
              Go to Planner
            </button>
          </div>
        </div>
      </>
    )
  }

  let parsedPlan = null
  try { parsedPlan = JSON.parse(plan) } catch (err) { console.error("Plan parse error", err) }

  function startPlan() {
    const tasks = parsedPlan.days.map(day => ({
      day:       day.day,
      tasks:     day.tasks,
      completed: false,
    }))
    setTasks(tasks)
    navigate("/")
  }

  const totalDays  = parsedPlan?.days?.length || 0
  const totalTasks = parsedPlan?.days?.reduce((acc, d) => acc + d.tasks.length, 0) || 0

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
        <span style={{
          fontSize:"11px",fontWeight:600,color:"var(--indigo)",
          background:"var(--indigo-light)",padding:"4px 10px",borderRadius:"var(--r-pill)",
        }}>
          {totalDays} days
        </span>
      </div>

      <div className="page">
        {/* Hero banner */}
        <div className="fade-up" style={{
          background:    "linear-gradient(135deg,#4F46E5,#7C3AED)",
          borderRadius:  "var(--r-lg)",
          padding:       "20px 18px",
          marginBottom:  "20px",
          color:         "#fff",
          position:      "relative",
          overflow:      "hidden",
        }}>
          {/* Decorative circles */}
          <div style={{ position:"absolute",top:"-20px",right:"-20px",width:"100px",height:"100px",borderRadius:"50%",background:"rgba(255,255,255,0.06)" }}/>
          <div style={{ position:"absolute",bottom:"-30px",left:"30%",width:"80px",height:"80px",borderRadius:"50%",background:"rgba(255,255,255,0.05)" }}/>

          <div style={{ fontSize:"11px",fontWeight:600,color:"rgba(255,255,255,0.65)",marginBottom:"4px",letterSpacing:"0.06em",textTransform:"uppercase" }}>
            AI Study Plan Ready
          </div>
          <div style={{ fontSize:"22px",fontWeight:800,marginBottom:"14px",lineHeight:1.2 }}>
            Your personalised plan is ready! 🎯
          </div>

          {/* Stats row */}
          <div style={{ display:"flex",gap:"12px" }}>
            {[
              { val: totalDays,  label:"Days"  },
              { val: totalTasks, label:"Tasks" },
              { val: `~${Math.round(totalTasks * 45)}m`, label:"Est. Time" },
            ].map(({ val, label }) => (
              <div key={label} style={{
                flex:1,background:"rgba(255,255,255,0.12)",borderRadius:"var(--r-md)",
                padding:"10px 8px",textAlign:"center",
              }}>
                <div style={{ fontSize:"18px",fontWeight:800,color:"#fff" }}>{val}</div>
                <div style={{ fontSize:"10px",color:"rgba(255,255,255,0.65)",marginTop:"1px" }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Day cards */}
        <div className="section-label">Study Schedule</div>
        <div style={{ display:"flex",flexDirection:"column",gap:"10px",marginBottom:"24px" }}>
          {parsedPlan?.days?.map((day, index) => (
            <div
              key={index}
              className="day-card fade-up"
              style={{ animationDelay:`${index * 0.035}s` }}
            >
              <div className="day-card-header">
                <div className="day-card-title">Day {day.day}</div>
                <span style={{
                  fontSize:"10px",fontWeight:600,
                  color:"var(--indigo)",
                  background:"var(--indigo-light)",
                  padding:"2px 8px",borderRadius:"var(--r-pill)",
                }}>
                  {day.tasks.length} task{day.tasks.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="day-card-body">
                <ul className="task-list">
                  {day.tasks.map((task, i) => (
                    <li key={i} className="task-item">{task}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Action buttons — sticky footer feel */}
        <div style={{
          position:     "sticky",
          bottom:       "78px",
          background:   "var(--bg)",
          padding:      "12px 0 4px",
          display:      "flex",
          gap:          "10px",
          zIndex:       10,
        }}>
          <button
            onClick={() => navigate("/planner")}
            className="btn-ghost"
            style={{ flex:1,justifyContent:"center" }}
          >
            ← Regenerate
          </button>
          <button
            onClick={startPlan}
            className="btn-primary"
            style={{ flex:2 }}
          >
            🚀 Start This Plan
          </button>
        </div>
      </div>
    </>
  )
}