import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/categories - Get all categories with lesson count
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: { lessons: true }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })

    // Transform to include lessonCount
    const categoriesWithCount = categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      description: cat.description,
      icon: cat.icon,
      lessonCount: cat._count.lessons,
      createdAt: cat.createdAt,
      updatedAt: cat.updatedAt
    }))

    return NextResponse.json({
      success: true,
      data: categoriesWithCount
    })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch categories' },
      { status: 500 }
    )
  }
}

// POST /api/categories - Create a new category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, description, icon } = body

    if (!name || !description || !icon) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const category = await prisma.category.create({
      data: {
        name,
        description,
        icon
      }
    })

    return NextResponse.json({
      success: true,
      data: category
    }, { status: 201 })
  } catch (error) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create category' },
      { status: 500 }
    )
  }
}
