// StreakCalendar.jsx — proper calendar grid with real dates shown
// streakHistory = { "2025-01-15": true, ... }

export default function StreakCalendar({ streakHistory = {} }) {
  const today    = new Date()
  const todayKey = today.toISOString().split("T")[0]

  // Build a proper calendar: show current month + spill from prev month
  // so that the grid starts on Sunday
  const year  = today.getFullYear()
  const month = today.getMonth()

  // First day of the month
  const firstOfMonth = new Date(year, month, 1)
  // Day of week the month starts on (0=Sun)
  const startDow = firstOfMonth.getDay()
  // Days in this month
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  // Days in previous month
  const daysInPrev  = new Date(year, month, 0).getDate()

  // Total cells: fill to complete rows (multiple of 7), at least one full week after month
  const totalCells = Math.ceil((startDow + daysInMonth) / 7) * 7

  const cells = []
  for (let i = 0; i < totalCells; i++) {
    const dayNum = i - startDow + 1 // day of current month (can be <1 or >daysInMonth)
    let date, key, isCurrentMonth

    if (dayNum < 1) {
      // Prev month spillover
      const d = new Date(year, month - 1, daysInPrev + dayNum)
      key = d.toISOString().split("T")[0]
      date = d
      isCurrentMonth = false
    } else if (dayNum > daysInMonth) {
      // Next month spillover
      const d = new Date(year, month + 1, dayNum - daysInMonth)
      key = d.toISOString().split("T")[0]
      date = d
      isCurrentMonth = false
    } else {
      const d = new Date(year, month, dayNum)
      key = d.toISOString().split("T")[0]
      date = d
      isCurrentMonth = true
    }

    const studied  = !!streakHistory[key]
    const isToday  = key === todayKey
    const isFuture = date > today && key !== todayKey

    cells.push({ key, date, dayNum: date.getDate(), isCurrentMonth, studied, isToday, isFuture })
  }

  // Current streak count
  let streak = 0
  const check = new Date(today)
  while (true) {
    const k = check.toISOString().split("T")[0]
    if (streakHistory[k]) { streak++; check.setDate(check.getDate() - 1) }
    else break
  }

  // Total studied days this month
  const studiedThisMonth = cells.filter(c => c.isCurrentMonth && c.studied).length

  const MONTH_NAMES = ["January","February","March","April","May","June","July","August","September","October","November","December"]
  const DOW = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]

  return (
    <div style={{
      background:"var(--white)",
      border:"0.5px solid var(--border)",
      borderRadius:"var(--r-lg)",
      padding:"16px",
      marginBottom:"16px",
    }}>
      {/* Header row */}
      <div style={{ display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:"14px" }}>
        <div>
          <div style={{ fontSize:"14px",fontWeight:700,color:"var(--ink)" }}>
            {MONTH_NAMES[month]} {year}
          </div>
          <div style={{ fontSize:"11px",color:"var(--muted)",marginTop:"1px" }}>
            {studiedThisMonth} day{studiedThisMonth!==1?"s":""} studied this month
          </div>
        </div>
        <div style={{
          display:"flex",alignItems:"center",gap:"6px",
          background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",
          border:"1px solid #F59E0B",borderRadius:"100px",
          padding:"5px 12px",
        }}>
          <span style={{ fontSize:"16px" }}>🔥</span>
          <span style={{ fontSize:"15px",fontWeight:800,color:"#92400E" }}>{streak}</span>
          <span style={{ fontSize:"10px",fontWeight:600,color:"#B45309" }}>day streak</span>
        </div>
      </div>

      {/* Day-of-week header */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"3px",marginBottom:"4px" }}>
        {DOW.map(d => (
          <div key={d} style={{ textAlign:"center",fontSize:"9px",fontWeight:700,color:"var(--muted)",padding:"2px 0",letterSpacing:"0.02em" }}>
            {d.toUpperCase()}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:"3px" }}>
        {cells.map(({ key, dayNum, isCurrentMonth, studied, isToday, isFuture }) => {
          let bg      = "var(--surface)"
          let color   = isCurrentMonth ? "var(--muted)" : "#D1D5DB"
          let border  = "0.5px solid var(--border)"
          let weight  = 400

          if (!isFuture && studied && isCurrentMonth) {
            bg     = "var(--indigo)"
            color  = "#fff"
            weight = 700
            border = "none"
          } else if (!isFuture && !studied && isCurrentMonth) {
            bg    = "#FEF2F2"
            color = "#FCA5A5"
          }
          if (isToday) {
            border = "2px solid var(--indigo)"
            weight = 700
            color  = studied ? "#fff" : "var(--indigo)"
          }

          return (
            <div
              key={key}
              title={`${key}${isCurrentMonth ? (studied ? " ✅ Studied" : " ❌ Missed") : ""}`}
              style={{
                aspectRatio:    "1",
                borderRadius:   "7px",
                display:        "flex",
                alignItems:     "center",
                justifyContent: "center",
                background:     isFuture || !isCurrentMonth ? "var(--surface)" : bg,
                border,
                cursor:         "default",
                transition:     "transform 0.1s",
                opacity:        !isCurrentMonth ? 0.35 : 1,
              }}
            >
              <span style={{
                fontSize:   "11px",
                fontWeight: weight,
                color:      isFuture || !isCurrentMonth ? "var(--muted)" : color,
                lineHeight: 1,
              }}>
                {dayNum}
              </span>
            </div>
          )
        })}
      </div>

      {/* Legend */}
      <div style={{ display:"flex",alignItems:"center",gap:"14px",marginTop:"12px",justifyContent:"flex-end" }}>
        <div style={{ display:"flex",alignItems:"center",gap:"4px" }}>
          <div style={{ width:"10px",height:"10px",borderRadius:"3px",background:"var(--indigo)" }}/>
          <span style={{ fontSize:"10px",color:"var(--muted)" }}>Studied</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:"4px" }}>
          <div style={{ width:"10px",height:"10px",borderRadius:"3px",background:"#FEF2F2",border:"0.5px solid #FCA5A5" }}/>
          <span style={{ fontSize:"10px",color:"var(--muted)" }}>Missed</span>
        </div>
        <div style={{ display:"flex",alignItems:"center",gap:"4px" }}>
          <div style={{ width:"10px",height:"10px",borderRadius:"3px",background:"var(--surface)",border:"2px solid var(--indigo)" }}/>
          <span style={{ fontSize:"10px",color:"var(--muted)" }}>Today</span>
        </div>
      </div>
    </div>
  )
}