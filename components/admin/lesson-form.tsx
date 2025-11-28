'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { X, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Lesson, Vocabulary, Phrase, Dialogue } from '@/lib/types'

interface LessonFormProps {
  initialData?: Lesson
  onSubmit: (data: Omit<Lesson, 'id'>) => void
  isEditing?: boolean
  categories?: any[]
}

export function LessonForm({ initialData, onSubmit, isEditing = false, categories = [] }: LessonFormProps) {
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: (typeof initialData?.category === 'string' ? initialData?.category : (initialData?.category as any)?.name) || (categories[0]?.name || ''),
    level: initialData?.level || 'beginner' as 'beginner' | 'intermediate' | 'advanced',
    description: initialData?.description || '',
    duration: initialData?.duration || '',
    completed: initialData?.completed || false,
    progress: initialData?.progress || 0,
  })

  const [vocabulary, setVocabulary] = useState<Vocabulary[]>(initialData?.vocabulary || [])
  const [phrases, setPhrases] = useState<Phrase[]>(initialData?.phrases || [])
  const [dialogues, setDialogues] = useState<Dialogue[]>(initialData?.dialogues || [])

  // Vocabulary handlers
  const addVocabulary = () => {
    setVocabulary([...vocabulary, { word: '', pronunciation: '', meaning: '', example: '' }])
  }

  const updateVocabulary = (index: number, field: keyof Vocabulary, value: string) => {
    const updated = [...vocabulary]
    updated[index] = { ...updated[index], [field]: value }
    setVocabulary(updated)
  }

  const removeVocabulary = (index: number) => {
    setVocabulary(vocabulary.filter((_, i) => i !== index))
  }

  // Phrase handlers
  const addPhrase = () => {
    setPhrases([...phrases, { phrase: '', meaning: '', example: '' }])
  }

  const updatePhrase = (index: number, field: keyof Phrase, value: string) => {
    const updated = [...phrases]
    updated[index] = { ...updated[index], [field]: value }
    setPhrases(updated)
  }

  const removePhrase = (index: number) => {
    setPhrases(phrases.filter((_, i) => i !== index))
  }

  // Dialogue handlers
  const addDialogue = () => {
    setDialogues([...dialogues, { speaker: 'A', text: '', translation: '' }])
  }

  const updateDialogue = (index: number, field: keyof Dialogue, value: string) => {
    const updated = [...dialogues]
    updated[index] = { ...updated[index], [field]: value }
    setDialogues(updated)
  }

  const removeDialogue = (index: number) => {
    setDialogues(dialogues.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.duration || !formData.category) {
      alert('Vui lòng điền đầy đủ thông tin bài học')
      return
    }

    onSubmit({
      ...formData,
      vocabulary,
      phrases,
      dialogues,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Thông tin cơ bản</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Tiêu đề bài học *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="VD: Chào hỏi và giới thiệu"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="category">Danh mục *</Label>
              <Select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                required
              >
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <option key={cat.id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))
                ) : (
                  <option value="">Đang tải...</option>
                )}
              </Select>
            </div>

            <div>
              <Label htmlFor="level">Cấp độ *</Label>
              <Select
                id="level"
                value={formData.level}
                onChange={(e) => setFormData({ ...formData, level: e.target.value as 'beginner' | 'intermediate' | 'advanced' })}
                required
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </Select>
            </div>

            <div>
              <Label htmlFor="duration">Thời lượng *</Label>
              <Input
                id="duration"
                value={formData.duration}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="VD: 15 phút"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="description">Mô tả *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Mô tả nội dung bài học..."
              rows={3}
              required
            />
          </div>
        </CardContent>
      </Card>

      {/* Vocabulary Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Từ vựng ({vocabulary.length})</CardTitle>
          <Button type="button" onClick={addVocabulary} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm từ
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {vocabulary.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Chưa có từ vựng nào. Nhấn &apos;Thêm từ&apos; để bắt đầu.
            </p>
          ) : (
            vocabulary.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 w-8 h-8 p-0"
                  onClick={() => removeVocabulary(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Từ vựng *</Label>
                    <Input
                      value={item.word}
                      onChange={(e) => updateVocabulary(index, 'word', e.target.value)}
                      placeholder="VD: Hello"
                      required
                    />
                  </div>
                  <div>
                    <Label>Phiên âm *</Label>
                    <Input
                      value={item.pronunciation}
                      onChange={(e) => updateVocabulary(index, 'pronunciation', e.target.value)}
                      placeholder="VD: /həˈloʊ/"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Nghĩa tiếng Việt *</Label>
                  <Input
                    value={item.meaning}
                    onChange={(e) => updateVocabulary(index, 'meaning', e.target.value)}
                    placeholder="VD: Xin chào"
                    required
                  />
                </div>
                
                <div>
                  <Label>Ví dụ *</Label>
                  <Textarea
                    value={item.example}
                    onChange={(e) => updateVocabulary(index, 'example', e.target.value)}
                    placeholder="VD: Hello! How are you today?"
                    rows={2}
                    required
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Phrases Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Cụm từ ({phrases.length})</CardTitle>
          <Button type="button" onClick={addPhrase} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm cụm từ
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {phrases.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Chưa có cụm từ nào. Nhấn &apos;Thêm cụm từ&apos; để bắt đầu.
            </p>
          ) : (
            phrases.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 w-8 h-8 p-0"
                  onClick={() => removePhrase(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>Cụm từ *</Label>
                    <Input
                      value={item.phrase}
                      onChange={(e) => updatePhrase(index, 'phrase', e.target.value)}
                      placeholder="VD: How are you doing?"
                      required
                    />
                  </div>
                  <div>
                    <Label>Nghĩa *</Label>
                    <Input
                      value={item.meaning}
                      onChange={(e) => updatePhrase(index, 'meaning', e.target.value)}
                      placeholder="VD: Bạn thế nào rồi?"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label>Ví dụ *</Label>
                  <Textarea
                    value={item.example}
                    onChange={(e) => updatePhrase(index, 'example', e.target.value)}
                    placeholder="VD: Hey Mike! How are you doing?"
                    rows={2}
                    required
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Dialogues Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Hội thoại ({dialogues.length})</CardTitle>
          <Button type="button" onClick={addDialogue} size="sm" className="gap-2">
            <Plus className="w-4 h-4" />
            Thêm câu
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {dialogues.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              Chưa có hội thoại nào. Nhấn &apos;Thêm câu&apos; để bắt đầu.
            </p>
          ) : (
            dialogues.map((item, index) => (
              <div key={index} className="border rounded-lg p-4 space-y-3 relative">
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 w-8 h-8 p-0"
                  onClick={() => removeDialogue(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
                
                <div>
                  <Label>Người nói *</Label>
                  <Input
                    value={item.speaker}
                    onChange={(e) => updateDialogue(index, 'speaker', e.target.value)}
                    placeholder="VD: A, B, John, Mary..."
                    required
                  />
                </div>
                
                <div>
                  <Label>Nội dung tiếng Anh *</Label>
                  <Textarea
                    value={item.text}
                    onChange={(e) => updateDialogue(index, 'text', e.target.value)}
                    placeholder="VD: Hello! My name is David."
                    rows={2}
                    required
                  />
                </div>
                
                <div>
                  <Label>Dịch tiếng Việt</Label>
                  <Textarea
                    value={item.translation || ''}
                    onChange={(e) => updateDialogue(index, 'translation', e.target.value)}
                    placeholder="VD: Xin chào! Tên tôi là David."
                    rows={2}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Submit Buttons */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Hủy
        </Button>
        <Button type="submit" size="lg">
          {isEditing ? 'Cập nhật bài học' : 'Tạo bài học'}
        </Button>
      </div>
    </form>
  )
}
