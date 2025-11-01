import { Lesson, QuizQuestion, Vocabulary, Phrase } from '../types';

// Shuffle array helper function
function shuffleArray<T>(array: T[]): T[] {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Generate multiple choice questions from vocabulary
function generateVocabularyMCQ(vocabulary: Vocabulary[], allVocabulary: Vocabulary[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  vocabulary.forEach((vocab, index) => {
    // Question: What does "word" mean?
    const wrongOptions = allVocabulary
      .filter(v => v.word !== vocab.word)
      .map(v => v.meaning)
      .slice(0, 3);
    
    const options = shuffleArray([vocab.meaning, ...wrongOptions]);
    
    questions.push({
      id: `vocab-mcq-${index}`,
      type: 'multiple-choice',
      question: `"${vocab.word}" có nghĩa là gì?`,
      options,
      correctAnswer: vocab.meaning,
      explanation: `Ví dụ: ${vocab.example}`,
      points: 10,
    });
  });
  
  return questions;
}

// Generate fill in the blank questions
function generateFillBlankQuestions(vocabulary: Vocabulary[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  vocabulary.forEach((vocab, index) => {
    // Replace the main word in the example with a blank
    const blank = '______';
    const questionText = vocab.example.replace(
      new RegExp(`\\b${vocab.word}\\b`, 'i'),
      blank
    );
    
    if (questionText !== vocab.example) {
      questions.push({
        id: `vocab-fill-${index}`,
        type: 'fill-blank',
        question: `Điền từ thích hợp vào chỗ trống:\n"${questionText}"`,
        correctAnswer: vocab.word.toLowerCase(),
        explanation: `Đáp án: ${vocab.word} - ${vocab.meaning}`,
        points: 15,
      });
    }
  });
  
  return questions;
}

// Generate phrase translation questions
function generatePhraseMCQ(phrases: Phrase[], allPhrases: Phrase[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  phrases.forEach((phrase, index) => {
    const wrongOptions = allPhrases
      .filter(p => p.phrase !== phrase.phrase)
      .map(p => p.meaning)
      .slice(0, 3);
    
    const options = shuffleArray([phrase.meaning, ...wrongOptions]);
    
    questions.push({
      id: `phrase-mcq-${index}`,
      type: 'multiple-choice',
      question: `"${phrase.phrase}" có nghĩa là gì?`,
      options,
      correctAnswer: phrase.meaning,
      explanation: `Ví dụ: ${phrase.example}`,
      points: 10,
    });
  });
  
  return questions;
}

// Generate true/false questions
function generateTrueFalseQuestions(vocabulary: Vocabulary[], allVocabulary: Vocabulary[]): QuizQuestion[] {
  const questions: QuizQuestion[] = [];
  
  vocabulary.slice(0, 3).forEach((vocab, index) => {
    const isTrue = Math.random() > 0.5;
    const meaning = isTrue 
      ? vocab.meaning 
      : allVocabulary.find(v => v.word !== vocab.word)?.meaning || vocab.meaning;
    
    questions.push({
      id: `vocab-tf-${index}`,
      type: 'true-false',
      question: `"${vocab.word}" có nghĩa là "${meaning}". Đúng hay sai?`,
      options: ['Đúng', 'Sai'],
      correctAnswer: isTrue ? 'Đúng' : 'Sai',
      explanation: `${vocab.word} có nghĩa là: ${vocab.meaning}`,
      points: 5,
    });
  });
  
  return questions;
}

// Main function to generate quiz from lesson
export function generateQuizFromLesson(lesson: Lesson, allLessons: Lesson[]): QuizQuestion[] {
  const allVocabulary = allLessons.flatMap(l => l.vocabulary);
  const allPhrases = allLessons.flatMap(l => l.phrases);
  
  const questions: QuizQuestion[] = [];
  
  // Generate different types of questions
  if (lesson.vocabulary.length > 0) {
    // Add vocabulary MCQ (max 5)
    const vocabMCQ = generateVocabularyMCQ(
      lesson.vocabulary.slice(0, 5),
      allVocabulary
    );
    questions.push(...vocabMCQ);
    
    // Add fill in the blank (max 3)
    const fillBlank = generateFillBlankQuestions(lesson.vocabulary.slice(0, 3));
    questions.push(...fillBlank);
    
    // Add true/false (max 3)
    const trueFalse = generateTrueFalseQuestions(lesson.vocabulary, allVocabulary);
    questions.push(...trueFalse);
  }
  
  if (lesson.phrases.length > 0) {
    // Add phrase MCQ (max 3)
    const phraseMCQ = generatePhraseMCQ(
      lesson.phrases.slice(0, 3),
      allPhrases
    );
    questions.push(...phraseMCQ);
  }
  
  // Shuffle all questions
  return shuffleArray(questions);
}

// Calculate quiz score
export function calculateQuizScore(
  questions: QuizQuestion[],
  answers: Map<string, string | string[]>
): {
  score: number;
  correctAnswers: number;
  totalPoints: number;
  earnedPoints: number;
} {
  let correctAnswers = 0;
  let earnedPoints = 0;
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  
  questions.forEach(question => {
    const userAnswer = answers.get(question.id);
    if (!userAnswer) return;
    
    const correct = Array.isArray(question.correctAnswer)
      ? JSON.stringify(question.correctAnswer.sort()) === JSON.stringify((userAnswer as string[]).sort())
      : userAnswer.toString().toLowerCase().trim() === question.correctAnswer.toString().toLowerCase().trim();
    
    if (correct) {
      correctAnswers++;
      earnedPoints += question.points;
    }
  });
  
  const score = Math.round((earnedPoints / totalPoints) * 100);
  
  return {
    score,
    correctAnswers,
    totalPoints,
    earnedPoints,
  };
}
