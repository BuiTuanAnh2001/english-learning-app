import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware/auth'

// GET - Get messages with a specific user
export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const currentUserId = user.userId
    const otherUserId = params.userId

    // Get all messages between the two users
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: currentUserId, receiverId: otherUserId },
          { senderId: otherUserId, receiverId: currentUserId }
        ]
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true }
        },
        receiver: {
          select: { id: true, name: true, email: true }
        }
      },
      orderBy: { createdAt: 'asc' }
    })

    // Mark messages as read
    await prisma.message.updateMany({
      where: {
        senderId: otherUserId,
        receiverId: currentUserId,
        read: false
      },
      data: {
        read: true,
        readAt: new Date()
      }
    })

    return NextResponse.json({ success: true, data: messages })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// POST - Send a message to a user
export async function POST(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const senderId = user.userId
    const receiverId = params.userId
    const { content } = await request.json()

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: 'Message content is required' }, { status: 400 })
    }

    // Check if users are friends
    const friendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId, receiverId, status: 'ACCEPTED' },
          { senderId: receiverId, receiverId: senderId, status: 'ACCEPTED' }
        ]
      }
    })

    if (!friendship) {
      return NextResponse.json({ 
        success: false, 
        error: 'You can only message your friends' 
      }, { status: 403 })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        senderId,
        receiverId,
        content: content.trim()
      },
      include: {
        sender: {
          select: { id: true, name: true, email: true }
        },
        receiver: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    // Create notification for receiver
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: 'NEW_MESSAGE',
        title: 'Tin nhắn mới',
        message: `${user.email || user.email} đã gửi tin nhắn cho bạn`,
        data: JSON.stringify({ messageId: message.id, senderId })
      }
    })

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ success: false, error: 'Failed to send message' }, { status: 500 })
  }
}
