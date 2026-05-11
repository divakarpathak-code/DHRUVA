// Planner.jsx
// The StudyForm handles its own top bar now.
// Planner just passes the handler down.

import StudyForm from "../components/StudyForm"
import { generatePlan } from "../api"
import { useNavigate } from "react-router-dom"

export default function Planner({ setPlan }) {
  const navigate = useNavigate()

  async function handleGenerate(data) {
    try {
      const result = await generatePlan(data)
      if (result.plan) {
        setPlan(result.plan)

        // ── Save plan to history in localStorage ──
        const history = JSON.parse(localStorage.getItem("planHistory") || "[]")
        history.unshift({
          id:        Date.now(),
          date:      new Date().toISOString(),
          subject:   data.subject,
          weeks:     data.weeks,
          hours:     data.hours_per_day,
          exam:      data.exam  || "",
          board:     data.board || "",
          planText:  result.plan,
        })
        // Keep last 10 plans only
        localStorage.setItem("planHistory", JSON.stringify(history.slice(0, 10)))

        navigate("/plan")
      }
    } catch (err) {
      console.error(err)
    }
  }

  return <StudyForm onGenerate={handleGenerate} />
}