import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const [all, unlocked] = await Promise.all([
    prisma.achievement.findMany({ orderBy: { xpReward: 'asc' } }),
    prisma.userAchievement.findMany({ where: { userId: session.user.id } }),
  ])

  const unlockedIds = new Set(unlocked.map((u) => u.achievementId))
  return NextResponse.json({
    achievements: all.map((a) => ({ ...a, unlocked: unlockedIds.has(a.id) })),
  })
}
