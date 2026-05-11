// Tasks.jsx — no 24hr lock (TaskLock removed for hackathon)
import { useState } from "react"
import ConfidenceRater from "../components/ConfidenceRater"
import logo            from "../assets/logo.png"

export default function Tasks({ tasks, setTasks, onTaskComplete }) {
  const [raterTask,  setRaterTask]  = useState(null)
  const [raterIndex, setRaterIndex] = useState(null)

  const done     = tasks.filter(t => t.completed).length
  const total    = tasks.length
  const progress = total === 0 ? 0 : Math.round((done / total) * 100)

  const CONFIDENCE_COLORS = { 1: "#EF4444", 2: "#F59E0B", 3: "#10B981" }

  function handleComplete(index) {
    const task    = tasks[index]
    const updated = tasks.map((t, i) => i === index ? { ...t, completed: true } : t)
    if (onTaskComplete) onTaskComplete(updated)
    else setTasks(updated)
    setRaterTask(task)
    setRaterIndex(index)
  }

  function handleConfidenceRating(dayIndex, rating) {
    const updated = tasks.map((t, i) => i === dayIndex ? { ...t, confidence: rating } : t)
    setTasks(updated)
    setRaterTask(null)
    setRaterIndex(null)
  }

  const currentTaskIndex = tasks.findIndex(t => !t.completed)

  return (
    <>
      {raterTask && (
        <ConfidenceRater
          task={raterTask}
          dayIndex={raterIndex}
          onRate={handleConfidenceRating}
          onClose={() => { setRaterTask(null); setRaterIndex(null) }}
        />
      )}

      <div className="top-bar">
        <div className="top-bar-logo">
          <img src={logo} alt="Dhruva" style={{ height:"28px", width:"auto", objectFit:"contain" }}/>
        </div>
        {total > 0 && (
          <span style={{
            fontSize:"12px", fontWeight:500, color:"var(--indigo)",
            background:"var(--indigo-light)", padding:"4px 10px",
            borderRadius:"var(--r-pill)",
          }}>
            {done}/{total} done
          </span>
        )}
      </div>

      <div className="page">
        <div className="page-header fade-up">
          <div className="page-title">All Tasks</div>
          <div className="page-sub">Your complete study plan, day by day</div>
        </div>

        {total > 0 && (
          <div className="fade-up fade-up-1" style={{ marginBottom:"20px" }}>
            <div style={{ display:"flex", justifyContent:"space-between", marginBottom:"6px" }}>
              <span style={{ fontSize:"12px", color:"var(--muted)" }}>Overall progress</span>
              <span style={{ fontSize:"12px", fontWeight:500, color:"var(--indigo)" }}>{progress}%</span>
            </div>
            <div className="prog-track-outer">
              <div className="prog-track-inner" style={{ width:`${progress}%` }}/>
            </div>
          </div>
        )}

        {tasks.length === 0 && (
          <div className="empty-state fade-up">
            <div className="empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="3"/>
                <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>
              </svg>
            </div>
            <div className="empty-title">No Tasks Yet</div>
            <div className="empty-sub">Generate a study plan from the Planner tab to see your tasks here.</div>
          </div>
        )}

        <div className="tasks-list">
          {tasks.map((item, index) => {
            const isCurrentDay = index === currentTaskIndex
            return (
              <div
                key={index}
                className="day-card fade-up"
                style={{ animationDelay:`${index * 0.04}s` }}
              >
                <div className="day-card-header">
                  <div className="day-card-title">Day {item.day}</div>
                  <div style={{ display:"flex", alignItems:"center", gap:"6px" }}>
                    {item.confidence && (
                      <span style={{
                        fontSize:"10px", padding:"2px 8px", borderRadius:"100px",
                        background:`${CONFIDENCE_COLORS[item.confidence]}15`,
                        color:CONFIDENCE_COLORS[item.confidence],
                        border:`0.5px solid ${CONFIDENCE_COLORS[item.confidence]}40`,
                        fontWeight:500,
                      }}>
                        {"⭐".repeat(item.confidence)}
                      </span>
                    )}
                    <span className="day-card-badge" style={
                      item.completed
                        ? { background:"var(--jade-light)", color:"#065F46", borderRadius:"var(--r-pill)", fontSize:"11px", fontWeight:500, padding:"3px 8px" }
                        : isCurrentDay
                        ? { background:"var(--indigo-light)", color:"var(--indigo-dark)", borderRadius:"var(--r-pill)", fontSize:"11px", fontWeight:500, padding:"3px 8px" }
                        : { background:"var(--amber-light)", color:"#92400E", borderRadius:"var(--r-pill)", fontSize:"11px", fontWeight:500, padding:"3px 8px" }
                    }>
                      {item.completed ? "✓ Done" : isCurrentDay ? "Current" : "Pending"}
                    </span>
                  </div>
                </div>

                <div className="day-card-body">
                  <ul className="task-list">
                    {item.tasks.map((task, i) => (
                      <li key={i} className="task-item">{task}</li>
                    ))}
                  </ul>
                  {isCurrentDay && !item.completed && (
                    <button
                      onClick={() => handleComplete(index)}
                      style={{
                        marginTop:"10px", width:"100%", padding:"9px",
                        background:"var(--indigo)", color:"#fff",
                        border:"none", borderRadius:"var(--r-md)",
                        fontFamily:"var(--font-body)", fontSize:"13px", fontWeight:600,
                        cursor:"pointer",
                      }}
                    >
                      ✓ Mark Day Complete
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}