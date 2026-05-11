const BASE = "http://127.0.0.1:8000"

// ── Generate study plan ──────────────────────────────────────────────────────
export async function generatePlan(data) {
  const rawHistory = JSON.parse(localStorage.getItem("planHistory") || "[]")
  const historySummaries = rawHistory
    .slice(0, 5)
    .map(p => `${p.subject} – ${p.weeks} weeks (${p.exam || "General"}, ${new Date(p.date).toLocaleDateString("en-IN")})`)

  const response = await fetch(`${BASE}/plans/generate`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ ...data, history: historySummaries }),
  })
  return response.json()
}

// ── AI Helper Bot ────────────────────────────────────────────────────────────
export async function sendMessage({ message, history = [] }) {
  const profile = JSON.parse(localStorage.getItem("profile") || "{}")
  const tasks   = JSON.parse(localStorage.getItem("tasks")   || "[]")

  const currentDay = tasks.find(t => !t.completed)
  const subject    = currentDay?.tasks?.[0]?.split("–")[0]?.trim() || ""

  const response = await fetch(`${BASE}/chat/ask`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message,
      history,
      subject,
      exam:       profile.exam   || "",
      board:      profile.board  || "",
      class_name: profile.class  || "",
    }),
  })
  return response.json()
}

// ── Weekly Mock Test ─────────────────────────────────────────────────────────
export async function generateMockTest({ topics, week = 1 }) {
  const profile = JSON.parse(localStorage.getItem("profile") || "{}")

  const response = await fetch(`${BASE}/test/generate`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      topics,
      week,
      exam:       profile.exam  || "",
      board:      profile.board || "",
      class_name: profile.class || "",
    }),
  })
  return response.json()
}

export async function analyseMockTest({ question_times, answers, correct, questions }) {
  const response = await fetch(`${BASE}/test/analyse`, {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question_times, answers, correct, questions }),
  })
  return response.json()
}