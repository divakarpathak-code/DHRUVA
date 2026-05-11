// utils/xpSystem.js — 5-tier level system for Dhruva
// Tiers: Rookie (1-5) → Scholar (6-10) → Expert (11-15) → Master (16-20) → Legend (21-30)
// XP required per level increases with each tier

// ── XP thresholds — cumulative XP needed to REACH that level ──────────────
// Tier 1 Rookie   (Lv 1–5):   100 XP per level  — easy start
// Tier 2 Scholar  (Lv 6–10):  250 XP per level  — moderate grind
// Tier 3 Expert   (Lv 11–15): 500 XP per level  — challenging
// Tier 4 Master   (Lv 16–20): 900 XP per level  — hard
// Tier 5 Legend   (Lv 21–30): 1500 XP per level — elite

function buildLevelTable() {
  const table = [{ level: 1, xpRequired: 0 }] // Lv 1 starts at 0 XP
  const tierXP = [
    { upTo: 5,  xpPer: 100  }, // Rookie
    { upTo: 10, xpPer: 250  }, // Scholar
    { upTo: 15, xpPer: 500  }, // Expert
    { upTo: 20, xpPer: 900  }, // Master
    { upTo: 30, xpPer: 1500 }, // Legend
  ]
  let cumulative = 0
  for (const { upTo, xpPer } of tierXP) {
    const startLevel = table[table.length - 1].level
    for (let lv = startLevel + 1; lv <= upTo; lv++) {
      cumulative += xpPer
      table.push({ level: lv, xpRequired: cumulative })
    }
  }
  return table // [{level:1,xpRequired:0},{level:2,xpRequired:100},...]
}

export const LEVEL_TABLE = buildLevelTable()
// LEVEL_TABLE[i].xpRequired = total XP needed to be at that level

// ── Tier metadata ──────────────────────────────────────────────────────────
const TIERS = [
  { name:"Rookie",  range:[1,5],   color:"#6B7280", emoji:"🌱", desc:"Just getting started!" },
  { name:"Scholar", range:[6,10],  color:"#3B82F6", emoji:"📘", desc:"Building the habit." },
  { name:"Expert",  range:[11,15], color:"#8B5CF6", emoji:"⚡", desc:"Serious about it." },
  { name:"Master",  range:[16,20], color:"#F59E0B", emoji:"🔥", desc:"Near the top." },
  { name:"Legend",  range:[21,30], color:"#EF4444", emoji:"👑", desc:"Elite grind." },
]

function getTierForLevel(level) {
  return TIERS.find(t => level >= t.range[0] && level <= t.range[1]) || TIERS[TIERS.length - 1]
}

// ── Core helpers ───────────────────────────────────────────────────────────
export function getLevelFromXP(xp) {
  let current = LEVEL_TABLE[0]
  for (const entry of LEVEL_TABLE) {
    if (xp >= entry.xpRequired) current = entry
    else break
  }
  const tier = getTierForLevel(current.level)
  return {
    level: current.level,
    title: tier.name,
    color: tier.color,
    emoji: tier.emoji,
    tierDesc: tier.desc,
  }
}

export function getNextLevel(xp) {
  const current = getLevelFromXP(xp)
  const next = LEVEL_TABLE.find(e => e.level === current.level + 1)
  if (!next) return null
  const tier = getTierForLevel(next.level)
  return { level: next.level, xpRequired: next.xpRequired, title: tier.name, emoji: tier.emoji, color: tier.color }
}

export function getXPProgress(xp) {
  const current     = getLevelFromXP(xp)
  const next        = getNextLevel(xp)
  const currentEntry = LEVEL_TABLE.find(e => e.level === current.level)
  if (!next) return { pct: 100, currentXP: xp, needed: 0 }
  const band    = next.xpRequired - currentEntry.xpRequired
  const into    = xp - currentEntry.xpRequired
  const pct     = Math.min(100, Math.round((into / band) * 100))
  const needed  = next.xpRequired - xp
  return { pct, currentXP: into, needed, band }
}

// ── XP rewards ────────────────────────────────────────────────────────────
export const XP_REWARDS = {
  TASK_COMPLETE: 50,
  STREAK_DAY:    30,
  STREAK_WEEK:   100,  // bonus on 7-day streak
  STREAK_MONTH:  500,  // bonus on 30-day streak
  PLAN_CREATED:  20,
  PROFILE_DONE:  10,
}

export function addXP(amount) {
  const current = parseInt(localStorage.getItem("xp") || "0")
  const updated = current + amount
  localStorage.setItem("xp", String(updated))
  return updated
}

export function getXP() {
  return parseInt(localStorage.getItem("xp") || "0")
}

// ── Level-up detection ─────────────────────────────────────────────────────
// Returns the new level if XP addition caused a level-up, else null
export function checkLevelUp(oldXP, newXP) {
  const oldLevel = getLevelFromXP(oldXP).level
  const newLevel = getLevelFromXP(newXP).level
  if (newLevel > oldLevel) return newLevel
  return null
}

// ── Tier unlock check — did user cross a tier boundary? ───────────────────
export function checkTierUnlock(oldXP, newXP) {
  const oldLevel = getLevelFromXP(oldXP).level
  const newLevel = getLevelFromXP(newXP).level
  const oldTier  = getTierForLevel(oldLevel).name
  const newTier  = getTierForLevel(newLevel).name
  if (newTier !== oldTier) return { tier: newTier, ...TIERS.find(t => t.name === newTier) }
  return null
}

// ── Level Prizes ──────────────────────────────────────────────────────────
export const LEVEL_PRIZES = {
  5:  { title:"Rookie Graduate 🌱",  desc:"You've completed the Rookie tier! Keep going." },
  10: { title:"Scholar Badge 📘",    desc:"Scholar tier cleared. You're building real habits." },
  15: { title:"Expert Access ⚡",    desc:"Expert tier unlocked. Serious grind achieved." },
  20: { title:"Master Status 🔥",    desc:"Master tier! You're in the top % of users." },
  25: { title:"Legend Recognition 👑", desc:"25 levels in. You're a Dhruva Legend." },
  30: { title:"Hall of Fame 🏆",     desc:"MAX LEVEL. You've conquered Dhruva completely." },
}