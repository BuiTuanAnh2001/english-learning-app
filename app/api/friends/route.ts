import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware/auth'

// GET - Get all friends and friend requests
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') || 'all' // all, friends, pending, sent

    let friendships = []

    if (type === 'friends') {
      // Get accepted friends only
      friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { senderId: userId, status: 'ACCEPTED' },
            { receiverId: userId, status: 'ACCEPTED' }
          ]
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true, createdAt: true }
          },
          receiver: {
            select: { id: true, name: true, email: true, createdAt: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    } else if (type === 'pending') {
      // Get pending friend requests received
      friendships = await prisma.friendship.findMany({
        where: {
          receiverId: userId,
          status: 'PENDING'
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true, createdAt: true }
          },
          receiver: {
            select: { id: true, name: true, email: true, createdAt: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else if (type === 'sent') {
      // Get sent friend requests
      friendships = await prisma.friendship.findMany({
        where: {
          senderId: userId,
          status: 'PENDING'
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true, createdAt: true }
          },
          receiver: {
            select: { id: true, name: true, email: true, createdAt: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      })
    } else {
      // Get all friendships
      friendships = await prisma.friendship.findMany({
        where: {
          OR: [
            { senderId: userId },
            { receiverId: userId }
          ]
        },
        include: {
          sender: {
            select: { id: true, name: true, email: true, createdAt: true }
          },
          receiver: {
            select: { id: true, name: true, email: true, createdAt: true }
          }
        },
        orderBy: { updatedAt: 'desc' }
      })
    }

    // Transform data to include friend info
    const transformedData = friendships.map(friendship => ({
      ...friendship,
      friend: friendship.senderId === userId ? friendship.receiver : friendship.sender,
      isReceiver: friendship.receiverId === userId
    }))

    return NextResponse.json({ success: true, data: transformedData })
  } catch (error) {
    console.error('Error fetching friends:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch friends' }, { status: 500 })
  }
}

// POST - Send friend request
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId
    const { receiverId } = await request.json()

    if (!receiverId) {
      return NextResponse.json({ success: false, error: 'Receiver ID is required' }, { status: 400 })
    }

    if (receiverId === userId) {
      return NextResponse.json({ success: false, error: 'Cannot send friend request to yourself' }, { status: 400 })
    }

    // Check if receiver exists
    const receiver = await prisma.user.findUnique({
      where: { id: receiverId }
    })

    if (!receiver) {
      return NextResponse.json({ success: false, error: 'User not found' }, { status: 404 })
    }

    // Check if friendship already exists
    const existingFriendship = await prisma.friendship.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId },
          { senderId: receiverId, receiverId: userId }
        ]
      }
    })

    if (existingFriendship) {
      return NextResponse.json({ 
        success: false, 
        error: 'Friend request already exists or you are already friends' 
      }, { status: 400 })
    }

    // Create friend request
    const friendship = await prisma.friendship.create({
      data: {
        senderId: userId,
        receiverId,
        status: 'PENDING'
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
        type: 'FRIEND_REQUEST',
        title: 'Lời mời kết bạn mới',
        message: `${user.email || user.email} muốn kết bạn với bạn`,
        data: JSON.stringify({ friendshipId: friendship.id, senderId: userId })
      }
    })

    return NextResponse.json({ success: true, data: friendship })
  } catch (error) {
    console.error('Error sending friend request:', error)
    return NextResponse.json({ success: false, error: 'Failed to send friend request' }, { status: 500 })
  }
}
