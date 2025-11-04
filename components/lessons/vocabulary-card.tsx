'use client'

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Volume2, Mic } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Vocabulary } from "@/lib/types"
import { speakEnglish } from "@/lib/utils/speech"
import { PronunciationAssessment } from "./pronunciation-assessment"
import Image from "next/image"

interface VocabularyCardProps {
  vocabulary: Vocabulary
  index: number
}

export function VocabularyCard({ vocabulary, index }: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [showPronunciation, setShowPronunciation] = useState(false)

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSpeaking) return

    try {
      setIsSpeaking(true)
      // Speak with friendly emotion for vocabulary learning
      await speakEnglish(vocabulary.word, { emotion: 'friendly', rate: 0.85 })
    } catch (error) {
      console.error('Error speaking word:', error)
    } finally {
      setIsSpeaking(false)
    }
  }

  return (
    <>
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ y: -4 }}
      className="h-72"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front - Enhanced European Style */}
        <Card
          className="absolute inset-0 bg-white dark:bg-slate-900 border-0 overflow-hidden rounded-2xl"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <CardContent className="p-0 h-full flex flex-col">
            {/* Image Section - Larger and more prominent */}
            {vocabulary.imageUrl && (
              <div className="relative w-full h-40 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-900">
                <Image
                  src={vocabulary.imageUrl}
                  alt={vocabulary.word}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                  }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            )}
            
            {/* Content Section */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
                {vocabulary.word}
              </h3>
              <p className="text-sm font-medium text-muted-foreground mb-4">{vocabulary.pronunciation}</p>
              
              {/* Tags */}
              {vocabulary.tags && vocabulary.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 justify-center mb-3">
                  {vocabulary.tags.slice(0, 3).map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
              
              <div className="flex gap-2 mt-2">
                <button
                  onClick={handleSpeak}
                  disabled={isSpeaking}
                  className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                  {isSpeaking ? 'Đang phát...' : 'Nghe'}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowPronunciation(true);
                  }}
                  className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Mic className="w-4 h-4" />
                  Luyện phát âm
                </button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                Nhấn để xem nghĩa
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 rounded-2xl border-0"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <CardContent className="p-6 h-full flex flex-col justify-center">
            <div className="space-y-4">
              <div>
                <p className="text-xs font-semibold text-blue-600 dark:text-blue-400 mb-2">NGHĨA</p>
                <p className="text-xl font-bold text-slate-900 dark:text-white">{vocabulary.meaning}</p>
              </div>
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-2">VÍ DỤ</p>
                <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300 italic">&quot;{vocabulary.example}&quot;</p>
              </div>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-6 text-center font-medium">
              Nhấn để lật lại
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>

    {/* Pronunciation Assessment Modal - Outside card hierarchy */}
    {showPronunciation && (
      <AnimatePresence>
        <PronunciationAssessment
          text={vocabulary.word}
          translation={vocabulary.meaning}
          onClose={() => setShowPronunciation(false)}
        />
      </AnimatePresence>
    )}
    </>
  )
}
