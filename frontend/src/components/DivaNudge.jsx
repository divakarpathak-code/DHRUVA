// DivaNudge.jsx — Diva's personalized daily tip on Home
// Shows a context-aware 1-2 line tip based on the student's actual data
// src/components/DivaNudge.jsx

import { useState, useEffect } from "react"
import DivaAvatar from "./DivaAvatar"

function getNudge(tasks, streakCount, profile) {
  // Find weak tasks (confidence 1 or 2)
  const weakTasks = tasks.filter(t => t.completed && t.confidence && t.confidence < 3)
  const currentTask = tasks.find(t => !t.completed)
  const doneTasks = tasks.filter(t => t.completed).length

  // Priority order of nudges
  if (weakTasks.length > 0) {
    const weakest = weakTasks.sort((a, b) => a.confidence - b.confidence)[0]
    const topic = weakest.tasks[0]?.split("–")[1]?.trim() || `Day ${weakest.day}`
    return {
      text: `You struggled with ${topic}. Want to revise before moving on? Tap Analysis → Weak Topics!`,
      pose: "think",
      color: "#FEF3C7",
      border: "#FDE68A",
      textColor: "#92400E",
    }
  }

  if (streakCount === 0 && tasks.length > 0) {
    return {
      text: `Start your streak today! Complete Day ${currentTask?.day || 1} to light your first 🔥`,
      pose: "wave",
      color: "#EEF2FF",
      border: "#C7D2FE",
      textColor: "#3730A3",
    }
  }

  if (streakCount >= 7) {
    return {
      text: `${streakCount} days strong, ${profile?.name?.split(" ")[0] || "champ"}! 🔥 You're in the top habit-builders. Keep going!`,
      pose: "cheer",
      color: "#FEF3C7",
      border: "#FDE68A",
      textColor: "#92400E",
    }
  }

  if (streakCount >= 3) {
    return {
      text: `${streakCount}-day streak! Consistency is your superpower. Don't break the chain today 💪`,
      pose: "wave",
      color: "#ECFDF5",
      border: "#A7F3D0",
      textColor: "#065F46",
    }
  }

  if (doneTasks > 0 && currentTask) {
    const examMsg = profile?.exam ? ` for ${profile.exam}` : ""
    return {
      text: `${doneTasks} day${doneTasks > 1 ? "s" : ""} done${examMsg}! Today's focus: Day ${currentTask.day}. You've got this 🌟`,
      pose: "idle",
      color: "#EEF2FF",
      border: "#C7D2FE",
      textColor: "#3730A3",
    }
  }

  if (tasks.length === 0) {
    return {
      text: `Hey${profile?.name ? ` ${profile.name.split(" ")[0]}` : ""}! Tap Planner to build your personalised ${profile?.exam || "exam"} study plan 📚`,
      pose: "wave",
      color: "#EEF2FF",
      border: "#C7D2FE",
      textColor: "#3730A3",
    }
  }

  return null
}

export default function DivaNudge({ tasks = [], streakCount = 0 }) {
  const [profile, setProfile] = useState(null)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const p = localStorage.getItem("profile")
    if (p) setProfile(JSON.parse(p))

    // Dismiss resets each day
    const dismissed = localStorage.getItem("nudgeDismissed")
    const today = new Date().toISOString().split("T")[0]
    if (dismissed === today) setVisible(false)
  }, [])

  function dismiss() {
    const today = new Date().toISOString().split("T")[0]
    localStorage.setItem("nudgeDismissed", today)
    setVisible(false)
  }

  if (!visible) return null

  const nudge = getNudge(tasks, streakCount, profile)
  if (!nudge) return null

  return (
    <div style={{
      display:      "flex",
      alignItems:   "flex-start",
      gap:          "10px",
      background:   nudge.color,
      border:       `1px solid ${nudge.border}`,
      borderRadius: "var(--r-lg)",
      padding:      "12px 14px",
      marginBottom: "16px",
      animation:    "nudgeIn 0.35s cubic-bezier(0.34,1.4,0.64,1) both",
      position:     "relative",
    }}>
      {/* Diva mini avatar */}
      <div style={{ flexShrink: 0, marginTop: "-4px" }}>
        <DivaAvatar pose={nudge.pose} size={44} animate/>
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: "11px", fontWeight: 700, color: nudge.textColor, marginBottom: "3px", opacity: 0.7 }}>
          Diva says 🐘
        </div>
        <div style={{ fontSize: "12px", color: nudge.textColor, lineHeight: 1.55 }}>
          {nudge.text}
        </div>
      </div>

      {/* Dismiss */}
      <button
        onClick={dismiss}
        style={{
          position:   "absolute",
          top:        "8px",
          right:      "10px",
          background: "transparent",
          border:     "none",
          cursor:     "pointer",
          fontSize:   "14px",
          color:      nudge.textColor,
          opacity:    0.5,
          padding:    "2px",
          lineHeight: 1,
        }}
      >
        ×
      </button>

      <style>{`
        @keyframes nudgeIn {
          from { opacity:0; transform:translateY(-8px) scale(0.97); }
          to   { opacity:1; transform:translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}