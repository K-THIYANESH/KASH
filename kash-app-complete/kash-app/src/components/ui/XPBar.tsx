import { getLevelInfo } from '@/lib/xp'

export default function XPBar({ xp }: { xp: number }) {
  const { current, next, progress } = getLevelInfo(xp)
  return (
    <div className="px-4 mb-3">
      <div className="flex justify-between mb-1.5">
        <span className="text-xs font-bold text-violet-300">Lv {current.level} · {current.title}</span>
        <span className="text-xs text-white/40">{xp} / {next.minXP} XP</span>
      </div>
      <div className="h-2 bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-violet-500 to-pink-500 rounded-full transition-all duration-700"
          style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}
