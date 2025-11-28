import { NextRequest, NextResponse } from 'next/server'
import { authenticateRequest } from '@/lib/middleware/auth'
import { prisma } from '@/lib/prisma'

// GET /api/progress - Get user's learning progress
export async function GET(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const progress = await prisma.userProgress.findMany({
      where: { userId: user.userId },
      include: {
        lesson: {
          select: {
            id: true,
            title: true,
            category: true,
            level: true,
          }
        }
      },
      orderBy: { lastAccess: 'desc' }
    })

    return NextResponse.json({
      success: true,
      data: progress
    })
  } catch (error) {
    console.error('Error fetching progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/progress - Update lesson progress
export async function POST(request: NextRequest) {
  try {
    const user = await authenticateRequest(request)
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { lessonId, completed, score } = body

    if (!lessonId) {
      return NextResponse.json(
        { error: 'Lesson ID is required' },
        { status: 400 }
      )
    }

    // Upsert user progress
    const progress = await prisma.userProgress.upsert({
      where: {
        userId_lessonId: {
          userId: user.userId,
          lessonId: lessonId
        }
      },
      update: {
        completed: completed ?? false,
        progress: score ?? 0,
        lastAccess: new Date()
      },
      create: {
        userId: user.userId,
        lessonId: lessonId,
        completed: completed ?? false,
        progress: score ?? 0,
        lastAccess: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: progress
    })
  } catch (error) {
    console.error('Error updating progress:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
