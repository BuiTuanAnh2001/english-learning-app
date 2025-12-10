'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { createBrowserClient } from '@/lib/supabase'
import { Search, Plus, Send, Info, LogOut, Circle, Image as ImageIcon } from 'lucide-react'
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
}

interface Conversation {
  id: string
  type: 'DIRECT' | 'GROUP'
  name: string | null
  members: {
    user: {
      id: string
      name: string | null
      email: string
      avatar: string | null
      status: string
    }
  }[]
  messages: Message[]
}

export default function ChatPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedConv, setSelectedConv] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [showNewChatDialog, setShowNewChatDialog] = useState(false)
  const [newChatEmail, setNewChatEmail] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<any>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      console.error('Error:', error)
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
      console.error('Error:', error)
    }
  }, [])

  const subscribeToRealtime = useCallback(() => {
    if (!selectedConv) return

    const supabase = createBrowserClient()
    
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
    }
    
    const channel = supabase
      .channel(`conversation-${selectedConv}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'Message',
        filter: `conversationId=eq.${selectedConv}`
      }, () => {
        fetchMessages(selectedConv)
        fetchConversations()
      })
      .subscribe()

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

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!messageInput.trim() || !selectedConv) return

    const tempMessage = messageInput
    setMessageInput('')

    try {
      await fetch(`/api/conversations/${selectedConv}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: tempMessage })
      })
    } catch (error) {
      setMessageInput(tempMessage)
    }
  }

  const createNewChat = async () => {
    if (!newChatEmail.trim()) return

    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'DIRECT', participantEmail: newChatEmail })
      })

      const data = await res.json()
      
      if (data.success) {
        setShowNewChatDialog(false)
        setNewChatEmail('')
        await fetchConversations()
        setSelectedConv(data.data.id)
      } else {
        alert(data.error || 'Error')
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const selectedConversation = conversations.find(c => c.id === selectedConv)
  const otherUser = selectedConversation?.members.find(m => m.user.id !== session?.user?.id)?.user
  const filteredConversations = conversations.filter(conv => {
    const other = conv.members.find(m => m.user.id !== session?.user?.id)?.user
    return other?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
           other?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  })

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-white dark:bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  return (
    <div className="h-screen flex bg-white dark:bg-black">
      {/* Sidebar */}
      <div className="w-80 border-r border-gray-200 dark:border-gray-800 flex flex-col bg-gray-50/50 dark:bg-gray-900/50">
        <div className="p-4 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between mb-3">
            <h1 className="text-2xl font-semibold">Messages</h1>
            <div className="flex gap-2">
              <Button onClick={() => setShowNewChatDialog(true)} size="sm" className="h-8 w-8 p-0 rounded-full bg-blue-500 hover:bg-blue-600">
                <Plus className="h-4 w-4 text-white" />
              </Button>
              <Button onClick={() => signOut({ callbackUrl: '/auth/signin' })} size="sm" variant="ghost" className="h-8 w-8 p-0">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search" className="pl-9 bg-gray-100 dark:bg-gray-800 border-0 rounded-lg h-9" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {filteredConversations.map((conv) => {
            const other = conv.members.find(m => m.user.id !== session?.user?.id)?.user
            const lastMessage = conv.messages[conv.messages.length - 1]
            return (
              <button key={conv.id} onClick={() => setSelectedConv(conv.id)} className={cn("w-full p-3 flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800/50 border-b border-gray-100 dark:border-gray-800/50", conv.id === selectedConv && "bg-gray-100 dark:bg-gray-800/50")}>
                <div className="relative">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={other?.avatar || undefined} />
                    <AvatarFallback className="bg-blue-500 text-white">{other?.name?.[0] || 'U'}</AvatarFallback>
                  </Avatar>
                  {other?.status === 'ONLINE' && <Circle className="absolute bottom-0 right-0 h-3 w-3 fill-green-500 text-green-500" />}
                </div>
                <div className="flex-1 text-left min-w-0">
                  <div className="flex justify-between mb-0.5">
                    <p className="font-semibold text-sm truncate">{other?.name || 'Unknown'}</p>
                    {lastMessage && <span className="text-xs text-gray-500">{new Date(lastMessage.createdAt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</span>}
                  </div>
                  {lastMessage && <p className="text-sm text-gray-500 truncate">{lastMessage.content}</p>}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            <div className="h-14 border-b border-gray-200 dark:border-gray-800 flex items-center justify-center px-4">
              <div className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={otherUser?.avatar || undefined} />
                  <AvatarFallback className="bg-blue-500 text-white text-xs">{otherUser?.name?.[0] || 'U'}</AvatarFallback>
                </Avatar>
                <p className="font-semibold text-sm">{otherUser?.name || 'Unknown'}</p>
              </div>
              <Button size="sm" variant="ghost" className="absolute right-4 h-8 w-8 p-0"><Info className="h-4 w-4" /></Button>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="max-w-3xl mx-auto space-y-0.5">
                {messages.map((msg, i) => {
                  const isOwn = msg.senderId === session?.user?.id
                  const prevMsg = messages[i - 1]
                  const nextMsg = messages[i + 1]
                  const isFirstInGroup = !prevMsg || prevMsg.senderId !== msg.senderId
                  const isLastInGroup = !nextMsg || nextMsg.senderId !== msg.senderId
                  return (
                    <motion.div key={msg.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className={cn("flex", isOwn ? "justify-end" : "justify-start", !isFirstInGroup && "mt-0.5", isLastInGroup && "mb-3")}>
                      <div className={cn("max-w-[70%] px-4 py-2 shadow-sm", isOwn ? "bg-blue-500 text-white rounded-[18px]" : "bg-gray-200 dark:bg-gray-800 rounded-[18px]", isOwn && isFirstInGroup && "rounded-tr-sm", isOwn && isLastInGroup && "rounded-br-sm", !isOwn && isFirstInGroup && "rounded-tl-sm", !isOwn && isLastInGroup && "rounded-bl-sm")}>
                        <p className="text-[15px] leading-snug break-words">{msg.content}</p>
                      </div>
                    </motion.div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 p-4">
              <form onSubmit={sendMessage} className="max-w-3xl mx-auto flex items-center gap-2">
                <Button type="button" size="sm" variant="ghost" className="h-9 w-9 p-0"><ImageIcon className="h-5 w-5 text-gray-500" /></Button>
                <Input value={messageInput} onChange={(e) => setMessageInput(e.target.value)} placeholder="iMessage" className="flex-1 bg-gray-100 dark:bg-gray-800 border-0 rounded-full h-9 px-4" />
                <motion.button type="submit" disabled={!messageInput.trim()} className={cn("h-9 w-9 rounded-full flex items-center justify-center", messageInput.trim() ? "bg-blue-500 hover:bg-blue-600" : "bg-gray-300 dark:bg-gray-700")} whileTap={messageInput.trim() ? { scale: 0.9 } : {}}>
                  <Send className="h-4 w-4 text-white" />
                </motion.button>
              </form>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center">
            <div className="text-center">
              <div className="h-16 w-16 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center mx-auto mb-4"><Plus className="h-8 w-8 text-gray-400" /></div>
              <p className="text-gray-500 text-sm">Chọn cuộc trò chuyện</p>
            </div>
          </div>
        )}
      </div>

      {/* Dialog */}
      <AnimatePresence>
        {showNewChatDialog && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowNewChatDialog(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl z-50 p-6">
              <h3 className="text-lg font-semibold mb-4">New Message</h3>
              <Input value={newChatEmail} onChange={(e) => setNewChatEmail(e.target.value)} placeholder="Email" className="mb-4" autoFocus />
              <div className="flex gap-2">
                <Button onClick={() => setShowNewChatDialog(false)} variant="outline" className="flex-1">Cancel</Button>
                <Button onClick={createNewChat} className="flex-1 bg-blue-500 hover:bg-blue-600" disabled={!newChatEmail.trim()}>Create</Button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
