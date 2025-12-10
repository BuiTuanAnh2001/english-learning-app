'use client'

import { useEffect, useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@/lib/supabase'
import { 
  MessageCircle, 
  Users, 
  Search, 
  Plus,
  MoreVertical,
  Hash,
  Circle,
  Send,
  Smile,
  Paperclip,
  Phone,
  Video,
  Info,
  Settings,
  LogOut,
  User,
  Menu,
  X,
  UserPlus,
  Check,
  Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'

interface Conversation {
  id: string
  name?: string
  type: 'DIRECT' | 'GROUP'
  avatar?: string
  members: any[]
  messages: any[]
  unreadCount: number
  updatedAt: string
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<string | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [newChatEmail, setNewChatEmail] = useState('')
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin')
    } else if (status === 'authenticated') {
      fetchConversations()
      subscribeToRealtime()
    }
  }, [status])

  const fetchConversations = async () => {
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
  }

  const subscribeToRealtime = () => {
    const supabase = createBrowserClient()
    
    const channel = supabase
      .channel('chat-messages')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'Message'
        },
        (payload) => {
          console.log('New message:', payload)
          if (payload.new.conversationId === selectedConv && selectedConv) {
            fetchMessages(selectedConv)
          }
          fetchConversations()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const fetchMessages = async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations/${convId}/messages`)
      const data = await res.json()
      if (data.success) {
        setMessages(data.data)
      }
    } catch (error) {
      console.error('Error fetching messages:', error)
    }
  }

  useEffect(() => {
    if (selectedConv) {
      fetchMessages(selectedConv)
    }
  }, [selectedConv])

  const sendMessage = async () => {
    if (!messageInput.trim() || !selectedConv) return

    try {
      const res = await fetch(`/api/conversations/${selectedConv}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: messageInput })
      })

      if (res.ok) {
        setMessageInput('')
        fetchMessages(selectedConv)
      }
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const createNewChat = async () => {
    if (!newChatEmail.trim()) return

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
        fetchConversations()
        setSelectedConv(data.data.id)
      } else {
        alert(data.error || 'Không thể tạo cuộc trò chuyện')
      }
    } catch (error) {
      console.error('Error creating conversation:', error)
      alert('Có lỗi xảy ra')
    }
  }

  const getConversationName = (conv: Conversation) => {
    if (conv.type === 'GROUP') return conv.name
    const other = conv.members.find(m => m.userId !== session?.user?.id)
    return other?.user?.name || other?.user?.email || 'Unknown'
  }

  const getConversationAvatar = (conv: Conversation) => {
    if (conv.type === 'GROUP') return conv.avatar
    const other = conv.members.find(m => m.userId !== session?.user?.id)
    return other?.user?.avatar
  }

  const getStatus = (conv: Conversation) => {
    if (conv.type === 'GROUP') return null
    const other = conv.members.find(m => m.userId !== session?.user?.id)
    return other?.user?.status
  }

  const filteredConversations = conversations.filter(conv =>
    getConversationName(conv).toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedConversation = conversations.find(c => c.id === selectedConv)

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Đang tải...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-white dark:bg-slate-950">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col shadow-sm">
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
              placeholder="Tìm kiếm..."
              className="pl-10 bg-white dark:bg-slate-800 border-0 shadow-sm h-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-2">
            {filteredConversations.map((conv) => {
              const status = getStatus(conv)
              const lastMessage = conv.messages[0]
              
              return (
                <motion.div
                  key={conv.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedConv(conv.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors mb-1",
                    selectedConv === conv.id
                      ? "bg-blue-100 dark:bg-blue-900/30"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800"
                  )}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={getConversationAvatar(conv)} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                        {conv.type === 'GROUP' ? (
                          <Users className="w-6 h-6" />
                        ) : (
                          getConversationName(conv)[0]?.toUpperCase()
                        )}
                      </AvatarFallback>
                    </Avatar>
                    {status === 'ONLINE' && (
                      <Circle className="absolute bottom-0 right-0 w-3 h-3 fill-green-500 text-green-500" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{getConversationName(conv)}</h3>
                      {conv.unreadCount > 0 && (
                        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {conv.unreadCount}
                        </span>
                      )}
                    </div>
                    {lastMessage && (
                      <p className="text-sm text-muted-foreground truncate">
                        {lastMessage.sender.name}: {lastMessage.content}
                      </p>
                    )}
                  </div>
                </motion.div>
              )
            })}

            {filteredConversations.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Chưa có cuộc trò chuyện nào</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedConversation ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="h-16 px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={getConversationAvatar(selectedConversation)} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white">
                  {getConversationName(selectedConversation)[0]?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold">{getConversationName(selectedConversation)}</h2>
                <p className="text-xs text-muted-foreground">
                  {selectedConversation.type === 'GROUP' 
                    ? `${selectedConversation.members.length} thành viên`
                    : getStatus(selectedConversation) || 'Offline'
                  }
                </p>
              </div>
            </div>
            <Button size="sm" variant="ghost">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 relative">
            {/* Chat Background - Subtle Pattern */}
            <div 
              className="absolute inset-0 opacity-[0.015] dark:opacity-[0.02] pointer-events-none"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            />

            <div className="space-y-1 max-w-3xl mx-auto relative">
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
                      initial={{ opacity: 0, y: 5, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className={cn(
                        "flex gap-2 items-end px-2",
                        isOwn ? "flex-row-reverse" : "flex-row",
                        !isFirstInGroup && "mt-0.5"
                      )}
                    >
                      {/* Avatar */}
                      {!isOwn ? (
                        isLastInGroup ? (
                          <Avatar className="h-7 w-7 flex-shrink-0 ring-2 ring-white dark:ring-slate-900">
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
                        "flex flex-col max-w-[65%]",
                        isOwn ? "items-end" : "items-start"
                      )}>
                        {/* Sender Name */}
                        {!isOwn && isFirstInGroup && selectedConversation.type === 'GROUP' && (
                          <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5 px-3">
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
                            
                            {/* Time */}
                            <div className={cn(
                              "flex items-center gap-1 mt-0.5 justify-end",
                              isOwn ? "text-blue-100" : "text-slate-400 dark:text-slate-500"
                            )}>
                              <span className="text-[10px] font-medium">
                                {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                              </span>
                              {isOwn && (
                                <Check className="w-3.5 h-3.5 opacity-90" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl">
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
                disabled={!messageInput.trim()}
                className={cn(
                  "h-10 w-10 p-0 rounded-full flex-shrink-0 shadow-lg transition-all",
                  messageInput.trim() 
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
        <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
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
              className="shadow-lg"
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
            className="fixed inset-0 z-40"
            onClick={() => setShowUserMenu(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
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
                    <p className="font-medium text-sm">Kết bạn</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Tìm và thêm bạn mới</p>
                  </div>
                </button>

                <button
                  onClick={() => {
                    setShowUserMenu(false)
                    setShowSettings(true)
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
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={() => setShowNewChatDialog(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-slate-800 rounded-2xl p-6 w-full max-w-md shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-2xl font-bold mb-4">Tạo cuộc trò chuyện mới</h2>
              <p className="text-muted-foreground mb-4">
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
              />
              <div className="flex gap-2 justify-end">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setShowNewChatDialog(false)
                    setNewChatEmail('')
                  }}
                >
                  Hủy
                </Button>
                <Button
                  onClick={createNewChat}
                  disabled={!newChatEmail.trim()}
                >
                  Tạo
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
