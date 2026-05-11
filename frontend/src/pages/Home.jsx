// Home.jsx — logo.png in top bar, HelperBot home-only, no TaskLock
import { Link }                from "react-router-dom"
import { useEffect, useState } from "react"
import ExamCountdown           from "../components/ExamCountdown"
import RevisionReminder        from "../components/RevisionReminder"
import PomodoroTimer           from "../components/PomodoroTimer"
import ConfidenceRater         from "../components/ConfidenceRater"
import DivaNudge               from "../components/DivaNudge"
import HelperBot               from "../components/HelperBot"
import logo                    from "../assets/logo.png"

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}
function getDateString() {
  return new Date().toLocaleDateString("en-IN", { weekday:"long", day:"numeric", month:"long" })
}

function FireStreak({ count }) {
  if (count === 0) return null
  return (
    <div style={{ display:"inline-flex",alignItems:"center",gap:"6px",background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",border:"1px solid #F59E0B",borderRadius:"100px",padding:"6px 14px",animation:"streakPulse 2s infinite" }}>
      <span style={{ fontSize:"18px",display:"inline-block",animation:"fireWiggle 1.5s ease-in-out infinite" }}>🔥</span>
      <span style={{ fontSize:"14px",fontWeight:800,color:"#92400E" }}>{count}</span>
      <span style={{ fontSize:"11px",fontWeight:600,color:"#B45309" }}>day streak!</span>
      <style>{`
        @keyframes fireWiggle{0%,100%{transform:rotate(-5deg) scale(1)}50%{transform:rotate(5deg) scale(1.15)}}
        @keyframes streakPulse{0%,100%{box-shadow:0 0 0 0 rgba(245,158,11,0.3)}50%{box-shadow:0 0 0 6px rgba(245,158,11,0)}}
      `}</style>
    </div>
  )
}

export default function Home({ tasks, setTasks, progress, streakCount=0, streakHistory={}, onTaskComplete }) {
  const [showComplete, setShowComplete] = useState(false)
  const [profile,      setProfile]      = useState(null)
  const [raterTask,    setRaterTask]    = useState(null)
  const [raterIndex,   setRaterIndex]   = useState(null)
  const [botOpen,      setBotOpen]      = useState(false)

  useEffect(() => {
    const p = localStorage.getItem("profile"); if (p) setProfile(JSON.parse(p))
  }, [])

  function completeTask(index) {
    const task    = tasks[index]
    const updated = tasks.map((t, i) => {
      if (i !== index) return t
      const completed = JSON.parse(localStorage.getItem("completedDays") || "[]")
      completed.push({
        date:    new Date().toISOString(),
        subject: t.tasks[0]?.split("–")[0]?.trim() || "Study",
        topics:  t.tasks.map(x => x.split(":")[0]?.split("–")[1]?.trim()).filter(Boolean),
      })
      localStorage.setItem("completedDays", JSON.stringify(completed))
      return { ...t, completed: true }
    })
    onTaskComplete(updated)
    setRaterTask(task)
    setRaterIndex(index)
  }

  function handleConfidenceRating(dayIndex, rating) {
    setTasks(tasks.map((t, i) => i === dayIndex ? { ...t, confidence: rating } : t))
    setRaterTask(null); setRaterIndex(null)
  }

  const currentTaskIndex = tasks.findIndex(t => !t.completed)
  const currentTask      = tasks[currentTaskIndex]
  const doneTasks        = tasks.filter(t => t.completed).length

  useEffect(() => {
    if (tasks.length > 0 && progress === 100) {
      setShowComplete(true)
      setTimeout(() => { setTasks([]); setShowComplete(false) }, 3000)
    }
  }, [progress])

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

      {/* Top bar with logo image */}
      <div className="top-bar">
        <div className="top-bar-logo">
          <img
            src={logo}
            alt="Dhruva"
            style={{ height:"28px", width:"auto", objectFit:"contain" }}
          />
        </div>
        <div className="top-bar-avatar">
          {profile?.name ? profile.name[0].toUpperCase() : "D"}
        </div>
      </div>

      <div className="page">
        <div className="greeting-section fade-up">
          <div className="greeting-label">{getDateString()}</div>
          <div className="greeting-name">
            {getGreeting()}{profile?.name ? `, ${profile.name.split(" ")[0]}` : ""} 👋
          </div>
          <div className="greeting-sub">
            {tasks.length === 0 ? "No study plan yet. Let's build one." : `${doneTasks} of ${tasks.length} days completed`}
          </div>
          <div style={{ marginTop:"10px" }}>
            <FireStreak count={streakCount}/>
            {streakCount === 0 && tasks.length > 0 && (
              <span className="streak-badge">Complete today's task to start your streak!</span>
            )}
          </div>
        </div>

        <DivaNudge tasks={tasks} streakCount={streakCount}/>
        <ExamCountdown examDate={profile?.examDate} examName={profile?.exam || "Exam"}/>
        <RevisionReminder/>

        <div className="progress-card fade-up fade-up-1">
          <div className="progress-card-label">Overall Progress</div>
          <div className="progress-card-row">
            <div className="progress-card-pct">{progress}%</div>
            <div className="progress-card-caption">
              {tasks.length === 0 ? "No plan active" : `${doneTasks}/${tasks.length} days done`}
            </div>
          </div>
          <div className="progress-track">
            <div className="progress-fill" style={{ width:`${progress}%` }}/>
          </div>
        </div>

        <div className="stats-row fade-up fade-up-2">
          <div className="stat-mini"><div className="stat-mini-val">{tasks.length}</div><div className="stat-mini-label">Total Days</div></div>
          <div className="stat-mini"><div className="stat-mini-val">{doneTasks}</div><div className="stat-mini-label">Completed</div></div>
          <div className="stat-mini"><div className="stat-mini-val">{tasks.length - doneTasks}</div><div className="stat-mini-label">Remaining</div></div>
        </div>

        {showComplete && (
          <div className="complete-card fade-up">
            <div style={{ fontSize:"32px",marginBottom:"8px" }}>🎉</div>
            <h3>Plan Completed!</h3>
            <p style={{ marginBottom:"14px" }}>You finished your entire study plan. Great work!</p>
            <Link to="/analysis" className="btn-primary">View Analysis</Link>
          </div>
        )}

        {!showComplete && tasks.length === 0 && (
          <div className="empty-state fade-up fade-up-3">
            <div className="empty-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#4F46E5" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="3"/>
                <path d="M16 2v4M8 2v4M3 10h18M9 16l2 2 4-4"/>
              </svg>
            </div>
            <div className="empty-title">No Study Plan Yet</div>
            <div className="empty-sub">Let the AI build a personalised plan around your exam and subjects.</div>
            <Link to="/planner" className="btn-primary" style={{ marginTop:"12px" }}>Start Planning</Link>
          </div>
        )}

        {!showComplete && currentTask && (
          <div className="fade-up fade-up-3">
            <div className="section-label">Today's Focus</div>
            <div className="day-card">
              <div className="day-card-header">
                <div className="day-card-title">Day {currentTask.day}</div>
                <span className="day-card-badge badge-current">In Progress</span>
              </div>
              <div className="day-card-body">
                <ul className="task-list">
                  {currentTask.tasks.map((task, i) => (
                    <li key={i} className="task-item">{task}</li>
                  ))}
                </ul>
                <div className="day-card-checkbox-row" style={{ marginTop:"10px" }}>
                  <input
                    type="checkbox"
                    className="task-checkbox"
                    checked={currentTask.completed}
                    onChange={() => completeTask(currentTaskIndex)}
                    id="mark-complete"
                  />
                  <label htmlFor="mark-complete" style={{ fontSize:"13px",color:"var(--slate)",cursor:"pointer",userSelect:"none" }}>
                    Mark day as complete
                  </label>
                </div>
                <div style={{ marginTop:"12px" }}>
                  <PomodoroTimer taskName={currentTask.tasks[0] || ""}/>
                </div>
              </div>
              <div className="day-card-footer">
                <Link to="/tasks" className="btn-ghost" style={{ width:"100%",justifyContent:"center" }}>View All Days</Link>
              </div>
            </div>
          </div>
        )}

        {!showComplete && tasks.length > 1 && currentTaskIndex >= 0 && currentTaskIndex < tasks.length - 1 && (
          <div className="fade-up fade-up-4" style={{ marginTop:"20px" }}>
            <div className="section-label">Coming Up</div>
            <div style={{ display:"flex",flexDirection:"column",gap:"6px" }}>
              {tasks.slice(currentTaskIndex + 1, currentTaskIndex + 3).map(t => (
                <div key={t.day} className="schedule-block">
                  <div className="schedule-block-title">Day {t.day}</div>
                  <div className="schedule-block-meta">{t.tasks.length} task{t.tasks.length !== 1 ? "s" : ""} scheduled</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* HelperBot — only on Home */}
      <HelperBot open={botOpen} setOpen={setBotOpen}/>
    </>
  )
}