'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { QuizQuestion } from '@/lib/types'

interface QuizCardProps {
  question: QuizQuestion
  questionNumber: number
  totalQuestions: number
  onAnswer: (answer: string | string[]) => void
  disabled?: boolean
  showResult?: boolean
  userAnswer?: string | string[]
}

export function QuizCard({
  question,
  questionNumber,
  totalQuestions,
  onAnswer,
  disabled = false,
  showResult = false,
  userAnswer,
}: QuizCardProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string>('')
  const [fillBlankAnswer, setFillBlankAnswer] = useState<string>('')
  const [hasAnswered, setHasAnswered] = useState(false)

  // Reset state when question changes
  useEffect(() => {
    setSelectedAnswer(userAnswer as string || '')
    setFillBlankAnswer('')
    setHasAnswered(false)
  }, [question.id, userAnswer])

  const handleMultipleChoiceAnswer = (option: string) => {
    if (disabled) return
    setSelectedAnswer(option)
    onAnswer(option)
  }

  const handleFillBlankSubmit = () => {
    if (disabled || !fillBlankAnswer.trim()) return
    onAnswer(fillBlankAnswer.trim())
  }

  const isCorrectAnswer = (option: string) => {
    if (!showResult) return false
    return option.toLowerCase() === question.correctAnswer.toString().toLowerCase()
  }

  const isUserAnswer = (option: string) => {
    if (!showResult || !userAnswer) return false
    return option === userAnswer
  }

  const getAnswerClassName = (option: string) => {
    if (!showResult) {
      return selectedAnswer === option
        ? 'border-primary bg-primary/10'
        : 'hover:border-primary/50'
    }

    if (isCorrectAnswer(option)) {
      return 'border-green-500 bg-green-500/10'
    }

    if (isUserAnswer(option) && !isCorrectAnswer(option)) {
      return 'border-red-500 bg-red-500/10'
    }

    return ''
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="w-full"
    >
      <Card className="border-2">
        <CardContent className="p-6 md:p-8">
          {/* Question Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-muted-foreground">
                Câu {questionNumber} / {totalQuestions}
              </span>
              <span className="text-sm font-medium text-primary">
                {question.points} điểm
              </span>
            </div>
            <h3 className="text-xl font-semibold mb-2 whitespace-pre-line">
              {question.question}
            </h3>
          </div>

          {/* Multiple Choice Options */}
          {question.type === 'multiple-choice' && question.options && (
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={!disabled ? { scale: 1.02 } : {}}
                  whileTap={!disabled ? { scale: 0.98 } : {}}
                  onClick={() => handleMultipleChoiceAnswer(option)}
                  disabled={disabled}
                  className={`w-full p-4 text-left border-2 rounded-lg transition-all ${getAnswerClassName(
                    option
                  )} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option}</span>
                    {showResult && (
                      <>
                        {isCorrectAnswer(option) && (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        )}
                        {isUserAnswer(option) && !isCorrectAnswer(option) && (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* True/False Options */}
          {question.type === 'true-false' && question.options && (
            <div className="grid grid-cols-2 gap-4">
              {question.options.map((option, index) => (
                <motion.button
                  key={index}
                  whileHover={!disabled ? { scale: 1.02 } : {}}
                  whileTap={!disabled ? { scale: 0.98 } : {}}
                  onClick={() => handleMultipleChoiceAnswer(option)}
                  disabled={disabled}
                  className={`p-6 text-center border-2 rounded-lg font-semibold text-lg transition-all ${getAnswerClassName(
                    option
                  )} ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span>{option}</span>
                    {showResult && (
                      <>
                        {isCorrectAnswer(option) && (
                          <CheckCircle className="w-6 h-6 text-green-500" />
                        )}
                        {isUserAnswer(option) && !isCorrectAnswer(option) && (
                          <XCircle className="w-6 h-6 text-red-500" />
                        )}
                      </>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          )}

          {/* Fill in the Blank */}
          {question.type === 'fill-blank' && (
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Nhập câu trả lời của bạn..."
                value={fillBlankAnswer}
                onChange={(e) => setFillBlankAnswer(e.target.value)}
                disabled={disabled || hasAnswered}
                className="text-lg p-6"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleFillBlankSubmit()
                  }
                }}
              />
              {!hasAnswered && (
                <Button
                  onClick={handleFillBlankSubmit}
                  disabled={disabled || !fillBlankAnswer.trim()}
                  className="w-full"
                >
                  Xác nhận
                </Button>
              )}
              {showResult && (
                <div
                  className={`p-4 rounded-lg border-2 ${
                    userAnswer?.toString().toLowerCase() ===
                    question.correctAnswer.toString().toLowerCase()
                      ? 'border-green-500 bg-green-500/10'
                      : 'border-red-500 bg-red-500/10'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    {userAnswer?.toString().toLowerCase() ===
                    question.correctAnswer.toString().toLowerCase() ? (
                      <>
                        <CheckCircle className="w-5 h-5 text-green-500" />
                        <span className="font-semibold text-green-700 dark:text-green-400">
                          Chính xác!
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-5 h-5 text-red-500" />
                        <span className="font-semibold text-red-700 dark:text-red-400">
                          Chưa đúng
                        </span>
                      </>
                    )}
                  </div>
                  <p className="text-sm">
                    Đáp án đúng: <strong>{question.correctAnswer}</strong>
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Explanation */}
          {showResult && question.explanation && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-6 p-4 bg-muted rounded-lg"
            >
              <p className="text-sm font-medium mb-1">Giải thích:</p>
              <p className="text-sm text-muted-foreground">{question.explanation}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
