import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware/auth'

// GET - Get all conversations (list of users you've chatted with)
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId

    // Get all unique users you've exchanged messages with
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
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
      orderBy: { createdAt: 'desc' }
    })

    // Group messages by conversation partner
    const conversationsMap = new Map()
    
    messages.forEach(message => {
      const partnerId = message.senderId === userId ? message.receiverId : message.senderId
      const partner = message.senderId === userId ? message.receiver : message.sender
      
      if (!conversationsMap.has(partnerId)) {
        conversationsMap.set(partnerId, {
          partner,
          lastMessage: message,
          unreadCount: 0
        })
      }
      
      // Count unread messages
      if (message.receiverId === userId && !message.read) {
        const conv = conversationsMap.get(partnerId)
        conv.unreadCount++
      }
    })

    const conversations = Array.from(conversationsMap.values()).sort((a, b) => 
      new Date(b.lastMessage.createdAt).getTime() - new Date(a.lastMessage.createdAt).getTime()
    )

    return NextResponse.json({ success: true, data: conversations })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch conversations' }, { status: 500 })
  }
}
