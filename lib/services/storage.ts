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
