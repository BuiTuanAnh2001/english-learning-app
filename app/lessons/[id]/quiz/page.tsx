'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Timer, Award } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { QuizCard } from '@/components/lessons/quiz-card'
import { QuizResult } from '@/components/lessons/quiz-result'
import { getLessonById, getLessons, initializeStorage } from '@/lib/services/storage'
import { generateQuizFromLesson, calculateQuizScore } from '@/lib/utils/quiz'
import { QuizQuestion, Lesson } from '@/lib/types'

type QuizState = 'intro' | 'quiz' | 'result'

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const lessonId = params.id as string
  
  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Map<string, string | string[]>>(new Map())
  const [quizState, setQuizState] = useState<QuizState>('intro')
  const [timeSpent, setTimeSpent] = useState(0)
  const [startTime, setStartTime] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  // Timer
  useEffect(() => {
    if (quizState === 'quiz') {
      const interval = setInterval(() => {
        setTimeSpent(Math.floor((Date.now() - startTime) / 1000))
      }, 1000)
      return () => clearInterval(interval)
    }
  }, [quizState, startTime])

  // Load lesson and generate quiz
  useEffect(() => {
    initializeStorage()
    const foundLesson = getLessonById(lessonId)
    const allLessons = getLessons()
    
    if (foundLesson) {
      setLesson(foundLesson)
      const generatedQuestions = generateQuizFromLesson(foundLesson, allLessons)
      setQuestions(generatedQuestions)
    }
    setLoading(false)
  }, [lessonId])

  const startQuiz = () => {
    setQuizState('quiz')
    setStartTime(Date.now())
    setTimeSpent(0)
    setCurrentQuestionIndex(0)
    setAnswers(new Map())
  }

  const handleAnswer = (answer: string | string[]) => {
    const newAnswers = new Map(answers)
    newAnswers.set(questions[currentQuestionIndex].id, answer)
    setAnswers(newAnswers)
    // Removed auto-advance - user must click Next button
  }

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handleSubmit = () => {
    setQuizState('result')
  }

  const handleRetry = () => {
    setQuizState('intro')
    setCurrentQuestionIndex(0)
    setAnswers(new Map())
    setTimeSpent(0)
  }

  const handleGoHome = () => {
    router.push(`/lessons/${lessonId}`)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <p>Đang tải...</p>
      </div>
    )
  }

  if (!lesson || questions.length === 0) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Không thể tạo quiz cho bài học này</h1>
        <Link href={`/lessons/${lessonId}`}>
          <Button>Quay lại bài học</Button>
        </Link>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100
  const hasAnsweredCurrent = answers.has(currentQuestion?.id)
  const allAnswered = questions.every((q) => answers.has(q.id))

  // Calculate results
  const result = calculateQuizScore(questions, answers)

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
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
        <Link href={`/lessons/${lessonId}`} className="hover:text-primary">
          {lesson.title}
        </Link>
        <span>/</span>
        <span className="text-foreground">Quiz</span>
      </motion.div>

      {/* Intro Screen */}
      {quizState === 'intro' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-4">
            <Award className="w-10 h-10 text-primary" />
          </div>
          
          <h1 className="text-4xl font-bold">Kiểm tra kiến thức</h1>
          <p className="text-xl text-muted-foreground">
            {lesson.title}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto my-8">
            <div className="p-6 bg-muted rounded-lg">
              <p className="text-3xl font-bold mb-2">{questions.length}</p>
              <p className="text-sm text-muted-foreground">Câu hỏi</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <p className="text-3xl font-bold mb-2">
                {questions.reduce((sum, q) => sum + q.points, 0)}
              </p>
              <p className="text-sm text-muted-foreground">Tổng điểm</p>
            </div>
            <div className="p-6 bg-muted rounded-lg">
              <p className="text-3xl font-bold mb-2">~{Math.ceil(questions.length * 1.5)}</p>
              <p className="text-sm text-muted-foreground">Phút</p>
            </div>
          </div>

          <div className="space-y-4 max-w-md mx-auto text-left">
            <h3 className="font-semibold">Hướng dẫn:</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Đọc kỹ từng câu hỏi trước khi trả lời</li>
              <li>• Bạn có thể quay lại câu trước đó</li>
              <li>• Cố gắng hoàn thành tất cả các câu hỏi</li>
              <li>• Điểm đạt yêu cầu: 70%</li>
            </ul>
          </div>

          <div className="flex gap-4 justify-center mt-8">
            <Button variant="outline" onClick={() => router.push(`/lessons/${lessonId}`)}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Quay lại
            </Button>
            <Button onClick={startQuiz} size="lg">
              Bắt đầu Quiz
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </motion.div>
      )}

      {/* Quiz Screen */}
      {quizState === 'quiz' && currentQuestion && (
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-sm">
                <Timer className="w-4 h-4 mr-2" />
                {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')}
              </Badge>
              <span className="text-sm font-medium">
                {currentQuestionIndex + 1} / {questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <QuizCard
              key={currentQuestion.id}
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              totalQuestions={questions.length}
              onAnswer={handleAnswer}
              disabled={hasAnsweredCurrent}
            />
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Câu trước
            </Button>

            {currentQuestionIndex === questions.length - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={!allAnswered}
                className="gap-2"
              >
                Nộp bài
                <Award className="w-4 h-4" />
              </Button>
            ) : (
              <Button
                onClick={handleNext}
                disabled={!hasAnsweredCurrent}
              >
                Câu tiếp
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>

          {/* Question Navigation */}
          <div className="flex flex-wrap gap-2 justify-center pt-4 border-t">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-primary text-primary-foreground'
                    : answers.has(q.id)
                    ? 'bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                    : 'bg-muted hover:bg-muted/80'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Result Screen */}
      {quizState === 'result' && (
        <QuizResult
          score={result.score}
          correctAnswers={result.correctAnswers}
          totalQuestions={questions.length}
          timeSpent={timeSpent}
          earnedPoints={result.earnedPoints}
          totalPoints={result.totalPoints}
          questions={questions}
          userAnswers={answers}
          onRetry={handleRetry}
          onGoHome={handleGoHome}
        />
      )}
    </div>
  )
}
