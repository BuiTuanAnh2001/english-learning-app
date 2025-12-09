import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware/auth'

// GET - Get user's notifications
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId
    const { searchParams } = new URL(request.url)
    const unreadOnly = searchParams.get('unread') === 'true'

    const where: any = { userId }
    if (unreadOnly) {
      where.read = false
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 50
    })

    const unreadCount = await prisma.notification.count({
      where: { userId, read: false }
    })

    return NextResponse.json({ 
      success: true, 
      data: notifications,
      unreadCount 
    })
  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch notifications' }, { status: 500 })
  }
}

// PUT - Mark notifications as read
export async function PUT(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId
    const { notificationIds } = await request.json()

    if (!notificationIds || !Array.isArray(notificationIds)) {
      // Mark all as read
      await prisma.notification.updateMany({
        where: { userId, read: false },
        data: { read: true, readAt: new Date() }
      })
    } else {
      // Mark specific notifications as read
      await prisma.notification.updateMany({
        where: { 
          id: { in: notificationIds },
          userId 
        },
        data: { read: true, readAt: new Date() }
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error marking notifications as read:', error)
    return NextResponse.json({ success: false, error: 'Failed to update notifications' }, { status: 500 })
  }
}

// DELETE - Delete notification
export async function DELETE(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId
    const { searchParams } = new URL(request.url)
    const notificationId = searchParams.get('id')

    if (!notificationId) {
      return NextResponse.json({ success: false, error: 'Notification ID is required' }, { status: 400 })
    }

    await prisma.notification.delete({
      where: { 
        id: notificationId,
        userId 
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting notification:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete notification' }, { status: 500 })
  }
}
