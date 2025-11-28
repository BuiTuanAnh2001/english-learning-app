import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/lessons/[id] - Get a specific lesson
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const lesson = await prisma.lesson.findUnique({
      where: { id: params.id },
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
        }
      }
    })

    if (!lesson) {
      return NextResponse.json(
        { success: false, error: 'Lesson not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: lesson
    })
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch lesson' },
      { status: 500 }
    )
  }
}

// PUT /api/lessons/[id] - Update a lesson
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const {
      title,
      description,
      level,
      duration,
      categoryId,
      thumbnailUrl,
      vocabulary,
      phrases,
      dialogues,
      objectives,
      tips
    } = body

    // Update lesson
    const lesson = await prisma.lesson.update({
      where: { id: params.id },
      data: {
        title,
        description,
        level,
        duration,
        categoryId,
        thumbnailUrl,
        ...(vocabulary && {
          vocabulary: {
            deleteMany: {},
            create: vocabulary.map((v: any, index: number) => ({
              word: v.word,
              pronunciation: v.pronunciation,
              meaning: v.meaning,
              example: v.example,
              imageUrl: v.imageUrl,
              tags: v.tags || [],
              order: index
            }))
          }
        }),
        ...(phrases && {
          phrases: {
            deleteMany: {},
            create: phrases.map((p: any, index: number) => ({
              phrase: p.phrase,
              meaning: p.meaning,
              example: p.example,
              context: p.context,
              imageUrl: p.imageUrl,
              order: index
            }))
          }
        }),
        ...(dialogues && {
          dialogues: {
            deleteMany: {},
            create: dialogues.map((d: any, index: number) => ({
              speaker: d.speaker,
              text: d.text,
              translation: d.translation,
              emotion: d.emotion,
              gender: d.gender,
              order: index
            }))
          }
        }),
        ...(objectives && {
          objectives: {
            deleteMany: {},
            create: objectives.map((obj: string, index: number) => ({
              text: obj,
              order: index
            }))
          }
        }),
        ...(tips && {
          tips: {
            deleteMany: {},
            create: tips.map((tip: string, index: number) => ({
              text: tip,
              order: index
            }))
          }
        })
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
    })
  } catch (error) {
    console.error('Error updating lesson:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update lesson' },
      { status: 500 }
    )
  }
}

// DELETE /api/lessons/[id] - Delete a lesson
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lesson.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Lesson deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete lesson' },
      { status: 500 }
    )
  }
}
