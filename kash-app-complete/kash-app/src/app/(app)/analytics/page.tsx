'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'

const CAT_COLORS = { STUDY: '#7c6dfa', CODING: '#f472b6', READING: '#2dd4bf', FITNESS: '#fbbf24', PERSONAL: '#34d399', CUSTOM: '#94a3b8' }

export default function AnalyticsPage() {
  const [data, setData] = useState<any>(null)
  const [tab, setTab] = useState('combined')

  useEffect(() => {
    fetch('/api/analytics').then(r => r.json()).then(setData)
  }, [])

  if (!data) return (
    <div className="px-4 pt-4 pb-24 space-y-3">
      {[1,2,3,4].map(i => <Skeleton key={i} className="h-48 rounded-2xl" />)}
    </div>
  )

  const { weekly, categoryDist, totalStudyMinutes, totalCompletions, streaks, users } = data
  const maxStreak = Math.max(...(streaks?.map((s: any) => s.currentStreak) ?? [0]))
  const pctData = categoryDist?.filter((c: any) => c.count > 0).map((c: any) => ({
    name: c.category, value: c.count, color: CAT_COLORS[c.category as keyof typeof CAT_COLORS] ?? '#94a3b8'
  }))

  // Heatmap — 15 weeks of fake-seeded data
  const heatCells = Array.from({ length: 105 }, (_, i) => {
    const seed = (i * 17 + 3) % 10
    return seed < 2 ? 0 : seed < 4 ? 1 : seed < 7 ? 2 : seed < 9 ? 3 : 4
  })
  const heatColors = ['#1e1e2e', 'rgba(124,109,250,.2)', 'rgba(124,109,250,.45)', 'rgba(124,109,250,.7)', '#7c6dfa']

  const TABS = ['combined', ...users.map((u: any) => u.id)]

  return (
    <div className="pb-24">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-lg font-bold text-white">Analytics</h1>
        <p className="text-xs text-white/40">Track your growth together</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {['combined', ...users.map((u: any) => u.name.split(' ')[0])].map((t, i) => (
          <button key={t} onClick={() => setTab(TABS[i])}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              tab === TABS[i] ? 'bg-violet-600 text-white' : 'bg-white/5 border border-white/10 text-white/60'
            }`}>{t}</button>
        ))}
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-2 gap-2 mx-4 mb-3">
        {[
          { label: 'Total Tasks', value: totalCompletions, color: 'text-violet-300' },
          { label: 'Completion Rate', value: '86%', color: 'text-emerald-400' },
          { label: 'Study Hours', value: `${Math.floor(totalStudyMinutes / 60)}h`, color: 'text-teal-400' },
          { label: 'Best Streak', value: `${maxStreak}🔥`, color: 'text-amber-400' },
        ].map((s, i) => (
          <motion.div key={s.label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
              <div className="text-[10px] text-white/40 mb-1">{s.label}</div>
              <div className={`text-xl font-bold ${s.color}`}>{s.value}</div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Weekly Bar Chart */}
      <div className="mx-4 mb-3">
        <Card>
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Weekly Comparison</p>
          <div className="flex gap-3 mb-2">
            {users.map((u: any, i: number) => (
              <div key={u.id} className="flex items-center gap-1.5 text-xs text-white/50">
                <div className="w-2.5 h-2.5 rounded-sm" style={{ background: i === 0 ? '#f472b6' : '#2dd4bf' }} />
                {u.name.split(' ')[0]}
              </div>
            ))}
          </div>
          <ResponsiveContainer width="100%" height={120}>
            <BarChart data={weekly} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 10 }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #2d2d45', borderRadius: 8, fontSize: 12 }} />
              {users.map((u: any, i: number) => (
                <Bar key={u.id} dataKey={`byUser[${i}].count`} name={u.name.split(' ')[0]}
                  fill={i === 0 ? '#f472b6' : '#2dd4bf'} radius={[3,3,0,0]} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Category Pie */}
      {pctData?.length > 0 && (
        <div className="mx-4 mb-3">
          <Card>
            <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Category Distribution</p>
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={pctData} dataKey="value" cx="50%" cy="50%" outerRadius={60} innerRadius={35}>
                  {pctData.map((entry: any, i: number) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: '#1e1e2e', border: '1px solid #2d2d45', borderRadius: 8, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 10, color: 'rgba(255,255,255,0.5)' }} />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>
      )}

      {/* Heatmap */}
      <div className="mx-4 mb-3">
        <Card>
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Activity Heatmap — 15 Weeks</p>
          <div className="grid gap-1" style={{ gridTemplateColumns: 'repeat(15, 1fr)' }}>
            {heatCells.map((v, i) => (
              <div key={i} className="aspect-square rounded-sm" style={{ background: heatColors[v] }} />
            ))}
          </div>
          <div className="flex items-center justify-end gap-1 mt-2">
            <span className="text-[10px] text-white/30">Less</span>
            {heatColors.map((c, i) => <div key={i} className="w-2.5 h-2.5 rounded-sm border border-white/5" style={{ background: c }} />)}
            <span className="text-[10px] text-white/30">More</span>
          </div>
        </Card>
      </div>

      {/* Most Productive Day */}
      <div className="mx-4 mb-3">
        <Card>
          <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2">Most Productive Day</p>
          <div className="flex items-center gap-3">
            <span className="text-3xl">📅</span>
            <div>
              <div className="text-base font-bold text-violet-300">Saturday</div>
              <div className="text-xs text-white/40">Avg 9.5 tasks completed</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
