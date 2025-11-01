/**
 * Speech utilities for text-to-speech functionality with emotion support
 */

export interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
  voice?: SpeechSynthesisVoice | null;
  emotion?: 'neutral' | 'happy' | 'sad' | 'excited' | 'calm' | 'formal' | 'friendly';
}

/**
 * Get emotion-based speech parameters
 */
const getEmotionParameters = (emotion?: string) => {
  switch (emotion) {
    case 'happy':
    case 'excited':
      return { rate: 1.1, pitch: 1.2 }; // Faster, higher pitch
    case 'sad':
      return { rate: 0.8, pitch: 0.9 }; // Slower, lower pitch
    case 'calm':
      return { rate: 0.85, pitch: 1.0 }; // Slower, normal pitch
    case 'formal':
      return { rate: 0.9, pitch: 0.95 }; // Slightly slower, slightly lower
    case 'friendly':
      return { rate: 1.0, pitch: 1.1 }; // Normal speed, slightly higher
    case 'neutral':
    default:
      return { rate: 0.95, pitch: 1.0 }; // Slightly slower for clarity
  }
};

/**
 * Speaks the given text using the Web Speech API with emotion support
 * @param text - The text to speak
 * @param options - Speech options (language, rate, pitch, volume, voice, emotion)
 * @returns Promise that resolves when speech is finished
 */
export const speak = (text: string, options: SpeechOptions = {}): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported in this browser');
      reject(new Error('Speech synthesis not supported'));
      return;
    }

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    // Create speech utterance
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Get emotion parameters
    const emotionParams = getEmotionParameters(options.emotion);
    
    // Set options with emotion adjustments
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate ?? emotionParams.rate;
    utterance.pitch = options.pitch ?? emotionParams.pitch;
    utterance.volume = options.volume ?? 1;

    // Set voice if provided, otherwise use best available
    if (options.voice) {
      utterance.voice = options.voice;
    } else {
      const bestVoice = getBestEnglishVoice();
      if (bestVoice) {
        utterance.voice = bestVoice;
      }
    }

    // Event handlers
    utterance.onend = () => {
      resolve();
    };

    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
      reject(event);
    };

    // Speak the text
    window.speechSynthesis.speak(utterance);
  });
};

/**
 * Stops any ongoing speech
 */
export const stopSpeech = (): void => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};

/**
 * Checks if speech synthesis is currently speaking
 */
export const isSpeaking = (): boolean => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.speaking;
  }
  return false;
};

/**
 * Gets available voices for speech synthesis
 * @returns Array of available voices
 */
export const getAvailableVoices = (): SpeechSynthesisVoice[] => {
  if ('speechSynthesis' in window) {
    return window.speechSynthesis.getVoices();
  }
  return [];
};

/**
 * Finds the best English voice available with preference for natural-sounding voices
 * @returns The best English voice or null if none found
 */
export const getBestEnglishVoice = (): SpeechSynthesisVoice | null => {
  const voices = getAvailableVoices();
  
  // Priority: Natural/Premium voices > Standard voices
  // Look for Google, Microsoft, or Apple natural voices
  const naturalVoiceKeywords = ['Google', 'Microsoft', 'Apple', 'Premium', 'Natural', 'Neural', 'Samantha', 'Karen', 'Daniel'];
  
  // Try to find premium US English voice
  const premiumUSVoice = voices.find(voice => 
    voice.lang === 'en-US' && 
    naturalVoiceKeywords.some(keyword => voice.name.includes(keyword))
  );
  if (premiumUSVoice) return premiumUSVoice;
  
  // Try to find premium UK English voice
  const premiumUKVoice = voices.find(voice => 
    voice.lang === 'en-GB' && 
    naturalVoiceKeywords.some(keyword => voice.name.includes(keyword))
  );
  if (premiumUKVoice) return premiumUKVoice;
  
  // Fallback to any premium English voice
  const premiumEnglish = voices.find(voice => 
    voice.lang.startsWith('en') && 
    naturalVoiceKeywords.some(keyword => voice.name.includes(keyword))
  );
  if (premiumEnglish) return premiumEnglish;
  
  // Standard priority order: US English > UK English > Any English
  const usVoice = voices.find(voice => voice.lang === 'en-US');
  if (usVoice) return usVoice;
  
  const ukVoice = voices.find(voice => voice.lang === 'en-GB');
  if (ukVoice) return ukVoice;
  
  const anyEnglish = voices.find(voice => voice.lang.startsWith('en'));
  return anyEnglish || null;
};

