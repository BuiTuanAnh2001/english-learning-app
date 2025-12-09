import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware/auth'

// GET - Search users to add as friends
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const userId = user.userId
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q') || ''

    if (query.length < 2) {
      return NextResponse.json({ success: true, data: [] })
    }

    // Search users by name or email (excluding current user)
    const users = await prisma.user.findMany({
      where: {
        AND: [
          { id: { not: userId } },
          {
            OR: [
              { name: { contains: query, mode: 'insensitive' } },
              { email: { contains: query, mode: 'insensitive' } }
            ]
          }
        ]
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true
      },
      take: 20
    })

    // Get existing friendships to mark users appropriately
    const friendships = await prisma.friendship.findMany({
      where: {
        OR: [
          { senderId: userId },
          { receiverId: userId }
        ]
      },
      select: {
        senderId: true,
        receiverId: true,
        status: true
      }
    })

    // Create a map of user relationships
    const relationshipMap = new Map()
    friendships.forEach(f => {
      const otherId = f.senderId === userId ? f.receiverId : f.senderId
      relationshipMap.set(otherId, {
        status: f.status,
        isSender: f.senderId === userId
      })
    })

    // Add relationship info to users
    const usersWithRelationship = users.map(user => ({
      ...user,
      relationship: relationshipMap.get(user.id) || null
    }))

    return NextResponse.json({ success: true, data: usersWithRelationship })
  } catch (error) {
    console.error('Error searching users:', error)
    return NextResponse.json({ success: false, error: 'Failed to search users' }, { status: 500 })
  }
}
