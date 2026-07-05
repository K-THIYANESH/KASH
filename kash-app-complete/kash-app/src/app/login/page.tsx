'use client'
import { useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => { if (status === 'authenticated') router.replace('/dashboard') }, [status, router])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    const res = await signIn('credentials', { email, password, redirect: false })
    if (res?.error) {
      toast.error('Invalid credentials. Try again.')
      setLoading(false)
    } else {
      router.replace('/dashboard')
    }
  }

  const inputCls = "w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3.5 text-white placeholder-white/30 focus:outline-none focus:border-violet-500 transition-colors text-sm"

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-600/12 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-pink-600/8 rounded-full blur-3xl" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-violet-600 to-pink-600 mb-4 shadow-2xl shadow-violet-500/30">
            <span className="text-3xl font-black text-white">KS</span>
          </div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">KA-SH</h1>
          <p className="text-white/40 text-sm mt-1">Kavibala × Thiyanesh</p>
          <p className="text-white/25 text-xs mt-0.5">Collaborative Productivity Platform</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3">
          <input type="email" className={inputCls} placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)} required />
          <input type="password" className={inputCls} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="submit" disabled={loading}
            className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-purple-600 text-white font-bold rounded-2xl text-sm hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
            {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            {loading ? 'Signing in...' : 'Sign In to KA-SH →'}
          </button>
        </form>

        {/* Credentials hint */}
        <div className="mt-6 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
          <p className="text-[11px] text-white/30 mb-1 font-medium uppercase tracking-wide">Demo Credentials</p>
          <p className="text-[11px] text-white/50">thiyanesh@kash.app · kash2025</p>
          <p className="text-[11px] text-white/50">kavibala@kash.app · kash2025</p>
        </div>
      </motion.div>
    </div>
  )
}
