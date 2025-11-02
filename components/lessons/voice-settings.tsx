'use client'

import { useEffect, useState } from 'react'
import { Volume2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { getAvailableVoices, speak, saveVoicePreferences } from '@/lib/utils/speech'

export function VoiceSettings() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [femaleVoice, setFemaleVoice] = useState<string>('')
  const [maleVoice, setMaleVoice] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = getAvailableVoices()
      const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'))
      setVoices(englishVoices)
      
      // Load saved preferences or set defaults
      if (typeof window !== 'undefined' && englishVoices.length > 0) {
        const savedFemale = localStorage.getItem('preferred_female_voice')
        const savedMale = localStorage.getItem('preferred_male_voice')
        
        setFemaleVoice(savedFemale && englishVoices.find(v => v.name === savedFemale) ? savedFemale : englishVoices[0].name)
        setMaleVoice(savedMale && englishVoices.find(v => v.name === savedMale) ? savedMale : (englishVoices[1]?.name || englishVoices[0].name))
      }
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

  const handleTestVoice = async (voiceName: string, sampleText: string) => {
    const voice = voices.find(v => v.name === voiceName)
    if (voice) {
      try {
        await speak(sampleText, { voice, emotion: 'friendly' })
      } catch (error) {
        console.error('Error testing voice:', error)
      }
    }
  }

  const handleSave = () => {
    saveVoicePreferences(femaleVoice, maleVoice)
    alert('✅ Đã lưu cài đặt giọng nói!\n\n👩 Giọng nữ (Speaker A, C, E...):\n' + femaleVoice + '\n\n👨 Giọng nam (Speaker B, D, F...):\n' + maleVoice)
    setIsOpen(false)
  }

  if (!isOpen) {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="gap-2"
      >
        <Settings className="w-4 h-4" />
        Cài đặt giọng nói
      </Button>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Cài đặt giọng nói cho hội thoại
        </CardTitle>
        <CardDescription>
          Chọn giọng đọc cho từng người trong cuộc hội thoại. Các speaker sẽ tự động xen kẽ giữa 2 giọng này.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Female Voice Selection */}
        <div className="space-y-3 p-4 border rounded-lg bg-pink-50/50 dark:bg-pink-950/20">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👩</span>
            <Label htmlFor="female-voice" className="text-base font-semibold">
              Giọng nữ (Speaker A, C, E...)
            </Label>
          </div>
          <select
            id="female-voice"
            value={femaleVoice}
            onChange={(e) => setFemaleVoice(e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTestVoice(femaleVoice, 'Hi! Tell me about your family.')}
            disabled={!femaleVoice}
            className="w-full gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Thử giọng nữ
          </Button>
        </div>

        {/* Male Voice Selection */}
        <div className="space-y-3 p-4 border rounded-lg bg-blue-50/50 dark:bg-blue-950/20">
          <div className="flex items-center gap-2">
            <span className="text-2xl">👨</span>
            <Label htmlFor="male-voice" className="text-base font-semibold">
              Giọng nam (Speaker B, D, F...)
            </Label>
          </div>
          <select
            id="male-voice"
            value={maleVoice}
            onChange={(e) => setMaleVoice(e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
              </option>
            ))}
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleTestVoice(maleVoice, 'Sure! I come from a big family.')}
            disabled={!maleVoice}
            className="w-full gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Thử giọng nam
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 pt-4">
          <Button
            variant="ghost"
            onClick={() => setIsOpen(false)}
            className="flex-1"
          >
            Hủy
          </Button>
          <Button
            onClick={handleSave}
            disabled={!femaleVoice || !maleVoice}
            className="flex-1"
          >
            💾 Lưu cài đặt
          </Button>
        </div>

        {/* Help Text */}
        <div className="text-xs text-muted-foreground space-y-2 pt-2 border-t">
          <p><strong>💡 Hướng dẫn:</strong></p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Chọn 2 giọng khác nhau để hội thoại nghe tự nhiên hơn</li>
            <li>Click &ldquo;Thử giọng&rdquo; để nghe trước khi lưu</li>
            <li>Cài đặt sẽ được áp dụng cho tất cả bài học</li>
            <li>Trong hội thoại: Speaker A, C, E... dùng giọng nữ; Speaker B, D, F... dùng giọng nam</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
