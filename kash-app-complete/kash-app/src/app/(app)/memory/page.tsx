'use client'
import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSession } from 'next-auth/react'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import { formatDate } from '@/lib/utils'
import toast from 'react-hot-toast'

const TYPE_COLORS: Record<string, string> = {
  MILESTONE: '#fbbf24', ACHIEVEMENT: '#7c6dfa', CELEBRATION: '#f472b6', NOTE: '#2dd4bf'
}

export default function MemoryPage() {
  const { data: session } = useSession()
  const [memories, setMemories] = useState<any[]>([])
  const [content, setContent] = useState('')
  const [type, setType] = useState('NOTE')
  const [loading, setLoading] = useState(false)

  const load = () => fetch('/api/memories').then(r => r.json()).then(({ memories }) => setMemories(memories))
  useEffect(() => { load() }, [])

  async function handleAdd() {
    if (!content.trim()) { toast.error('Write something first'); return }
    setLoading(true)
    await fetch('/api/memories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content, type }) })
    toast.success('Memory pinned! 📌')
    setContent('')
    await load()
    setLoading(false)
  }

  return (
    <div className="pb-24">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-lg font-bold text-white">Memory Wall</h1>
        <p className="text-xs text-white/40">Your KA-SH journey ✨</p>
      </div>

      {/* Add Memory */}
      <Card className="mx-4 mb-4 bg-gradient-to-br from-teal-500/10 to-emerald-500/5 border-teal-500/20">
        <p className="text-[10px] font-semibold text-teal-400 uppercase tracking-widest mb-2">Add Memory</p>
        <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-teal-500 transition-colors resize-none min-h-[80px]"
          placeholder="Write a memory, achievement, or moment to remember..."
          value={content} onChange={e => setContent(e.target.value)} />
        <div className="flex gap-2 mt-2 mb-3">
          {['NOTE', 'MILESTONE', 'ACHIEVEMENT', 'CELEBRATION'].map(t => (
            <button key={t} onClick={() => setType(t)}
              className={`flex-1 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                type === t ? 'border-teal-500 text-teal-400 bg-teal-500/10' : 'border-white/10 text-white/40'
              }`}>{t.slice(0, 5)}</button>
          ))}
        </div>
        <Button variant="secondary" className="w-full" onClick={handleAdd} loading={loading}>📌 Pin Memory</Button>
      </Card>

      {/* Timeline */}
      <div className="px-4">
        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-3">Timeline</p>
        <div className="space-y-0">
          {memories.map((m, i) => (
            <motion.div key={m.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
              className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1" style={{ background: TYPE_COLORS[m.type] ?? '#7c6dfa' }} />
                {i < memories.length - 1 && <div className="w-0.5 flex-1 bg-white/5 mt-1 mb-0" />}
              </div>
              <div className={`flex-1 pb-4 ${i < memories.length - 1 ? '' : ''}`}>
                <Card className="mb-0">
                  <div className="text-[10px] text-white/30 mb-1">{formatDate(m.createdAt)}</div>
                  <div className="text-sm text-white/80 leading-relaxed">{m.content}</div>
                  <div className="text-[10px] text-violet-400 mt-2">— {m.author?.name}</div>
                </Card>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
