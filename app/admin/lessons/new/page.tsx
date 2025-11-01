'use client'

import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LessonForm } from '@/components/admin/lesson-form'
import { ProtectedRoute } from '@/components/auth/protected-route'
import { createLesson, updateCategoryLessonCount } from '@/lib/services/storage'
import { Lesson } from '@/lib/types'

function NewLessonPageContent() {
  const router = useRouter()

  const handleSubmit = (data: Omit<Lesson, 'id'>) => {
    try {
      const newLesson = createLesson(data)
      updateCategoryLessonCount(newLesson.category)
      alert('Bài học đã được tạo thành công!')
      router.push('/admin')
    } catch (error) {
      console.error('Error creating lesson:', error)
      alert('Có lỗi xảy ra khi tạo bài học')
    }
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
        <h1 className="text-4xl font-bold mb-2">Tạo bài học mới</h1>
        <p className="text-muted-foreground">
          Thêm từ vựng, cụm từ và hội thoại cho bài học của bạn
        </p>
      </div>

      <LessonForm onSubmit={handleSubmit} />
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
