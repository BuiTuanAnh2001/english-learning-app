'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { LessonCard } from "@/components/lessons/lesson-card"
import { useLessons } from "@/lib/contexts/lessons-context"
import { useAuth } from "@/lib/contexts/auth-context"

const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'daily', name: 'Giao tiếp hàng ngày' },
  { id: 'business', name: 'Tiếng Anh thương mại' },
  { id: 'travel', name: 'Du lịch' },
  { id: 'beginner', name: 'Người mới' },
]

export default function LessonsPage() {
  const { isAuthenticated } = useAuth()
  const { 
    lessons, 
    userProgress, 
    loading, 
    progressLoading, 
    error 
  } = useLessons()
  
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredLessons = selectedCategory === 'all'
    ? lessons
    : lessons.filter(lesson => {
      const categoryName = typeof lesson.category === 'string'
        ? lesson.category
        : (lesson.category as any)?.name || lesson.category
      return categoryName === selectedCategory
    })

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20 grid place-items-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Đang tải bài học...</p>
        </motion.div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20">
        <div className="container mx-auto px-4 py-12 md:py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-4">
                {error}
              </p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors"
              >
                Thử lại
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 pt-20">
      <div className="container mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12 space-y-4"
        >
          <motion.h1
            className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              Bài Học Tiếng Anh
            </span>
          </motion.h1>
          <motion.p
            className="text-base md:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            Khám phá các bài học được thiết kế chuyên nghiệp, phù hợp với mọi trình độ
          </motion.p>
        </motion.div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-wrap gap-3 justify-center mb-10"
        >
          {categories.map((category, idx) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${selectedCategory === category.id
                  ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30 scale-105'
                  : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-md hover:scale-105 border border-slate-200 dark:border-slate-700'
                }`}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + idx * 0.05 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Progress Loading Indicator */}
        {progressLoading && isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-6"
          >
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
              <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              <span className="text-sm text-blue-600 dark:text-blue-400">Đang tải tiến độ học tập...</span>
            </div>
          </motion.div>
        )}

        {/* Lessons Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {filteredLessons.map((lesson, index) => {
            const progress = userProgress.get(lesson.id)
            return (
              <LessonCard 
                key={lesson.id} 
                lesson={lesson} 
                index={index}
                completed={progress?.completed || false}
                score={progress?.progress}
                showProgress={isAuthenticated}
              />
            )
          })}
        </motion.div>

        {filteredLessons.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <p className="text-slate-600 dark:text-slate-400 text-lg mb-2">
                Không tìm thấy bài học
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm">
                Thử chọn danh mục khác
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
