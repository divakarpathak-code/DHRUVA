// StreakPopup.jsx — Duolingo-style streak celebration popup
// Props: streak (number), onClose (fn)
import { useEffect, useState } from "react"

const MILESTONES = {
  1:   { emoji:"🔥", title:"First Flame!",        sub:"You studied today. The journey starts now!" },
  2:   { emoji:"🔥", title:"2 Days Strong!",       sub:"Two in a row. The habit is forming." },
  3:   { emoji:"🔥", title:"3-Day Streak!",        sub:"Three days! You're on a roll." },
  5:   { emoji:"🌟", title:"5-Day Streak!",        sub:"Five days straight. Rookie grind unlocked!" },
  7:   { emoji:"⚡", title:"One Week Streak!",     sub:"A full week! You're unstoppable." },
  10:  { emoji:"💪", title:"10-Day Streak!",       sub:"Double digits. Serious dedication." },
  14:  { emoji:"🏆", title:"2-Week Warrior!",      sub:"14 days. You're a study machine." },
  21:  { emoji:"👑", title:"21-Day Habit!",        sub:"Science says 21 days = a habit. You made it." },
  30:  { emoji:"🌙", title:"30-Day Legend!",       sub:"One month of non-stop grind. Legendary." },
  50:  { emoji:"🚀", title:"50-Day Elite!",        sub:"50 days. You're in a different league." },
  100: { emoji:"💎", title:"100-Day God Mode!",    sub:"100 days. Absolute legend status." },
}

function getMsg(streak) {
  const keys = Object.keys(MILESTONES).map(Number).sort((a,b)=>b-a)
  const hit  = keys.find(k => streak >= k)
  return hit ? MILESTONES[hit] : { emoji:"🔥", title:`${streak}-Day Streak!`, sub:"Keep the momentum going!" }
}

const COLORS = ["#4F46E5","#F59E0B","#10B981","#EF4444","#8B5CF6","#EC4899","#06B6D4"]

export default function StreakPopup({ streak, onClose }) {
  const [visible, setVisible] = useState(false)
  const [leaving, setLeaving] = useState(false)
  const msg = getMsg(streak)

  const particles = Array.from({ length: 22 }, (_, i) => ({
    left:       `${5 + Math.random() * 90}%`,
    top:        `${-10 + Math.random() * 50}%`,
    width:      `${4 + Math.random() * 7}px`,
    height:     `${4 + Math.random() * 7}px`,
    background: COLORS[i % COLORS.length],
    borderRadius: Math.random() > 0.5 ? "50%" : "2px",
    animation:  `cfFall ${0.7 + Math.random() * 1.3}s ease-out ${Math.random() * 0.5}s both`,
    transform:  `rotate(${Math.random()*360}deg)`,
  }))

  useEffect(() => { const t = setTimeout(() => setVisible(true), 30); return () => clearTimeout(t) }, [])

  useEffect(() => {
    const t = setTimeout(close, 4200)
    return () => clearTimeout(t)
  }, [])

  function close() {
    setLeaving(true)
    setTimeout(onClose, 300)
  }

  const show = visible && !leaving

  return (
    <>
      {/* Backdrop */}
      <div onClick={close} style={{ position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:900,opacity:show?1:0,transition:"opacity 0.3s ease" }}/>

      {/* Card */}
      <div style={{
        position:"fixed", left:"50%", bottom:"50%",
        transform:`translateX(-50%) translateY(${show?"50%":"58%"})`,
        opacity:show?1:0,
        transition:"all 0.34s cubic-bezier(0.34,1.4,0.64,1)",
        width:"min(340px,calc(100vw - 32px))",
        background:"var(--white)",
        borderRadius:"24px",
        padding:"28px 24px 20px",
        textAlign:"center",
        zIndex:901,
        boxShadow:"0 32px 80px rgba(0,0,0,0.22),0 8px 24px rgba(79,70,229,0.18)",
        overflow:"hidden",
      }}>
        {/* Confetti */}
        <div style={{ position:"absolute",inset:0,pointerEvents:"none",overflow:"hidden" }}>
          {particles.map((p,i) => <div key={i} style={{ position:"absolute",...p }}/>)}
        </div>

        {/* Glow ring + emoji */}
        <div style={{
          width:"88px",height:"88px",borderRadius:"50%",
          background:"linear-gradient(135deg,#4F46E5,#7C3AED)",
          display:"flex",alignItems:"center",justifyContent:"center",
          margin:"0 auto 14px",
          boxShadow:"0 0 0 8px rgba(79,70,229,0.12),0 8px 32px rgba(79,70,229,0.4)",
          animation:"ringPop 0.55s cubic-bezier(0.34,1.56,0.64,1) 0.05s both",
        }}>
          <div>
            <div style={{ fontSize:"26px",lineHeight:1 }}>{msg.emoji}</div>
            <div style={{ fontSize:"14px",fontWeight:900,color:"#fff",lineHeight:1,marginTop:"1px" }}>{streak}</div>
          </div>
        </div>

        {/* Flame row — up to 7 flames */}
        <div style={{ display:"flex",justifyContent:"center",gap:"2px",marginBottom:"10px" }}>
          {Array.from({ length: Math.min(streak, 7) }).map((_, i) => (
            <span key={i} style={{ fontSize:"15px",animation:`flamePop 0.35s ease ${i*0.055}s both`,display:"inline-block" }}>🔥</span>
          ))}
        </div>

        <div style={{ fontSize:"21px",fontWeight:800,color:"var(--ink)",lineHeight:1.15,marginBottom:"6px" }}>{msg.title}</div>
        <div style={{ fontSize:"13px",color:"var(--muted)",lineHeight:1.55,marginBottom:"18px" }}>{msg.sub}</div>

        {/* XP pill */}
        <div style={{
          display:"inline-flex",alignItems:"center",gap:"5px",
          background:"linear-gradient(135deg,#FEF3C7,#FDE68A)",
          border:"1px solid #F59E0B",borderRadius:"100px",
          padding:"5px 16px",marginBottom:"18px",
          fontSize:"12px",fontWeight:700,color:"#92400E",
        }}>
          ⭐ +30 XP earned
        </div>

        <button onClick={close} style={{
          width:"100%",padding:"13px",
          background:"linear-gradient(135deg,#4F46E5,#7C3AED)",
          color:"#fff",border:"none",borderRadius:"var(--r-md)",
          fontFamily:"var(--font-body)",fontSize:"14px",fontWeight:700,cursor:"pointer",
        }}>
          Keep it up! 💪
        </button>

        {/* Auto-dismiss progress bar */}
        <div style={{ height:"3px",background:"var(--surface)",borderRadius:"2px",marginTop:"12px",overflow:"hidden" }}>
          <div style={{ height:"100%",background:"var(--indigo)",borderRadius:"2px",animation:"dismissBar 4.2s linear both" }}/>
        </div>
      </div>

      <style>{`
        @keyframes cfFall    { from{opacity:1;transform:translateY(-10px) rotate(0deg)} to{opacity:0;transform:translateY(100px) rotate(420deg)} }
        @keyframes ringPop   { from{transform:scale(0) rotate(-20deg)} to{transform:scale(1) rotate(0)} }
        @keyframes flamePop  { from{transform:scale(0) translateY(8px);opacity:0} to{transform:scale(1) translateY(0);opacity:1} }
        @keyframes dismissBar{ from{width:100%} to{width:0%} }
      `}</style>
    </>
  )
}