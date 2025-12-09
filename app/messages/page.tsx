'use client'

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
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

export default function MessagesPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

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
      // Poll for new messages every 3 seconds
      const interval = setInterval(() => {
        fetchMessages(selectedUser.id)
      }, 3000)
      return () => clearInterval(interval)
    }
  }, [selectedUser])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 pt-20">
      <div className="container mx-auto px-4 max-w-7xl h-[calc(100vh-5rem)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-full py-4">
          {/* Conversations List */}
          <Card className={`md:col-span-1 flex flex-col ${selectedUser ? 'hidden md:flex' : 'flex'}`}>
            <div className="p-4 border-b">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <MessageCircle className="w-6 h-6 text-blue-600" />
                Tin nhắn
              </h2>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : conversations.length === 0 ? (
                <div className="text-center py-12 px-4">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                  <p className="text-slate-600 dark:text-slate-400">
                    Chưa có cuộc trò chuyện nào
                  </p>
                  <Button
                    className="mt-4"
                    onClick={() => router.push('/friends?tab=add')}
                  >
                    Thêm bạn bè
                  </Button>
                </div>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv.partner.id}
                    onClick={() => setSelectedUser(conv.partner)}
                    className={`p-4 border-b cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
                      selectedUser?.id === conv.partner.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold shrink-0">
                        {(conv.partner.name || conv.partner.email)[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold truncate">
                            {conv.partner.name || conv.partner.email}
                          </h3>
                          <span className="text-xs text-slate-500">
                            {formatTime(conv.lastMessage.createdAt)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                            {conv.lastMessage.senderId === user?.id ? 'Bạn: ' : ''}
                            {conv.lastMessage.content}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="ml-2 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center shrink-0">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Chat Area */}
          <Card className={`md:col-span-2 flex flex-col ${selectedUser ? 'flex' : 'hidden md:flex'}`}>
            {selectedUser ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="md:hidden"
                      onClick={() => setSelectedUser(null)}
                    >
                      <ArrowLeft className="w-5 h-5" />
                    </Button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold">
                      {(selectedUser.name || selectedUser.email)[0].toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-semibold">
                        {selectedUser.name || selectedUser.email}
                      </h3>
                      <p className="text-xs text-slate-500">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  <AnimatePresence>
                    {messages.map((message) => {
                      const isOwn = message.senderId === user?.id
                      return (
                        <motion.div
                          key={message.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                        >
                          <div className={`max-w-[70%] ${isOwn ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                            <div
                              className={`px-4 py-2 rounded-2xl ${
                                isOwn
                                  ? 'bg-blue-600 text-white rounded-br-sm'
                                  : 'bg-slate-200 dark:bg-slate-700 rounded-bl-sm'
                              }`}
                            >
                              <p className="whitespace-pre-wrap break-words">{message.content}</p>
                            </div>
                            <div className="flex items-center gap-1 px-2">
                              <span className="text-xs text-slate-500">
                                {formatTime(message.createdAt)}
                              </span>
                              {isOwn && (
                                message.read ? (
                                  <CheckCheck className="w-3 h-3 text-blue-600" />
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
                <div className="p-4 border-t">
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
                      className="resize-none"
                      rows={2}
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!newMessage.trim() || sending}
                      className="shrink-0"
                    >
                      {sending ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : (
                        <Send className="w-5 h-5" />
                      )}
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-center p-8">
                <div>
                  <MessageCircle className="w-20 h-20 mx-auto mb-4 text-slate-400" />
                  <h3 className="text-xl font-semibold mb-2">
                    Chọn một cuộc trò chuyện
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
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
