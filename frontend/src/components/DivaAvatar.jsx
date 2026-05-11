// DivaAvatar.jsx — Diva the elephant AI companion for Dhruva
// pose: "wave" | "write" | "think" | "cheer" | "idle"
// size: number in px

export default function DivaAvatar({ pose = "idle", size = 80, animate = true }) {
  return (
    <div style={{
      width: size, height: size,
      display: "inline-block",
      position: "relative",
      animation: animate ? "divaFloat 3s ease-in-out infinite" : "none",
    }}>
      <svg width={size} height={size} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" style={{ overflow: "visible" }}>

        {/* Body */}
        <ellipse cx="50" cy="63" rx="25" ry="21" fill="#7C6AC4"/>
        {/* Belly */}
        <ellipse cx="50" cy="68" rx="15" ry="12" fill="#A99FD8"/>

        {/* Head */}
        <circle cx="50" cy="40" r="22" fill="#7C6AC4"/>

        {/* Cheeks blush */}
        <circle cx="37" cy="45" r="6" fill="#F9A8D4" opacity="0.45"/>
        <circle cx="63" cy="45" r="6" fill="#F9A8D4" opacity="0.45"/>

        {/* Eyes */}
        <circle cx="42" cy="36" r="4.5" fill="white"/>
        <circle cx="58" cy="36" r="4.5" fill="white"/>
        <circle cx="43" cy="37" r="2.5" fill="#1E1B4B"/>
        <circle cx="59" cy="37" r="2.5" fill="#1E1B4B"/>
        <circle cx="44" cy="36" r="0.9" fill="white"/>
        <circle cx="60" cy="36" r="0.9" fill="white"/>

        {/* Smile */}
        <path d="M43 47 Q50 54 57 47" stroke="#1E1B4B" strokeWidth="1.8" fill="none" strokeLinecap="round"/>

        {/* Trunk */}
        <path
          d={pose === "cheer"
            ? "M50 56 Q46 65 44 72 Q42 79 45 83"
            : "M50 56 Q46 66 44 73 Q42 79 45 83"}
          stroke="#7C6AC4" strokeWidth="7" fill="none" strokeLinecap="round"
        />
        <circle cx="45" cy="83" r="4" fill="#6D5FC4"/>

        {/* Ears */}
        <ellipse cx="27" cy="38" rx="10" ry="14" fill="#6D5FC4"/>
        <ellipse cx="27" cy="38" rx="6" ry="9" fill="#A99FD8"/>
        <ellipse cx="73" cy="38" rx="10" ry="14" fill="#6D5FC4"/>
        <ellipse cx="73" cy="38" rx="6" ry="9" fill="#A99FD8"/>

        {/* Graduation cap */}
        <rect x="33" y="19" width="34" height="5" rx="1.5" fill="#1E1B4B"/>
        <polygon points="50,9 70,22 30,22" fill="#1E1B4B"/>
        {/* Tassel */}
        <line x1="70" y1="22" x2="74" y2="31" stroke="#FBBF24" strokeWidth="1.8"/>
        <circle cx="74" cy="33" r="2.5" fill="#FBBF24"/>

        {/* ── POSE ARMS + ACCESSORIES ── */}

        {/* IDLE */}
        {pose === "idle" && <>
          <path d="M28 64 Q21 70 23 77" stroke="#7C6AC4" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
          <path d="M72 64 Q79 70 77 77" stroke="#7C6AC4" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
        </>}

        {/* WAVE — right arm raised and waving */}
        {pose === "wave" && <>
          <path d="M28 64 Q21 70 23 77" stroke="#7C6AC4" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
          <path
            d="M72 62 Q82 50 84 42 Q86 37 81 36 Q76 35 75 40 Q73 46 70 55"
            stroke="#7C6AC4" strokeWidth="6.5" fill="none" strokeLinecap="round"
            style={{ transformOrigin:"72px 62px", animation:"divaWave 0.8s ease-in-out infinite" }}
          />
          <circle cx="82" cy="38" r="5" fill="#7C6AC4"/>
        </>}

        {/* WRITE — holding notebook in right, pen in left */}
        {pose === "write" && <>
          {/* Right arm → notebook */}
          <path d="M72 64 Q82 61 84 68 Q83 76 73 75" stroke="#7C6AC4" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
          {/* Notebook */}
          <rect x="75" y="61" width="19" height="24" rx="2" fill="white" stroke="#D1D5DB" strokeWidth="0.8"/>
          <rect x="75" y="61" width="4.5" height="24" rx="1.5" fill="#6366F1"/>
          <line x1="82" y1="68" x2="92" y2="68" stroke="#D1D5DB" strokeWidth="1"/>
          <line x1="82" y1="72" x2="92" y2="72" stroke="#D1D5DB" strokeWidth="1"/>
          <line x1="82" y1="76" x2="88" y2="76" stroke="#D1D5DB" strokeWidth="1"/>
          {/* Left arm → pen */}
          <path d="M28 64 Q17 61 14 68" stroke="#7C6AC4" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
          <rect x="5" y="62" width="13" height="4" rx="2" fill="#FBBF24" transform="rotate(-25 11 64)"/>
          <polygon points="5,64 2,68 7,68" fill="#374151" transform="rotate(-25 5 66)"/>
        </>}

        {/* THINK — arm on chin, thought bubbles */}
        {pose === "think" && <>
          <path d="M72 64 Q79 70 77 77" stroke="#7C6AC4" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
          <path d="M28 64 Q20 57 28 50 Q36 44 44 48" stroke="#7C6AC4" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
          <circle cx="22" cy="22" r="3.5" fill="#A99FD8" opacity="0.55"/>
          <circle cx="29" cy="14" r="4.5" fill="#A99FD8" opacity="0.65"/>
          <circle cx="38" cy="7"  r="6.5" fill="#A99FD8" opacity="0.75"/>
          <text x="34" y="11" fontSize="8" fill="#4F46E5" fontWeight="700">?</text>
        </>}

        {/* CHEER — both arms raised high */}
        {pose === "cheer" && <>
          <path d="M28 65 Q17 52 15 39 Q14 33 20 33 Q26 33 26 39 Q27 46 30 56"
            stroke="#7C6AC4" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
          <circle cx="15" cy="37" r="5.5" fill="#7C6AC4"/>
          <path d="M72 65 Q83 52 85 39 Q86 33 80 33 Q74 33 74 39 Q73 46 70 56"
            stroke="#7C6AC4" strokeWidth="6.5" fill="none" strokeLinecap="round"/>
          <circle cx="85" cy="37" r="5.5" fill="#7C6AC4"/>
          <text x="5"  y="26" fontSize="13" style={{ animation:"divaFloat 1s ease-in-out infinite" }}>⭐</text>
          <text x="80" y="26" fontSize="13" style={{ animation:"divaFloat 1.3s ease-in-out infinite" }}>🎉</text>
        </>}

      </svg>

      <style>{`
        @keyframes divaFloat { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        @keyframes divaWave  { 0%,100%{transform:rotate(0deg)} 30%{transform:rotate(-22deg)} 70%{transform:rotate(18deg)} }
      `}</style>
    </div>
  )
}