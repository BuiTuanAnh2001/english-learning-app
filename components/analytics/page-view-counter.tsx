'use client'

import { useEffect, useState } from 'react'
import { Eye } from 'lucide-react'

export function PageViewCounter() {
  const [pageViews, setPageViews] = useState(0)
  const [todayViews, setTodayViews] = useState(0)

  useEffect(() => {
    // Get current date
    const today = new Date().toDateString()
    
    // Initialize or get total page views
    const totalViews = parseInt(localStorage.getItem('totalPageViews') || '0')
    const lastViewDate = localStorage.getItem('lastViewDate')
    const dailyViews = parseInt(localStorage.getItem('dailyPageViews') || '0')
    
    // Increment total views
    const newTotalViews = totalViews + 1
    localStorage.setItem('totalPageViews', newTotalViews.toString())
    setPageViews(newTotalViews)
    
    // Reset daily counter if it's a new day
    if (lastViewDate !== today) {
      localStorage.setItem('dailyPageViews', '1')
      localStorage.setItem('lastViewDate', today)
      setTodayViews(1)
    } else {
      const newDailyViews = dailyViews + 1
      localStorage.setItem('dailyPageViews', newDailyViews.toString())
      setTodayViews(newDailyViews)
    }
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M'
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K'
    }
    return num.toString()
  }

  return (
    <div className="flex items-center gap-6 text-sm text-slate-600 dark:text-slate-400">
      <div className="flex items-center gap-2">
        <Eye className="w-4 h-4" />
        <span>
          Lượt truy cập: <span className="font-bold text-blue-600 dark:text-blue-400">{formatNumber(pageViews)}</span>
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs px-2 py-1 bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 rounded-full font-semibold">
          Hôm nay: {formatNumber(todayViews)}
        </span>
      </div>
    </div>
  )
}
