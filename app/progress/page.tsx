'use client'

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { BookOpen, Clock, Award, TrendingUp, LogIn, RefreshCw } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useLessons } from "@/lib/contexts/lessons-context"
import { useAuth } from "@/lib/contexts/auth-context"
import { getLevelColor, getLevelLabel } from "@/lib/utils"
import { getCategories } from "@/lib/services/api"

interface Category {
  id: string
  name: string
  icon: string
}

export default function ProgressPage() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const { lessons, userProgress, loading, progressLoading, refreshProgress } = useLessons()
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      } finally {
        setCategoriesLoading(false)
      }
    }
    fetchCategories()
  }, [])

  // Redirect nếu chưa đăng nhập
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20"
        >
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 shadow-lg max-w-md mx-auto">
            <LogIn className="w-16 h-16 text-primary mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Đăng nhập để xem tiến độ</h2>
            <p className="text-muted-foreground mb-6">
              Bạn cần đăng nhập để theo dõi tiến độ học tập của mình
            </p>
            <Button onClick={() => router.push('/auth')} size="lg">
              Đăng nhập ngay
            </Button>
          </div>
        </motion.div>
      </div>
    )
  }
  
  // Tính toán thống kê từ userProgress
  const completedLessonIds = Array.from(userProgress.entries())
    .filter(([_, data]) => data.completed)
    .map(([id]) => id)
  
  const completedLessons = completedLessonIds.length
  const totalLessons = lessons.length
  
  // Tính tổng thời gian học
  const totalMinutes = lessons.reduce((acc, lesson) => {
    const minutes = parseInt(lesson.duration) || 0
    return acc + (completedLessonIds.includes(lesson.id) ? minutes : 0)
  }, 0)
  
  // Tính điểm trung bình
  const scoresArray = Array.from(userProgress.values())
    .filter(p => p.completed && p.progress !== undefined && p.progress > 0)
    .map(p => p.progress as number)
  
  const averageScore = scoresArray.length > 0 
    ? Math.round(scoresArray.reduce((a, b) => a + b, 0) / scoresArray.length) 
    : 0
  
  // Mock streak (có thể implement sau với database)
  const streak = completedLessons > 0 ? Math.min(completedLessons, 7) : 0

  const stats = [
    {
      title: "Bài học hoàn thành",
      value: `${completedLessons}/${totalLessons}`,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
    },
    {
      title: "Thời gian học",
      value: `${totalMinutes} phút`,
      icon: Clock,
      color: "from-emerald-500 to-emerald-600",
    },
    {
      title: "Chuỗi ngày học",
      value: `${streak} ngày`,
      icon: Award,
      color: "from-amber-500 to-amber-600",
    },
    {
      title: "Điểm trung bình",
      value: averageScore > 0 ? `${averageScore}%` : "Chưa có",
      icon: TrendingUp,
      color: "from-purple-500 to-purple-600",
    },
  ]

  // Tính tiến độ theo category
  const categoryProgress = categories.map((category) => {
    const categoryLessons = lessons.filter((l) => {
      const lessonCategory = typeof l.category === 'string' 
        ? l.category 
        : (l.category as any)?.name || l.category
      return lessonCategory === category.name || (l.category as any)?.id === category.id
    })
    const completed = categoryLessons.filter((l) => completedLessonIds.includes(l.id)).length
    const total = categoryLessons.length
    const percentage = total > 0 ? Math.round((completed / total) * 100) : 0

    return {
      ...category,
      completed,
      total,
      percentage,
    }
  })

  // Bài học gần đây với điểm số
  const recentLessons = lessons
    .filter(l => completedLessonIds.includes(l.id))
    .map(l => ({
      ...l,
      score: userProgress.get(l.id)?.progress || 0
    }))
    .slice(0, 5)

  // Loading state
  if (loading || categoriesLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-muted-foreground">Đang tải tiến độ học tập...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 space-y-4"
      >
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
          Tiến độ học tập
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Xin chào <span className="font-semibold text-primary">{user?.name || 'bạn'}</span>! Theo dõi quá trình học tập và thành tích của bạn
        </p>
        {/* Refresh button */}
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => refreshProgress(true)}
          disabled={progressLoading}
          className="mt-2"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${progressLoading ? 'animate-spin' : ''}`} />
          {progressLoading ? 'Đang cập nhật...' : 'Làm mới'}
        </Button>
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
            <CardTitle>Bài học đã hoàn thành</CardTitle>
          </CardHeader>
          <CardContent>
            {recentLessons.length === 0 ? (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">Bạn chưa hoàn thành bài học nào</p>
                <Button onClick={() => router.push('/lessons')}>
                  Bắt đầu học ngay
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {recentLessons.map((lesson, index) => (
                  <motion.div
                    key={lesson.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Link href={`/lessons/${lesson.id}`}>
                      <div className="flex items-center justify-between p-4 rounded-lg border hover:border-primary hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all cursor-pointer">
                        <div className="flex-1">
                          <h3 className="font-medium mb-1">{lesson.title}</h3>
                          <div className="flex items-center gap-2">
                            <Badge className={getLevelColor(lesson.level)} variant="default">
                              {getLevelLabel(lesson.level)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {lesson.duration} phút
                            </span>
                          </div>
                        </div>
                        <div className="w-32">
                          {lesson.score > 0 ? (
                            <div className="flex items-center gap-2">
                              <Progress value={lesson.score} className="flex-1" />
                              <span className={`text-sm font-bold ${lesson.score >= 80 ? 'text-emerald-600' : lesson.score >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                                {lesson.score}%
                              </span>
                            </div>
                          ) : (
                            <Badge variant="secondary" className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                              ✓ Đã hoàn thành
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
