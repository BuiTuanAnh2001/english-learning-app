import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware/auth'

// GET /api/vocabulary-notes - Get user's vocabulary notes
export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const mastered = searchParams.get('mastered')
    const search = searchParams.get('search')
    const tag = searchParams.get('tag')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const where: any = {
      userId: user.userId
    }

    if (mastered !== null) {
      where.mastered = mastered === 'true'
    }

    if (search) {
      where.OR = [
        { word: { contains: search, mode: 'insensitive' } },
        { meaning: { contains: search, mode: 'insensitive' } },
        { personalNote: { contains: search, mode: 'insensitive' } },
      ]
    }

    if (tag) {
      where.tags = { has: tag }
    }

    const notes = await (prisma as any).vocabularyNote.findMany({
      where,
      orderBy: {
        [sortBy]: sortOrder
      }
    })

    // Get unique tags for filtering
    const allNotes = await (prisma as any).vocabularyNote.findMany({
      where: { userId: user.userId },
      select: { tags: true }
    })
    const allTags = [...new Set(allNotes.flatMap((n: any) => n.tags))]

    // Stats
    const stats = {
      total: await (prisma as any).vocabularyNote.count({ where: { userId: user.userId } }),
      mastered: await (prisma as any).vocabularyNote.count({ where: { userId: user.userId, mastered: true } }),
      learning: await (prisma as any).vocabularyNote.count({ where: { userId: user.userId, mastered: false } }),
    }

    return NextResponse.json({
      success: true,
      data: notes,
      tags: allTags,
      stats
    })
  } catch (error: any) {
    console.error('Error fetching vocabulary notes:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch vocabulary notes' },
      { status: 500 }
    )
  }
}

// POST /api/vocabulary-notes - Add a new vocabulary note
export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { word, pronunciation, meaning, example, personalNote, context, difficulty, tags } = body

    if (!word || !meaning) {
      return NextResponse.json(
        { success: false, error: 'Word and meaning are required' },
        { status: 400 }
      )
    }

    // Check if word already exists for this user
    const existing = await (prisma as any).vocabularyNote.findUnique({
      where: {
        userId_word: {
          userId: user.userId,
          word: word.toLowerCase().trim()
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { success: false, error: 'This word is already in your notebook' },
        { status: 409 }
      )
    }

    const note = await (prisma as any).vocabularyNote.create({
      data: {
        userId: user.userId,
        word: word.toLowerCase().trim(),
        pronunciation: pronunciation || null,
        meaning,
        example: example || null,
        personalNote: personalNote || null,
        context: context || null,
        difficulty: difficulty || 3,
        tags: tags || []
      }
    })

    return NextResponse.json({
      success: true,
      data: note,
      message: 'Vocabulary added to your notebook!'
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error creating vocabulary note:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to save vocabulary' },
      { status: 500 }
    )
  }
}
