import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Find the other user in the database (since only two members use this app)
  const otherUser = await prisma.user.findFirst({
    where: {
      id: { not: session.user.id },
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      xp: true,
      level: true,
    },
  })

  if (!otherUser) {
    return NextResponse.json({ error: 'No partner user found' }, { status: 404 })
  }

  const messages = await prisma.chatMessage.findMany({
    where: {
      OR: [
        { senderId: session.user.id, receiverId: otherUser.id },
        { senderId: otherUser.id, receiverId: session.user.id },
      ],
    },
    orderBy: {
      createdAt: 'asc',
    },
  })

  return NextResponse.json({ messages, partner: otherUser })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const otherUser = await prisma.user.findFirst({
    where: {
      id: { not: session.user.id },
    },
  })

  if (!otherUser) {
    return NextResponse.json({ error: 'No partner user found' }, { status: 404 })
  }

  try {
    const body = await req.json()
    const { message } = body

    if (!message || typeof message !== 'string' || message.trim() === '') {
      return NextResponse.json({ error: 'Message content is required' }, { status: 400 })
    }

    const newMessage = await prisma.chatMessage.create({
      data: {
        message: message.trim(),
        senderId: session.user.id,
        receiverId: otherUser.id,
      },
    })

    return NextResponse.json({ message: newMessage }, { status: 201 })
  } catch (error) {
    console.error('Error creating chat message:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
