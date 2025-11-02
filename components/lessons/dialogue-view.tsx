'use client'

import { useState } from "react"
import { motion } from "framer-motion"
import { Volume2 } from "lucide-react"
import { Dialogue } from "@/lib/types"
import { cn } from "@/lib/utils"
import { speakDialogue } from "@/lib/utils/speech"

interface DialogueViewProps {
  dialogues: Dialogue[]
}

export function DialogueView({ dialogues }: DialogueViewProps) {
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null)

  const handleSpeak = async (dialogue: Dialogue, index: number) => {
    if (speakingIndex !== null) return

    try {
      setSpeakingIndex(index)
      // Use gender from dialogue data, or fallback to alternating pattern
      const gender = dialogue.gender || (index % 2 === 0 ? 'female' : 'male')
      await speakDialogue(dialogue.text, dialogue.emotion, gender)
    } catch (error) {
      console.error('Error speaking dialogue:', error)
    } finally {
      setSpeakingIndex(null)
    }
  }

  // Determine if speaker is on the left (odd index) or right (even index)
  // This creates alternating pattern for natural conversation flow
  const isLeftSide = (index: number) => index % 2 === 0

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {dialogues.map((dialogue, index) => {
        const onLeft = isLeftSide(index)
        
        return (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: onLeft ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={cn(
              "flex gap-3",
              onLeft ? 'justify-start' : 'justify-end'
            )}
          >
            {onLeft && (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-semibold text-xs">
                {dialogue.speaker.charAt(0).toUpperCase()}
              </div>
            )}

            <div
              className={cn(
                "flex flex-col gap-2 max-w-[70%]",
                onLeft ? 'items-start' : 'items-end'
              )}
            >
              <span className="text-xs font-semibold text-muted-foreground px-2">
                {dialogue.speaker}
              </span>
              <div
                className={cn(
                  "rounded-2xl p-4 shadow-md",
                  onLeft
                    ? 'bg-primary/10 rounded-tl-none'
                    : 'bg-secondary/10 rounded-tr-none'
                )}
              >
                <div className="flex items-start gap-2">
                  <p className="text-sm font-medium leading-relaxed">
                    {dialogue.text}
                  </p>
                  <button
                    onClick={() => handleSpeak(dialogue, index)}
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
                {dialogue.emotion && (
                  <span className="inline-block mt-2 text-xs bg-muted px-2 py-1 rounded-full">
                    {dialogue.emotion}
                  </span>
                )}
              </div>
            </div>

            {!onLeft && (
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-white font-semibold text-xs">
                {dialogue.speaker.charAt(0).toUpperCase()}
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
