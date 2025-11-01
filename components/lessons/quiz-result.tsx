'use client'

import { motion } from 'framer-motion'
import { Trophy, Target, Clock, CheckCircle, XCircle, RotateCcw, Home } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { QuizQuestion } from '@/lib/types'

interface QuizResultProps {
  score: number
  correctAnswers: number
  totalQuestions: number
  timeSpent: number
  earnedPoints: number
  totalPoints: number
  questions: QuizQuestion[]
  userAnswers: Map<string, string | string[]>
  onRetry: () => void
  onGoHome: () => void
}

export function QuizResult({
  score,
  correctAnswers,
  totalQuestions,
  timeSpent,
  earnedPoints,
  totalPoints,
  questions,
  userAnswers,
  onRetry,
  onGoHome,
}: QuizResultProps) {
  const percentage = (correctAnswers / totalQuestions) * 100
  const isPassed = percentage >= 70
  
  const getScoreMessage = () => {
    if (percentage >= 90) return { title: 'Xuất sắc! 🎉', message: 'Bạn đã thành thạo bài học này!', color: 'text-green-600 dark:text-green-400' }
    if (percentage >= 70) return { title: 'Tốt lắm! 👍', message: 'Bạn đã hiểu rất tốt bài học!', color: 'text-blue-600 dark:text-blue-400' }
    if (percentage >= 50) return { title: 'Cố gắng thêm! 💪', message: 'Bạn cần ôn lại một số phần.', color: 'text-yellow-600 dark:text-yellow-400' }
    return { title: 'Hãy thử lại! 📚', message: 'Bạn nên xem lại bài học và làm lại quiz.', color: 'text-red-600 dark:text-red-400' }
  }

  const scoreMessage = getScoreMessage()
  const minutes = Math.floor(timeSpent / 60)
  const seconds = timeSpent % 60

  return (
    <div className="space-y-6">
      {/* Main Result Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border-2">
          <CardContent className="p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="mb-6"
            >
              <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full ${
                isPassed ? 'bg-green-100 dark:bg-green-900/20' : 'bg-yellow-100 dark:bg-yellow-900/20'
              }`}>
                <Trophy className={`w-12 h-12 ${
                  isPassed ? 'text-green-600 dark:text-green-400' : 'text-yellow-600 dark:text-yellow-400'
                }`} />
              </div>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className={`text-3xl font-bold mb-2 ${scoreMessage.color}`}
            >
              {scoreMessage.title}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-muted-foreground mb-6"
            >
              {scoreMessage.message}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="mb-6"
            >
              <div className="text-6xl font-bold mb-2">{score}%</div>
              <Progress value={percentage} className="h-3 mb-4" />
              <p className="text-sm text-muted-foreground">
                Điểm: {earnedPoints} / {totalPoints}
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Đúng</p>
                <p className="text-2xl font-bold">{correctAnswers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 dark:bg-red-900/20 rounded-full">
                <XCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Sai</p>
                <p className="text-2xl font-bold">{totalQuestions - correctAnswers}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full">
                <Clock className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Thời gian</p>
                <p className="text-2xl font-bold">
                  {minutes > 0 ? `${minutes}:${seconds.toString().padStart(2, '0')}` : `${seconds}s`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Detailed Results */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card>
          <CardContent className="p-6">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Target className="w-5 h-5" />
              Chi tiết kết quả
            </h3>
            <div className="space-y-3">
              {questions.map((question, index) => {
                const userAnswer = userAnswers.get(question.id)
                const isCorrect = userAnswer
                  ? userAnswer.toString().toLowerCase().trim() === 
                    question.correctAnswer.toString().toLowerCase().trim()
                  : false

                return (
                  <div
                    key={question.id}
                    className={`p-4 rounded-lg border-2 ${
                      isCorrect
                        ? 'border-green-500 bg-green-500/5'
                        : 'border-red-500 bg-red-500/5'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium mb-1">Câu {index + 1}</p>
                        <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line">
                          {question.question}
                        </p>
                        {!isCorrect && (
                          <div className="text-sm">
                            <p className="text-red-600 dark:text-red-400">
                              Bạn trả lời: {userAnswer?.toString() || '(Không trả lời)'}
                            </p>
                            <p className="text-green-600 dark:text-green-400">
                              Đáp án đúng: {question.correctAnswer.toString()}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="flex-shrink-0 text-sm font-medium">
                        {isCorrect ? `+${question.points}` : '0'} điểm
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="flex flex-col sm:flex-row gap-4"
      >
        <Button onClick={onRetry} variant="outline" className="flex-1 gap-2">
          <RotateCcw className="w-4 h-4" />
          Làm lại
        </Button>
        <Button onClick={onGoHome} className="flex-1 gap-2">
          <Home className="w-4 h-4" />
          Về trang bài học
        </Button>
      </motion.div>
    </div>
  )
}
