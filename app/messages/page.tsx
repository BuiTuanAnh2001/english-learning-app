'use client'

import { useEffect, useState, useRef, Suspense } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@/lib/supabase'
import { 
  MessageCircle, Send, Loader2, ArrowLeft, Search, 
  MoreVertical, Check, CheckCheck 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

interface User {
  id: string
  name: string | null
  email: string
}

interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  readAt: string | null
  createdAt: string
  sender: User
  receiver: User
}

interface Conversation {
  partner: User
  lastMessage: Message
  unreadCount: number
}

function MessagesContent() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const previousMessagesCount = useRef(0)

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
      fetchConversations()
      
      // Check if there's a user parameter in URL
      const userId = searchParams.get('user')
      if (userId) {
        // Fetch user info and open chat
        fetchUserAndOpenChat(userId)
      }
    }
  }, [isAuthenticated, searchParams])

  useEffect(() => {
    if (selectedUser) {
      fetchMessages(selectedUser.id)
      
      let realtimeChannel: any = null
      
      // Setup Realtime only - no polling
      try {
        const supabase = createBrowserClient()
        realtimeChannel = supabase
          .channel(`messages-${selectedUser.id}`, {
            config: {
              broadcast: { self: true },
              presence: { key: user?.id }
            }
          })
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'Message'
            },
            (payload: any) => {
              console.log('🔥 Realtime message event:', payload)
              // Update if message involves current chat
              if (payload.new?.senderId === selectedUser.id || 
                  payload.new?.receiverId === selectedUser.id ||
                  payload.new?.senderId === user?.id ||
                  payload.new?.receiverId === user?.id) {
                
                // Instantly add new message to state without refetching
                if (payload.event === 'INSERT' && payload.new) {
                  setMessages(prev => {
                    // Check if message already exists
                    if (prev.some(m => m.id === payload.new.id)) {
                      return prev
                    }
                    return [...prev, payload.new]
                  })
                  fetchConversations()
                } else if (payload.event === 'UPDATE' && payload.new) {
                  // Update message (e.g., read status)
                  setMessages(prev => 
                    prev.map(m => m.id === payload.new.id ? payload.new : m)
                  )
                } else {
                  // Fallback: refetch if needed
                  fetchMessages(selectedUser.id)
                  fetchConversations()
                }
                
                // Show notification for incoming messages
                if (payload.new?.senderId === selectedUser.id && 
                    payload.new?.receiverId === user?.id &&
                    notificationPermission === 'granted') {
                  const notification = new Notification(
                    `${selectedUser.name || selectedUser.email}`,
                    {
                      body: payload.new.content,
                      icon: '/notification-icon.svg',
                      tag: `message-${payload.new.id}`
                    }
                  )
                  notification.onclick = () => {
                    window.focus()
                    notification.close()
                  }
                }
              }
            }
          )
          .subscribe((status: string) => {
            console.log('Realtime status:', status)
            if (status === 'SUBSCRIBED') {
              console.log('✅ Realtime connected - NO POLLING!')
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
              console.error('❌ Realtime failed - check Supabase setup')
            }
          })
      } catch (error) {
        console.error('Realtime setup error:', error)
      }
      
      return () => {
        if (realtimeChannel) {
          const supabase = createBrowserClient()
          supabase.removeChannel(realtimeChannel)
        }
      }
    }
  }, [selectedUser, user?.id, notificationPermission])

  useEffect(() => {
    // Only scroll on initial load or when messages length increases
    if (messages.length > 0) {
      scrollToBottom()
    }
  }, [messages.length]) // Changed from [messages] to [messages.length]

  const fetchConversations = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setConversations(data.data)
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUserAndOpenChat = async (userId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`/api/friends?type=friends`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        const friendship = data.data.find((f: any) => f.friend.id === userId)
        if (friendship) {
          setSelectedUser(friendship.friend)
        }
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  const fetchMessages = async (userId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`/api/messages/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setMessages(data.data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  const sendMessage = async () => {
    if (!selectedUser || !newMessage.trim()) return

    setSending(true)
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`/api/messages/${selectedUser.id}`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ content: newMessage.trim() })
      })
      const data = await res.json()
      if (data.success) {
        setMessages([...messages, data.data])
        setNewMessage('')
        fetchConversations() // Update conversation list
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setSending(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    } else if (diffInHours < 48) {
      return 'Hôm qua'
    } else {
      return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 pt-16 md:pt-20">
      <div className="container mx-auto px-2 md:px-4 max-w-7xl h-[calc(100vh-4rem)] md:h-[calc(100vh-5rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4 h-full py-2 md:py-4">
          {/* Conversations List */}
          <Card className={`md:col-span-1 flex flex-col overflow-hidden shadow-lg ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-3 md:p-4 border-b shrink-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5">
              <h2 className="text-lg md:text-xl font-bold flex items-center gap-2">
                <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-blue-600" />
                Tin nhắn
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-8 md:py-12 px-4">
                  <MessageCircle className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 text-slate-400" />
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-3 md:mb-4">
                    Chưa có cuộc trò chuyện nào
                  </p>
                  <Button
                    className="text-sm"
                    onClick={() => router.push('/friends?tab=add')}
                  >
                    Thêm bạn bè
                  </Button>
                </div>
              ) : (
                conversations.map((conv) => (
                  <motion.div
                    key={conv.partner.id}
                    onClick={() => setSelectedUser(conv.partner)}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className={`p-3 md:p-4 border-b cursor-pointer transition-all ${
                      selectedUser?.id === conv.partner.id 
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-l-4 border-l-blue-500' 
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
                    }`}
                  >
                    <div className="flex items-center gap-2 md:gap-3">
                      <div className="relative">
                        <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0 shadow-md">
                          {(conv.partner.name || conv.partner.email)[0].toUpperCase()}
                        </div>
                        {conv.unreadCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold shadow-lg animate-pulse">
                            {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-sm md:text-base truncate">
                            {conv.partner.name || conv.partner.email}
                          </h3>
                          <span className="text-xs text-slate-500 shrink-0 ml-2">
                            {formatTime(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                        <p className="text-xs md:text-sm text-slate-600 dark:text-slate-400 truncate">
                          {conv.lastMessage.senderId === user?.id && (
                            <span className="text-blue-600 dark:text-blue-400">Bạn: </span>
                          )}
                          {conv.lastMessage.content}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className={`md:col-span-2 flex flex-col overflow-hidden shadow-lg ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-3 md:p-4 border-b flex items-center justify-between shrink-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5">
                  <div className="flex items-center gap-2 md:gap-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="md:hidden -ml-2"
                      onClick={() => setSelectedUser(null)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="w-9 h-9 md:w-10 md:h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold shadow-md">
                      {(selectedUser.name || selectedUser.email)[0].toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm md:text-base truncate">
                        {selectedUser.name || selectedUser.email}
                      </h3>
                      <p className="text-xs text-slate-500 truncate">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div 
                  className="flex-1 overflow-y-auto p-3 md:p-4 space-y-3 md:space-y-4 min-h-0 scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-600"
                  style={{ 
                    backgroundImage: 'radial-gradient(circle at 1px 1px, rgb(203 213 225 / 0.15) 1px, transparent 0)',
                    backgroundSize: '24px 24px'
                  }}
                >
                  <AnimatePresence>
                    {messages.map((message) => {
                      const isOwn = message.senderId === user?.id
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[85%] md:max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                            <div
                              className={`px-3 md:px-4 py-2 md:py-2.5 rounded-2xl shadow-sm ${
                                isOwn
                                  ? 'bg-gradient-to-br from-blue-600 to-blue-500 text-white rounded-br-sm'
                                  : 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-bl-sm border border-slate-200 dark:border-slate-600'
                              }`}
                            >
                              <p className="text-sm md:text-base whitespace-pre-wrap break-words leading-relaxed">
                                {message.content}
                              </p>
                            </div>
                            <div className="flex items-center gap-1 px-2">
                              <span className="text-xs text-slate-500 dark:text-slate-400">
                                {formatTime(message.createdAt)}
                              </span>
                              {isOwn && (
                                message.read ? (
                                  <CheckCheck className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                ) : (
                                  <Check className="w-3 h-3 text-slate-400" />
                                )
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </AnimatePresence>
                  <div ref={messagesEndRef} />
                </div>

                {/* Input */}
                <div className="p-3 md:p-4 border-t shrink-0 bg-white dark:bg-slate-800/50">
                  <div className="flex gap-2">
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault()
                          sendMessage()
                        }
                      }}
                      placeholder="Nhập tin nhắn..."
                      className="resize-none text-sm md:text-base min-h-[40px] md:min-h-[48px]"
                      rows={1}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="shrink-0 h-10 w-10 md:h-12 md:w-12 p-0 flex items-center justify-center"
                      size="sm"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4 md:w-5 md:h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-6 md:p-8">
                <div>
                  <MessageCircle className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-3 md:mb-4 text-slate-400" />
                  <h3 className="text-lg md:text-xl font-semibold mb-2">
                    Chọn một cuộc trò chuyện
                  </h3>
                  <p className="text-sm md:text-base text-slate-600 dark:text-slate-400">
                    Chọn một người bạn từ danh sách bên trái để bắt đầu trò chuyện
                  </p>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 pt-20 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
      <MessagesContent />
    </Suspense>
  )
}
