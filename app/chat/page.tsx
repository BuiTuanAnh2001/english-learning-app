'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
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
  Circle
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
    <div className="h-screen flex bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
      {/* Sidebar */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              ChatApp
            </h1>
            <Button 
              size="sm" 
              variant="ghost"
              onClick={() => setShowNewChatDialog(true)}
              className="hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              <Plus className="w-5 h-5" />
            </Button>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm cuộc trò chuyện..."
              className="pl-10"
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
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4">
              {messages.map((msg) => {
                const isOwn = msg.senderId === session?.user?.id
                
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3",
                      isOwn && "flex-row-reverse"
                    )}
                  >
                    {!isOwn && (
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={msg.sender.avatar} />
                        <AvatarFallback>
                          {msg.sender.name?.[0]?.toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    
                    <div className={cn(
                      "max-w-md px-4 py-2 rounded-2xl",
                      isOwn
                        ? "bg-blue-600 text-white rounded-br-sm"
                        : "bg-white dark:bg-slate-800 rounded-bl-sm shadow-sm"
                    )}>
                      {!isOwn && (
                        <p className="text-xs font-semibold mb-1">{msg.sender.name}</p>
                      )}
                      <p className="break-words">{msg.content}</p>
                      <p className={cn(
                        "text-xs mt-1",
                        isOwn ? "text-blue-100" : "text-muted-foreground"
                      )}>
                        {new Date(msg.createdAt).toLocaleTimeString('vi-VN', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <div className="flex gap-2">
              <Input
                placeholder="Nhập tin nhắn..."
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                className="flex-1"
              />
              <Button onClick={sendMessage}>
                Gửi
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle className="w-24 h-24 mx-auto mb-4 text-muted-foreground opacity-50" />
            <h2 className="text-2xl font-bold mb-2">Chào mừng đến ChatApp</h2>
            <p className="text-muted-foreground">Chọn một cuộc trò chuyện để bắt đầu</p>
          </div>
        </div>
      )}

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
