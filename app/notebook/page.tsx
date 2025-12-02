'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { 
  BookMarked, Search, Plus, Trash2, Edit3, Star, Check, X, 
  Volume2, Filter, SortAsc, SortDesc, Sparkles, Brain, 
  Clock, Tag, ChevronDown, Bookmark, GraduationCap
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/contexts/auth-context'

interface VocabularyNote {
  id: string
  word: string
  pronunciation: string | null
  meaning: string
  example: string | null
  personalNote: string | null
  context: string | null
  difficulty: number
  reviewCount: number
  lastReviewed: string | null
  mastered: boolean
  tags: string[]
  createdAt: string
}

interface Stats {
  total: number
  mastered: number
  learning: number
}

export default function NotebookPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [notes, setNotes] = useState<VocabularyNote[]>([])
  const [stats, setStats] = useState<Stats>({ total: 0, mastered: 0, learning: 0 })
  const [allTags, setAllTags] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterMastered, setFilterMastered] = useState<boolean | null>(null)
  const [filterTag, setFilterTag] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const [editingNote, setEditingNote] = useState<VocabularyNote | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const params = new URLSearchParams()
      if (searchQuery) params.append('search', searchQuery)
      if (filterMastered !== null) params.append('mastered', String(filterMastered))
      if (filterTag) params.append('tag', filterTag)
      params.append('sortBy', sortBy)
      params.append('sortOrder', sortOrder)

      const res = await fetch(`/api/vocabulary-notes?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      
      if (data.success) {
        setNotes(data.data)
        setStats(data.stats)
        setAllTags(data.tags || [])
      }
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }, [searchQuery, filterMastered, filterTag, sortBy, sortOrder])

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes()
    }
  }, [isAuthenticated, fetchNotes])

  // Toggle mastered status
  const toggleMastered = async (note: VocabularyNote) => {
    try {
      const token = localStorage.getItem('auth_token')
      await fetch(`/api/vocabulary-notes/${note.id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ mastered: !note.mastered })
      })
      fetchNotes()
    } catch (error) {
      console.error('Error updating note:', error)
    }
  }

  // Delete note
  const deleteNote = async (id: string) => {
    if (!confirm('Bạn có chắc muốn xóa từ này khỏi sổ tay?')) return
    try {
      const token = localStorage.getItem('auth_token')
      await fetch(`/api/vocabulary-notes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchNotes()
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  // Speak word
  const speakWord = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word)
    utterance.lang = 'en-US'
    speechSynthesis.speak(utterance)
  }

  // Not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <BookMarked className="w-16 h-16 text-blue-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-4">Sổ từ vựng cá nhân</h2>
              <p className="text-muted-foreground mb-6">
                Đăng nhập để lưu và quản lý từ vựng của bạn
              </p>
              <Button onClick={() => router.push('/auth')} size="lg">
                Đăng nhập ngay
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500/10 to-purple-500/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
              Sổ từ vựng của {user?.name || 'bạn'}
            </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Vocabulary Notebook
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Lưu giữ và ôn tập những từ vựng quan trọng. Ghi chú theo cách của riêng bạn!
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
        >
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <BookMarked className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-blue-100 text-sm">Tổng từ vựng</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-emerald-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-green-100 text-sm">Đã thuộc</p>
                  <p className="text-3xl font-bold">{stats.mastered}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-amber-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/20 rounded-xl">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-orange-100 text-sm">Đang học</p>
                  <p className="text-3xl font-bold">{stats.learning}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Filters & Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg mb-6"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Tìm từ vựng..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <Button
                variant={filterMastered === null ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMastered(null)}
              >
                Tất cả
              </Button>
              <Button
                variant={filterMastered === true ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMastered(true)}
                className="gap-1"
              >
                <Check className="w-4 h-4" />
                Đã thuộc
              </Button>
              <Button
                variant={filterMastered === false ? "default" : "outline"}
                size="sm"
                onClick={() => setFilterMastered(false)}
                className="gap-1"
              >
                <Brain className="w-4 h-4" />
                Đang học
              </Button>

              {/* Sort */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                className="gap-1"
              >
                {sortOrder === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                {sortBy === 'createdAt' ? 'Ngày thêm' : 'Tên'}
              </Button>

              {/* Add new */}
              <Button
                size="sm"
                onClick={() => setShowAddModal(true)}
                className="gap-1 bg-gradient-to-r from-blue-500 to-indigo-600"
              >
                <Plus className="w-4 h-4" />
                Thêm từ
              </Button>
            </div>
          </div>

          {/* Tags */}
          {allTags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Tag className="w-4 h-4" /> Tags:
              </span>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={filterTag === tag ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setFilterTag(filterTag === tag ? null : tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </motion.div>

        {/* Vocabulary List */}
        {loading ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Đang tải sổ từ vựng...</p>
          </div>
        ) : notes.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <Bookmark className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Chưa có từ vựng nào</h3>
              <p className="text-muted-foreground mb-6">
                Bắt đầu lưu từ vựng khi học bài để xây dựng sổ tay của riêng bạn!
              </p>
              <Button onClick={() => router.push('/lessons')}>
                Khám phá bài học
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="grid gap-4"
          >
            <AnimatePresence>
              {notes.map((note, idx) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Card className={`overflow-hidden transition-all hover:shadow-lg ${
                    note.mastered 
                      ? 'border-l-4 border-l-green-500 bg-green-50/50 dark:bg-green-950/20' 
                      : 'border-l-4 border-l-blue-500'
                  }`}>
                    <CardContent className="p-4 md:p-6">
                      <div className="flex flex-col md:flex-row md:items-start gap-4">
                        {/* Word Info */}
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl md:text-2xl font-bold text-blue-600 dark:text-blue-400">
                              {note.word}
                            </h3>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => speakWord(note.word)}
                              className="p-2 h-auto"
                            >
                              <Volume2 className="w-5 h-5" />
                            </Button>
                            {note.mastered && (
                              <Badge className="bg-green-500 text-white">
                                <Check className="w-3 h-3 mr-1" />
                                Đã thuộc
                              </Badge>
                            )}
                          </div>

                          {note.pronunciation && (
                            <p className="text-muted-foreground text-sm mb-2">
                              {note.pronunciation}
                            </p>
                          )}

                          <p className="text-lg font-medium mb-2">{note.meaning}</p>

                          {note.example && (
                            <p className="text-muted-foreground italic mb-2">
                              &ldquo;{note.example}&rdquo;
                            </p>
                          )}

                          {note.personalNote && (
                            <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 mt-3">
                              <p className="text-sm flex items-start gap-2">
                                <Edit3 className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                                <span>{note.personalNote}</span>
                              </p>
                            </div>
                          )}

                          {/* Tags */}
                          {note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {note.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Meta info */}
                          <div className="flex flex-wrap gap-4 mt-3 text-xs text-muted-foreground">
                            {note.context && (
                              <span className="flex items-center gap-1">
                                <BookMarked className="w-3 h-3" />
                                {note.context}
                              </span>
                            )}
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Ôn tập: {note.reviewCount} lần
                            </span>
                            <span className="flex items-center gap-1">
                              Độ khó: {'⭐'.repeat(note.difficulty)}
                            </span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex md:flex-col gap-2">
                          <Button
                            variant={note.mastered ? "outline" : "default"}
                            size="sm"
                            onClick={() => toggleMastered(note)}
                            className="gap-1"
                          >
                            {note.mastered ? (
                              <>
                                <X className="w-4 h-4" />
                                Bỏ thuộc
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4" />
                                Đánh dấu thuộc
                              </>
                            )}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingNote(note)}
                            className="gap-1"
                          >
                            <Edit3 className="w-4 h-4" />
                            Sửa
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteNote(note.id)}
                            className="gap-1 text-red-500 hover:text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Add/Edit Modal */}
        <AnimatePresence>
          {(showAddModal || editingNote) && (
            <AddEditModal
              note={editingNote}
              onClose={() => {
                setShowAddModal(false)
                setEditingNote(null)
              }}
              onSave={() => {
                fetchNotes()
                setShowAddModal(false)
                setEditingNote(null)
              }}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

// Add/Edit Modal Component
function AddEditModal({ 
  note, 
  onClose, 
  onSave 
}: { 
  note: VocabularyNote | null
  onClose: () => void
  onSave: () => void 
}) {
  const [word, setWord] = useState(note?.word || '')
  const [pronunciation, setPronunciation] = useState(note?.pronunciation || '')
  const [meaning, setMeaning] = useState(note?.meaning || '')
  const [example, setExample] = useState(note?.example || '')
  const [personalNote, setPersonalNote] = useState(note?.personalNote || '')
  const [difficulty, setDifficulty] = useState(note?.difficulty || 3)
  const [tags, setTags] = useState(note?.tags.join(', ') || '')
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!word || !meaning) {
      alert('Vui lòng nhập từ và nghĩa!')
      return
    }

    setSaving(true)
    try {
      const token = localStorage.getItem('auth_token')
      const tagsArray = tags.split(',').map(t => t.trim()).filter(Boolean)

      if (note) {
        // Update existing
        await fetch(`/api/vocabulary-notes/${note.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({ personalNote, difficulty, tags: tagsArray })
        })
      } else {
        // Create new
        const res = await fetch('/api/vocabulary-notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            word,
            pronunciation,
            meaning,
            example,
            personalNote,
            difficulty,
            tags: tagsArray
          })
        })
        const data = await res.json()
        if (!data.success) {
          alert(data.error || 'Có lỗi xảy ra!')
          setSaving(false)
          return
        }
      }
      onSave()
    } catch (error) {
      console.error('Error saving note:', error)
      alert('Có lỗi xảy ra!')
    } finally {
      setSaving(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">
          {note ? 'Chỉnh sửa ghi chú' : 'Thêm từ vựng mới'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!note && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Từ vựng *</label>
                <Input
                  value={word}
                  onChange={(e) => setWord(e.target.value)}
                  placeholder="Ví dụ: Hello"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Phiên âm</label>
                <Input
                  value={pronunciation}
                  onChange={(e) => setPronunciation(e.target.value)}
                  placeholder="Ví dụ: /həˈləʊ/"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Nghĩa *</label>
                <Input
                  value={meaning}
                  onChange={(e) => setMeaning(e.target.value)}
                  placeholder="Ví dụ: Xin chào"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Ví dụ</label>
                <Input
                  value={example}
                  onChange={(e) => setExample(e.target.value)}
                  placeholder="Ví dụ: Hello! How are you?"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">
              Ghi chú cá nhân (mẹo nhớ từ)
            </label>
            <textarea
              value={personalNote}
              onChange={(e) => setPersonalNote(e.target.value)}
              placeholder="Ghi chú giúp bạn nhớ từ này..."
              className="w-full px-3 py-2 border rounded-lg resize-none h-24 dark:bg-slate-900 dark:border-slate-700"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Độ khó (1-5)</label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setDifficulty(level)}
                  className={`w-10 h-10 rounded-lg transition-all ${
                    difficulty >= level
                      ? 'bg-yellow-400 text-white'
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  ⭐
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Tags (phân cách bằng dấu phẩy)</label>
            <Input
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Ví dụ: greeting, daily, important"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600"
            >
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  )
}
