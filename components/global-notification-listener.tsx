'use client'

import { useEffect } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@/lib/supabase'

/**
 * Global notification listener - works on all pages
 * Place this in your root layout to receive notifications everywhere
 */
export function GlobalNotificationListener() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return

    // Request notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission()
    }

    let notificationChannel: any = null
    let messageChannel: any = null

    try {
      const supabase = createBrowserClient()

      // Listen for new notifications
      notificationChannel = supabase
        .channel('global-notifications')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'Notification'
          },
          (payload: any) => {
            console.log('🔔 Global notification received:', payload)
            
            // Check if notification is for current user
            if (payload.new?.userId === user.id) {
              // Show browser notification
              if (Notification.permission === 'granted') {
                const notification = new Notification(payload.new.title, {
                  body: payload.new.message,
                  icon: '/icon.png',
                  tag: `notification-${payload.new.id}`,
                  requireInteraction: false
                })

                notification.onclick = () => {
                  window.focus()
                  
                  // Navigate based on notification type
                  const data = payload.new.data ? JSON.parse(payload.new.data) : null
                  
                  switch (payload.new.type) {
                    case 'FRIEND_REQUEST':
                      router.push('/friends?tab=requests')
                      break
                    case 'FRIEND_ACCEPTED':
                      router.push('/friends')
                      break
                    case 'NEW_MESSAGE':
                      if (data?.senderId) {
                        router.push(`/messages?user=${data.senderId}`)
                      } else {
                        router.push('/messages')
                      }
                      break
                    default:
                      router.push('/notifications')
                  }
                  
                  notification.close()
                }
              }

              // Play notification sound (optional)
              try {
                const audio = new Audio('/notification.mp3')
                audio.volume = 0.5
                audio.play().catch(() => {
                  // Ignore if sound fails
                })
              } catch (e) {
                // Ignore
              }
            }
          }
        )
        .subscribe((status) => {
          console.log('Global notification channel status:', status)
        })

      // Listen for new messages (to show notification even when not on messages page)
      messageChannel = supabase
        .channel('global-messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'Message'
          },
          (payload: any) => {
            console.log('💬 Global message received:', payload)
            
            // Check if message is for current user
            if (payload.new?.receiverId === user.id) {
              // Show browser notification
              if (Notification.permission === 'granted') {
                // Fetch sender info from the message
                const senderName = payload.new.senderName || 'Someone'
                
                const notification = new Notification(`New message from ${senderName}`, {
                  body: payload.new.content,
                  icon: '/icon.png',
                  tag: `message-${payload.new.id}`,
                  requireInteraction: false
                })

                notification.onclick = () => {
                  window.focus()
                  router.push(`/messages?user=${payload.new.senderId}`)
                  notification.close()
                }
              }

              // Play notification sound
              try {
                const audio = new Audio('/notification.mp3')
                audio.volume = 0.5
                audio.play().catch(() => {})
              } catch (e) {
                // Ignore
              }
            }
          }
        )
        .subscribe((status) => {
          console.log('Global message channel status:', status)
        })

    } catch (error) {
      console.error('Error setting up global notifications:', error)
    }

    return () => {
      if (notificationChannel || messageChannel) {
        const supabase = createBrowserClient()
        if (notificationChannel) supabase.removeChannel(notificationChannel)
        if (messageChannel) supabase.removeChannel(messageChannel)
      }
    }
  }, [isAuthenticated, user?.id, router])

  return null // This component doesn't render anything
}
