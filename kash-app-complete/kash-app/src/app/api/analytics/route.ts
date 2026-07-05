import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [users, completions, sessions, streaks] = await Promise.all([
    prisma.user.findMany({ select: { id: true, name: true, xp: true, level: true } }),
    prisma.taskCompletion.findMany({
      include: { task: { select: { category: true, xpReward: true, priority: true } } },
      orderBy: { completedAt: 'desc' },
    }),
    prisma.studySession.findMany({ where: { completed: true }, orderBy: { startedAt: 'desc' } }),
    prisma.streak.findMany(),
  ])

  // Weekly data (last 7 days)
  const weekly = Array.from({ length: 7 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (6 - i))
    date.setHours(0, 0, 0, 0)
    const next = new Date(date)
    next.setDate(next.getDate() + 1)

    const dayCompletions = completions.filter((c) => {
      const d = new Date(c.completedAt)
      return d >= date && d < next
    })

    return {
      day: date.toLocaleDateString('en', { weekday: 'short' }),
      date: date.toISOString().split('T')[0],
      total: dayCompletions.length,
      byUser: users.map((u) => ({
        userId: u.id,
        name: u.name,
        count: dayCompletions.filter((c) => c.userId === u.id).length,
      })),
    }
  })

  // Category distribution
  const categoryDist = ['STUDY', 'CODING', 'READING', 'FITNESS', 'PERSONAL', 'CUSTOM'].map((cat) => ({
    category: cat,
    count: completions.filter((c) => c.task.category === cat).length,
  }))

  // Total study minutes
  const totalStudyMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0)

  return NextResponse.json({
    weekly,
    categoryDist,
    totalStudyMinutes,
    totalCompletions: completions.length,
    streaks: streaks.map((s) => ({ ...s, userName: users.find((u) => u.id === s.userId)?.name })),
    users,
  })
}
