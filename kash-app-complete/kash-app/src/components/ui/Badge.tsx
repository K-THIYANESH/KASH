import { cn } from '@/lib/utils'

const variants = {
  high: 'bg-red-500/15 text-red-400 border border-red-500/20',
  medium: 'bg-amber-500/15 text-amber-400 border border-amber-500/20',
  low: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20',
  category: 'bg-violet-500/15 text-violet-300 border border-violet-500/20',
  user: 'bg-pink-500/15 text-pink-300 border border-pink-500/20',
  xp: 'bg-violet-500/10 text-violet-300 border border-violet-500/15',
  default: 'bg-white/5 text-white/50 border border-white/10',
}

interface BadgeProps {
  children: React.ReactNode
  variant?: keyof typeof variants
  className?: string
}

export default function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide', variants[variant], className)}>
      {children}
    </span>
  )
}
