'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'

const MILESTONES = [
  { days: 7,   icon: '🥉', name: 'Bronze Streak',  reward: '+100 XP',  desc: '7 consecutive days' },
  { days: 30,  icon: '🥈', name: 'Silver Streak',  reward: '+300 XP',  desc: '30 consecutive days' },
  { days: 100, icon: '🥇', name: 'Gold Streak',    reward: '+1000 XP', desc: '100 consecutive days' },
  { days: 365, icon: '💎', name: 'Diamond Legend', reward: '+5000 XP', desc: '365 consecutive days' },
]

export default function StreaksPage() {
  const [streaks, setStreaks] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/streaks').then(r => r.json()).then(({ streaks }) => { setStreaks(streaks); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="px-4 pt-4 space-y-3">
      <Skeleton className="h-40 rounded-2xl" /><Skeleton className="h-64 rounded-2xl" />
    </div>
  )

  const maxStreak = Math.max(...streaks.map(s => s.currentStreak), 0)
  const bestStreak = Math.max(...streaks.map(s => s.longestStreak), 0)

  return (
    <div className="pb-24">
      <div className="px-4 pt-4 pb-2">
        <h1 className="text-lg font-bold text-white">Streak Center</h1>
        <p className="text-xs text-white/40">Keep the fire alive 🔥</p>
      </div>

      {/* Big Flame */}
      <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-center py-5">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ repeat: Infinity, duration: 2 }} className="text-7xl">🔥</motion.div>
        <div className="text-5xl font-black text-amber-400 mt-1">{maxStreak}</div>
        <div className="text-sm text-white/40 mt-1">Combined Day Streak</div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-2 mx-4 mb-4">
        {[
          { label: 'Current', value: `${maxStreak}🔥`, color: 'text-amber-400' },
          { label: 'Best Ever', value: `${bestStreak}🏆`, color: 'text-yellow-300' },
          { label: 'This Month', value: `${Math.min(maxStreak, 15)}`, color: 'text-teal-400' },
          { label: 'Total Days', value: `${Math.max(...streaks.map(s => s.totalDays), 0)}`, color: 'text-violet-300' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}>
            <Card><div className="text-[10px] text-white/40 mb-1">{s.label}</div><div className={`text-xl font-bold ${s.color}`}>{s.value}</div></Card>
          </motion.div>
        ))}
      </div>

      {/* Per-user streaks */}
      {streaks.length > 0 && (
        <div className="mx-4 mb-4">
          <Card>
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Individual Streaks</p>
            {streaks.map((s: any, i: number) => (
              <div key={s.id} className={`flex items-center gap-3 ${i < streaks.length - 1 ? 'mb-3' : ''}`}>
                <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 ${i === 0 ? 'bg-gradient-to-br from-pink-500 to-violet-600' : 'bg-gradient-to-br from-teal-500 to-violet-600'}`}>
                  {s.user?.name?.split(' ').map((n: string) => n[0]).join('') ?? '?'}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-white/80">{s.user?.name?.split(' ')[0]}</span>
                    <span className="text-amber-400 font-bold">{s.currentStreak}🔥</span>
                  </div>
                  <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full"
                      style={{ width: `${Math.min(100, (s.currentStreak / 30) * 100)}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </Card>
        </div>
      )}

      {/* Milestones */}
      <div className="px-4 mb-2">
        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Milestones</p>
      </div>
      <div className="px-4 space-y-2">
        {MILESTONES.map((m, i) => {
          const unlocked = maxStreak >= m.days
          const pct = Math.min(100, Math.round((maxStreak / m.days) * 100))
          return (
            <motion.div key={m.days} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}>
              <Card className={unlocked ? 'border-violet-500/30 bg-violet-500/5' : 'opacity-60'}>
                <div className="flex items-center gap-3">
                  <div className={`text-2xl w-11 h-11 flex items-center justify-center rounded-full flex-shrink-0 ${unlocked ? 'bg-violet-500/15' : 'bg-white/5 grayscale'}`}>
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-semibold text-white/90">{m.name}</span>
                      {unlocked && <span className="text-[10px] text-emerald-400 font-bold">✓ UNLOCKED</span>}
                    </div>
                    <div className="text-xs text-white/40">{m.desc} · {m.reward}</div>
                    {!unlocked && (
                      <>
                        <div className="h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                        <div className="text-[10px] text-white/30 mt-1">{maxStreak}/{m.days} days · {pct}%</div>
                      </>
                    )}
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
