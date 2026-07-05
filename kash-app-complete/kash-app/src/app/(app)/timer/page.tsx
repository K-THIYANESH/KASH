'use client'
import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '@/store/useAppStore'
import { formatTimer } from '@/lib/utils'
import Card from '@/components/ui/Card'
import toast from 'react-hot-toast'

const MODES = [
  { label: '25/5', mode: 'POMODORO_25', work: 25 * 60, break_: 5 * 60 },
  { label: '50/10', mode: 'POMODORO_50', work: 50 * 60, break_: 10 * 60 },
  { label: '90/20', mode: 'POMODORO_90', work: 90 * 60, break_: 20 * 60 },
  { label: 'Custom', mode: 'CUSTOM', work: 30 * 60, break_: 5 * 60 },
]

export default function TimerPage() {
  const { timerSeconds, timerActive, timerMode, timerWorkSeconds, setTimerSeconds, setTimerActive, setTimerMode } = useAppStore()
  const [phase, setPhase] = useState<'work' | 'break'>('work')
  const [sessions, setSessions] = useState<any[]>([])
  const [totalMinutes, setTotalMinutes] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const currentMode = MODES.find(m => m.label === timerMode) ?? MODES[0]

  useEffect(() => {
    fetch('/api/timer').then(r => r.json()).then(d => { setSessions(d.sessions ?? []); setTotalMinutes(d.totalMinutes ?? 0) })
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  useEffect(() => {
    if (timerActive) {
      intervalRef.current = setInterval(() => {
        setTimerSeconds(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current!)
            setTimerActive(false)
            if (phase === 'work') {
              toast.success('🎉 Focus session done! Time for a break.')
              logSession()
              setPhase('break')
              return currentMode.break_
            } else {
              toast('⏰ Break over! Back to focus.', { icon: '🍅' })
              setPhase('work')
              return timerWorkSeconds
            }
          }
          return prev - 1
        })
      }, 1000)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [timerActive])

  async function logSession() {
    await fetch('/api/timer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode: currentMode.mode, durationMinutes: Math.round(timerWorkSeconds / 60), completed: true }),
    })
    fetch('/api/timer').then(r => r.json()).then(d => { setSessions(d.sessions ?? []); setTotalMinutes(d.totalMinutes ?? 0) })
  }

  function toggle() { setTimerActive(!timerActive) }
  function reset() { setTimerActive(false); setTimerSeconds(timerWorkSeconds); setPhase('work') }
  function skip() {
    setTimerActive(false)
    if (phase === 'work') { setPhase('break'); setTimerSeconds(currentMode.break_) }
    else { setPhase('work'); setTimerSeconds(timerWorkSeconds) }
  }

  const pct = (1 - timerSeconds / (phase === 'work' ? timerWorkSeconds : currentMode.break_)) * 100
  const r = 90, circ = 2 * Math.PI * r, dash = circ * (1 - pct / 100)

  return (
    <div className="pb-24">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-lg font-bold text-white">Study Timer</h1>
        <p className="text-xs text-white/40">Pomodoro Focus Mode 🍅</p>
      </div>

      {/* Mode Selector */}
      <div className="flex gap-2 px-4 pb-4 overflow-x-auto scrollbar-hide">
        {MODES.map(m => (
          <button key={m.label} onClick={() => { setTimerMode(m.label, m.work); setPhase('work') }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
              timerMode === m.label ? 'bg-violet-600 border-violet-600 text-white' : 'bg-white/5 border-white/10 text-white/60'
            }`}>{m.label}</button>
        ))}
      </div>

      {/* Ring Timer */}
      <div className="flex flex-col items-center py-4">
        <div className="relative" style={{ width: 200, height: 200 }}>
          <svg width="200" height="200" viewBox="0 0 200 200" style={{ transform: 'rotate(-90deg)' }}>
            <circle cx="100" cy="100" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
            <circle cx="100" cy="100" r={r} fill="none"
              stroke={phase === 'work' ? 'url(#timerGrad)' : '#2dd4bf'}
              strokeWidth="12" strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={dash}
              style={{ transition: 'stroke-dashoffset 1s linear' }} />
            <defs>
              <linearGradient id="timerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#7c6dfa" /><stop offset="100%" stopColor="#f472b6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="text-4xl font-bold font-mono tabular-nums bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
              {formatTimer(timerSeconds)}
            </div>
            <div className="text-xs text-white/40 mt-1 capitalize">{phase} session</div>
            {timerActive && <div className="text-[10px] text-emerald-400 mt-1 animate-pulse">In progress...</div>}
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-4 mt-6">
          <button onClick={reset} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition-colors">⏹</button>
          <motion.button onClick={toggle} whileTap={{ scale: 0.95 }}
            className="w-16 h-16 rounded-full bg-gradient-to-r from-violet-600 to-pink-600 flex items-center justify-center text-2xl shadow-lg shadow-violet-500/25">
            {timerActive ? '⏸' : '▶'}
          </motion.button>
          <button onClick={skip} className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl hover:bg-white/10 transition-colors">⏭</button>
        </div>
      </div>

      {/* Today's stats */}
      <div className="grid grid-cols-2 gap-2 mx-4 mb-4">
        <Card>
          <div className="text-[10px] text-white/40 mb-1">Sessions Today</div>
          <div className="text-xl font-bold text-teal-400">{sessions.length}</div>
        </Card>
        <Card>
          <div className="text-[10px] text-white/40 mb-1">Total Time</div>
          <div className="text-xl font-bold text-violet-300">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</div>
        </Card>
      </div>

      {/* Recent sessions */}
      {sessions.length > 0 && (
        <div className="px-4">
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2">Recent Sessions</p>
          <div className="space-y-2">
            {sessions.slice(0, 5).map((s: any) => (
              <Card key={s.id} className="flex items-center gap-3 py-2.5">
                <span className="text-xl">🍅</span>
                <div>
                  <div className="text-xs font-medium text-white/80">{s.title}</div>
                  <div className="text-[10px] text-white/40">{s.durationMinutes} min · {new Date(s.startedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
