'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Volume2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Vocabulary } from "@/lib/types"

interface VocabularyCardProps {
  vocabulary: Vocabulary
  index: number
}

export function VocabularyCard({ vocabulary, index }: VocabularyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="h-64 perspective-1000"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front */}
        <Card
          className="absolute inset-0 [backface-visibility:hidden] flex items-center justify-center bg-gradient-to-br from-primary/10 to-secondary/10"
        >
          <CardContent className="text-center p-6">
            <h3 className="text-3xl font-bold text-primary mb-2">
              {vocabulary.word}
            </h3>
            <p className="text-muted-foreground mb-4">{vocabulary.pronunciation}</p>
            <button
              onClick={(e) => {
                e.stopPropagation()
              }}
              className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80"
            >
              <Volume2 className="w-4 h-4" />
              Phát âm
            </button>
            <p className="text-xs text-muted-foreground mt-6">
              Nhấn để xem nghĩa
            </p>
          </CardContent>
        </Card>

        {/* Back */}
        <Card
          className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)] bg-gradient-to-br from-accent/10 to-primary/10"
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
