'use client'

import Link from "next/link"
import { motion } from "framer-motion"
import { Clock, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Lesson } from "@/lib/types"
import { getLevelColor, getLevelLabel } from "@/lib/utils"

interface LessonCardProps {
  lesson: Lesson
  index?: number
}

export function LessonCard({ lesson, index = 0 }: LessonCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Link href={`/lessons/${lesson.id}`}>
        <Card className="h-full cursor-pointer group hover:border-primary overflow-hidden">
          {/* Header with gradient */}
          <div className="h-24 bg-gradient-to-br from-primary via-secondary to-accent relative overflow-hidden">
            <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors"></div>
            <div className="absolute bottom-2 right-2">
              <BookOpen className="w-8 h-8 text-white/80" />
            </div>
          </div>

          <CardHeader className="pb-3">
            <div className="flex items-start justify-between gap-2 mb-2">
              <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-1">
                {lesson.title}
              </CardTitle>
              <Badge className={getLevelColor(lesson.level)} variant="default">
                {getLevelLabel(lesson.level)}
              </Badge>
            </div>
            <CardDescription className="line-clamp-2">
              {lesson.description}
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Duration */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{lesson.duration}</span>
            </div>

            {/* Progress */}
            {lesson.progress > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Tiến độ</span>
                  <span>{lesson.progress}%</span>
                </div>
                <Progress value={lesson.progress} />
              </div>
            )}

            {/* Category tag */}
            <div className="pt-2 border-t">
              <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                {lesson.category === 'daily' && '💬 Giao tiếp hàng ngày'}
                {lesson.category === 'business' && '💼 Tiếng Anh thương mại'}
                {lesson.category === 'travel' && '✈️ Tiếng Anh du lịch'}
                {lesson.category === 'beginner' && '🎯 Dành cho người mới'}
              </span>
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
