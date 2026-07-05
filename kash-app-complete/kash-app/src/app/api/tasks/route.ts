import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createTaskSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
  category: z.enum(['STUDY', 'CODING', 'READING', 'FITNESS', 'PERSONAL', 'CUSTOM']).default('STUDY'),
  assigneeIds: z.array(z.string()).min(1),
  dueDate: z.string().optional(),
  estimatedMinutes: z.number().optional(),
  recurrence: z.enum(['NONE', 'DAILY', 'WEEKLY', 'MONTHLY', 'CUSTOM']).default('NONE'),
  notes: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const tasks = await prisma.task.findMany({
    include: {
      assignees: { include: { user: { select: { id: true, name: true } } } },
      completions: { select: { userId: true, completedAt: true } },
      creator: { select: { id: true, name: true } },
    },
    orderBy: [{ createdAt: 'desc' }],
  })

  return NextResponse.json({ tasks })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = createTaskSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })

  const { assigneeIds, dueDate, ...data } = parsed.data
  const xpReward = data.priority === 'HIGH' ? 25 : data.priority === 'MEDIUM' ? 15 : 10

  const task = await prisma.task.create({
    data: {
      ...data, xpReward,
      dueDate: dueDate ? new Date(dueDate) : undefined,
      creatorId: session.user.id,
      assignees: { create: assigneeIds.map((uid) => ({ userId: uid })) },
    },
    include: { assignees: { include: { user: { select: { id: true, name: true } } } } },
  })

  return NextResponse.json({ task }, { status: 201 })
}
