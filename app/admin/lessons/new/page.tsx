'use client'

import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LessonForm } from '@/components/admin/lesson-form'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { createLesson, getCategories } from '@/lib/services/api'
import { Lesson } from '@/lib/types'

function NewLessonPageContent() {
  const router = useRouter()
  const [categories, setCategories] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const cats = await getCategories()
        setCategories(cats)
      } catch (error) {
        console.error('Error fetching categories:', error)
        alert('Không thể tải categories. Vui lòng refresh trang.')
      } finally {
        setLoading(false)
      }
    }
    fetchCategories()
  }, [])

  const handleSubmit = async (data: Omit<Lesson, 'id'>) => {
    try {
      console.log('Submitting lesson data:', data)
      console.log('Available categories:', categories)
      
      // Validate category
      if (!data.category || data.category.trim() === '') {
        alert('Vui lòng chọn danh mục!')
        return
      }
      
      // Find categoryId from category name
      const category = categories.find(c => c.name === data.category || c.id === data.category)
      
      if (!category) {
        console.error('Category not found. Looking for:', data.category)
        console.error('Available categories:', categories.map(c => ({ id: c.id, name: c.name })))
        alert(`Không tìm thấy category "${data.category}". Categories có sẵn: ${categories.map(c => c.name).join(', ')}`)
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

      console.log('Transformed lesson data:', lessonData)
      await createLesson(lessonData as any)
      alert('Bài học đã được tạo thành công!')
      router.push('/admin')
    } catch (error: any) {
      console.error('Error creating lesson:', error)
      const errorMessage = error?.message || 'Có lỗi xảy ra khi tạo bài học'
      alert(`Lỗi: ${errorMessage}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4 gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Quay lại
        </Button>
        <h1 className="text-4xl font-bold mb-2">Tạo bài học mới</h1>
        <p className="text-muted-foreground">
          Thêm từ vựng, cụm từ và hội thoại cho bài học của bạn
        </p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Đang tải...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-red-500 mb-4">Không thể tải danh mục. Vui lòng thử lại.</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      ) : (
        <LessonForm onSubmit={handleSubmit} categories={categories} />
      )}
    </div>
  )
}

export default function NewLessonPage() {
  return (
    <ProtectedRoute>
      <NewLessonPageContent />
    </ProtectedRoute>
  )
}
