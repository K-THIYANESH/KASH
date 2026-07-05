'use client'
import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import Button from '@/components/ui/Button'

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH']
const CATEGORIES = ['STUDY', 'CODING', 'READING', 'FITNESS', 'PERSONAL', 'CUSTOM']
const RECURRENCES = ['NONE', 'DAILY', 'WEEKLY', 'MONTHLY']

export default function CreateTaskPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', priority: 'MEDIUM', category: 'STUDY',
    assigneeIds: [] as string[], dueDate: '', estimatedMinutes: '', recurrence: 'NONE', notes: '',
  })

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(({ users }) => {
      setUsers(users)
      setForm(f => ({ ...f, assigneeIds: users.map((u: any) => u.id) }))
    })
  }, [])

  function toggleAssignee(id: string) {
    setForm(f => ({
      ...f,
      assigneeIds: f.assigneeIds.includes(id) ? f.assigneeIds.filter(x => x !== id) : [...f.assigneeIds, id]
    }))
  }

  async function handleSubmit() {
    if (!form.title.trim()) { toast.error('Title is required'); return }
    if (!form.assigneeIds.length) { toast.error('Assign to at least one person'); return }
    setLoading(true)
    try {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, estimatedMinutes: form.estimatedMinutes ? Number(form.estimatedMinutes) : undefined }),
      })
      if (!res.ok) throw new Error()
      toast.success('Task created! ✨')
      router.push('/tasks')
    } catch {
      toast.error('Failed to create task')
    } finally {
      setLoading(false)
    }
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors"

  return (
    <div className="pb-24">
      <div className="px-4 pt-4 pb-4">
        <h1 className="text-lg font-bold text-white">Create Task</h1>
        <p className="text-xs text-white/40">Add a new goal for KA-SH</p>
      </div>

      <div className="px-4 space-y-4">
        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Title *</label>
          <input className={inputCls} placeholder="e.g. Complete 3 LeetCode problems" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Description</label>
          <textarea className={inputCls + ' min-h-[80px] resize-none'} placeholder="What exactly needs to be done?" value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Priority</label>
          <div className="flex gap-2">
            {PRIORITIES.map(p => (
              <button key={p} onClick={() => setForm(f => ({ ...f, priority: p }))}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  form.priority === p ? 'bg-violet-600 border-violet-600 text-white' : 'bg-white/5 border-white/10 text-white/60'
                }`}>{p}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Category</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setForm(f => ({ ...f, category: c }))}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  form.category === c ? 'bg-violet-600 border-violet-600 text-white' : 'bg-white/5 border-white/10 text-white/60'
                }`}>{c}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Assign To</label>
          <div className="flex gap-2">
            {users.map(u => (
              <button key={u.id} onClick={() => toggleAssignee(u.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                  form.assigneeIds.includes(u.id) ? 'bg-violet-600 border-violet-600 text-white' : 'bg-white/5 border-white/10 text-white/60'
                }`}>{u.name.split(' ')[0]}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Due Date</label>
            <input type="date" className={inputCls} value={form.dueDate} onChange={e => setForm(f => ({ ...f, dueDate: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Est. Minutes</label>
            <input type="number" className={inputCls} placeholder="60" value={form.estimatedMinutes} onChange={e => setForm(f => ({ ...f, estimatedMinutes: e.target.value }))} />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Recurrence</label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {RECURRENCES.map(r => (
              <button key={r} onClick={() => setForm(f => ({ ...f, recurrence: r }))}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                  form.recurrence === r ? 'bg-violet-600 border-violet-600 text-white' : 'bg-white/5 border-white/10 text-white/60'
                }`}>{r}</button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-white/50 mb-1.5 uppercase tracking-wide">Notes</label>
          <input className={inputCls} placeholder="Any extra notes..." value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} />
        </div>

        <Button variant="primary" size="lg" className="w-full" onClick={handleSubmit} loading={loading}>
          Save Task ✓
        </Button>
      </div>
    </div>
  )
}
