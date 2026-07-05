'use client'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import Badge from './Badge'

interface Task {
  id: string
  title: string
  description?: string
  priority: 'LOW' | 'MEDIUM' | 'HIGH'
  category: string
  xpReward: number
  estimatedMinutes?: number
  completions: { userId: string }[]
  assignees: { user: { id: string; name: string } }[]
}

interface TaskCardProps {
  task: Task
  currentUserId: string
  onToggle: (taskId: string) => void
}

export default function TaskCard({ task, currentUserId, onToggle }: TaskCardProps) {
  const isCompleted = task.completions.some((c) => c.userId === currentUserId)
  const [optimistic, setOptimistic] = useState(isCompleted)

  async function handleToggle() {
    setOptimistic(!optimistic)
    onToggle(task.id)
  }

  const assigneeNames = task.assignees.map((a) => a.user.name.split(' ')[0]).join(', ')

  return (
    <div className={cn(
      'flex items-start gap-3 p-3 rounded-xl border transition-all duration-200',
      optimistic
        ? 'bg-white/[0.02] border-white/5 opacity-50'
        : 'bg-white/[0.04] border-white/[0.06] hover:bg-white/[0.06]'
    )}>
      <button onClick={handleToggle}
        className={cn(
          'w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all',
          optimistic ? 'bg-emerald-500 border-emerald-500' : 'border-white/20 hover:border-violet-400'
        )}>
        {optimistic && (
          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className={cn('text-sm font-medium text-white/90 truncate', optimistic && 'line-through text-white/40')}>
          {task.title}
        </div>
        {task.description && (
          <div className="text-xs text-white/40 mt-0.5 truncate">{task.description}</div>
        )}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <Badge variant={task.priority.toLowerCase() as 'high' | 'medium' | 'low'}>{task.priority}</Badge>
          <Badge variant="category">{task.category}</Badge>
          <Badge variant="user">{assigneeNames}</Badge>
          {task.estimatedMinutes && (
            <Badge>⏱ {task.estimatedMinutes}m</Badge>
          )}
          <Badge variant="xp">+{task.xpReward} XP</Badge>
        </div>
      </div>
    </div>
  )
}
