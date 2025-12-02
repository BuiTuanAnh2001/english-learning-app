import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/lessons - Get all lessons with optional filters
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const category = searchParams.get('category')
    const level = searchParams.get('level')
    const search = searchParams.get('search')

    const where: any = {}

    if (category) {
      where.category = { name: category }
    }

    if (level) {
      where.level = level
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
      ]
    }

    const lessons = await prisma.lesson.findMany({
      where,
      include: {
        category: true,
        vocabulary: {
          orderBy: { order: 'asc' }
        },
        phrases: {
          orderBy: { order: 'asc' }
        },
        dialogues: {
          orderBy: { order: 'asc' }
        },
        objectives: {
          orderBy: { order: 'asc' }
        },
        tips: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            vocabulary: true,
            phrases: true,
            dialogues: true,
          }
        }
      },
      orderBy: [
        { level: 'asc' },
        { createdAt: 'asc' }
      ]
    })

    // Custom sort by level order: beginner -> intermediate -> advanced
    const levelOrder = { beginner: 1, intermediate: 2, advanced: 3 }
    const sortedLessons = lessons.sort((a, b) => {
      const levelDiff = (levelOrder[a.level as keyof typeof levelOrder] || 99) - 
                        (levelOrder[b.level as keyof typeof levelOrder] || 99)
      if (levelDiff !== 0) return levelDiff
      // Same level: sort by creation date (older first)
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })

    return NextResponse.json({
      success: true,
      data: sortedLessons,
      count: sortedLessons.length
    })
  } catch (error: any) {
    console.error('Error fetching lessons:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch lessons',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// POST /api/lessons - Create a new lesson
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      level,
      duration,
      categoryId,
      thumbnailUrl,
      vocabulary = [],
      phrases = [],
      dialogues = [],
      objectives = [],
      tips = []
    } = body

    // Validate required fields
    if (!title || !description || !level || !categoryId) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create lesson with all related data
    const lesson = await prisma.lesson.create({
      data: {
        title,
        description,
        level,
        duration: duration || '15 phút',
        thumbnailUrl,
        categoryId,
        vocabulary: {
          create: vocabulary.map((v: any, index: number) => ({
            word: v.word,
            pronunciation: v.pronunciation,
            meaning: v.meaning,
            example: v.example,
            imageUrl: v.imageUrl,
            tags: v.tags || [],
            order: index
          }))
        },
        phrases: {
          create: phrases.map((p: any, index: number) => ({
            phrase: p.phrase,
            meaning: p.meaning,
            example: p.example,
            context: p.context,
            imageUrl: p.imageUrl,
            order: index
          }))
        },
        dialogues: {
          create: dialogues.map((d: any, index: number) => ({
            speaker: d.speaker,
            text: d.text,
            translation: d.translation,
            emotion: d.emotion,
            gender: d.gender,
            order: index
          }))
        },
        objectives: {
          create: objectives.map((obj: string, index: number) => ({
            text: obj,
            order: index
          }))
        },
        tips: {
          create: tips.map((tip: string, index: number) => ({
            text: tip,
            order: index
          }))
        }
      },
      include: {
        category: true,
        vocabulary: true,
        phrases: true,
        dialogues: true,
        objectives: true,
        tips: true
      }
    })

    return NextResponse.json({
      success: true,
      data: lesson
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating lesson:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create lesson' },
      { status: 500 }
    )
  }
}
