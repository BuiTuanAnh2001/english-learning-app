'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Volume2 } from "lucide-react"
import { Dialogue } from "@/lib/types"
import { cn } from "@/lib/utils"
import { speakEnglish } from "@/lib/utils/speech"

interface DialogueViewProps {
  dialogues: Dialogue[]
}

export function DialogueView({ dialogues }: DialogueViewProps) {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null)

  const handleSpeak = async (text: string, index: number) => {
    if (speakingIndex !== null) return

    try {
      setSpeakingIndex(index)
      await speakEnglish(text)
    } catch (error) {
      console.error('Error speaking dialogue:', error)
    } finally {
      setSpeakingIndex(null)
    }
  }

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {dialogues.map((dialogue, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: dialogue.speaker === 'A' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className={cn(
            "flex gap-3",
            dialogue.speaker === 'A' ? 'justify-start' : 'justify-end'
          )}
        >
          {dialogue.speaker === 'A' && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold">
              A
            </div>
          )}

          <div
            className={cn(
              "flex flex-col gap-2 max-w-[70%]",
              dialogue.speaker === 'A' ? 'items-start' : 'items-end'
            )}
          >
            <div
              className={cn(
                "rounded-2xl p-4 shadow-md",
                dialogue.speaker === 'A'
                  ? 'bg-primary/10 rounded-tl-none'
                  : 'bg-secondary/10 rounded-tr-none'
              )}
            >
              <div className="flex items-start gap-2">
                <p className="text-sm font-medium leading-relaxed">
                  {dialogue.text}
                </p>
                <button
                  onClick={() => handleSpeak(dialogue.text, index)}
                  disabled={speakingIndex !== null}
                  className="flex-shrink-0 text-muted-foreground hover:text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title={speakingIndex === index ? 'Đang phát...' : 'Phát âm'}
                >
                  <Volume2 className={`w-4 h-4 ${speakingIndex === index ? 'animate-pulse' : ''}`} />
                </button>
              </div>
              {dialogue.translation && (
                <p className="text-xs text-muted-foreground mt-2 italic">
                  {dialogue.translation}
                </p>
              )}
            </div>
          </div>

          {dialogue.speaker !== 'A' && (
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold">
              B
            </div>
          )}
        </motion.div>
      ))}
    </div>
  )
}
