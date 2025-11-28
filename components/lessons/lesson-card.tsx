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
  completed?: boolean
  score?: number
}

export function LessonCard({ lesson, index = 0, completed = false, score }: LessonCardProps) {
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

  const getCategoryEmoji = (category: string | any) => {
    const categoryName = typeof category === 'string' ? category : category?.name || '';
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
      'daily': '🌅',
      'business': '💼',
      'travel': '✈️',
      'beginner': '📚',
      'grammar': '📖',
      'default': '📚'
    };
    return emojiMap[categoryName] || emojiMap['default'];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
      whileHover={{ y: -6, scale: 1.02 }}
      className="h-full"
    >
      <Link href={`/lessons/${lesson.id}`}>
        <Card className="h-full cursor-pointer group overflow-hidden border border-slate-200/60 dark:border-slate-700/60 bg-white dark:bg-slate-900 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-500">
          {/* Hero Image Section */}
          <div className="relative h-52 overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900">
            <Image
              src={getIllustrationUrl()}
              alt={lesson.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
            
            {/* Level Badge */}
            <div className="absolute top-4 left-4">
              <Badge className={`${getLevelColor(lesson.level)} rounded-lg px-3 py-1 text-xs font-semibold shadow-md`} variant="default">
                {getLevelLabel(lesson.level)}
              </Badge>
            </div>

            {/* Completion and Score Badges */}
            {completed && (
              <div className="absolute top-4 right-4 flex gap-2">
                <div className="bg-emerald-500/90 backdrop-blur-md px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-md">
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span className="text-xs font-bold text-white">
                    Hoàn thành
                  </span>
                </div>
                {score !== undefined && (
                  <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md">
                    <span className="text-xs font-bold text-blue-600 dark:text-blue-400">
                      {score}%
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Hover Icon */}
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform group-hover:scale-110">
              <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md p-2.5 rounded-xl shadow-lg">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-5 space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
                {lesson.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                {lesson.description}
              </p>
            </div>

            {/* Meta Info */}
            <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-1.5 text-sm text-slate-600 dark:text-slate-400">
                <Clock className="w-4 h-4" />
                <span className="font-medium">{lesson.duration}&apos;</span>
              </div>
              <Badge variant="outline" className="rounded-lg text-xs font-medium border-slate-200 dark:border-slate-700">
                {getCategoryEmoji(lesson.category)} {typeof lesson.category === 'string' ? lesson.category : (lesson.category as any)?.name || lesson.category}
              </Badge>
            </div>

            {/* Progress Bar */}
            {completed && score !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 dark:text-slate-400 font-medium">Điểm số</span>
                  <span className="font-bold text-primary">{score}%</span>
                </div>
                <div className="relative h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div 
                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${score}%` }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  />
                </div>
              </div>
            )}
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
