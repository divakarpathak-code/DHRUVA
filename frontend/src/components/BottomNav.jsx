// BottomNav.jsx — profile icon shows name initial
import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

function IconHome({ active }) {
  const c = active ? "var(--indigo)" : "var(--muted)"
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><path d="M9 21V12h6v9"/></svg>
}
function IconTasks({ active }) {
  const c = active ? "var(--indigo)" : "var(--muted)"
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M9 12l2 2 4-4M9 7h6M9 17h4"/></svg>
}
function IconAnalysis({ active }) {
  const c = active ? "var(--indigo)" : "var(--muted)"
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={c} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20h18M5 20V10l4-4 4 4 4-6" strokeLinejoin="round"/></svg>
}

export default function BottomNav() {
  const { pathname } = useLocation()
  const [profile, setProfile] = useState(null)

  useEffect(() => {
    const p = localStorage.getItem("profile"); if (p) setProfile(JSON.parse(p))
    const h = () => { const pp = localStorage.getItem("profile"); if (pp) setProfile(JSON.parse(pp)) }
    window.addEventListener("storage", h)
    return () => window.removeEventListener("storage", h)
  }, [])

  const initial   = profile?.name?.[0]?.toUpperCase() || "?"
  const isProfile = pathname === "/profile"

  return (
    <nav className="bottom-nav">
      {[
        { to:"/",         label:"Home",     Icon:IconHome     },
        { to:"/tasks",    label:"Tasks",    Icon:IconTasks    },
        { to:"/analysis", label:"Analysis", Icon:IconAnalysis },
      ].map(({ to, label, Icon }) => {
        const active = pathname === to
        return (
          <Link key={to} to={to} className={`nav-btn${active ? " active" : ""}`}>
            {active && <span className="nav-active-dot"/>}
            <Icon active={active}/>
            <span className="nav-btn-label">{label}</span>
          </Link>
        )
      })}

      <Link to="/profile" className={`nav-btn${isProfile ? " active" : ""}`}>
        {isProfile && <span className="nav-active-dot"/>}
        <div style={{
          width:"24px", height:"24px", borderRadius:"50%",
          background:   isProfile ? "var(--indigo)" : "var(--surface)",
          border:       `1.5px solid ${isProfile ? "var(--indigo)" : "var(--border)"}`,
          display:      "flex", alignItems:"center", justifyContent:"center",
          fontSize:     "11px", fontWeight:700,
          color:        isProfile ? "#fff" : "var(--muted)",
          transition:   "all 0.15s",
        }}>
          {initial}
        </div>
        <span className="nav-btn-label">Profile</span>
      </Link>
    </nav>
  )
}