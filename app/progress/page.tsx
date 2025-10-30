'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { BookOpen, Clock, Award, TrendingUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { lessons, categories } from "@/lib/data/lessons"
import { getLevelColor, getLevelLabel } from "@/lib/utils"

export default function ProgressPage() {
  // Calculate statistics
  const completedLessons = lessons.filter((l) => l.completed).length
  const totalLessons = lessons.length
  const totalMinutes = lessons.reduce((acc, lesson) => {
    const minutes = parseInt(lesson.duration)
    return acc + (lesson.completed ? minutes : 0)
  }, 0)
  const streak = 7 // Mock streak

  const stats = [
    {
      title: "Bài học hoàn thành",
      value: `${completedLessons}/${totalLessons}`,
      icon: BookOpen,
      color: "from-primary to-primary/60",
    },
    {
      title: "Thời gian học",
      value: `${totalMinutes} phút`,
      icon: Clock,
      color: "from-secondary to-secondary/60",
    },
    {
      title: "Chuỗi ngày học",
      value: `${streak} ngày`,
      icon: Award,
      color: "from-accent to-accent/60",
    },
    {
      title: "Điểm trung bình",
      value: "8.5/10",
      icon: TrendingUp,
      color: "from-primary to-secondary",
    },
  ]

  // Calculate progress by category
  const categoryProgress = categories.map((category) => {
    const categoryLessons = lessons.filter((l) => l.category === category.id)
    const completed = categoryLessons.filter((l) => l.completed).length
    const total = categoryLessons.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      ...category,
      completed,
      total,
      percentage,
    }
  })

  // Recent lessons (last 5)
  const recentLessons = [...lessons]
    .sort((a, b) => b.progress - a.progress)
    .slice(0, 5)

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
          Tiến độ học tập
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Theo dõi quá trình học tập và thành tích của bạn
        </p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={`w-12 h-12 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}
                  >
                    <stat.icon className="w-6 h-6 text-white" />
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-1">{stat.value}</h3>
                <p className="text-sm text-muted-foreground">{stat.title}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Progress by Category */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-12"
      >
        <Card>
          <CardHeader>
            <CardTitle>Tiến độ theo chủ đề</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {categoryProgress.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {category.completed}/{category.total}
                  </span>
                </div>
                <Progress value={category.percentage} showPercentage />
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      {/* Recent Lessons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card>
          <CardHeader>
            <CardTitle>Bài học gần đây</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentLessons.map((lesson, index) => (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <Link href={`/lessons/${lesson.id}`}>
                    <div className="flex items-center justify-between p-4 rounded-lg border hover:border-primary transition-colors cursor-pointer">
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{lesson.title}</h3>
                        <div className="flex items-center gap-2">
                          <Badge className={getLevelColor(lesson.level)} variant="default">
                            {getLevelLabel(lesson.level)}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {lesson.duration}
                          </span>
                        </div>
                      </div>
                      <div className="w-32">
                        {lesson.progress > 0 ? (
                          <div className="flex items-center gap-2">
                            <Progress value={lesson.progress} className="flex-1" />
                            <span className="text-xs text-muted-foreground w-8 text-right">
                              {lesson.progress}%
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-muted-foreground">Chưa bắt đầu</span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
