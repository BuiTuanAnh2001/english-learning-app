'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Volume2, Image as ImageIcon } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Vocabulary } from "@/lib/types"
import { speakEnglish } from "@/lib/utils/speech"
import Image from "next/image"

interface VocabularyCardProps {
  vocabulary: Vocabulary
  index: number
}

export function VocabularyCard({ vocabulary, index }: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  const handleSpeak = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isSpeaking) return

    try {
      setIsSpeaking(true)
      await speakEnglish(vocabulary.word)
    } catch (error) {
      console.error('Error speaking word:', error)
    } finally {
      setIsSpeaking(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-64"
      style={{ perspective: "1000px" }}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <Card
          className="absolute inset-0 bg-gradient-to-br from-primary/10 to-secondary/10 overflow-hidden"
          style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
        >
          <CardContent className="p-0 h-full flex flex-col">
            {/* Image Section */}
            {vocabulary.imageUrl && (
              <div className="relative w-full h-32 bg-muted">
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
              </div>
            )}
            
            {/* Content Section */}
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
              <h3 className="text-2xl md:text-3xl font-bold text-primary mb-2">
                {vocabulary.word}
              </h3>
              <p className="text-sm text-muted-foreground mb-3">{vocabulary.pronunciation}</p>
              
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
              
              <button
                onClick={handleSpeak}
                disabled={isSpeaking}
                className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
              >
                <Volume2 className={`w-4 h-4 ${isSpeaking ? 'animate-pulse' : ''}`} />
                {isSpeaking ? 'Đang phát...' : 'Phát âm'}
              </button>
              <p className="text-xs text-muted-foreground mt-4">
                Nhấn để xem nghĩa
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          className="absolute inset-0 bg-gradient-to-br from-accent/10 to-primary/10"
          style={{ 
            backfaceVisibility: "hidden", 
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)"
          }}
        >
          <CardContent className="p-6 h-full flex flex-col justify-center">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Nghĩa:</p>
                <p className="text-lg font-semibold">{vocabulary.meaning}</p>
              </div>
              <div className="border-t pt-4">
                <p className="text-sm text-muted-foreground mb-2">Ví dụ:</p>
                <p className="text-sm italic">{vocabulary.example}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-4 text-center">
              Nhấn để trở lại
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  )
}
