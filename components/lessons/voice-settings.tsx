'use client'

import { useEffect, useState } from 'react'
import { Volume2, Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { getAvailableVoices, speak } from '@/lib/utils/speech'

export function VoiceSettings() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([])
  const [selectedVoice, setSelectedVoice] = useState<string>('')
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Load voices
    const loadVoices = () => {
      const availableVoices = getAvailableVoices()
      const englishVoices = availableVoices.filter(v => v.lang.startsWith('en'))
      setVoices(englishVoices)
      
      // Set default voice
      if (englishVoices.length > 0 && !selectedVoice) {
        setSelectedVoice(englishVoices[0].name)
      }
    }

    loadVoices()
    
    // Voices might load asynchronously
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = loadVoices
    }

    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [selectedVoice])

  const handleTestVoice = async () => {
    const voice = voices.find(v => v.name === selectedVoice)
    if (voice) {
      try {
        await speak('Hello! This is how I sound.', { 
          voice,
          emotion: 'friendly'
        })
      } catch (error) {
        console.error('Error testing voice:', error)
      }
    }
  }

  const saveVoicePreference = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_voice', selectedVoice)
    }
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
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Volume2 className="w-5 h-5" />
          Cài đặt giọng nói
        </CardTitle>
        <CardDescription>
          Chọn giọng đọc phù hợp để cải thiện trải nghiệm học tập
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="voice-select">Chọn giọng nói</Label>
          <select
            id="voice-select"
            value={selectedVoice}
            onChange={(e) => setSelectedVoice(e.target.value)}
            className="w-full p-2 border rounded-md bg-background"
          >
            {voices.map((voice) => (
              <option key={voice.name} value={voice.name}>
                {voice.name} ({voice.lang})
                {voice.localService ? ' - Local' : ' - Network'}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleTestVoice}
            disabled={!selectedVoice}
            className="flex-1 gap-2"
          >
            <Volume2 className="w-4 h-4" />
            Thử giọng
          </Button>
          <Button
            onClick={saveVoicePreference}
            disabled={!selectedVoice}
            className="flex-1"
          >
            Lưu
          </Button>
        </div>

        <Button
          variant="ghost"
          onClick={() => setIsOpen(false)}
          className="w-full"
        >
          Đóng
        </Button>

        <div className="text-xs text-muted-foreground space-y-1">
          <p><strong>Mẹo:</strong></p>
          <ul className="list-disc list-inside space-y-1">
            <li>Giọng &ldquo;Natural&rdquo; hoặc &ldquo;Premium&rdquo; nghe tự nhiên hơn</li>
            <li>Giọng &ldquo;Local&rdquo; hoạt động offline</li>
            <li>Giọng nam/nữ sẽ tự động xen kẽ trong hội thoại</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
