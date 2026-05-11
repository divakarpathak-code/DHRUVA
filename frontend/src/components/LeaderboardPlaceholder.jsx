// LeaderboardPlaceholder.jsx — Streak Leaderboard (Coming Soon)

const MOCK_ENTRIES = [
  { rank: 1, name: "Aryan S.", streak: 42, exam: "JEE" },
  { rank: 2, name: "Priya M.", streak: 37, exam: "NEET" },
  { rank: 3, name: "Rohit K.", streak: 31, exam: "Boards" },
  { rank: 4, name: "Sneha P.", streak: 28, exam: "JEE" },
  { rank: 5, name: "Dev A.",   streak: 19, exam: "UPSC" },
]

const MEDALS = ["🥇", "🥈", "🥉"]

export default function LeaderboardPlaceholder({ currentStreak = 0 }) {
  return (
    <div style={{
      background: "var(--white)",
      border: "0.5px solid var(--border)",
      borderRadius: "var(--r-lg)",
      overflow: "hidden",
      marginBottom: "16px",
      position: "relative",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
        padding: "14px 16px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span style={{ fontSize: "18px" }}>🏆</span>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff" }}>Streak Leaderboard</div>
            <div style={{ fontSize: "10px", color: "rgba(255,255,255,0.65)" }}>Top studiers this week</div>
          </div>
        </div>
        <span style={{
          background: "rgba(255,255,255,0.15)",
          border: "0.5px solid rgba(255,255,255,0.3)",
          borderRadius: "100px",
          padding: "3px 10px",
          fontSize: "10px", fontWeight: 600, color: "#fff",
        }}>
          🔒 Login required
        </span>
      </div>

      {/* Mock leaderboard (blurred) */}
      <div style={{ position: "relative" }}>
        <div style={{ filter: "blur(3px)", pointerEvents: "none", userSelect: "none" }}>
          {MOCK_ENTRIES.map((entry, i) => (
            <div key={i} style={{
              display: "flex", alignItems: "center",
              padding: "11px 16px",
              borderBottom: i < MOCK_ENTRIES.length - 1 ? "0.5px solid var(--border-soft)" : "none",
              gap: "10px",
            }}>
              <div style={{
                width: "26px", textAlign: "center",
                fontSize: i < 3 ? "16px" : "12px",
                fontWeight: 700, color: "var(--muted)",
              }}>
                {i < 3 ? MEDALS[i] : `#${entry.rank}`}
              </div>
              <div style={{
                width: "32px", height: "32px", borderRadius: "50%",
                background: "var(--indigo-light)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "13px", fontWeight: 700, color: "var(--indigo-dark)",
              }}>
                {entry.name[0]}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--ink)" }}>{entry.name}</div>
                <div style={{ fontSize: "10px", color: "var(--muted)" }}>{entry.exam}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <span style={{ fontSize: "14px" }}>🔥</span>
                <span style={{ fontSize: "14px", fontWeight: 700, color: "var(--ink)" }}>{entry.streak}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Overlay CTA */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          background: "rgba(255,255,255,0.7)",
          backdropFilter: "blur(1px)",
          gap: "8px",
        }}>
          <div style={{ fontSize: "28px" }}>🔒</div>
          <div style={{ fontSize: "13px", fontWeight: 700, color: "var(--ink)" }}>Coming Soon</div>
          <div style={{ fontSize: "11px", color: "var(--muted)", textAlign: "center", maxWidth: "200px" }}>
            Login with Google to join the leaderboard and see where you rank!
          </div>
          <div style={{
            marginTop: "4px",
            background: "var(--indigo)",
            color: "#fff",
            borderRadius: "var(--r-pill)",
            padding: "7px 18px",
            fontSize: "12px", fontWeight: 600,
          }}>
            Google Login · Coming Soon
          </div>
        </div>
      </div>

      {/* Your streak teaser */}
      <div style={{
        padding: "12px 16px",
        background: "var(--surface)",
        borderTop: "0.5px solid var(--border)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <span style={{ fontSize: "12px", color: "var(--muted)" }}>Your current streak</span>
        <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
          <span style={{ fontSize: "16px" }}>🔥</span>
          <span style={{ fontSize: "15px", fontWeight: 700, color: "var(--indigo)" }}>{currentStreak}</span>
          <span style={{ fontSize: "11px", color: "var(--muted)" }}>days</span>
        </div>
      </div>
    </div>
  )
}