/**
 * Get voices categorized by gender (for more natural conversations)
 */
export const getVoicesByGender = (): { male: SpeechSynthesisVoice[]; female: SpeechSynthesisVoice[] } => {
  const voices = getAvailableVoices();
  const englishVoices = voices.filter(v => v.lang.startsWith('en'));
  
  // Common male voice names
  const maleKeywords = [
    'Male', 'male', 'Man', 'man',
    'David', 'Daniel', 'James', 'Thomas', 'Alex', 'George', 
    'Fred', 'Oliver', 'Rishi', 'Ryan', 'Aaron', 'Bruce',
    'Guy', 'Male'
  ];
  
  // Common female voice names
  const femaleKeywords = [
    'Female', 'female', 'Woman', 'woman',
    'Samantha', 'Karen', 'Victoria', 'Susan', 'Zira', 'Joanna',
    'Kate', 'Lisa', 'Emma', 'Amy', 'Salli', 'Kimberly',
    'Moira', 'Fiona', 'Serena', 'Tessa', 'Ava', 'Allison'
  ];
  
  const male: SpeechSynthesisVoice[] = [];
  const female: SpeechSynthesisVoice[] = [];
  const unclassified: SpeechSynthesisVoice[] = [];
  
  // Classify voices
  englishVoices.forEach(voice => {
    const isMale = maleKeywords.some(keyword => voice.name.toLowerCase().includes(keyword.toLowerCase()));
    const isFemale = femaleKeywords.some(keyword => voice.name.toLowerCase().includes(keyword.toLowerCase()));
    
    if (isMale && !isFemale) {
      male.push(voice);
    } else if (isFemale && !isMale) {
      female.push(voice);
    } else {
      unclassified.push(voice);
    }
  });
  
  // If we don't have enough voices in either category, distribute unclassified voices
  if (male.length === 0 && unclassified.length > 0) {
    male.push(...unclassified.slice(0, Math.ceil(unclassified.length / 2)));
    unclassified.splice(0, Math.ceil(unclassified.length / 2));
  }
  if (female.length === 0 && unclassified.length > 0) {
    female.push(...unclassified);
  }
  
  return { male, female };
};

/**
 * Speaks the given text with the best available English voice
 * @param text - The text to speak
 * @param options - Additional speech options including emotion
 */
export const speakEnglish = async (text: string, options: Omit<SpeechOptions, 'lang'> = {}): Promise<void> => {
  try {
    await speak(text, {
      ...options,
      lang: 'en-US',
    });
  } catch (error) {
    console.error('Error speaking English text:', error);
    throw error;
  }
};

/**
 * Speaks dialogue with appropriate emotion and voice variation
 * @param text - The text to speak
 * @param emotion - The emotion to convey
 * @param speakerIndex - Index to determine voice variation (for alternating speakers)
 */
export const speakDialogue = async (
  text: string, 
  emotion?: string,
  speakerIndex?: number
): Promise<void> => {
  try {
    const voices = getVoicesByGender();
    let selectedVoice: SpeechSynthesisVoice | null = null;
    
    // Alternate between male and female voices for natural conversation
    if (speakerIndex !== undefined) {
      if (speakerIndex % 2 === 0 && voices.female.length > 0) {
        selectedVoice = voices.female[0];
      } else if (voices.male.length > 0) {
        selectedVoice = voices.male[0];
      }
    }
    
    await speak(text, {
      lang: 'en-US',
      emotion: emotion as any,
      voice: selectedVoice,
    });
  } catch (error) {
    console.error('Error speaking dialogue:', error);
    throw error;
  }
};
