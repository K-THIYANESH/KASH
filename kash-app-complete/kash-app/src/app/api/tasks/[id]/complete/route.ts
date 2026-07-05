import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const existing = await prisma.taskCompletion.findUnique({
    where: { taskId_userId: { taskId: params.id, userId: session.user.id } },
  })

  if (existing) {
    await prisma.taskCompletion.delete({ where: { taskId_userId: { taskId: params.id, userId: session.user.id } } })
    const task = await prisma.task.findUnique({ where: { id: params.id } })
    if (task) await prisma.user.update({ where: { id: session.user.id }, data: { xp: { decrement: task.xpReward } } })
    return NextResponse.json({ completed: false })
  }

  const task = await prisma.task.findUnique({ where: { id: params.id } })
  if (!task) return NextResponse.json({ error: 'Task not found' }, { status: 404 })

  await prisma.taskCompletion.create({ data: { taskId: params.id, userId: session.user.id, xpEarned: task.xpReward } })
  const user = await prisma.user.update({ where: { id: session.user.id }, data: { xp: { increment: task.xpReward } } })

  return NextResponse.json({ completed: true, xpEarned: task.xpReward, newXP: user.xp })
}
