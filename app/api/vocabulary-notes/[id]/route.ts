import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { authenticateRequest } from '@/lib/middleware/auth'

// GET /api/vocabulary-notes/[id] - Get a single note
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const note = await (prisma as any).vocabularyNote.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (!note) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ success: true, data: note })
  } catch (error) {
    console.error('Error fetching note:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch note' },
      { status: 500 }
    )
  }
}

// PUT /api/vocabulary-notes/[id] - Update a note
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check ownership
    const existing = await (prisma as any).vocabularyNote.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const { personalNote, difficulty, mastered, tags, reviewCount, lastReviewed } = body

    const note = await (prisma as any).vocabularyNote.update({
      where: { id: params.id },
      data: {
        personalNote: personalNote !== undefined ? personalNote : existing.personalNote,
        difficulty: difficulty !== undefined ? difficulty : existing.difficulty,
        mastered: mastered !== undefined ? mastered : existing.mastered,
        tags: tags !== undefined ? tags : existing.tags,
        reviewCount: reviewCount !== undefined ? reviewCount : existing.reviewCount,
        lastReviewed: lastReviewed !== undefined ? new Date(lastReviewed) : existing.lastReviewed,
      }
    })

    return NextResponse.json({
      success: true,
      data: note,
      message: 'Note updated successfully'
    })
  } catch (error) {
    console.error('Error updating note:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update note' },
      { status: 500 }
    )
  }
}

// DELETE /api/vocabulary-notes/[id] - Delete a note
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Check ownership
    const existing = await (prisma as any).vocabularyNote.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      )
    }

    await (prisma as any).vocabularyNote.delete({
      where: { id: params.id }
    })

    return NextResponse.json({
      success: true,
      message: 'Note deleted successfully'
    })
  } catch (error) {
    console.error('Error deleting note:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete note' },
      { status: 500 }
    )
  }
}

// PATCH /api/vocabulary-notes/[id]/review - Mark as reviewed
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await authenticateRequest(request)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const existing = await (prisma as any).vocabularyNote.findFirst({
      where: {
        id: params.id,
        userId: user.userId
      }
    })

    if (!existing) {
      return NextResponse.json(
        { success: false, error: 'Note not found' },
        { status: 404 }
      )
    }

    const note = await (prisma as any).vocabularyNote.update({
      where: { id: params.id },
      data: {
        reviewCount: existing.reviewCount + 1,
        lastReviewed: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      data: note,
      message: 'Review recorded!'
    })
  } catch (error) {
    console.error('Error recording review:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to record review' },
      { status: 500 }
    )
  }
}
