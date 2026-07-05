'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ProgressRing from '@/components/ui/ProgressRing'
import XPBar from '@/components/ui/XPBar'
import StreakBadge from '@/components/ui/StreakBadge'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'
import { getGreeting, getDailyQuote } from '@/lib/utils'
import { getLevelInfo } from '@/lib/xp'
import Link from 'next/link'

interface DashData {
  tasks: any[]
  users: any[]
  streaks: any[]
  currentUser: any
}

export default function DashboardPage() {
  const { data: session } = useSession()
  const [data, setData] = useState<DashData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [tasksRes, usersRes, streaksRes] = await Promise.all([
        fetch('/api/tasks'),
        fetch('/api/users'),
        fetch('/api/streaks'),
      ])
      const [{ tasks }, { users }, { streaks }] = await Promise.all([
        tasksRes.json(), usersRes.json(), streaksRes.json()
      ])
      const currentUser = users.find((u: any) => u.id === session?.user?.id)
      setData({ tasks, users, streaks, currentUser })
      setLoading(false)
    }
    if (session?.user?.id) load()
  }, [session])

  if (loading || !session) return <DashboardSkeleton />

  const { tasks, users, streaks, currentUser } = data!
  const myTasks = tasks.filter((t: any) => t.assignees.some((a: any) => a.user.id === session.user.id))
  const myDone = myTasks.filter((t: any) => t.completions.some((c: any) => c.userId === session.user.id))
  const pct = myTasks.length ? Math.round((myDone.length / myTasks.length) * 100) : 0
  const myStreak = streaks.find((s: any) => s.userId === session.user.id)
  const partnerUser = users.find((u: any) => u.id !== session.user.id)
  const partnerTasks = tasks.filter((t: any) => t.assignees.some((a: any) => a.user.id === partnerUser?.id))
  const partnerDone = partnerTasks.filter((t: any) => t.completions.some((c: any) => c.userId === partnerUser?.id))
  const partnerPct = partnerTasks.length ? Math.round((partnerDone.length / partnerTasks.length) * 100) : 0
  const xpInfo = getLevelInfo(currentUser?.xp ?? 0)

  return (
    <div className="pb-24">
      {/* Header */}
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <motion.h1 initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}
            className="text-lg font-bold text-white">
            {getGreeting(session.user.name?.split(' ')[0] ?? 'Friend')}
          </motion.h1>
          <p className="text-xs text-white/40 mt-0.5">KA-SH Dashboard</p>
        </div>
        <div className="flex gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">KA</div>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-teal-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white">SH</div>
        </div>
      </div>

      {/* Streak + Switch */}
      <div className="px-4 mb-3">
        <StreakBadge days={myStreak?.currentStreak ?? 0} />
      </div>

      {/* Progress Ring */}
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}>
        <Card className="mx-4 mb-3">
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Today's Progress</p>
          <div className="flex items-center justify-center mb-4">
            <ProgressRing pct={pct} label={`${pct}%`} sublabel={`${myDone.length}/${myTasks.length} done`} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-emerald-500/10 border border-emerald-500/15 rounded-xl p-3">
              <div className="text-[10px] text-white/40 mb-1">Completed</div>
              <div className="text-xl font-bold text-emerald-400">{myDone.length}</div>
            </div>
            <div className="bg-amber-500/10 border border-amber-500/15 rounded-xl p-3">
              <div className="text-[10px] text-white/40 mb-1">Pending</div>
              <div className="text-xl font-bold text-amber-400">{myTasks.length - myDone.length}</div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* XP Bar */}
      <XPBar xp={currentUser?.xp ?? 0} />

      {/* Partner Status */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card className="mx-4 mb-3">
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Partner Status</p>
          {/* Current user */}
          <div className="flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-teal-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">SH</div>
            <div className="flex-1">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-white/80">{session.user.name?.split(' ')[0]}</span>
                <span className="text-white/40">{myDone.length}/{myTasks.length}</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-teal-500 to-violet-500 rounded-full transition-all duration-700" style={{ width: `${pct}%` }} />
              </div>
            </div>
          </div>
          {/* Partner */}
          {partnerUser && (
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">KA</div>
              <div className="flex-1">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/80">{partnerUser.name?.split(' ')[0]}</span>
                  <span className="text-white/40">{partnerDone.length}/{partnerTasks.length}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-500 to-violet-500 rounded-full transition-all duration-700" style={{ width: `${partnerPct}%` }} />
                </div>
              </div>
            </div>
          )}
        </Card>
      </motion.div>

      {/* Quote */}
      <Card className="mx-4 mb-3 bg-gradient-to-br from-violet-500/10 to-pink-500/5 border-violet-500/20">
        <p className="text-[10px] font-semibold text-violet-400 uppercase tracking-widest mb-2">Today's Quote</p>
        <p className="text-sm text-violet-200 italic leading-relaxed">{getDailyQuote()}</p>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-2 mx-4 mb-3">
        <Link href="/create" className="flex items-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 rounded-xl p-3 text-white font-semibold text-sm hover:opacity-90 transition-opacity">
          <span className="text-lg">+</span> New Task
        </Link>
        <Link href="/timer" className="flex items-center gap-2 bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 text-white/80 font-semibold text-sm hover:bg-white/[0.07]">
          <span className="text-lg">🍅</span> Timer
        </Link>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2 mx-4">
        <Link href="/achievements">
          <Card className="text-center cursor-pointer hover:bg-white/[0.07] transition-colors">
            <div className="text-2xl mb-1">🏆</div>
            <div className="text-xs font-semibold text-white/80">Achievements</div>
            <div className="text-[10px] text-white/40">Tap to view</div>
          </Card>
        </Link>
        <Link href="/appreciate">
          <Card className="text-center cursor-pointer hover:bg-white/[0.07] transition-colors">
            <div className="text-2xl mb-1">💜</div>
            <div className="text-xs font-semibold text-white/80">Appreciate</div>
            <div className="text-[10px] text-white/40">Send love</div>
          </Card>
        </Link>
      </div>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="px-4 pt-4 pb-24 space-y-3">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-8 w-full rounded-full" />
      <Skeleton className="h-32 w-full rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </div>
  )
}
