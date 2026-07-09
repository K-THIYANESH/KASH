'use client'

import { useSession } from 'next-auth/react'
import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Sparkles, Loader2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

interface ChatMessage {
  id: string
  message: string
  senderId: string
  receiverId: string
  createdAt: string
}

interface Partner {
  id: string
  name: string
  avatar?: string
  xp: number
  level: number
}

export default function ChatPage() {
  const { data: session } = useSession()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [partner, setPartner] = useState<Partner | null>(null)
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch messages and partner info
  const fetchChat = async (silent = false) => {
    try {
      const res = await fetch('/api/chat')
      if (res.ok) {
        const data = await res.json()
        setMessages(data.messages)
        setPartner(data.partner)
      }
    } catch (err) {
      console.error('Error fetching chat:', err)
    } finally {
      if (!silent) setLoading(false)
    }
  }

  // Scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Initial load
  useEffect(() => {
    fetchChat()
    
    // Auto-polling every 4 seconds
    const interval = setInterval(() => {
      fetchChat(true)
    }, 4000)

    return () => clearInterval(interval)
  }, [])

  // Scroll on new messages
  useEffect(() => {
    if (!loading) {
      scrollToBottom()
    }
  }, [messages, loading])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newMessage.trim() || sending) return

    const content = newMessage.trim()
    setNewMessage('')
    setSending(true)

    // Optimistic update
    const tempId = Math.random().toString()
    const tempMsg: ChatMessage = {
      id: tempId,
      message: content,
      senderId: session?.user?.id || '',
      receiverId: partner?.id || '',
      createdAt: new Date().toISOString(),
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: content }),
      })

      if (res.ok) {
        const data = await res.json()
        // Replace optimistic message with actual
        setMessages(prev => prev.map(m => m.id === tempId ? data.message : m))
      } else {
        // Remove optimistic message if failed
        setMessages(prev => prev.filter(m => m.id !== tempId))
      }
    } catch (err) {
      console.error('Failed to send message:', err)
      setMessages(prev => prev.filter(m => m.id !== tempId))
    } finally {
      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 text-violet-500 animate-spin mb-2" />
        <p className="text-xs text-white/40">Loading chat history...</p>
      </div>
    )
  }

  const partnerInitials = partner?.name ? partner.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) : 'PA'

  return (
    <div className="flex flex-col h-dvh bg-[#0a0a0f] pb-[80px]">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-white/[0.06] bg-[#0f0f1a]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <Link href="/dashboard" className="p-1 hover:bg-white/5 rounded-lg text-white/60 hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-pink-500 to-violet-600 flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-pink-500/20">
              {partnerInitials}
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white/90">{partner?.name || 'Partner'}</h2>
              <div className="flex items-center gap-1 text-[10px] text-violet-400">
                <Sparkles className="w-3 h-3 text-pink-400" />
                <span>Level {partner?.level || 1} • {partner?.xp || 0} XP</span>
              </div>
            </div>
          </div>
        </div>
        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
          Connected
        </span>
      </div>

      {/* Messages list */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-none">
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-2">
            <div className="w-12 h-12 rounded-full bg-white/[0.02] border border-white/[0.06] flex items-center justify-center text-xl">
              💬
            </div>
            <h3 className="text-sm font-medium text-white/80">Start your conversation</h3>
            <p className="text-xs text-white/40 max-w-[240px]">
              This space is shared privately between only the two of you. Send a message to get started!
            </p>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => {
              const isSelf = msg.senderId === session?.user?.id
              return (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className={`flex ${isSelf ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed shadow-md transition-all ${
                      isSelf
                        ? 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white rounded-br-none border border-violet-500/20'
                        : 'bg-white/[0.04] border border-white/[0.08] text-white/90 rounded-bl-none'
                    }`}
                  >
                    <p className="break-words">{msg.message}</p>
                    <span className="block text-[8px] text-white/40 text-right mt-1">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input container */}
      <div className="p-3 border-t border-white/[0.06] bg-[#0f0f1a]/50 backdrop-blur-md">
        <form onSubmit={handleSendMessage} className="flex gap-2 max-w-md mx-auto">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
            className="flex-1 bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-2.5 text-base text-white placeholder-white/30 focus:outline-none focus:border-violet-500/50 transition-colors"
          />
          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white p-2.5 rounded-xl transition-all shadow-lg shadow-violet-500/10 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
