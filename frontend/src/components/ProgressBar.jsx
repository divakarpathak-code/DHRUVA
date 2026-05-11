// ProgressBar.jsx
// A clean, minimal progress bar using the Dhruva design system.
// Props:
//   progress  — number 0-100
//   label     — optional string (default: "Overall Progress")
//   color     — optional CSS color (default: var(--indigo))

export default function ProgressBar({
  progress = 0,
  label = "Overall Progress",
  color = "var(--indigo)",
}) {
  const pct = Math.min(100, Math.max(0, Math.round(progress)))

  return (
    <div className="prog-wrapper">
      <div className="prog-header-row">
        <span className="prog-title">{label}</span>
        <span className="prog-pct">{pct}%</span>
      </div>
      <div className="prog-track-outer">
        <div
          className="prog-track-inner"
          style={{
            width: `${pct}%`,
            background: color,
          }}
        />
      </div>
    </div>
  )
}