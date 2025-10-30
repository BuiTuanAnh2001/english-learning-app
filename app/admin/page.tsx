'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2, BookOpen, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { getLessons, deleteLesson, initializeStorage, updateCategoryLessonCount } from '@/lib/services/storage'
import { Lesson } from '@/lib/types'

export default function AdminPage() {
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  useEffect(() => {
    initializeStorage()
    loadLessons()
  }, [])

  const loadLessons = () => {
    const allLessons = getLessons()
    setLessons(allLessons)
  }

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài học này?')) {
      const lesson = lessons.find(l => l.id === id)
      if (lesson && deleteLesson(id)) {
        updateCategoryLessonCount(lesson.category)
        loadLessons()
      }
    }
  }

  const filteredLessons = lessons.filter(lesson => {
    const matchesSearch = lesson.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         lesson.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || lesson.category === filterCategory
    return matchesSearch && matchesCategory
  })

  const categories = [
    { id: 'all', name: 'Tất cả' },
    { id: 'daily', name: 'Giao tiếp hàng ngày' },
    { id: 'business', name: 'Tiếng Anh thương mại' },
    { id: 'travel', name: 'Tiếng Anh du lịch' },
    { id: 'beginner', name: 'Dành cho người mới' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
          <p className="text-muted-foreground">Quản lý bài học và từ vựng</p>
        </div>
        <Link href="/admin/lessons/new">
          <Button size="lg" className="gap-2">
            <Plus className="w-5 h-5" />
            Thêm bài học mới
          </Button>
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng số bài học</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lessons.length}</div>
            <p className="text-xs text-muted-foreground">bài học đã tạo</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Từ vựng</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.reduce((sum, lesson) => sum + lesson.vocabulary.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">từ trong tổng số bài</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Hội thoại</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {lessons.reduce((sum, lesson) => sum + lesson.dialogues.length, 0)}
            </div>
            <p className="text-xs text-muted-foreground">đoạn hội thoại</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Tìm kiếm bài học..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((cat) => (
            <Button
              key={cat.id}
              variant={filterCategory === cat.id ? 'default' : 'outline'}
              onClick={() => setFilterCategory(cat.id)}
              size="sm"
            >
              {cat.name}
            </Button>
          ))}
        </div>
      </div>

      {/* Lessons List */}
      <div className="space-y-4">
        {filteredLessons.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <BookOpen className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">
                {searchQuery ? 'Không tìm thấy bài học nào' : 'Chưa có bài học nào'}
              </p>
              <Link href="/admin/lessons/new">
                <Button>Tạo bài học đầu tiên</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          filteredLessons.map((lesson) => (
            <Card key={lesson.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{lesson.title}</h3>
                      <Badge variant={
                        lesson.level === 'beginner' ? 'default' :
                        lesson.level === 'intermediate' ? 'secondary' : 'accent'
                      }>
                        {lesson.level}
                      </Badge>
                    </div>
                    <p className="text-muted-foreground mb-3">{lesson.description}</p>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>⏱️ {lesson.duration}</span>
                      <span>📚 {lesson.vocabulary.length} từ vựng</span>
                      <span>💬 {lesson.dialogues.length} hội thoại</span>
                      <span>📝 {lesson.phrases.length} cụm từ</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/admin/lessons/${lesson.id}/edit`}>
                      <Button variant="outline" size="sm" className="w-9 h-9 p-0">
                        <Edit className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-9 h-9 p-0 text-destructive hover:text-destructive"
                      onClick={() => handleDelete(lesson.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
