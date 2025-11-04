'use client'

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Clock, BookOpen, CheckCircle2 } from "lucide-react"
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
  // Generate illustration URL based on lesson content
  const getIllustrationUrl = () => {
    const keywords = lesson.title.toLowerCase();
    if (keywords.includes('greeting') || keywords.includes('hello') || keywords.includes('introduction')) {
      return 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=800&q=80';
    } else if (keywords.includes('family')) {
      return 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=800&q=80';
    } else if (keywords.includes('shopping') || keywords.includes('store')) {
      return 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80';
    } else if (keywords.includes('restaurant') || keywords.includes('food')) {
      return 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80';
    } else if (keywords.includes('travel') || keywords.includes('direction')) {
      return 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&q=80';
    } else if (keywords.includes('work') || keywords.includes('business')) {
      return 'https://images.unsplash.com/photo-1497032628192-86f99bcd76bc?w=800&q=80';
    } else if (keywords.includes('health') || keywords.includes('doctor')) {
      return 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=80';
    } else if (keywords.includes('weather') || keywords.includes('time')) {
      return 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=800&q=80';
    } else if (keywords.includes('hobby') || keywords.includes('sport')) {
      return 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=800&q=80';
    } else if (keywords.includes('phone') || keywords.includes('communication')) {
      return 'https://images.unsplash.com/photo-1596526131083-e8c633c948d2?w=800&q=80';
    } else if (keywords.includes('home') || keywords.includes('house')) {
      return 'https://images.unsplash.com/photo-1513584684374-8bab748fbf90?w=800&q=80';
    } else if (keywords.includes('school') || keywords.includes('education')) {
      return 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80';
    } else {
      return 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800&q=80';
    }
  };

  const getCategoryEmoji = (category: string) => {
    const emojiMap: Record<string, string> = {
      'Giao tiếp cơ bản': '💬',
      'Hàng ngày': '🌅',
      'Du lịch': '✈️',
      'Công việc': '💼',
      'Sức khỏe': '🏥',
      'Giải trí': '🎮',
      'Gia đình': '👨‍👩‍👧‍👦',
      'Mua sắm': '🛍️',
      'Ẩm thực': '🍽️',
      'default': '📚'
    };
    return emojiMap[category] || emojiMap['default'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      whileHover={{ y: -8 }}
      className="h-full"
    >
      <Link href={`/lessons/${lesson.id}`}>
        <Card className="h-full cursor-pointer group hover:shadow-2xl transition-all duration-300 overflow-hidden border-0 bg-white dark:bg-slate-900">
          {/* Hero Image Section - European Style */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
            <Image
              src={getIllustrationUrl()}
              alt={lesson.title}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
            
            {/* Progress Badge */}
            {lesson.progress > 0 && (
              <div className="absolute top-3 right-3">
                <div className="bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-xs font-semibold text-slate-900 dark:text-white">
                    {lesson.progress}%
                  </span>
                </div>
              </div>
            )}
            
            {/* Level Badge */}
            <div className="absolute top-3 left-3">
              <Badge className={`${getLevelColor(lesson.level)} shadow-lg backdrop-blur-sm`} variant="default">
                {getLevelLabel(lesson.level)}
              </Badge>
            </div>

            {/* Icon Overlay */}
            <div className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="bg-white/20 backdrop-blur-md p-2 rounded-full">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>

          <CardHeader className="pb-3 space-y-3">
            <CardTitle className="text-xl font-bold group-hover:text-primary transition-colors line-clamp-2 leading-tight">
              {lesson.title}
            </CardTitle>
            <CardDescription className="line-clamp-2 text-sm leading-relaxed">
              {lesson.description}
            </CardDescription>
          </CardHeader>

                    <CardContent className="pt-0 space-y-4">
            {/* Category & Duration Row */}
            <div className="flex items-center justify-between gap-3">
              <Badge variant="outline" className="font-medium border-slate-300 dark:border-slate-700">
                {getCategoryEmoji(lesson.category)} {lesson.category}
              </Badge>
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{lesson.duration} phút</span>
              </div>
            </div>

            {/* Progress bar - Enhanced Design */}
            {lesson.progress > 0 && (
              <div className="space-y-2 pt-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Tiến độ học tập</span>
                  <span className="font-bold text-primary">{lesson.progress}%</span>
                </div>
                <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary via-secondary to-accent rounded-full transition-all duration-500"
                    style={{ width: `${lesson.progress}%` }}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  )
}
