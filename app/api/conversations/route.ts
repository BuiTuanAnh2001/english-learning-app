import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { prisma } from '@/lib/prisma'

// GET /api/conversations - Get all conversations for current user
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        members: {
          some: {
            userId: session.user.id
          }
        }
      },
      include: {
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
                status: true,
                lastSeen: true
              }
            }
          }
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: {
            messages: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    // Calculate unread count for each conversation
    const conversationsWithUnread = await Promise.all(
      conversations.map(async (conv) => {
        const member = conv.members.find(m => m.userId === session.user.id)
        const unreadCount = await prisma.message.count({
          where: {
            conversationId: conv.id,
            createdAt: {
              gt: member?.lastReadAt || new Date(0)
            },
            senderId: {
              not: session.user.id
            }
          }
        })

        return {
          ...conv,
          unreadCount
        }
      })
    )

    return NextResponse.json({ success: true, data: conversationsWithUnread })
  } catch (error) {
    console.error('Error fetching conversations:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST /api/conversations - Create new conversation
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, participantEmail, userIds, name, type = 'DIRECT' } = body

    // For direct messages
    if (type === 'DIRECT') {
      let targetUserId = userId

      // If participantEmail is provided, find user by email
      if (participantEmail && !targetUserId) {
        const targetUser = await prisma.user.findUnique({
          where: { email: participantEmail }
        })

        if (!targetUser) {
          return NextResponse.json({ 
            success: false,
            error: 'Không tìm thấy người dùng với email này' 
          }, { status: 404 })
        }

        if (targetUser.id === session.user.id) {
          return NextResponse.json({ 
            success: false,
            error: 'Không thể tạo cuộc trò chuyện với chính mình' 
          }, { status: 400 })
        }

        targetUserId = targetUser.id
      }

      if (!targetUserId) {
        return NextResponse.json({ 
          success: false,
          error: 'Vui lòng cung cấp userId hoặc participantEmail' 
        }, { status: 400 })
      }

      // Check if conversation already exists
      const existing = await prisma.conversation.findFirst({
        where: {
          type: 'DIRECT',
          AND: [
            { members: { some: { userId: session.user.id } } },
            { members: { some: { userId: targetUserId } } }
          ]
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                  status: true
                }
              }
            }
          }
        }
      })

      if (existing) {
        return NextResponse.json({ success: true, data: existing })
      }

      // Create new direct conversation
      const conversation = await prisma.conversation.create({
        data: {
          type: 'DIRECT',
          members: {
            create: [
              { userId: session.user.id, role: 'MEMBER' },
              { userId: targetUserId, role: 'MEMBER' }
            ]
          }
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                  status: true
                }
              }
            }
          }
        }
      })

      return NextResponse.json({ success: true, data: conversation })
    }

    // For group conversations
    if (type === 'GROUP' && userIds && userIds.length > 0) {
      if (!name) {
        return NextResponse.json({ error: 'Group name required' }, { status: 400 })
      }

      const conversation = await prisma.conversation.create({
        data: {
          type: 'GROUP',
          name,
          members: {
            create: [
              { userId: session.user.id, role: 'OWNER' },
              ...userIds.map((uid: string) => ({ userId: uid, role: 'MEMBER' }))
            ]
          }
        },
        include: {
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  avatar: true,
                  status: true
                }
              }
            }
          }
        }
      })

      return NextResponse.json({ success: true, data: conversation })
    }

    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  } catch (error) {
    console.error('Error creating conversation:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
