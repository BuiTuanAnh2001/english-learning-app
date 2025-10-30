/**
 * localStorage service for managing lessons and vocabulary
 * This provides a simple CRUD interface without needing a backend
 */

import { Lesson, Category } from '@/lib/types';
import { lessons as defaultLessons, categories as defaultCategories } from '@/lib/data/lessons';

const LESSONS_KEY = 'english_app_lessons';
const CATEGORIES_KEY = 'english_app_categories';

/**
 * Initialize storage with default data if empty
 */
export const initializeStorage = (): void => {
  if (typeof window === 'undefined') return;

  const existingLessons = localStorage.getItem(LESSONS_KEY);
  const existingCategories = localStorage.getItem(CATEGORIES_KEY);

  if (!existingLessons) {
    localStorage.setItem(LESSONS_KEY, JSON.stringify(defaultLessons));
  }

  if (!existingCategories) {
    localStorage.setItem(CATEGORIES_KEY, JSON.stringify(defaultCategories));
  }
};

/**
 * Get all lessons from storage
 */
export const getLessons = (): Lesson[] => {
  if (typeof window === 'undefined') return defaultLessons;

  try {
    const stored = localStorage.getItem(LESSONS_KEY);
    return stored ? JSON.parse(stored) : defaultLessons;
  } catch (error) {
    console.error('Error loading lessons:', error);
    return defaultLessons;
  }
};

/**
 * Get a single lesson by ID
 */
export const getLessonById = (id: string): Lesson | null => {
  const lessons = getLessons();
  return lessons.find(lesson => lesson.id === id) || null;
};

/**
 * Save a new lesson
 */
export const createLesson = (lesson: Omit<Lesson, 'id'>): Lesson => {
  const lessons = getLessons();
  const newLesson: Lesson = {
    ...lesson,
    id: Date.now().toString(), // Simple ID generation
  };
  
  lessons.push(newLesson);
  localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
  
  return newLesson;
};

/**
 * Update an existing lesson
 */
export const updateLesson = (id: string, updates: Partial<Lesson>): Lesson | null => {
  const lessons = getLessons();
  const index = lessons.findIndex(lesson => lesson.id === id);
  
  if (index === -1) return null;
  
  lessons[index] = { ...lessons[index], ...updates };
  localStorage.setItem(LESSONS_KEY, JSON.stringify(lessons));
  
  return lessons[index];
};

/**
 * Delete a lesson
 */
export const deleteLesson = (id: string): boolean => {
  const lessons = getLessons();
  const filtered = lessons.filter(lesson => lesson.id !== id);
  
  if (filtered.length === lessons.length) return false;
  
  localStorage.setItem(LESSONS_KEY, JSON.stringify(filtered));
  return true;
};

/**
 * Get all categories
 */
export const getCategories = (): Category[] => {
  if (typeof window === 'undefined') return defaultCategories;

  try {
    const stored = localStorage.getItem(CATEGORIES_KEY);
    return stored ? JSON.parse(stored) : defaultCategories;
  } catch (error) {
    console.error('Error loading categories:', error);
    return defaultCategories;
  }
};

/**
 * Update category lesson count
 */
export const updateCategoryLessonCount = (categoryId: string): void => {
  const lessons = getLessons();
  const categories = getCategories();
  
  const categoryIndex = categories.findIndex(c => c.id === categoryId);
  if (categoryIndex === -1) return;
  
  const lessonCount = lessons.filter(l => l.category === categoryId).length;
  categories[categoryIndex].lessonCount = lessonCount;
  
  localStorage.setItem(CATEGORIES_KEY, JSON.stringify(categories));
};

/**
 * Get lessons by category
 */
export const getLessonsByCategory = (categoryId: string): Lesson[] => {
  const lessons = getLessons();
  return lessons.filter(lesson => lesson.category === categoryId);
};

/**
 * Search lessons by title or description
 */
export const searchLessons = (query: string): Lesson[] => {
  const lessons = getLessons();
  const lowerQuery = query.toLowerCase();
  
  return lessons.filter(lesson => 
    lesson.title.toLowerCase().includes(lowerQuery) ||
    lesson.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Clear all data (reset to defaults)
 */
export const resetStorage = (): void => {
  localStorage.removeItem(LESSONS_KEY);
  localStorage.removeItem(CATEGORIES_KEY);
  initializeStorage();
};

/**
 * Export all lessons to JSON
 */
export const exportLessonsToJSON = (): string => {
  const lessons = getLessons();
  return JSON.stringify(lessons, null, 2);
};

/**
 * Import lessons from JSON
 */
export const importLessonsFromJSON = (jsonString: string): { success: boolean; message: string; count?: number } => {
  try {
    const importedLessons: Lesson[] = JSON.parse(jsonString);
    
    // Validate structure
    if (!Array.isArray(importedLessons)) {
      return { success: false, message: 'Invalid format: Expected an array of lessons' };
    }

    // Validate each lesson has required fields
    for (const lesson of importedLessons) {
      if (!lesson.title || !lesson.category || !lesson.level) {
        return { success: false, message: 'Invalid lesson structure: Missing required fields' };
      }
    }

    // Get existing lessons and merge
    const existingLessons = getLessons();
    const mergedLessons = [...existingLessons];

    let addedCount = 0;
    let updatedCount = 0;

    for (const importedLesson of importedLessons) {
      const existingIndex = mergedLessons.findIndex(l => l.id === importedLesson.id);
      
      if (existingIndex !== -1) {
        // Update existing lesson
        mergedLessons[existingIndex] = importedLesson;
        updatedCount++;
      } else {
        // Add new lesson with unique ID
        const newLesson = {
          ...importedLesson,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        };
        mergedLessons.push(newLesson);
        addedCount++;
      }
    }

    // Save to localStorage
    localStorage.setItem(LESSONS_KEY, JSON.stringify(mergedLessons));

    // Update category counts
    const categories = getCategories();
    categories.forEach(cat => updateCategoryLessonCount(cat.id));

    return {
      success: true,
      message: `Successfully imported ${addedCount} new lessons and updated ${updatedCount} existing lessons`,
      count: addedCount + updatedCount,
    };
  } catch (error) {
    console.error('Import error:', error);
    return {
      success: false,
      message: `Failed to import: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};

/**
 * Download lessons as JSON file
 */
export const downloadLessonsAsFile = (filename: string = 'lessons.json'): void => {
  const jsonString = exportLessonsToJSON();
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

/**
 * Export lessons template (empty structure for users to fill)
 */
export const exportLessonsTemplate = (): string => {
  const template: Lesson = {
    id: 'auto-generated',
    title: 'Your Lesson Title',
    category: 'daily',
    level: 'beginner',
    description: 'Description of your lesson',
    duration: '15 phút',
    completed: false,
    progress: 0,
    vocabulary: [
      {
        word: 'Example',
        pronunciation: '/ɪɡˈzæmpl/',
        meaning: 'Ví dụ',
        example: 'This is an example sentence.',
      },
    ],
    phrases: [
      {
        phrase: 'Example phrase',
        meaning: 'Nghĩa của cụm từ',
        example: 'Example: This is how you use it.',
      },
    ],
    dialogues: [
      {
        speaker: 'A',
        text: 'Hello!',
        translation: 'Xin chào!',
      },
      {
        speaker: 'B',
        text: 'Hi there!',
        translation: 'Chào bạn!',
      },
    ],
  };

  return JSON.stringify([template], null, 2);
};

/**
 * Download lessons template file
 */
export const downloadLessonsTemplate = (): void => {
  const templateString = exportLessonsTemplate();
  const blob = new Blob([templateString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'lesson-template.json';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
