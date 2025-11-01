'use client'

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight, Clock, CheckCircle, Award } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { VocabularyCard } from "@/components/lessons/vocabulary-card"
import { DialogueView } from "@/components/lessons/dialogue-view"
import { getLessons, getLessonById, initializeStorage } from "@/lib/services/storage"
import { getLevelColor, getLevelLabel } from "@/lib/utils"
import { Lesson } from "@/lib/types"

export default function LessonDetailPage() {
  const params = useParams()
  const lessonId = params.id as string
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [lessons, setLessons] = useState<Lesson[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    initializeStorage()
    const foundLesson = getLessonById(lessonId)
    const allLessons = getLessons()
    setLesson(foundLesson)
    setLessons(allLessons)
    setLoading(false)
  }, [lessonId])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Đang tải...</p>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold">Không tìm thấy bài học</h1>
        <Link href="/lessons">
          <Button className="mt-4">Quay lại danh sách bài học</Button>
        </Link>
      </div>
    )
  }

  const currentIndex = lessons.findIndex((l) => l.id === lessonId)
  const previousLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-2 text-sm text-muted-foreground mb-6"
      >
        <Link href="/" className="hover:text-primary">
          Trang chủ
        </Link>
        <span>/</span>
        <Link href="/lessons" className="hover:text-primary">
          Bài học
        </Link>
        <span>/</span>
        <span className="text-foreground">{lesson.title}</span>
      </motion.div>

      {/* Lesson Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{lesson.title}</h1>
            <p className="text-lg text-muted-foreground">{lesson.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge className={getLevelColor(lesson.level)}>
              {getLevelLabel(lesson.level)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{lesson.duration}</span>
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Tabs defaultValue="vocabulary" className="w-full">
          <TabsList className="w-full justify-start overflow-x-auto">
            <TabsTrigger value="vocabulary">
              Từ vựng ({lesson.vocabulary.length})
            </TabsTrigger>
            <TabsTrigger value="phrases">
              Cụm từ ({lesson.phrases.length})
            </TabsTrigger>
            <TabsTrigger value="dialogues">
              Hội thoại
            </TabsTrigger>
          </TabsList>

          {/* Vocabulary Tab */}
          <TabsContent value="vocabulary">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {lesson.vocabulary.map((vocab, index) => (
                <VocabularyCard key={index} vocabulary={vocab} index={index} />
              ))}
            </div>
          </TabsContent>

          {/* Phrases Tab */}
          <TabsContent value="phrases">
            <div className="space-y-4 mt-6">
              {lesson.phrases.map((phrase, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="hover:border-primary transition-colors">
                    <CardContent className="p-6">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <h3 className="text-lg font-semibold text-primary">
                            {phrase.phrase}
                          </h3>
                        </div>
                        <p className="text-muted-foreground">{phrase.meaning}</p>
                        <div className="border-t pt-3 mt-3">
                          <p className="text-sm text-muted-foreground mb-1">Ví dụ:</p>
                          <p className="text-sm italic">{phrase.example}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Dialogues Tab */}
          <TabsContent value="dialogues">
            <div className="mt-6">
              <DialogueView dialogues={lesson.dialogues} />
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-12 pt-8 border-t"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex gap-2">
            {previousLesson && (
              <Link href={`/lessons/${previousLesson.id}`}>
                <Button variant="outline" className="gap-2">
                  <ChevronLeft className="w-4 h-4" />
                  Bài trước
                </Button>
              </Link>
            )}
            {nextLesson && (
              <Link href={`/lessons/${nextLesson.id}`}>
                <Button variant="outline" className="gap-2">
                  Bài sau
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            )}
          </div>

          <div className="flex gap-2">
            <Link href={`/lessons/${lessonId}/quiz`}>
              <Button variant="outline" className="gap-2">
                <Award className="w-4 h-4" />
                Làm Quiz
              </Button>
            </Link>
            <Button className="gap-2">
              <CheckCircle className="w-4 h-4" />
              Đánh dấu hoàn thành
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
