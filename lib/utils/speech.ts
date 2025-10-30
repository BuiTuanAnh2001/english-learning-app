/**
 * Speech utilities for text-to-speech functionality
 */

export interface SpeechOptions {
  lang?: string;
  rate?: number;
  pitch?: number;
  volume?: number;
}

/**
 * Speaks the given text using the Web Speech API
 * @param text - The text to speak
 * @param options - Speech options (language, rate, pitch, volume)
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
    
    // Set default options
    utterance.lang = options.lang || 'en-US';
    utterance.rate = options.rate || 0.9; // Slightly slower for clarity
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;

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
 * Finds the best English voice available
 * @returns The best English voice or null if none found
 */
export const getBestEnglishVoice = (): SpeechSynthesisVoice | null => {
  const voices = getAvailableVoices();
  
  // Priority order: US English > UK English > Any English
  const usVoice = voices.find(voice => voice.lang === 'en-US');
  if (usVoice) return usVoice;
  
  const ukVoice = voices.find(voice => voice.lang === 'en-GB');
  if (ukVoice) return ukVoice;
  
  const anyEnglish = voices.find(voice => voice.lang.startsWith('en'));
  return anyEnglish || null;
};

/**
 * Speaks the given text with the best available English voice
 * @param text - The text to speak
 * @param options - Additional speech options
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
