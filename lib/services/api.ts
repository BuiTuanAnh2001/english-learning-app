/**
 * API Service Layer
 * This replaces localStorage with backend API calls
 */

import { Lesson, Category } from '@/lib/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

// Helper function to get auth token
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('auth_token')
}

// Helper function to make authenticated requests
async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const token = getAuthToken()
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  const data = await response.json()

  if (!response.ok) {
    const errorMessage = data.error || data.message || 'API request failed'
    console.error('API Error:', errorMessage, 'Response:', data)
    throw new Error(errorMessage)
  }

  return data
}

/**
 * Get all lessons with optional filters
 */
export const getLessons = async (filters?: {
  category?: string
  level?: string
  search?: string
}): Promise<Lesson[]> => {
  try {
    const params = new URLSearchParams()
    if (filters?.category) params.append('category', filters.category)
    if (filters?.level) params.append('level', filters.level)
    if (filters?.search) params.append('search', filters.search)

    const queryString = params.toString()
    const endpoint = `/lessons${queryString ? `?${queryString}` : ''}`
    
    const result = await fetchAPI(endpoint)
    return result.data || []
  } catch (error) {
    console.error('Error fetching lessons:', error)
    return []
  }
}

/**
 * Get a single lesson by ID
 */
export const getLessonById = async (id: string): Promise<Lesson | null> => {
  try {
    const result = await fetchAPI(`/lessons/${id}`)
    return result.data
  } catch (error) {
    console.error('Error fetching lesson:', error)
    return null
  }
}

/**
 * Create a new lesson (Admin only)
 */
export const createLesson = async (lesson: Omit<Lesson, 'id' | 'completed' | 'progress'>): Promise<Lesson> => {
  try {
    const result = await fetchAPI('/lessons', {
      method: 'POST',
      body: JSON.stringify(lesson),
    })
    return result.data
  } catch (error) {
    console.error('Error creating lesson:', error)
    throw error
  }
}

/**
 * Update an existing lesson (Admin only)
 */
export const updateLesson = async (id: string, updates: Partial<Lesson>): Promise<Lesson | null> => {
  try {
    const result = await fetchAPI(`/lessons/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })
    return result.data
  } catch (error) {
    console.error('Error updating lesson:', error)
    throw error
  }
}

/**
 * Delete a lesson (Admin only)
 */
export const deleteLesson = async (id: string): Promise<boolean> => {
  try {
    await fetchAPI(`/lessons/${id}`, {
      method: 'DELETE',
    })
    return true
  } catch (error) {
    console.error('Error deleting lesson:', error)
    return false
  }
}

/**
 * Get all categories
 */
export const getCategories = async (): Promise<Category[]> => {
  try {
    const result = await fetchAPI('/categories')
    return result.data || []
  } catch (error) {
    console.error('Error fetching categories:', error)
    return []
  }
}

/**
 * Get lessons by category
 */
export const getLessonsByCategory = async (categoryId: string): Promise<Lesson[]> => {
  return getLessons({ category: categoryId })
}

/**
 * Search lessons
 */
export const searchLessons = async (query: string): Promise<Lesson[]> => {
  return getLessons({ search: query })
}

/**
 * Authentication functions
 */
export const login = async (email: string, password: string): Promise<{ user: any; token: string }> => {
  try {
    // Use /admin/signin instead of /auth/login to avoid adblocker blocking
    const result = await fetchAPI('/admin/signin', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    
    // Save token to localStorage
    if (result.token) {
      localStorage.setItem('auth_token', result.token)
      localStorage.setItem('user', JSON.stringify(result.user))
    }
    
    return { user: result.user, token: result.token }
  } catch (error) {
    console.error('Login error:', error)
    throw error
  }
}

export const register = async (email: string, password: string, name?: string): Promise<{ user: any; token: string }> => {
  try {
    const result = await fetchAPI('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    })
    
    // Save token to localStorage
    if (result.data.token) {
      localStorage.setItem('auth_token', result.data.token)
      localStorage.setItem('user', JSON.stringify(result.data.user))
    }
    
    return result.data
  } catch (error) {
    console.error('Register error:', error)
    throw error
  }
}

export const logout = (): void => {
  localStorage.removeItem('auth_token')
  localStorage.removeItem('user')
}

export const getCurrentUser = async (): Promise<any | null> => {
  try {
    const data = await fetchAPI('/auth/me')
    return data.user
  } catch (error) {
    console.error('Get current user error:', error)
    return null
  }
}

export const isAuthenticated = (): boolean => {
  return !!getAuthToken()
}

/**
 * Export lessons to JSON (for backup)
 */
export const exportLessonsToJSON = async (): Promise<string> => {
  const lessons = await getLessons()
  return JSON.stringify(lessons, null, 2)
}

/**
 * Download lessons as JSON file
 */
export const downloadLessonsAsFile = async (filename: string = 'lessons.json'): Promise<void> => {
  const jsonString = await exportLessonsToJSON()
  const blob = new Blob([jsonString], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Get user's learning progress
 */
export const getUserProgress = async (): Promise<any[]> => {
  try {
    const result = await fetchAPI('/progress')
    return result.data || []
  } catch (error) {
    console.error('Error fetching progress:', error)
    return []
  }
}

/**
 * Update lesson progress
 */
export const updateLessonProgress = async (lessonId: string, completed: boolean, score?: number): Promise<any> => {
  try {
    const result = await fetchAPI('/progress', {
      method: 'POST',
      body: JSON.stringify({ lessonId, completed, score }),
    })
    return result.data
  } catch (error) {
    console.error('Error updating progress:', error)
    throw error
  }
}

