import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({
  mode: z.enum(['POMODORO_25', 'POMODORO_50', 'POMODORO_90', 'CUSTOM']),
  durationMinutes: z.number().min(1),
  completed: z.boolean().default(true),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const session_db = await prisma.studySession.create({
    data: { userId: session.user.id, ...parsed.data, endedAt: new Date() },
  })
  return NextResponse.json({ session: session_db }, { status: 201 })
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const sessions = await prisma.studySession.findMany({
    where: { userId: session.user.id },
    orderBy: { startedAt: 'desc' },
    take: 10,
  })
  const totalMinutes = sessions.reduce((s, x) => s + x.durationMinutes, 0)
  return NextResponse.json({ sessions, totalMinutes })
}
