'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Volume2 } from 'lucide-react'
import { getAvailableVoices, getVoicesByGender, speak } from '@/lib/utils/speech'

export function VoiceDebugPanel() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [categorized, setCategorized] = useState<{ male: SpeechSynthesisVoice[]; female: SpeechSynthesisVoice[] }>({ male: [], female: [] })

  useEffect(() => {
    const loadVoices = () => {
      const allVoices = getAvailableVoices()
      const englishVoices = allVoices.filter(v => v.lang.startsWith('en'))
      setVoices(englishVoices)
      setCategorized(getVoicesByGender())
    }

    loadVoices()
    
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  const testVoice = async (voice: SpeechSynthesisVoice) => {
    await speak('Hello! This is a test.', { voice })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>🔍 Voice Debug Panel</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Male Voices */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              👨 Male Voices ({categorized.male.length})
            </h3>
            <div className="space-y-2">
              {categorized.male.map((voice) => (
                <div key={voice.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{voice.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{voice.lang}</Badge>
                      {voice.localService && <Badge variant="secondary">Local</Badge>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => testVoice(voice)}
                    className="gap-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    Test
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Female Voices */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              👩 Female Voices ({categorized.female.length})
            </h3>
            <div className="space-y-2">
              {categorized.female.map((voice) => (
                <div key={voice.name} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium">{voice.name}</p>
                    <div className="flex gap-2 mt-1">
                      <Badge variant="outline">{voice.lang}</Badge>
                      {voice.localService && <Badge variant="secondary">Local</Badge>}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => testVoice(voice)}
                    className="gap-2"
                  >
                    <Volume2 className="w-4 h-4" />
                    Test
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* All English Voices */}
          <div>
            <h3 className="text-lg font-semibold mb-3">
              📋 All English Voices ({voices.length})
            </h3>
            <div className="text-xs text-muted-foreground space-y-1 max-h-60 overflow-y-auto">
              {voices.map((voice, idx) => (
                <div key={idx} className="font-mono">
                  {idx + 1}. {voice.name} - {voice.lang}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
