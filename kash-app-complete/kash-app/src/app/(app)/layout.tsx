'use client'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'

const NAV = [
  { href: '/dashboard', label: 'Home', icon: (active: boolean) => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
      <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  )},
  { href: '/tasks', label: 'Tasks', icon: (active: boolean) => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
      <path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
    </svg>
  )},
  { href: '/analytics', label: 'Stats', icon: (active: boolean) => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  )},
  { href: '/streaks', label: 'Streak', icon: (active: boolean) => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
      <path d="M12 2c0 5-4 8-4 13a4 4 0 008 0c0-5-4-8-4-13z"/>
    </svg>
  )},
  { href: '/timer', label: 'Timer', icon: (active: boolean) => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
      <circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2"/><path d="M5 3l-1.5 2.5M19 3l1.5 2.5"/>
    </svg>
  )},
  { href: '/memory', label: 'More', icon: (active: boolean) => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={active ? 2.2 : 1.7}>
      <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
    </svg>
  )},
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  if (status === 'loading') return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
    </div>
  )

  if (!session) return null

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-600/8 rounded-full blur-3xl" />
      </div>

      <div className="max-w-md mx-auto relative">
        <main className="min-h-screen">{children}</main>

        {/* Bottom Nav */}
        <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-[#0f0f1a]/95 backdrop-blur-2xl border-t border-white/[0.06] pb-safe">
          <div className="flex justify-around px-2 pt-2 pb-3">
            {NAV.map(item => {
              const active = pathname === item.href || (item.href === '/memory' && ['/memory', '/appreciate', '/achievements'].includes(pathname))
              return (
                <Link key={item.href} href={item.href}
                  className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl transition-all ${active ? 'text-violet-400' : 'text-white/30 hover:text-white/60'}`}>
                  <span className={active ? 'drop-shadow-[0_0_8px_rgba(124,109,250,0.8)]' : ''}>{item.icon(active)}</span>
                  <span className="text-[9px] font-medium tracking-wide">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </nav>
      </div>
    </div>
  )
}
