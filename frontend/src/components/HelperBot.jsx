// HelperBot.jsx — Diva AI companion chat (general study buddy)
// open + setOpen are controlled by Home.jsx — this keeps the bot Home-only
// and hides the floating avatar when the chat panel is open
// src/components/HelperBot.jsx

import { useRef, useEffect, useState } from "react"
import { sendMessage } from "../api"
import DivaAvatar      from "./DivaAvatar"

function CloseIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>
}
function SendIcon() {
  return <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 2 11 13M22 2 15 22l-4-9-9-4 20-7z"/></svg>
}

function BotMessage({ text }) {
  return (
    <span>
      {text.split("\n").map((line, li, arr) => (
        <span key={li}>
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
            part.startsWith("**") && part.endsWith("**")
              ? <strong key={i}>{part.slice(2, -2)}</strong>
              : part
          )}
          {li < arr.length - 1 && <br/>}
        </span>
      ))}
    </span>
  )
}

const QUICK_PROMPTS = [
  "Explain a concept 📖",
  "Give me a solved example 🔢",
  "What are common mistakes? ⚠️",
  "Help me make a revision plan 📅",
]

const INITIAL_MESSAGE = {
  role:    "assistant",
  content: "Hey! 🐘 I'm Diva, your AI study buddy!\nAsk me anything — concepts, formulas, solved examples, revision tips, or exam strategy for any subject!",
}

