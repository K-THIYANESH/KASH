'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Skeleton from '@/components/ui/Skeleton'

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/achievements').then(r => r.json()).then(({ achievements }) => { setAchievements(achievements); setLoading(false) })
  }, [])

  if (loading) return (
    <div className="px-4 pt-4 grid grid-cols-2 gap-2">
      {[1,2,3,4,5,6].map(i => <Skeleton key={i} className="h-36 rounded-2xl" />)}
    </div>
  )

  const unlocked = achievements.filter(a => a.unlocked).length

  return (
    <div className="pb-24">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-lg font-bold text-white">Achievements</h1>
        <p className="text-xs text-white/40">{unlocked}/{achievements.length} unlocked</p>
      </div>

      <div className="mx-4 mb-4">
        <Card className="bg-gradient-to-br from-violet-500/10 to-pink-500/5 border-violet-500/20 text-center">
          <div className="text-3xl font-black text-violet-300">{unlocked}</div>
          <div className="text-xs text-white/40 mb-2">of {achievements.length} unlocked</div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.round(unlocked / achievements.length * 100)}%` }} />
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-2 px-4">
        {achievements.map((a, i) => (
          <motion.div key={a.id} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.04 }}>
            <Card className={`text-center transition-all ${
              a.unlocked ? 'border-violet-500/30 bg-gradient-to-br from-violet-500/10 to-pink-500/5' : 'opacity-40 grayscale'
            }`}>
              <div className="text-3xl mb-2">{a.icon}</div>
              <div className="text-xs font-bold text-white/90 mb-1">{a.name}</div>
              <div className="text-[10px] text-white/40 leading-relaxed">{a.description}</div>
              {a.unlocked && <div className="text-[10px] text-violet-400 font-bold mt-2">UNLOCKED ✓</div>}
              {!a.unlocked && <div className="text-[10px] text-white/20 mt-2">+{a.xpReward} XP</div>}
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
