export default function StreakBadge({ days }: { days: number }) {
  return (
    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/25 rounded-full px-3 py-1.5">
      <span className="text-base">🔥</span>
      <span className="text-sm font-bold text-amber-400">{days} Day Streak</span>
    </div>
  )
}