export default function HelperBot({ open, setOpen }) {
  const [input,    setInput]    = useState("")
  const [messages, setMessages] = useState([INITIAL_MESSAGE])
  const [loading,  setLoading]  = useState(false)
  const [divaPose, setDivaPose] = useState("idle")

  const bottomRef = useRef(null)
  const inputRef  = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, loading, open])

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 150)
      setDivaPose("wave")
      setTimeout(() => setDivaPose("idle"), 2000)
    }
  }, [open])

  async function handleSend(text) {
    const msg = (text ?? input).trim()
    if (!msg || loading) return

    const userMsg = { role: "user", content: msg }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput("")
    setLoading(true)
    setDivaPose("think")

    try {
      const res = await sendMessage({ message: msg, history: updated.slice(-10) })
      if (res.status === "error") throw new Error(res.reply)
      setMessages(prev => [...prev, { role: "assistant", content: res.reply || "Hmm, try again!" }])
      setDivaPose("idle")
    } catch {
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "⚠️ Couldn't reach the backend. Is it running on port 8000?",
      }])
      setDivaPose("idle")
    }
    setLoading(false)
  }

  function handleKey(e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  function clearChat() {
    setMessages([INITIAL_MESSAGE])
    setDivaPose("wave")
    setTimeout(() => setDivaPose("idle"), 2000)
  }

  return (
    <>
      {/* ── Chat panel ── */}
      {open && (
        <div style={{
          position:      "fixed",
          bottom:        "86px",
          left:          "50%",
          transform:     "translateX(-50%)",
          width:         "min(440px, calc(100vw - 24px))",
          height:        "min(560px, calc(100dvh - 140px))",
          background:    "var(--white)",
          border:        "0.5px solid var(--border)",
          borderRadius:  "20px",
          boxShadow:     "0 24px 64px rgba(0,0,0,0.14), 0 8px 24px rgba(79,70,229,0.1)",
          display:       "flex",
          flexDirection: "column",
          overflow:      "hidden",
          zIndex:        200,
          animation:     "divaSlideUp 0.28s cubic-bezier(0.34,1.4,0.64,1) both",
        }}>

          {/* Header */}
          <div style={{
            display:        "flex",
            alignItems:     "center",
            justifyContent: "space-between",
            padding:        "10px 14px",
            background:     "linear-gradient(135deg, #4F46E5, #7C3AED)",
            flexShrink:     0,
          }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ width:"40px", height:"40px", background:"rgba(255,255,255,0.12)", borderRadius:"50%", display:"flex", alignItems:"center", justifyContent:"center", overflow:"visible" }}>
                <DivaAvatar pose={divaPose} size={46} animate={divaPose !== "idle"}/>
              </div>
              <div>
                <div style={{ fontSize:"14px", fontWeight:700, color:"#fff" }}>Diva</div>
                <div style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                  <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#4ADE80" }}/>
                  <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.7)" }}>
                    {loading ? "Thinking… 🤔" : "Your AI study buddy"}
                  </span>
                </div>
              </div>
            </div>
            <div style={{ display:"flex", gap:"6px" }}>
              {messages.length > 1 && (
                <button onClick={clearChat} style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:"8px", padding:"5px 10px", cursor:"pointer", color:"rgba(255,255,255,0.85)", fontSize:"11px", fontFamily:"var(--font-body)" }}>
                  Clear
                </button>
              )}
              <button onClick={() => setOpen(false)} style={{ background:"rgba(255,255,255,0.12)", border:"none", borderRadius:"8px", padding:"6px", cursor:"pointer", color:"#fff", display:"flex" }}>
                <CloseIcon/>
              </button>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex:1, overflowY:"auto", padding:"14px 12px 6px", display:"flex", flexDirection:"column", gap:"10px", scrollbarWidth:"thin" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display:"flex", justifyContent:msg.role==="user"?"flex-end":"flex-start", gap:"7px", alignItems:"flex-end" }}>
                {msg.role === "assistant" && (
                  <div style={{ width:"26px", height:"26px", flexShrink:0, marginBottom:"2px" }}>
                    <DivaAvatar pose="idle" size={28} animate={false}/>
                  </div>
                )}
                <div style={{
                  maxWidth:     "78%",
                  padding:      "9px 12px",
                  borderRadius: msg.role==="user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                  background:   msg.role==="user" ? "var(--indigo)" : "var(--surface)",
                  color:        msg.role==="user" ? "#fff" : "var(--slate)",
                  fontSize:     "13px",
                  lineHeight:   1.65,
                  border:       msg.role==="assistant" ? "0.5px solid var(--border)" : "none",
                  whiteSpace:   "pre-wrap",
                  wordBreak:    "break-word",
                }}>
                  {msg.role==="assistant" ? <BotMessage text={msg.content}/> : msg.content}
                </div>
              </div>
            ))}

            {/* Thinking indicator */}
            {loading && (
              <div style={{ display:"flex", gap:"7px", alignItems:"flex-end" }}>
                <div style={{ width:"26px", height:"26px", flexShrink:0 }}>
                  <DivaAvatar pose="think" size={28} animate/>
                </div>
                <div style={{ padding:"10px 14px", background:"var(--surface)", borderRadius:"16px 16px 16px 4px", border:"0.5px solid var(--border)", display:"flex", gap:"4px", alignItems:"center" }}>
                  {[0,1,2].map(i => (
                    <div key={i} style={{ width:"6px", height:"6px", borderRadius:"50%", background:"var(--indigo)", animation:`divaBounce 1s ease-in-out ${i*0.15}s infinite` }}/>
                  ))}
                </div>
              </div>
            )}
            <div ref={bottomRef}/>
          </div>

          {/* Quick prompts — shown only on first open */}
          {messages.length <= 1 && (
            <div style={{ padding:"0 12px 8px", display:"flex", gap:"6px", flexWrap:"wrap", flexShrink:0 }}>
              {QUICK_PROMPTS.map(p => (
                <button key={p} onClick={() => handleSend(p)} style={{
                  fontFamily:"var(--font-body)", fontSize:"11px", fontWeight:500,
                  padding:"5px 10px", borderRadius:"100px",
                  border:"0.5px solid var(--border)", background:"var(--surface)",
                  color:"var(--slate)", cursor:"pointer", transition:"all 0.15s",
                }}
                onMouseOver={e => { e.currentTarget.style.borderColor="var(--indigo)"; e.currentTarget.style.color="var(--indigo)" }}
                onMouseOut={e  => { e.currentTarget.style.borderColor="var(--border)";  e.currentTarget.style.color="var(--slate)" }}
                >
                  {p}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding:"10px 12px 12px", borderTop:"0.5px solid var(--border)", display:"flex", gap:"8px", alignItems:"flex-end", flexShrink:0 }}>
            <textarea
              ref={inputRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              placeholder="Ask Diva anything… 🐘"
              rows={1}
              style={{
                flex:1, fontFamily:"var(--font-body)", fontSize:"13px",
                padding:"9px 12px", border:"0.5px solid var(--border)",
                borderRadius:"var(--r-md)", resize:"none", outline:"none",
                background:"var(--surface)", color:"var(--ink)",
                lineHeight:1.5, maxHeight:"80px", overflowY:"auto",
                transition:"border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={e => { e.target.style.borderColor="var(--indigo)"; e.target.style.boxShadow="0 0 0 3px rgba(79,70,229,0.12)" }}
              onBlur={e  => { e.target.style.borderColor="var(--border)";  e.target.style.boxShadow="none" }}
            />
            <button
              onClick={() => handleSend()}
              disabled={!input.trim() || loading}
              style={{
                width:"36px", height:"36px", borderRadius:"var(--r-md)",
                background:(!input.trim()||loading) ? "var(--border)" : "var(--indigo)",
                border:"none", cursor:(!input.trim()||loading)?"not-allowed":"pointer",
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", flexShrink:0, transition:"background 0.15s",
              }}
            >
              <SendIcon/>
            </button>
          </div>
        </div>
      )}

      {/* ── Floating Diva button — disappears when chat is open ── */}
      {!open && (
        <div
          onClick={() => setOpen(true)}
          title="Ask Diva"
          style={{
            position:   "fixed",
            bottom:     "86px",
            right:      "max(12px, calc(50vw - 222px))",
            zIndex:     201,
            cursor:     "pointer",
            filter:     "drop-shadow(0 4px 12px rgba(79,70,229,0.4))",
            transition: "all 0.25s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <DivaAvatar pose="wave" size={54} animate={true}/>

          {/* Amber ping dot for first-time users */}
          {messages.length === 1 && (
            <div style={{
              position:     "absolute",
              top:          "-4px",
              right:        "-4px",
              width:        "14px",
              height:       "14px",
              borderRadius: "50%",
              background:   "#F59E0B",
              border:       "2px solid white",
              animation:    "divaPing 1.5s ease-in-out infinite",
              pointerEvents:"none",
            }}/>
          )}
        </div>
      )}

      <style>{`
        @keyframes divaBounce  { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        @keyframes divaSlideUp { from{opacity:0;transform:translateX(-50%) translateY(16px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes divaPing    { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.5);opacity:0.5} }
      `}</style>
    </>
  )
}