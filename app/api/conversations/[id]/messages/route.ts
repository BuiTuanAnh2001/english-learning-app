import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const searchParams = request.nextUrl.searchParams
    const limit = parseInt(searchParams.get('limit') || '50')
    const before = searchParams.get('before') // Message ID for pagination

    const messages = await prisma.message.findMany({
      where: {
        conversationId: params.id,
        deleted: false,
        ...(before && {
          id: { lt: before }
        })
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                name: true
              }
            }
          }
        },
        readReceipts: {
          select: {
            userId: true,
            readAt: true
          }
        },
        reactions: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    })

    return NextResponse.json({ success: true, data: messages.reverse() })
  } catch (error) {
    console.error('Error fetching messages:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { content, type = 'TEXT', fileUrl, fileName, fileSize, replyToId } = body

    if (!content && !fileUrl) {
      return NextResponse.json({ error: 'Content or file required' }, { status: 400 })
    }

    // Verify user is member of conversation
    const member = await prisma.conversationMember.findFirst({
      where: {
        conversationId: params.id,
        userId: session.user.id
      }
    })

    if (!member) {
      return NextResponse.json({ error: 'Not a member of this conversation' }, { status: 403 })
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        conversationId: params.id,
        senderId: session.user.id,
        content: content || '',
        type,
        fileUrl,
        fileName,
        fileSize,
        replyToId
      },
      include: {
        sender: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        },
        replyTo: {
          select: {
            id: true,
            content: true,
            sender: {
              select: {
                name: true
              }
            }
          }
        }
      }
    })

    // Update conversation timestamp
    await prisma.conversation.update({
      where: { id: params.id },
      data: { updatedAt: new Date() }
    })

    // Broadcast realtime event via Supabase
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || `https://vehatkcukaloprvqcejz.supabase.co`;
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

      if (supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey);

        // Broadcast to channel - this will trigger postgres_changes listener
        const channel = supabase.channel(`conversation:${params.id}`);

        await channel.send({
          type: 'broadcast',
          event: 'new_message',
          payload: {
            id: message.id,
            conversationId: params.id,
            senderId: message.senderId,
            senderName: message.sender?.name,
            senderAvatar: message.sender?.avatar,
            content: message.content,
            type: message.type,
            createdAt: message.createdAt,
            fileUrl: message.fileUrl,
            fileName: message.fileName,
          }
        });

        console.log('✅ Realtime event broadcasted for message:', message.id);
      }
    } catch (broadcastError) {
      console.error('⚠️ Failed to broadcast realtime event:', broadcastError);
      // Don't fail the request if broadcast fails
    }

    // Send push notifications to other members
    try {
      const otherMembers = await prisma.conversationMember.findMany({
        where: {
          conversationId: params.id,
          userId: { not: session.user.id },
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              pushSubscription: true,
            },
          },
        },
      });

      // Send push notification to each member
      const webpush = await import('web-push');
      const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;
      const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:support@chatapp.com';

      if (vapidPublicKey && vapidPrivateKey) {
        webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey);

        for (const member of otherMembers) {
          if (member.user.pushSubscription) {
            const subscription = member.user.pushSubscription;
            const pushSubscription = {
              endpoint: subscription.endpoint,
              keys: subscription.keys as { p256dh: string; auth: string },
            };

            const payload = JSON.stringify({
              title: message.sender?.name || 'Tin nhắn mới',
              body: message.type === 'IMAGE' ? '📷 Đã gửi một ảnh' : message.content,
              icon: message.sender?.avatar || '/icon.svg',
              image: message.type === 'IMAGE' ? message.fileUrl : undefined,
              url: `/chat?conversation=${params.id}`,
              tag: `message-${message.id}`,
              conversationId: params.id,
            });

            try {
              await webpush.sendNotification(pushSubscription, payload);
              console.log('🔔 Push notification sent to:', member.user.name);
            } catch (pushError: any) {
              console.error('⚠️ Failed to send push to:', member.user.name, pushError.message);

              // Remove invalid subscription
              if (pushError.statusCode === 410 || pushError.statusCode === 404) {
                await prisma.pushSubscription.delete({
                  where: { userId: member.user.id },
                }).catch(() => { });
              }
            }
          }
        }
      } else {
        console.warn('⚠️ VAPID keys not configured, skipping push notifications');
      }
    } catch (pushError) {
      console.error('⚠️ Failed to send push notifications:', pushError);
      // Don't fail the request if push fails
    }

    return NextResponse.json({ success: true, data: message })
  } catch (error) {
    console.error('Error sending message:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
