'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@/lib/supabase'
import { 
  MessageCircle, 
  Search, 
  Plus,
  Send,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  Check,
  CheckCheck,
  Circle,
  MoreVertical,
  Smile,
  Paperclip,
  UserPlus,
  Users,
} from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  content: string
  senderId: string
  conversationId: string
  createdAt: string
  sender: {
    id: string
    name: string | null
    email: string
    avatar: string | null
  }
  readReceipts?: {
    userId: string
    readAt: string
  }[]
}

interface ConversationMember {
  user: {
    id: string
    name: string | null
    email: string
    avatar: string | null
    status: string
    lastSeen: string | null
  }
}

interface Conversation {
  id: string
  type: 'DIRECT' | 'GROUP'
  name: string | null
  members: ConversationMember[]
  messages: Message[]
  unreadCount?: number
  updatedAt: string
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sendingMessage, setSendingMessage] = useState(false)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [newChatEmail, setNewChatEmail] = useState('')
  const [creatingChat, setCreatingChat] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showMobileView, setShowMobileView] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const supabase = createBrowserClient()
  const channelRef = useRef<any>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations')
      const data = await res.json()
      if (data.success) {
        setConversations(data.data)
        if (data.data.length > 0 && !selectedConv) {
          setSelectedConv(data.data[0].id)
        }
      }
    } catch (error) {
      console.error('Error fetching conversations:', error)
    } finally {
      setLoading(false)
    }
  }, [selectedConv])

  const fetchMessages = useCallback(async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`)
      const data = await res.json()
      if (data.success) {
        setMessages(data.data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }, [])

  const subscribeToRealtime = useCallback(() => {
    if (!selectedConv) return

    const supabase = createBrowserClient()
    
    // Unsubscribe from previous channel
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }
    
    const channel = supabase
      .channel(`conversation-${selectedConv}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message',
          filter: `conversationId=eq.${selectedConv}`
        },
        (payload: any) => {
          console.log('📨 New message received:', payload)
          
          // Fetch updated messages to get sender info
          fetchMessages(selectedConv)
          
          // Also refresh conversations to update last message
          fetchConversations()
        }
      )
      .subscribe((status) => {
        console.log('🔌 Realtime subscription status:', status)
      })

    channelRef.current = channel

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [selectedConv, fetchMessages, fetchConversations])

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchConversations()
    }
  }, [status, router, fetchConversations])

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv)
      const cleanup = subscribeToRealtime()
      return cleanup
    }
  }, [selectedConv, fetchMessages, subscribeToRealtime])

  const sendMessage = useCallback(async () => {
    if (!messageInput.trim() || !selectedConv || sendingMessage) return

    const tempMessage = messageInput
    setMessageInput('')
    setSendingMessage(true)

    try {
      const res = await fetch(`/api/conversations/${selectedConv}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tempMessage })
      })

      if (!res.ok) {
        setMessageInput(tempMessage)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      setMessageInput(tempMessage)
    } finally {
      setSendingMessage(false)
    }
  }, [messageInput, selectedConv, sendingMessage])

  const createNewChat = useCallback(async () => {
    if (!newChatEmail.trim() || creatingChat) return

    setCreatingChat(true)

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: 'DIRECT',
          participantEmail: newChatEmail 
        })
      })

      const data = await res.json()
      
      if (data.success) {
        setShowNewChatDialog(false)
        setNewChatEmail('')
        await fetchConversations()
        setSelectedConv(data.data.id)
      } else {
        alert(data.error || 'Không thể tạo cuộc trò chuyện')
      }
    } catch (error) {
      console.error('Error creating chat:', error)
      alert('Đã xảy ra lỗi')
    } finally {
      setCreatingChat(false)
    }
  }, [newChatEmail, creatingChat, fetchConversations])

  const getConversationName = useCallback((conv: Conversation) => {
    if (conv.type === 'GROUP') return conv.name || 'Group Chat'
    const other = conv.members.find(m => m.user.id !== session?.user?.id)
    return other?.user?.name || other?.user?.email || 'Unknown'
  }, [session?.user?.id])

  const getConversationAvatar = useCallback((conv: Conversation) => {
    if (conv.type === 'GROUP') return undefined
    const other = conv.members.find(m => m.user.id !== session?.user?.id)
    return other?.user?.avatar || undefined
  }, [session?.user?.id])

  const getStatus = useCallback((conv: Conversation) => {
    if (conv.type === 'GROUP') return null
    const other = conv.members.find(m => m.user.id !== session?.user?.id)
    return other?.user?.status
  }, [session?.user?.id])

  const selectedConversation = conversations.find(c => c.id === selectedConv)
  const filteredConversations = conversations.filter(conv =>
    getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 dark:text-slate-400">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-white dark:bg-slate-950 overflow-hidden">
      {/* Sidebar */}
      <div className={cn(
        "w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shadow-sm",
        "md:flex",
        showMobileView && "hidden"
      )}>
        {/* User Profile Header */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-r from-blue-600 to-purple-600">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="relative">
                <Avatar className="w-10 h-10 border-2 border-white shadow-lg">
                  <AvatarImage src={session?.user?.avatar || session?.user?.image || undefined} />
                  <AvatarFallback className="bg-white text-blue-600 font-bold">
                    {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="font-semibold text-white truncate text-sm">
                  {session?.user?.name || 'User'}
                </h2>
                <p className="text-xs text-blue-100 truncate">
                  {session?.user?.email}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowNewChatDialog(true)}
                className="h-8 w-8 p-0 hover:bg-white/20 text-white"
              >
                <Plus className="w-4 h-4" />
              </Button>
              <Button 
                size="sm" 
                variant="ghost"
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="h-8 w-8 p-0 hover:bg-white/20 text-white"
              >
                <Menu className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-3 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Tìm kiếm cuộc trò chuyện..."
              className="pl-10 bg-white dark:bg-slate-800 border-0 shadow-sm h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-2">
            {filteredConversations.map((conv) => {
              const status = getStatus(conv)
              const lastMessage = conv.messages[0]
              
              return (
                <motion.div
                  key={conv.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setSelectedConv(conv.id)
                    setShowMobileView(true)
                  }}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all mb-1",
                    selectedConv === conv.id
                      ? "bg-blue-50 dark:bg-blue-900/20 shadow-sm"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-white dark:ring-slate-900">
                      <AvatarImage src={getConversationAvatar(conv)} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                        {conv.type === 'GROUP' ? (
                          <Users className="w-6 h-6" />
                        ) : (
                          getConversationName(conv)[0]?.toUpperCase()
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {status === 'ONLINE' && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-slate-900 rounded-full"></div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold text-sm truncate">{getConversationName(conv)}</h3>
                      {lastMessage && (
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {new Date(lastMessage.createdAt).toLocaleTimeString('vi-VN', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      {lastMessage ? (
                        <p className="text-sm text-slate-600 dark:text-slate-400 truncate flex-1">
                          {lastMessage.senderId === session?.user?.id && 'Bạn: '}
                          {lastMessage.content}
                        </p>
                      ) : (
                        <p className="text-sm text-slate-400 dark:text-slate-500 italic">Chưa có tin nhắn</p>
                      )}
                      {conv.unreadCount && conv.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full font-medium">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </motion.div>
              )
            })}

            {filteredConversations.length === 0 && (
              <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p className="text-sm">
                  {searchQuery ? 'Không tìm thấy cuộc trò chuyện' : 'Chưa có cuộc trò chuyện nào'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className={cn(
          "flex-1 flex flex-col",
          "md:flex",
          !showMobileView && "hidden md:flex"
        )}>
          {/* Chat Header */}
          <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                className="md:hidden h-8 w-8 p-0"
                onClick={() => setShowMobileView(false)}
              >
                <X className="w-5 h-5" />
              </Button>
              <Avatar className="h-10 w-10 ring-2 ring-white dark:ring-slate-900">
                <AvatarImage src={getConversationAvatar(selectedConversation)} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-semibold">
                  {getConversationName(selectedConversation)[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-sm">{getConversationName(selectedConversation)}</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {selectedConversation.type === 'GROUP' 
                    ? `${selectedConversation.members.length} thành viên`
                    : getStatus(selectedConversation) === 'ONLINE' ? (
                      <span className="text-green-600 dark:text-green-500 font-medium">Đang hoạt động</span>
                    ) : 'Offline'
                  }
                </p>
              </div>
            </div>
            <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 relative">
            {/* Subtle Background Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            <div className="space-y-1 max-w-4xl mx-auto p-4 relative">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full min-h-[400px]">
                  <div className="text-center py-12">
                    <div className="relative inline-block mb-4">
                      <div className="absolute inset-0 bg-blue-500/10 blur-2xl rounded-full"></div>
                      <MessageCircle className="w-20 h-20 mx-auto text-blue-500/20 dark:text-blue-500/10 relative" />
                    </div>
                    <p className="text-slate-400 dark:text-slate-600 text-sm">
                      Chưa có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
                    </p>
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => {
                  const isOwn = msg.senderId === session?.user?.id
                  const prevMsg = messages[index - 1]
                  const nextMsg = messages[index + 1]
                  
                  const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId
                  const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId
                  
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className={cn(
                        "flex gap-2 items-end",
                        isOwn ? "flex-row-reverse" : "flex-row",
                        !isFirstInGroup && "mt-0.5"
                      )}
                    >
                      {/* Avatar */}
                      {!isOwn ? (
                        isLastInGroup ? (
                          <Avatar className="h-7 w-7 flex-shrink-0 ring-2 ring-white dark:ring-slate-950">
                            <AvatarImage src={msg.sender.avatar || undefined} />
                            <AvatarFallback className="bg-gradient-to-br from-violet-500 to-purple-500 text-white text-xs font-semibold">
                              {msg.sender.name?.[0]?.toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="w-7 flex-shrink-0"></div>
                        )
                      ) : null}
                      
                      {/* Message Container */}
                      <div className={cn(
                        "flex flex-col max-w-[70%] md:max-w-[65%]",
                        isOwn ? "items-end" : "items-start"
                      )}>
                        {/* Sender Name */}
                        {!isOwn && isFirstInGroup && selectedConversation.type === 'GROUP' && (
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1 px-3">
                            {msg.sender.name}
                          </span>
                        )}
                        
                        {/* Message Bubble */}
                        <div className="relative group">
                          {/* Tail for last message in group */}
                          {isLastInGroup && (
                            <svg
                              className={cn(
                                "absolute bottom-0 w-2.5 h-3 fill-current",
                                isOwn ? (
                                  "right-0 translate-x-[1px] text-blue-500 dark:text-blue-600"
                                ) : (
                                  "left-0 -translate-x-[1px] text-white dark:text-slate-800 scale-x-[-1]"
                                )
                              )}
                              viewBox="0 0 8 13"
                            >
                              <path d="M1.533,3.568 L8.009,0.011 L8.009,13.000 L1.533,3.568 Z" />
                            </svg>
                          )}
                          
                          <div className={cn(
                            "px-3 py-2 shadow-sm relative",
                            isOwn ? (
                              "bg-blue-500 dark:bg-blue-600 text-white"
                            ) : (
                              "bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                            ),
                            // Rounded corners logic
                            isOwn ? (
                              cn(
                                "rounded-2xl",
                                isLastInGroup ? "rounded-br-md" : "rounded-br-2xl"
                              )
                            ) : (
                              cn(
                                "rounded-2xl",
                                isLastInGroup ? "rounded-bl-md" : "rounded-bl-2xl"
                              )
                            )
                          )}>
                            {/* Message Text */}
                            <p className="text-[14px] leading-[1.4] break-words whitespace-pre-wrap">
                              {msg.content}
                            </p>
                            
                            {/* Time & Status */}
                            <div className={cn(
                              "flex items-center gap-1 mt-1 justify-end",
                              isOwn ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
                            )}>
                              <span className="text-[10px] font-medium">
                                {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {isOwn && (
                                <CheckCheck className="w-3.5 h-3.5 opacity-90" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
              <div ref={messagesEndRef} />
            </div>
          </div>

          {/* Message Input */}
          <div className="p-3 md:p-4 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
            <div className="flex items-end gap-2 max-w-4xl mx-auto">
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-10 w-10 p-0 flex-shrink-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Paperclip className="w-5 h-5 text-slate-500" />
              </Button>
              
              <div className="flex-1 bg-slate-100 dark:bg-slate-800 rounded-3xl px-4 py-2.5 shadow-inner">
                <Input
                  placeholder="Nhập tin nhắn..."
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault()
                      sendMessage()
                    }
                  }}
                  className="border-0 bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto min-h-[24px] text-sm placeholder:text-slate-400"
                  disabled={sendingMessage}
                />
              </div>
              
              <Button 
                size="sm" 
                variant="ghost" 
                className="h-10 w-10 p-0 flex-shrink-0 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Smile className="w-5 h-5 text-slate-500" />
              </Button>
              
              <Button 
                onClick={sendMessage}
                disabled={!messageInput.trim() || sendingMessage}
                className={cn(
                  "h-10 w-10 p-0 rounded-full flex-shrink-0 shadow-lg transition-all",
                  messageInput.trim() && !sendingMessage
                    ? "bg-gradient-to-br from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 scale-100" 
                    : "scale-95 opacity-50"
                )}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className={cn(
          "flex-1 items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950",
          "hidden md:flex"
        )}>
          <div className="text-center p-8">
            <div className="relative inline-block mb-6">
              <div className="absolute inset-0 bg-blue-500/20 dark:bg-blue-500/10 blur-3xl rounded-full"></div>
              <MessageCircle className="w-32 h-32 mx-auto text-blue-500/40 dark:text-blue-500/20 relative" />
            </div>
            <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Chào mừng đến ChatApp
            </h2>
            <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md">
              Chọn một cuộc trò chuyện bên trái hoặc tạo cuộc trò chuyện mới để bắt đầu
            </p>
            <Button
              onClick={() => setShowNewChatDialog(true)}
              className="shadow-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Tạo cuộc trò chuyện mới
            </Button>
          </div>
        </div>
      )}

      {/* User Menu Dropdown */}
      <AnimatePresence>
        {showUserMenu && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/30"
            onClick={() => setShowUserMenu(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              className="absolute top-16 left-4 w-72 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* User Info Section */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-700 dark:to-slate-700">
                <div className="flex items-center gap-3">
                  <Avatar className="w-14 h-14 border-2 border-white shadow-lg">
                    <AvatarImage src={session?.user?.avatar || session?.user?.image || undefined} />
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-bold text-lg">
                      {session?.user?.name?.[0]?.toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 dark:text-white truncate">
                      {session?.user?.name || 'User'}
                    </h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate">
                      {session?.user?.email}
                    </p>
                  </div>
                </div>
              </div>

              {/* Menu Items */}
              <div className="py-2">
                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    router.push('/profile')
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                >
                  <User className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="font-medium text-sm">Hồ sơ</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Xem và chỉnh sửa thông tin</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    setShowNewChatDialog(true)
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                >
                  <UserPlus className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="font-medium text-sm">Cuộc trò chuyện mới</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tìm và thêm bạn mới</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    // Settings functionality
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors text-left"
                >
                  <Settings className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                  <div>
                    <p className="font-medium text-sm">Cài đặt</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tuỳ chỉnh ứng dụng</p>
                  </div>
                </button>

                <div className="my-2 border-t border-slate-200 dark:border-slate-700"></div>

                <button
                  onClick={() => {
                    signOut({ callbackUrl: '/auth/signin' })
                  }}
                  className="w-full px-4 py-3 flex items-center gap-3 hover:bg-red-50 dark:hover:bg-red-950 transition-colors text-left group"
                >
                  <LogOut className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-medium text-sm text-red-600">Đăng xuất</p>
                    <p className="text-xs text-red-500/70">Thoát khỏi tài khoản</p>
                  </div>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Chat Dialog */}
      <AnimatePresence>
        {showNewChatDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowNewChatDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">Cuộc trò chuyện mới</h2>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setShowNewChatDialog(false)}
                  className="h-8 w-8 p-0"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-slate-600 dark:text-slate-400 mb-4">
                Nhập email của người bạn muốn chat
              </p>
              <Input
                placeholder="Email (ví dụ: user@example.com)"
                type="email"
                value={newChatEmail}
                onChange={(e) => setNewChatEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && createNewChat()}
                className="mb-4"
                autoFocus
                disabled={creatingChat}
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowNewChatDialog(false)
                    setNewChatEmail('')
                  }}
                  disabled={creatingChat}
                >
                  Hủy
                </Button>
                <Button
                  onClick={createNewChat}
                  disabled={!newChatEmail.trim() || creatingChat}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  {creatingChat ? 'Đang tạo...' : 'Tạo cuộc trò chuyện'}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
