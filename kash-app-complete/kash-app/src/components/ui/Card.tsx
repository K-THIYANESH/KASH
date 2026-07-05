import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glow?: boolean
}

export default function Card({ children, className, glow }: CardProps) {
  return (
    <div className={cn(
      'rounded-2xl border border-white/[0.06] bg-white/[0.04] backdrop-blur-sm p-4',
      glow && 'shadow-[0_0_30px_rgba(124,109,250,0.08)]',
      className
    )}>
      {children}
    </div>
  )
}
