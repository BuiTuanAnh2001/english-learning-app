// Pronunciation assessment utilities using Web Speech API

export interface PronunciationResult {
  accuracy: number; // 0-100
  recognized: string;
  expected: string;
  feedback: string[];
  matchedWords: string[];
  missedWords: string[];
  extraWords: string[];
}

// Check if browser supports speech recognition
export const isSpeechRecognitionSupported = (): boolean => {
  return typeof window !== 'undefined' && 
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);
};

// Get speech recognition instance
export const getSpeechRecognition = () => {
  if (typeof window === 'undefined') return null;
  
  const SpeechRecognition = (window as any).SpeechRecognition || 
                           (window as any).webkitSpeechRecognition;
  
  if (!SpeechRecognition) return null;
  
  const recognition = new SpeechRecognition();
  recognition.continuous = false;
  recognition.interimResults = false;
  recognition.lang = 'en-US';
  recognition.maxAlternatives = 1;
  
  return recognition;
};

// Normalize text for comparison (lowercase, remove punctuation)
const normalizeText = (text: string): string => {
  return text
    .toLowerCase()
    .replace(/[.,!?;:'"]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
};

// Calculate word-level accuracy
const getWordAccuracy = (expected: string[], recognized: string[]): {
  matched: string[];
  missed: string[];
  extra: string[];
} => {
  const matched: string[] = [];
  const missed: string[] = [];
  const extra: string[] = [];
  
  const recognizedSet = new Set(recognized);
  const expectedSet = new Set(expected);
  
  // Find matched and missed words
  expected.forEach(word => {
    if (recognizedSet.has(word)) {
      matched.push(word);
    } else {
      missed.push(word);
    }
  });
  
  // Find extra words
  recognized.forEach(word => {
    if (!expectedSet.has(word)) {
      extra.push(word);
    }
  });
  
  return { matched, missed, extra };
};

// Calculate similarity score using Levenshtein distance
const calculateSimilarity = (str1: string, str2: string): number => {
  const len1 = str1.length;
  const len2 = str2.length;
  const matrix: number[][] = [];

  for (let i = 0; i <= len1; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= len2; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= len1; i++) {
    for (let j = 1; j <= len2; j++) {
      const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  const distance = matrix[len1][len2];
  const maxLen = Math.max(len1, len2);
  return maxLen === 0 ? 100 : ((maxLen - distance) / maxLen) * 100;
};

// Generate feedback based on accuracy
const generateFeedback = (
  accuracy: number,
  missed: string[],
  extra: string[],
  expected: string
): string[] => {
  const feedback: string[] = [];
  
  if (accuracy >= 90) {
    feedback.push('🎉 Excellent pronunciation! You got it almost perfect!');
  } else if (accuracy >= 75) {
    feedback.push('👍 Great job! Your pronunciation is very good.');
  } else if (accuracy >= 60) {
    feedback.push('😊 Good effort! Keep practicing to improve.');
  } else if (accuracy >= 40) {
    feedback.push('💪 You\'re on the right track. Try listening carefully and repeat.');
  } else {
    feedback.push('📚 Don\'t worry! Pronunciation takes practice. Listen to the sentence again.');
  }
  
  if (missed.length > 0) {
    feedback.push(`❌ Missing words: "${missed.join(', ')}". Try to pronounce them clearly.`);
  }
  
  if (extra.length > 0) {
    feedback.push(`➕ Extra words detected: "${extra.join(', ')}". Make sure you're saying the exact sentence.`);
  }
  
  if (accuracy < 75) {
    feedback.push(`💡 Tip: Listen to the original sentence again and pay attention to pronunciation.`);
    feedback.push(`🎯 Expected: "${expected}"`);
  }
  
  return feedback;
};

// Assess pronunciation
export const assessPronunciation = (
  expectedText: string,
  recognizedText: string
): PronunciationResult => {
  const normalizedExpected = normalizeText(expectedText);
  const normalizedRecognized = normalizeText(recognizedText);
  
  const expectedWords = normalizedExpected.split(' ').filter(w => w);
  const recognizedWords = normalizedRecognized.split(' ').filter(w => w);
  
  const { matched, missed, extra } = getWordAccuracy(expectedWords, recognizedWords);
  
  // Calculate accuracy based on word matching and string similarity
  const wordAccuracy = expectedWords.length > 0 
    ? (matched.length / expectedWords.length) * 100 
    : 0;
  
  const stringSimilarity = calculateSimilarity(normalizedExpected, normalizedRecognized);
  
  // Weighted average: 60% word accuracy, 40% string similarity
  const accuracy = Math.round(wordAccuracy * 0.6 + stringSimilarity * 0.4);
  
  const feedback = generateFeedback(accuracy, missed, extra, expectedText);
  
  return {
    accuracy,
    recognized: recognizedText,
    expected: expectedText,
    feedback,
    matchedWords: matched,
    missedWords: missed,
    extraWords: extra
  };
};

// Start recording and return promise with result
export const startPronunciationTest = (expectedText: string): Promise<PronunciationResult> => {
  return new Promise((resolve, reject) => {
    const recognition = getSpeechRecognition();
    
    if (!recognition) {
      reject(new Error('Speech recognition is not supported in this browser'));
      return;
    }
    
    recognition.onresult = (event: any) => {
      const recognizedText = event.results[0][0].transcript;
      const result = assessPronunciation(expectedText, recognizedText);
      resolve(result);
    };
    
    recognition.onerror = (event: any) => {
      reject(new Error(`Speech recognition error: ${event.error}`));
    };
    
    recognition.onend = () => {
      // Recognition ended without result
    };
    
    try {
      recognition.start();
    } catch (error) {
      reject(error);
    }
  });
};
