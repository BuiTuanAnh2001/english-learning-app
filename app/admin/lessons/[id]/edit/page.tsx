'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LessonForm } from '@/components/admin/lesson-form'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { getLessonById, updateLesson, getCategories } from '@/lib/services/api'
import { Lesson } from '@/lib/types'

function EditLessonPageContent() {
  const router = useRouter()
  const params = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const id = params.id as string
        const [foundLesson, cats] = await Promise.all([
          getLessonById(id),
          getCategories()
        ])
        setLesson(foundLesson)
        setCategories(cats)
      } catch (err) {
        setError('Không tìm thấy bài học')
        console.error('Error fetching lesson:', err)
        setTimeout(() => router.push('/admin'), 2000)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id, router])

  const handleSubmit = async (data: Omit<Lesson, 'id'>) => {
    try {
      const id = params.id as string
      
      // Find categoryId from category name
      const categoryName = typeof data.category === 'string' ? data.category : (data.category as any)?.name
      const category = categories.find(c => c.name === categoryName)
      
      if (!category) {
        alert('Không tìm thấy category. Vui lòng chọn lại.')
        return
      }

      // Transform data to match API format
      const lessonData = {
        title: data.title,
        description: data.description,
        level: data.level,
        duration: data.duration,
        categoryId: category.id,
        thumbnailUrl: data.thumbnailUrl,
        vocabulary: data.vocabulary || [],
        phrases: data.phrases || [],
        dialogues: data.dialogues || [],
        objectives: data.objectives || [],
        tips: data.tips || []
      }

      await updateLesson(id, lessonData as any)
      alert('Bài học đã được cập nhật thành công!')
      router.push('/admin')
    } catch (error) {
      console.error('Error updating lesson:', error)
      alert('Có lỗi xảy ra khi cập nhật bài học')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (error || !lesson) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-20">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <p className="text-lg mb-4">{error || 'Không tìm thấy bài học'}</p>
          <Button onClick={() => router.push('/admin')}>Quay về trang admin</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <h1 className="text-4xl font-bold mb-2">Chỉnh sửa bài học</h1>
        <p className="text-muted-foreground">
          Cập nhật thông tin bài học: {lesson.title}
        </p>
      </div>

      <LessonForm
        initialData={lesson}
        onSubmit={handleSubmit}
        isEditing
        categories={categories}
      />
    </div>
  )
}

export default function EditLessonPage() {
  return (
    <ProtectedRoute>
      <EditLessonPageContent />
    </ProtectedRoute>
  )
}
