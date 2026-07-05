// src/lib/utils.ts — Shared utilities
import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric'
  })
}

export function formatRelativeTime(date: Date | string): string {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

export function getGreeting(name: string): string {
  const hour = new Date().getHours()
  if (hour < 5) return `Good Night, ${name} 🌙`
  if (hour < 12) return `Good Morning, ${name} ☀️`
  if (hour < 17) return `Good Afternoon, ${name} 🌤️`
  return `Good Evening, ${name} 🌙`
}

export const MOTIVATIONAL_QUOTES = [
  '"Consistency beats talent every single day."',
  '"Small daily improvements lead to stunning results."',
  '"You don\'t rise to your goals, you fall to your systems."',
  '"The secret of getting ahead is getting started."',
  '"Together, KA-SH is unstoppable. 🔥"',
  '"Progress, not perfection, is the goal."',
  '"Every task completed is a vote for the person you want to become."',
]

export function getDailyQuote(): string {
  const idx = Math.floor(Date.now() / 86400000) % MOTIVATIONAL_QUOTES.length
  return MOTIVATIONAL_QUOTES[idx]
}

export function padTime(n: number): string {
  return String(Math.floor(n)).padStart(2, '0')
}

export function formatTimer(seconds: number): string {
  return `${padTime(seconds / 60)}:${padTime(seconds % 60)}`
}
