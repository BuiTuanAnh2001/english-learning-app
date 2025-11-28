'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Lesson } from '@/lib/types'
import { getLessons, getUserProgress } from '@/lib/services/api'
import { useAuth } from './auth-context'

interface ProgressData {
  completed: boolean
  progress?: number
}

interface LessonsContextType {
  lessons: Lesson[]
  userProgress: Map<string, ProgressData>
  loading: boolean
  progressLoading: boolean
  error: string | null
  refreshLessons: () => Promise<void>
  refreshProgress: () => Promise<void>
  updateLocalProgress: (lessonId: string, data: ProgressData) => void
}

const LessonsContext = createContext<LessonsContextType | undefined>(undefined)

// Cache cho lessons và progress
let lessonsCache: Lesson[] | null = null
let progressCache: Map<string, ProgressData> | null = null
let lastLessonsFetch = 0
let lastProgressFetch = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 phút

export function LessonsProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated, user } = useAuth()
  const [lessons, setLessons] = useState<Lesson[]>(lessonsCache || [])
  const [userProgress, setUserProgress] = useState<Map<string, ProgressData>>(progressCache || new Map())
  const [loading, setLoading] = useState(!lessonsCache)
  const [progressLoading, setProgressLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const refreshLessons = useCallback(async () => {
    const now = Date.now()
    
    // Sử dụng cache nếu còn hiệu lực
    if (lessonsCache && now - lastLessonsFetch < CACHE_DURATION) {
      setLessons(lessonsCache)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const allLessons = await getLessons()
      setLessons(allLessons)
      lessonsCache = allLessons
      lastLessonsFetch = now
    } catch (err) {
      setError('Không thể tải bài học. Vui lòng thử lại sau.')
      console.error('Error fetching lessons:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const refreshProgress = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setUserProgress(new Map())
      progressCache = null
      return
    }

    const now = Date.now()
    
    // Sử dụng cache nếu còn hiệu lực và cùng user
    if (progressCache && now - lastProgressFetch < CACHE_DURATION) {
      setUserProgress(progressCache)
      return
    }

    try {
      setProgressLoading(true)
      const progressData = await getUserProgress()
      const progressMap = new Map<string, ProgressData>()
      
      progressData.forEach((p: any) => {
        progressMap.set(p.lessonId, {
          completed: p.completed,
          progress: p.progress ?? undefined
        })
      })
      
      setUserProgress(progressMap)
      progressCache = progressMap
      lastProgressFetch = now
    } catch (err) {
      console.error('Error fetching progress:', err)
    } finally {
      setProgressLoading(false)
    }
  }, [isAuthenticated, user])

  // Optimistic update cho progress
  const updateLocalProgress = useCallback((lessonId: string, data: ProgressData) => {
    setUserProgress(prev => {
      const newMap = new Map(prev)
      newMap.set(lessonId, data)
      progressCache = newMap
      return newMap
    })
  }, [])

  // Load lessons khi component mount
  useEffect(() => {
    refreshLessons()
  }, [refreshLessons])

  // Load progress khi user thay đổi
  useEffect(() => {
    refreshProgress()
  }, [refreshProgress])

  const value = {
    lessons,
    userProgress,
    loading,
    progressLoading,
    error,
    refreshLessons,
    refreshProgress,
    updateLocalProgress,
  }

  return (
    <LessonsContext.Provider value={value}>
      {children}
    </LessonsContext.Provider>
  )
}

export function useLessons() {
  const context = useContext(LessonsContext)
  if (context === undefined) {
    throw new Error('useLessons must be used within a LessonsProvider')
  }
  return context
}