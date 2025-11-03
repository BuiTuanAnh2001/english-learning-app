'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  startPronunciationTest,
  isSpeechRecognitionSupported,
  type PronunciationResult
} from '@/lib/utils/pronunciation';
import { speak } from '@/lib/utils/speech';

interface PronunciationAssessmentProps {
  text: string;
  translation?: string;
  onClose: () => void;
}

export function PronunciationAssessment({ text, translation, onClose }: PronunciationAssessmentProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [result, setResult] = useState<PronunciationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [mounted, setMounted] = useState(false);

  const isSupported = isSpeechRecognitionSupported();

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handlePlayOriginal = async () => {
    setIsPlaying(true);
    try {
      await speak(text);
    } catch (err) {
      console.error('Error playing audio:', err);
    } finally {
      setIsPlaying(false);
    }
  };

  const handleStartRecording = async () => {
    setIsRecording(true);
    setError(null);
    setResult(null);

    try {
      const pronunciationResult = await startPronunciationTest(text);
      setResult(pronunciationResult);
    } catch (err: any) {
      setError(err.message || 'Failed to record. Please try again.');
      console.error('Recording error:', err);
    } finally {
      setIsRecording(false);
    }
  };

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return 'text-green-600';
    if (accuracy >= 75) return 'text-blue-600';
    if (accuracy >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getAccuracyBgColor = (accuracy: number) => {
    if (accuracy >= 90) return 'bg-green-500';
    if (accuracy >= 75) return 'bg-blue-500';
    if (accuracy >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!mounted) {
    return null;
  }

  const modalContent = !isSupported ? (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <Card className="max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Speech Recognition Not Supported</h3>
          <p className="text-muted-foreground mb-4">
            Your browser doesn&apos;t support speech recognition. Please try using Chrome, Edge, or Safari.
          </p>
          <Button onClick={onClose}>Close</Button>
        </div>
      </Card>
    </motion.div>
  ) : (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-2xl w-full relative"
        style={{ zIndex: 100000 }}
      >
        <Card className="p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Pronunciation Practice</h2>
              <p className="text-muted-foreground">
                Listen, repeat, and get instant feedback on your pronunciation
              </p>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Original Text */}
          <div className="mb-6 p-4 bg-primary/5 rounded-lg border-2 border-primary/20">
            <p className="text-lg font-medium mb-2">{text}</p>
            {translation && (
              <p className="text-sm text-muted-foreground">{translation}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mb-6">
            <Button
              onClick={handlePlayOriginal}
              disabled={isPlaying || isRecording}
              variant="outline"
              className="flex-1"
            >
              <Volume2 className="w-4 h-4 mr-2" />
              {isPlaying ? 'Playing...' : 'Listen'}
            </Button>
            <Button
              onClick={handleStartRecording}
              disabled={isRecording || isPlaying}
              className="flex-1"
            >
              <Mic className={`w-4 h-4 mr-2 ${isRecording ? 'animate-pulse' : ''}`} />
              {isRecording ? 'Recording...' : 'Record Your Voice'}
            </Button>
          </div>

          {/* Recording Status */}
          {isRecording && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-red-500/10 border-2 border-red-500/50 rounded-lg text-center"
            >
              <div className="flex items-center justify-center gap-2 mb-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                <p className="font-semibold text-red-600">Recording... Speak now!</p>
              </div>
              <p className="text-sm text-muted-foreground">
                Say the sentence clearly and naturally
              </p>
            </motion.div>
          )}

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg"
              >
                <div className="flex items-start gap-3">
                  <XCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold text-red-600 mb-1">Recording Error</p>
                    <p className="text-sm mb-3">{error}</p>
                    
                    {/* Troubleshooting tips */}
                    {error.includes('Microphone permission') && (
                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm">
                        <p className="font-semibold mb-2">How to enable microphone:</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Look for the microphone icon in your browser&apos;s address bar</li>
                          <li>Click it and select &quot;Allow&quot;</li>
                          <li>Refresh the page if needed</li>
                        </ul>
                      </div>
                    )}
                    
                    {error.includes('Network error') && (
                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm">
                        <p className="font-semibold mb-2">Troubleshooting tips:</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Check your internet connection</li>
                          <li>Try disabling VPN if you&apos;re using one</li>
                          <li>Make sure your browser is up to date</li>
                          <li>Try using Chrome or Edge browser</li>
                        </ul>
                      </div>
                    )}
                    
                    {error.includes('No speech detected') && (
                      <div className="mt-3 p-3 bg-blue-500/10 border border-blue-500/30 rounded text-sm">
                        <p className="font-semibold mb-2">Tips for better recognition:</p>
                        <ul className="space-y-1 list-disc list-inside">
                          <li>Speak clearly and at normal volume</li>
                          <li>Make sure your microphone is working</li>
                          <li>Reduce background noise</li>
                          <li>Position microphone closer to your mouth</li>
                        </ul>
                      </div>
                    )}
                    
                    <Button
                      onClick={handleStartRecording}
                      disabled={isRecording}
                      variant="outline"
                      size="sm"
                      className="mt-3"
                    >
                      <Mic className="w-4 h-4 mr-2" />
                      Try Again
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="space-y-4"
              >
                {/* Accuracy Score */}
                <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg border-2 border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Accuracy Score</h3>
                    <span className={`text-3xl font-bold ${getAccuracyColor(result.accuracy)}`}>
                      {result.accuracy}%
                    </span>
                  </div>
                  <Progress 
                    value={result.accuracy} 
                    className="h-3"
                  />
                  <div className="mt-2 text-sm text-muted-foreground text-right">
                    {result.accuracy >= 90 ? 'Excellent!' :
                     result.accuracy >= 75 ? 'Great!' :
                     result.accuracy >= 60 ? 'Good!' :
                     result.accuracy >= 40 ? 'Fair' : 'Needs Practice'}
                  </div>
                </div>

                {/* What You Said */}
                <div className="p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm font-semibold mb-2 text-muted-foreground">What you said:</p>
                  <p className="text-lg">{result.recognized || '(nothing detected)'}</p>
                </div>

                {/* Word Analysis */}
                {(result.matchedWords.length > 0 || result.missedWords.length > 0 || result.extraWords.length > 0) && (
                  <div className="p-4 bg-secondary/50 rounded-lg space-y-3">
                    {result.matchedWords.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          Correct Words ({result.matchedWords.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {result.matchedWords.map((word, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-green-500/20 text-green-700 rounded text-sm"
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.missedWords.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <XCircle className="w-4 h-4 text-red-500" />
                          Missed Words ({result.missedWords.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {result.missedWords.map((word, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-red-500/20 text-red-700 rounded text-sm"
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {result.extraWords.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold mb-2 flex items-center gap-2">
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                          Extra Words ({result.extraWords.length})
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {result.extraWords.map((word, idx) => (
                            <span
                              key={idx}
                              className="px-2 py-1 bg-yellow-500/20 text-yellow-700 rounded text-sm"
                            >
                              {word}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Feedback */}
                <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-500" />
                    Feedback & Tips
                  </h4>
                  <ul className="space-y-2">
                    {result.feedback.map((tip, idx) => (
                      <li key={idx} className="text-sm leading-relaxed">
                        {tip}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Try Again Button */}
                <Button
                  onClick={handleStartRecording}
                  disabled={isRecording}
                  className="w-full"
                  size="lg"
                >
                  <Mic className="w-4 h-4 mr-2" />
                  Try Again
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Initial Instructions */}
          {!result && !isRecording && !error && (
            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="font-semibold mb-2">How it works:</h4>
              <ol className="space-y-2 text-sm">
                <li>1. Click &quot;Listen&quot; to hear the original pronunciation</li>
                <li>2. Click &quot;Record Your Voice&quot; and speak the sentence clearly</li>
                <li>3. Get instant feedback on your pronunciation accuracy</li>
                <li>4. Practice until you reach 90%+ accuracy!</li>
              </ol>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  );

  return createPortal(modalContent, document.body);
}
