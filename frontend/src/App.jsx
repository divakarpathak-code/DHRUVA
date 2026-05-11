// App.jsx — streak popup on task complete, logo.png, TaskLock removed
import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Home        from "./pages/Home"
import Planner     from "./pages/Planner"
import Tasks       from "./pages/Tasks"
import Analysis    from "./pages/Analysis"
import Profile     from "./pages/Profile"
import PlanPreview from "./pages/PlanPreview"
import Onboarding  from "./pages/Onboarding"
import BottomNav   from "./components/BottomNav"
import StreakPopup  from "./components/StreakPopup"
import { addXP, XP_REWARDS } from "./utils/xpSystem"

export default function App() {
  const [plan,          setPlan]          = useState("")
  const [tasks,         setTasks]         = useState([])
  const [progress,      setProgress]      = useState(0)
  const [loaded,        setLoaded]        = useState(false)
  const [onboarded,     setOnboarded]     = useState(false)
  const [streakHistory, setStreakHistory] = useState({})
  const [streakCount,   setStreakCount]   = useState(0)
  const [streakPopup,   setStreakPopup]   = useState(null) // null or streak number to show

  // ── Load ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const t  = localStorage.getItem("tasks");         if (t)  setTasks(JSON.parse(t))
    const sh = localStorage.getItem("streakHistory"); if (sh) setStreakHistory(JSON.parse(sh))
    const ob = localStorage.getItem("onboarded");     if (ob) setOnboarded(true)
    setLoaded(true)
  }, [])

  // ── Save tasks + recalc progress ──────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem("tasks", JSON.stringify(tasks))
    const done  = tasks.filter(t => t.completed).length
    const total = tasks.length
    setProgress(total === 0 ? 0 : Math.round((done / total) * 100))
  }, [tasks, loaded])

  // ── Date-based streak ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!loaded) return
    localStorage.setItem("streakHistory", JSON.stringify(streakHistory))
    let count = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(today.getDate() - i)
      const key = d.toISOString().split("T")[0]
      if (streakHistory[key]) count++
      else if (i > 0) break
    }
    setStreakCount(count)
    localStorage.setItem("streak", String(count))
  }, [streakHistory, loaded])

  // ── Task complete handler ─────────────────────────────────────────────────
  function handleTaskComplete(updatedTasks) {
    setTasks(updatedTasks)
    const now      = new Date().toISOString()
    const todayKey = now.split("T")[0]

    // Only count streak + show popup if first study today
    if (!streakHistory[todayKey]) {
      const newHistory = { ...streakHistory, [todayKey]: true }
      setStreakHistory(newHistory)

      // Calc new streak count to show in popup
      let count = 0
      const today = new Date()
      for (let i = 0; i < 365; i++) {
        const d = new Date(today); d.setDate(today.getDate() - i)
        const key = d.toISOString().split("T")[0]
        if (newHistory[key]) count++
        else if (i > 0) break
      }

      addXP(XP_REWARDS.STREAK_DAY)
      // Bonus XP for milestones
      if (count === 7)  addXP(XP_REWARDS.STREAK_WEEK)
      if (count === 30) addXP(XP_REWARDS.STREAK_MONTH)

      // Show streak popup
      setStreakPopup(count)
    }

    addXP(XP_REWARDS.TASK_COMPLETE)
  }

  if (!loaded) return null

  return (
    <BrowserRouter>
      <div style={{ paddingBottom:"70px" }}>
        <Routes>
          <Route path="/welcome" element={
            onboarded ? <Navigate to="/" replace/> :
            <Onboarding onComplete={() => { setOnboarded(true); localStorage.setItem("onboarded","1") }}/>
          }/>

          <Route path="/" element={
            !onboarded ? <Navigate to="/welcome" replace/> :
            <Home
              tasks={tasks}
              setTasks={setTasks}
              progress={progress}
              streakCount={streakCount}
              streakHistory={streakHistory}
              onTaskComplete={handleTaskComplete}
            />
          }/>

          <Route path="/planner"  element={<Planner setPlan={setPlan}/>}/>
          <Route path="/plan"     element={<PlanPreview plan={plan} setTasks={setTasks}/>}/>
          <Route path="/tasks"    element={
            <Tasks tasks={tasks} setTasks={setTasks} onTaskComplete={handleTaskComplete}/>
          }/>
          <Route path="/analysis" element={<Analysis progress={progress} tasks={tasks} setTasks={setTasks}/>}/>
          <Route path="/profile"  element={
            <Profile progress={progress} streakCount={streakCount} streakHistory={streakHistory} tasks={tasks}/>
          }/>
        </Routes>
      </div>

      {onboarded && <BottomNav/>}

      {/* Streak popup — shown after task complete triggers a new streak day */}
      {streakPopup !== null && (
        <StreakPopup
          streak={streakPopup}
          onClose={() => setStreakPopup(null)}
        />
      )}
    </BrowserRouter>
  )
}