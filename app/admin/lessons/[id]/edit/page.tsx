'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { LessonForm } from '@/components/admin/lesson-form'
import { getLessonById, updateLesson, updateCategoryLessonCount } from '@/lib/services/storage'
import { Lesson } from '@/lib/types'

export default function EditLessonPage() {
  const router = useRouter()
  const params = useParams()
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const id = params.id as string
    const foundLesson = getLessonById(id)
    
    if (!foundLesson) {
      alert('Không tìm thấy bài học')
      router.push('/admin')
      return
    }
    
    setLesson(foundLesson)
    setLoading(false)
  }, [params.id, router])

  const handleSubmit = (data: Omit<Lesson, 'id'>) => {
    try {
      const id = params.id as string
      const oldCategory = lesson?.category
      const updatedLesson = updateLesson(id, data)
      
      if (updatedLesson) {
        // Update lesson count for both old and new categories if changed
        if (oldCategory && oldCategory !== data.category) {
          updateCategoryLessonCount(oldCategory)
        }
        updateCategoryLessonCount(data.category)
        
        alert('Bài học đã được cập nhật thành công!')
        router.push('/admin')
      } else {
        alert('Có lỗi xảy ra khi cập nhật bài học')
      }
    } catch (error) {
      console.error('Error updating lesson:', error)
      alert('Có lỗi xảy ra khi cập nhật bài học')
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Đang tải...</div>
      </div>
    )
  }

  if (!lesson) {
    return null
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
      />
    </div>
  )
}
