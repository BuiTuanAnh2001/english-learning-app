'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { LessonCard } from "@/components/lessons/lesson-card"
import { lessons } from "@/lib/data/lessons"

const categories = [
  { id: 'all', name: 'Tất cả' },
  { id: 'daily', name: 'Giao tiếp hàng ngày' },
  { id: 'business', name: 'Tiếng Anh thương mại' },
  { id: 'travel', name: 'Du lịch' },
  { id: 'beginner', name: 'Người mới' },
]

export default function LessonsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const filteredLessons = selectedCategory === 'all'
    ? lessons
    : lessons.filter(lesson => lesson.category === selectedCategory)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Các bài học
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Chọn bài học phù hợp với trình độ và mục tiêu của bạn
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-wrap gap-2 justify-center mb-12"
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setSelectedCategory(category.id)}
            className={`px-6 py-2 rounded-lg font-medium transition-all ${
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground shadow-lg scale-105'
                : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:scale-105'
            }`}
          >
            {category.name}
          </button>
        ))}
      </motion.div>

      {/* Lessons Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {filteredLessons.map((lesson, index) => (
          <LessonCard key={lesson.id} lesson={lesson} index={index} />
        ))}
      </motion.div>

      {filteredLessons.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-12"
        >
          <p className="text-muted-foreground text-lg">
            Không tìm thấy bài học nào trong danh mục này
          </p>
        </motion.div>
      )}
    </div>
  )
}
