'use client'
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { motion } from 'framer-motion'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Skeleton from '@/components/ui/Skeleton'
import { formatRelativeTime } from '@/lib/utils'
import toast from 'react-hot-toast'

export default function AppreciatePage() {
  const { data: session } = useSession()
  const [appreciations, setAppreciations] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const [aiMsg, setAiMsg] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const [chatHistory, setChatHistory] = useState([
    { role: 'ai', text: "Hello! I'm your KA-SH AI 🤖 Ask me for study plans, productivity tips, or motivation!" }
  ])
  const [userInput, setUserInput] = useState('')

  const loadData = () => Promise.all([
    fetch('/api/appreciations').then(r => r.json()).then(({ appreciations }) => setAppreciations(appreciations)),
    fetch('/api/users').then(r => r.json()).then(({ users }) => setUsers(users)),
  ])

  useEffect(() => { loadData() }, [])

  const partner = users.find(u => u.id !== session?.user?.id)

  async function sendAppreciation() {
    if (!msg.trim()) { toast.error('Write something heartfelt first 💜'); return }
    if (!partner) return
    setLoading(true)
    await fetch('/api/appreciations', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg, receiverId: partner.id }),
    })
    toast.success('Appreciation sent! ❤️')
    setMsg('')
    await loadData()
    setLoading(false)
  }

  async function sendAI() {
    if (!userInput.trim()) return
    const input = userInput.trim()
    setUserInput('')
    const newHistory = [...chatHistory, { role: 'user', text: input }]
    setChatHistory(newHistory)
    setAiLoading(true)
    try {
      const res = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6', max_tokens: 600,
          system: 'You are the KA-SH AI assistant — a warm, motivating productivity coach for two study partners named Thiyanesh K and Kavibala J. Be concise, friendly, and give actionable advice. Max 3 sentences.',
          messages: newHistory.filter(m => m.role !== 'ai' || newHistory.indexOf(m) > 0).map(m => ({ role: m.role === 'ai' ? 'assistant' : 'user', content: m.text }))
        })
      })
      const data = await res.json()
      const text = data.content?.[0]?.text ?? 'Something went wrong. Try again!'
      setChatHistory([...newHistory, { role: 'ai', text }])
    } catch {
      setChatHistory([...newHistory, { role: 'ai', text: 'Connection issue. Check your network.' }])
    }
    setAiLoading(false)
  }

  return (
    <div className="pb-24">
      <div className="px-4 pt-4 pb-3">
        <h1 className="text-lg font-bold text-white">Partner Appreciation</h1>
        <p className="text-xs text-white/40">Spread the love 💜</p>
      </div>

      {/* Send */}
      <Card className="mx-4 mb-4 bg-gradient-to-br from-pink-500/10 to-violet-500/5 border-pink-500/20">
        <p className="text-[10px] font-semibold text-pink-400 uppercase tracking-widest mb-1">Send to {partner?.name?.split(' ')[0] ?? '...'}</p>
        <textarea className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-pink-500 transition-colors resize-none min-h-[80px] mt-2"
          placeholder="Write something heartfelt..." value={msg} onChange={e => setMsg(e.target.value)} />
        <Button variant="primary" className="w-full mt-3 bg-gradient-to-r from-pink-600 to-violet-600" onClick={sendAppreciation} loading={loading}>
          ❤️ Send Appreciation
        </Button>
      </Card>

      {/* History */}
      <div className="px-4 mb-4">
        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2">Appreciation History</p>
        <div className="space-y-2">
          {appreciations.map((a, i) => (
            <motion.div key={a.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <Card className="bg-gradient-to-br from-pink-500/8 to-violet-500/5 border-pink-500/15">
                <div className="text-[10px] text-pink-400 font-semibold mb-1">From {a.sender?.name?.split(' ')[0]} to {a.receiver?.name?.split(' ')[0]}</div>
                <div className="text-sm text-white/70 leading-relaxed">{a.message}</div>
                <div className="text-[10px] text-white/30 mt-2">{formatRelativeTime(a.createdAt)}</div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* AI Chat */}
      <div className="px-4">
        <p className="text-[10px] font-semibold text-white/40 uppercase tracking-widest mb-2">KA-SH AI Assistant</p>
        <div className="space-y-2 mb-2">
          {chatHistory.map((m, i) => (
            <div key={i} className={`rounded-xl p-3 ${
              m.role === 'user'
                ? 'bg-violet-500/15 border border-violet-500/20 ml-8'
                : 'bg-white/[0.04] border border-white/[0.06] mr-8'
            }`}>
              <div className={`text-[10px] font-bold mb-1 ${m.role === 'user' ? 'text-violet-400 text-right' : 'text-white/40'}`}>
                {m.role === 'user' ? 'You' : '🤖 KA-SH AI'}
              </div>
              <div className="text-sm text-white/80 leading-relaxed">{m.text}</div>
            </div>
          ))}
          {aiLoading && (
            <div className="bg-white/[0.04] border border-white/[0.06] rounded-xl p-3 mr-8">
              <div className="text-[10px] text-white/40 mb-1">🤖 KA-SH AI</div>
              <div className="flex gap-1">
                {[0,1,2].map(i => <div key={i} className="w-1.5 h-1.5 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />)}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <input className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/30 focus:outline-none focus:border-violet-500"
            placeholder="Ask about study plans, tips..." value={userInput} onChange={e => setUserInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendAI()} />
          <button onClick={sendAI} className="bg-violet-600 text-white px-4 rounded-xl text-sm font-semibold hover:bg-violet-500 transition-colors">→</button>
        </div>
      </div>
    </div>
  )
}
