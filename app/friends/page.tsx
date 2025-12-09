'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/contexts/auth-context'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Users, UserPlus, Search, Check, X, MessageCircle, 
  Loader2, UserMinus, Clock, UserCheck 
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface User {
  id: string
  name: string | null
  email: string
  createdAt: string
}

interface Friendship {
  id: string
  status: string
  friend: User
  isReceiver: boolean
  createdAt: string
}

interface SearchUser extends User {
  relationship: { status: string; isSender: boolean } | null
}

export default function FriendsPage() {
  const { isAuthenticated, user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [friends, setFriends] = useState<Friendship[]>([])
  const [pendingRequests, setPendingRequests] = useState<Friendship[]>([])
  const [sentRequests, setSentRequests] = useState<Friendship[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchUser[]>([])
  const [searching, setSearching] = useState(false)
  const [activeTab, setActiveTab] = useState('friends')

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth')
    } else {
      fetchFriends()
      fetchPendingRequests()
      fetchSentRequests()
    }
  }, [isAuthenticated])

  const fetchFriends = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch('/api/friends?type=friends', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setFriends(data.data)
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchPendingRequests = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch('/api/friends?type=pending', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setPendingRequests(data.data)
      }
    } catch (error) {
      console.error('Error fetching pending requests:', error)
    }
  }

  const fetchSentRequests = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch('/api/friends?type=sent', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setSentRequests(data.data)
      }
    } catch (error) {
      console.error('Error fetching sent requests:', error)
    }
  }

  const searchUsers = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([])
      return
    }

    setSearching(true)
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`/api/friends/search?q=${encodeURIComponent(query)}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setSearchResults(data.data)
      }
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setSearching(false)
    }
  }

  const sendFriendRequest = async (receiverId: string) => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch('/api/friends', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ receiverId })
      })
      const data = await res.json()
      if (data.success) {
        // Refresh search results
        searchUsers(searchQuery)
        fetchSentRequests()
      } else {
        alert(data.error)
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
    }
  }

  const respondToRequest = async (friendshipId: string, action: 'accept' | 'reject') => {
    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` 
        },
        body: JSON.stringify({ action })
      })
      const data = await res.json()
      if (data.success) {
        fetchPendingRequests()
        if (action === 'accept') {
          fetchFriends()
        }
      }
    } catch (error) {
      console.error('Error responding to request:', error)
    }
  }

  const removeFriend = async (friendshipId: string) => {
    if (!confirm('Bạn có chắc muốn xóa bạn bè này?')) return

    try {
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`/api/friends/${friendshipId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        fetchFriends()
      }
    } catch (error) {
      console.error('Error removing friend:', error)
    }
  }

  useEffect(() => {
    const timer = setTimeout(() => {
      searchUsers(searchQuery)
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Bạn bè
            </h1>
            <p className="text-slate-600 dark:text-slate-400 text-lg">
              Kết nối và trao đổi học tập cùng bạn bè
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="friends" className="gap-2">
                <Users className="w-4 h-4" />
                Bạn bè ({friends.length})
              </TabsTrigger>
              <TabsTrigger value="requests" className="gap-2">
                <Clock className="w-4 h-4" />
                Lời mời ({pendingRequests.length})
              </TabsTrigger>
              <TabsTrigger value="add" className="gap-2">
                <UserPlus className="w-4 h-4" />
                Thêm bạn
              </TabsTrigger>
            </TabsList>

            {/* Friends List */}
            <TabsContent value="friends" className="space-y-4">
              {loading ? (
                <div className="flex justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                </div>
              ) : friends.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Users className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Bạn chưa có bạn bè nào. Hãy thêm bạn bè để cùng học tập!
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {friends.map((friendship) => (
                    <motion.div
                      key={friendship.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <Card className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                                {(friendship.friend.name || friendship.friend.email)[0].toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {friendship.friend.name || friendship.friend.email}
                                </h3>
                                <p className="text-sm text-slate-500">
                                  {friendship.friend.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => router.push(`/messages?user=${friendship.friend.id}`)}
                                className="gap-2"
                              >
                                <MessageCircle className="w-4 h-4" />
                                Nhắn tin
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => removeFriend(friendship.id)}
                              >
                                <UserMinus className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Friend Requests */}
            <TabsContent value="requests" className="space-y-4">
              {pendingRequests.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center">
                    <Clock className="w-16 h-16 mx-auto mb-4 text-slate-400" />
                    <p className="text-slate-600 dark:text-slate-400">
                      Không có lời mời kết bạn nào
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {pendingRequests.map((request) => (
                    <motion.div
                      key={request.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <Card>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center text-white font-bold text-xl">
                                {(request.friend.name || request.friend.email)[0].toUpperCase()}
                              </div>
                              <div>
                                <h3 className="font-semibold">
                                  {request.friend.name || request.friend.email}
                                </h3>
                                <p className="text-sm text-slate-500">
                                  {request.friend.email}
                                </p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => respondToRequest(request.id, 'accept')}
                                className="gap-2"
                              >
                                <Check className="w-4 h-4" />
                                Chấp nhận
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => respondToRequest(request.id, 'reject')}
                              >
                                <X className="w-4 h-4" />
                                Từ chối
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            {/* Add Friends */}
            <TabsContent value="add" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="w-5 h-5" />
                    Tìm kiếm người dùng
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                    <Input
                      placeholder="Tìm theo tên hoặc email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {searching && (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="space-y-3">
                  {searchResults.map((user) => (
                    <Card key={user.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white font-bold text-xl">
                              {(user.name || user.email)[0].toUpperCase()}
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {user.name || user.email}
                              </h3>
                              <p className="text-sm text-slate-500">{user.email}</p>
                            </div>
                          </div>
                          <div>
                            {user.relationship?.status === 'ACCEPTED' && (
                              <Button size="sm" disabled className="gap-2">
                                <UserCheck className="w-4 h-4" />
                                Đã là bạn bè
                              </Button>
                            )}
                            {user.relationship?.status === 'PENDING' && user.relationship.isSender && (
                              <Button size="sm" disabled>
                                Đã gửi lời mời
                              </Button>
                            )}
                            {user.relationship?.status === 'PENDING' && !user.relationship.isSender && (
                              <Button size="sm" disabled>
                                Đang chờ phản hồi
                              </Button>
                            )}
                            {!user.relationship && (
                              <Button
                                size="sm"
                                onClick={() => sendFriendRequest(user.id)}
                                className="gap-2"
                              >
                                <UserPlus className="w-4 h-4" />
                                Thêm bạn bè
                              </Button>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {searchQuery.length >= 2 && !searching && searchResults.length === 0 && (
                <Card>
                  <CardContent className="py-12 text-center">
                    <p className="text-slate-600 dark:text-slate-400">
                      Không tìm thấy người dùng nào
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  )
}
