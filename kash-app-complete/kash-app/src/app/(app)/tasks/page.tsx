'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import TaskCard from '@/components/ui/TaskCard'
import Skeleton from '@/components/ui/Skeleton'
import { useAppStore } from '@/store/useAppStore'
import toast from 'react-hot-toast'
import Link from 'next/link'

const FILTERS = ['All', 'Mine', 'Partner', 'Shared', 'Pending', 'Done']

export default function TasksPage() {
  const { data: session } = useSession()
  const { taskFilter, setTaskFilter } = useAppStore()
  const [tasks, setTasks] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadTasks = useCallback(async () => {
    const [tr, ur] = await Promise.all([fetch('/api/tasks'), fetch('/api/users')])
    const [{ tasks }, { users }] = await Promise.all([tr.json(), ur.json()])
    setTasks(tasks)
    setUsers(users)
    setLoading(false)
  }, [])

  useEffect(() => { loadTasks() }, [loadTasks])

  const filtered = tasks.filter((t) => {
    const uid = session?.user?.id
    const partnerId = users.find((u: any) => u.id !== uid)?.id
    if (taskFilter === 'Mine') return t.assignees.some((a: any) => a.user.id === uid) && !t.assignees.some((a: any) => a.user.id === partnerId)
    if (taskFilter === 'Partner') return t.assignees.some((a: any) => a.user.id === partnerId) && !t.assignees.some((a: any) => a.user.id === uid)
    if (taskFilter === 'Shared') return t.assignees.length > 1
    if (taskFilter === 'Pending') return !t.completions.some((c: any) => c.userId === uid)
    if (taskFilter === 'Done') return t.completions.some((c: any) => c.userId === uid)
    return true
  })

  async function handleToggle(taskId: string) {
    try {
      const res = await fetch(`/api/tasks/${taskId}/complete`, { method: 'POST' })
      const data = await res.json()
      if (data.completed) toast.success(`✅ Task done! +${data.xpEarned} XP`, { style: { background: '#1e1e2e', color: '#e8e8f0', border: '1px solid #2d2d45' } })
      await loadTasks()
    } catch {
      toast.error('Failed to update task')
    }
  }

  return (
    <div className="pb-24">
      <div className="px-4 pt-4 pb-2 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-white">Checklist</h1>
          <p className="text-xs text-white/40">{filtered.length} tasks</p>
        </div>
        <Link href="/create" className="bg-gradient-to-r from-violet-600 to-purple-600 text-white text-xs font-semibold px-3 py-2 rounded-xl">+ Add</Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2 px-4 pb-3 overflow-x-auto scrollbar-hide">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setTaskFilter(f)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
              taskFilter === f ? 'bg-violet-600 text-white' : 'bg-white/5 border border-white/10 text-white/60'
            }`}>
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="px-4 space-y-2">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 px-4">
          <div className="text-4xl mb-3">📭</div>
          <p className="text-white/40 text-sm">No tasks here yet.</p>
          <Link href="/create" className="inline-block mt-3 text-violet-400 text-sm font-medium">Create one →</Link>
        </div>
      ) : (
        <div className="px-4 space-y-2">
          <AnimatePresence>
            {filtered.map((task, i) => (
              <motion.div key={task.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                <TaskCard task={task} currentUserId={session?.user?.id ?? ''} onToggle={handleToggle} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
