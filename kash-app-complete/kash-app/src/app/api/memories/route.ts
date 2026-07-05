import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const schema = z.object({ content: z.string().min(1).max(1000), type: z.enum(['NOTE', 'MILESTONE', 'ACHIEVEMENT', 'CELEBRATION']).default('NOTE') })

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const memories = await prisma.memory.findMany({
    include: { author: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json({ memories })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })

  const memory = await prisma.memory.create({
    data: { ...parsed.data, authorId: session.user.id },
    include: { author: { select: { id: true, name: true } } },
  })
  return NextResponse.json({ memory }, { status: 201 })
}
