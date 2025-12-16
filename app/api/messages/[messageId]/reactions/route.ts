import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { createClient } from '@supabase/supabase-js'
import { getServerSession } from 'next-auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { emoji } = await request.json()
    
    if (!emoji) {
      return NextResponse.json({ error: 'Emoji required' }, { status: 400 })
    }

    // Check if message exists
    const message = await prisma.message.findUnique({
      where: { id: params.messageId },
      include: { conversation: true }
    })

    if (!message) {
      return NextResponse.json({ error: 'Message not found' }, { status: 404 })
    }

    // Check if user already reacted with this emoji
    const existingReaction = await prisma.messageReaction.findFirst({
      where: {
        messageId: params.messageId,
        userId: session.user.id,
        emoji
      }
    })

    if (existingReaction) {
      // Remove reaction (toggle)
      await prisma.messageReaction.delete({
        where: { id: existingReaction.id }
      })

      // Broadcast removal
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vehatkcukaloprvqcejz.supabase.co'
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
        
        if (supabaseKey) {
          const supabase = createClient(supabaseUrl, supabaseKey)
          const channel = supabase.channel(`conversation:${message.conversationId}`)
          
          await channel.send({
            type: 'broadcast',
            event: 'reaction_removed',
            payload: {
              messageId: params.messageId,
              userId: session.user.id,
              emoji
            }
          })
        }
      } catch (error) {
        console.error('Failed to broadcast reaction removal:', error)
      }

      return NextResponse.json({ success: true, removed: true })
    }

    // Add new reaction
    const reaction = await prisma.messageReaction.create({
      data: {
        messageId: params.messageId,
        userId: session.user.id,
        emoji
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    // Broadcast new reaction
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vehatkcukaloprvqcejz.supabase.co'
      const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY
      
      if (supabaseKey) {
        const supabase = createClient(supabaseUrl, supabaseKey)
        const channel = supabase.channel(`conversation:${message.conversationId}`)
        
        await channel.send({
          type: 'broadcast',
          event: 'reaction_added',
          payload: {
            messageId: params.messageId,
            userId: session.user.id,
            userName: reaction.user.name,
            emoji
          }
        })
      }
    } catch (error) {
      console.error('Failed to broadcast reaction:', error)
    }

    return NextResponse.json({ success: true, data: reaction })
  } catch (error) {
    console.error('Error adding reaction:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { messageId: string } }
) {
  try {
    const reactions = await prisma.messageReaction.findMany({
      where: { messageId: params.messageId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    })

    return NextResponse.json({ success: true, data: reactions })
  } catch (error) {
    console.error('Error fetching reactions:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
