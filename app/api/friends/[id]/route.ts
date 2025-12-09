import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware/auth'

// PUT - Accept or reject friend request
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId
    const friendshipId = params.id
    const { action } = await request.json() // 'accept' or 'reject'

    if (!['accept', 'reject'].includes(action)) {
      return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 })
    }

    // Find friendship
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId },
      include: {
        sender: {
          select: { id: true, name: true, email: true }
        }
      }
    })

    if (!friendship) {
      return NextResponse.json({ success: false, error: 'Friend request not found' }, { status: 404 })
    }

    // Check if user is the receiver
    if (friendship.receiverId !== userId) {
      return NextResponse.json({ success: false, error: 'You cannot respond to this request' }, { status: 403 })
    }

    // Update friendship status
    const updatedFriendship = await prisma.friendship.update({
      where: { id: friendshipId },
      data: {
        status: action === 'accept' ? 'ACCEPTED' : 'REJECTED'
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

    // Create notification for sender if accepted
    if (action === 'accept') {
      await prisma.notification.create({
        data: {
          userId: friendship.senderId,
          type: 'FRIEND_ACCEPTED',
          title: 'Lời mời kết bạn được chấp nhận',
          message: `${user.email || user.email} đã chấp nhận lời mời kết bạn của bạn`,
          data: JSON.stringify({ friendshipId: friendship.id, userId })
        }
      })
    }

    return NextResponse.json({ success: true, data: updatedFriendship })
  } catch (error) {
    console.error('Error updating friendship:', error)
    return NextResponse.json({ success: false, error: 'Failed to update friendship' }, { status: 500 })
  }
}

// DELETE - Remove friend or cancel friend request
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId
    const friendshipId = params.id

    // Find friendship
    const friendship = await prisma.friendship.findUnique({
      where: { id: friendshipId }
    })

    if (!friendship) {
      return NextResponse.json({ success: false, error: 'Friendship not found' }, { status: 404 })
    }

    // Check if user is involved in this friendship
    if (friendship.senderId !== userId && friendship.receiverId !== userId) {
      return NextResponse.json({ success: false, error: 'You cannot delete this friendship' }, { status: 403 })
    }

    // Delete friendship
    await prisma.friendship.delete({
      where: { id: friendshipId }
    })

    return NextResponse.json({ success: true, message: 'Friendship deleted' })
  } catch (error) {
    console.error('Error deleting friendship:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete friendship' }, { status: 500 })
  }
}
