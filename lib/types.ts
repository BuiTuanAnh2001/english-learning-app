// Type definitions for the English learning app

export interface Vocabulary {
  word: string;
  pronunciation: string;
  meaning: string;
  example: string;
}

export interface Phrase {
  phrase: string;
  meaning: string;
  example: string;
}

export interface Dialogue {
  speaker: string;
  text: string;
  translation?: string;
}

export interface Lesson {
  id: string;
  title: string;
  category: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  description: string;
  duration: string;
  vocabulary: Vocabulary[];
  phrases: Phrase[];
  dialogues: Dialogue[];
  completed: boolean;
  progress: number;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  lessonCount: number;
}
