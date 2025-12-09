'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@/lib/supabase'
import { 
  Bell, BellOff, Trash2, Check, UserPlus, UserCheck, 
  MessageCircle, Trophy, Loader2, CheckCheck
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  data: string | null
  read: boolean
  readAt: string | null
  createdAt: string
}

const notificationIcons = {
  FRIEND_REQUEST: UserPlus,
  FRIEND_ACCEPTED: UserCheck,
  NEW_MESSAGE: MessageCircle,
  LESSON_REMINDER: Bell,
  ACHIEVEMENT: Trophy,
}

const notificationColors = {
  FRIEND_REQUEST: 'from-blue-500 to-cyan-500',
  FRIEND_ACCEPTED: 'from-green-500 to-emerald-500',
  NEW_MESSAGE: 'from-purple-500 to-pink-500',
  LESSON_REMINDER: 'from-orange-500 to-red-500',
  ACHIEVEMENT: 'from-yellow-500 to-amber-500',
}

export default function NotificationsPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window) {
      setNotificationPermission(Notification.permission)
      if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
          setNotificationPermission(permission)
        })
      }
    }
  }, [])

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth')
    } else {
      fetchNotifications()
    }
  }, [isAuthenticated, filter])
  
  // Separate effect for realtime (doesn't depend on filter)
  useEffect(() => {
    if (!isAuthenticated || !user?.id) return
    
    let realtimeChannel: any = null
    let pollInterval: NodeJS.Timeout | null = null
    let isRealtimeConnected = false
    
    try {
      const supabase = createBrowserClient()
      realtimeChannel = supabase
        .channel('notifications-channel', {
          config: {
            broadcast: { self: true }
          }
        })
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'Notification'
          },
          (payload: any) => {
            console.log('Realtime notification event:', payload)
            // Check if notification is for current user
            if (payload.new?.userId === user.id) {
              fetchNotifications(true)
              
              // Show browser notification
              if (notificationPermission === 'granted') {
                const notification = new Notification(payload.new.title, {
                  body: payload.new.message,
                  icon: '/icon.png',
                  tag: `notification-${payload.new.id}`
                })
                notification.onclick = () => {
                  window.focus()
                  handleNotificationClick(payload.new as Notification)
                  notification.close()
                }
              }
            }
          }
        )
        .subscribe((status: string) => {
          console.log('Notification realtime status:', status)
          if (status === 'SUBSCRIBED') {
            isRealtimeConnected = true
            console.log('✅ Realtime connected for notifications')
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            console.warn('⚠️ Notification realtime failed, using polling')
            isRealtimeConnected = false
          }
        })
    } catch (error) {
      console.error('Notification realtime setup error:', error)
    }
    
    // Fallback polling
    pollInterval = setInterval(() => {
      fetchNotifications(true)
    }, isRealtimeConnected ? 15000 : 5000) // 15s if realtime, 5s if not
    
    return () => {
      if (realtimeChannel) {
        const supabase = createBrowserClient()
        supabase.removeChannel(realtimeChannel)
      }
      if (pollInterval) {
        clearInterval(pollInterval)
      }
    }
  }, [isAuthenticated, user?.id, notificationPermission])

  const fetchNotifications = async (isRealtime = false) => {
    try {
      const token = localStorage.getItem('auth_token')
      const url = filter === 'unread' ? '/api/notifications?unread=true' : '/api/notifications'
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setNotifications(data.data)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationIds?: string[]) => {
    try {
      const token = localStorage.getItem('auth_token')
      await fetch('/api/notifications', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ notificationIds })
      })
      fetchNotifications()
    } catch (error) {
      console.error('Error marking as read:', error)
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      fetchNotifications()
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead([notification.id])
    }

    // Navigate based on type
    if (notification.data) {
      try {
        const data = JSON.parse(notification.data)
        
        if (notification.type === 'FRIEND_REQUEST') {
          router.push('/friends?tab=requests')
        } else if (notification.type === 'NEW_MESSAGE' && data.senderId) {
          router.push(`/messages?user=${data.senderId}`)
        } else if (notification.type === 'FRIEND_ACCEPTED' && data.userId) {
          router.push('/friends')
        }
      } catch (error) {
        console.error('Error parsing notification data:', error)
      }
    }
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMinutes = (now.getTime() - date.getTime()) / (1000 * 60)

    if (diffInMinutes < 1) return 'Vừa xong'
    if (diffInMinutes < 60) return `${Math.floor(diffInMinutes)} phút trước`
    
    const diffInHours = diffInMinutes / 60
    if (diffInHours < 24) return `${Math.floor(diffInHours)} giờ trước`
    
    const diffInDays = diffInHours / 24
    if (diffInDays < 7) return `${Math.floor(diffInDays)} ngày trước`
    
    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
  }

  if (!isAuthenticated) {
    return null
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Thông báo
              </h1>
              <p className="text-slate-600 dark:text-slate-400 mt-2">
                {unreadCount > 0 ? `Bạn có ${unreadCount} thông báo chưa đọc` : 'Không có thông báo mới'}
              </p>
            </div>
            {unreadCount > 0 && (
              <Button
                variant="outline"
                onClick={() => markAsRead()}
                className="gap-2"
              >
                <CheckCheck className="w-4 h-4" />
                Đánh dấu tất cả đã đọc
              </Button>
            )}
          </div>

          {/* Filter */}
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              Tất cả ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              onClick={() => setFilter('unread')}
              size="sm"
            >
              Chưa đọc ({unreadCount})
            </Button>
          </div>

          {/* Notifications List */}
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : notifications.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <BellOff className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                <h3 className="text-xl font-semibold mb-2">
                  {filter === 'unread' ? 'Không có thông báo chưa đọc' : 'Chưa có thông báo nào'}
                </h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Các thông báo mới sẽ xuất hiện ở đây
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              <AnimatePresence>
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type as keyof typeof notificationIcons] || Bell
                  const gradient = notificationColors[notification.type as keyof typeof notificationColors] || 'from-slate-500 to-slate-600'
                  
                  return (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                    >
                      <Card 
                        className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                          !notification.read ? 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-800' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h3 className="font-semibold text-slate-900 dark:text-white">
                                  {notification.title}
                                </h3>
                                {!notification.read && (
                                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 mt-2" />
                                )}
                              </div>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between mt-2">
                                <span className="text-xs text-slate-500">
                                  {formatTime(notification.createdAt)}
                                </span>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    deleteNotification(notification.id)
                                  }}
                                  className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
