'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { createBrowserClient } from '@/lib/supabase'
import { Menu, X, Sun, Moon, Shield, LogOut, User, ChevronDown, BookOpen, TrendingUp, Sparkles, Home, GraduationCap, BarChart3, BookMarked, Bell, MessageCircle, Users } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/contexts/auth-context"
import { LoginModal } from "@/components/auth/login-modal"

const navItems = [
  { name: "Trang chủ", href: "/", icon: Home },
  { name: "Bài học", href: "/lessons", icon: GraduationCap },
  { name: "Sổ từ vựng", href: "/notebook", icon: BookMarked },
  { name: "Bạn bè", href: "/friends", icon: Users },
  { name: "Tin nhắn", href: "/messages", icon: MessageCircle },
  { name: "Tiến độ", href: "/progress", icon: BarChart3 },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [showLoginModal, setShowLoginModal] = React.useState(false)
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const [unreadNotifications, setUnreadNotifications] = React.useState(0)
  const [unreadMessages, setUnreadMessages] = React.useState(0)
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, isAdmin, logout, user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const userMenuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
    
    const handleScroll = () => {
      setScrolled(window.scrollY > 20)
    }
    
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Fetch unread counts
  React.useEffect(() => {
    if (isAuthenticated && user) {
      fetchUnreadCounts()
      
      let notifChannel: any = null
      let messageChannel: any = null
      let pollInterval: NodeJS.Timeout | null = null
      let isRealtimeConnected = false
      
      // Subscribe to realtime updates
      try {
        const supabase = createBrowserClient()
        
        // Subscribe to notifications
        notifChannel = supabase
          .channel('navbar-notifications')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'Notification'
            },
            (payload: any) => {
              console.log('Navbar notification update:', payload)
              if (payload.new?.userId === user.id || payload.old?.userId === user.id) {
                fetchUnreadCounts()
              }
            }
          )
          .subscribe((status) => {
            console.log('Navbar notification channel:', status)
            if (status === 'SUBSCRIBED') {
              isRealtimeConnected = true
            }
          })
        
        // Subscribe to messages
        messageChannel = supabase
          .channel('navbar-messages')
          .on(
            'postgres_changes',
            {
              event: '*',
              schema: 'public',
              table: 'Message'
            },
            (payload: any) => {
              console.log('Navbar message update:', payload)
              if (payload.new?.receiverId === user.id || payload.old?.receiverId === user.id) {
                fetchUnreadCounts()
              }
            }
          )
          .subscribe((status) => {
            console.log('Navbar message channel:', status)
          })
      } catch (error) {
        console.error('Navbar realtime error:', error)
      }
      
      // Fallback polling
      pollInterval = setInterval(() => {
        fetchUnreadCounts()
      }, isRealtimeConnected ? 30000 : 10000) // 30s if realtime, 10s if not
      
      return () => {
        if (notifChannel || messageChannel) {
          const supabase = createBrowserClient()
          if (notifChannel) supabase.removeChannel(notifChannel)
          if (messageChannel) supabase.removeChannel(messageChannel)
        }
        if (pollInterval) {
          clearInterval(pollInterval)
        }
      }
    }
  }, [isAuthenticated, user])

  const fetchUnreadCounts = async () => {
    try {
      const token = localStorage.getItem('auth_token')
      
      // Fetch unread notifications
      const notifRes = await fetch('/api/notifications?unread=true', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const notifData = await notifRes.json()
      if (notifData.success) {
        setUnreadNotifications(notifData.unreadCount || 0)
      }

      // Fetch unread messages
      const messagesRes = await fetch('/api/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      })
      const messagesData = await messagesRes.json()
      if (messagesData.success) {
        const totalUnread = messagesData.data.reduce((sum: number, conv: any) => sum + conv.unreadCount, 0)
        setUnreadMessages(totalUnread)
      }
    } catch (error) {
      console.error('Error fetching unread counts:', error)
    }
  }

  // Close user menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false)
      }
    }
    
    if (showUserMenu) {
      document.addEventListener('mousedown', handleClickOutside)
      return () => document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showUserMenu])

  const handleAdminClick = () => {
    if (isAuthenticated) {
      router.push('/admin')
    } else {
      setShowLoginModal(true)
    }
  }

  const handleLoginSuccess = () => {
    router.push('/admin')
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    if (pathname.startsWith('/admin')) {
      router.push('/')
    }
  }

  // Get user initials for avatar
  const getUserInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  // Get avatar background color from name
  const getAvatarColor = (name?: string) => {
    if (!name) return 'bg-gradient-to-br from-blue-500 to-indigo-600'
    const colors = [
      'bg-gradient-to-br from-blue-500 to-cyan-500',
      'bg-gradient-to-br from-purple-500 to-pink-500',
      'bg-gradient-to-br from-emerald-500 to-teal-500',
      'bg-gradient-to-br from-orange-500 to-red-500',
      'bg-gradient-to-br from-indigo-500 to-purple-500',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  const isHomePage = pathname === '/'

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
          scrolled || !isHomePage
            ? "bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl shadow-lg shadow-slate-900/5 dark:shadow-slate-900/20 border-b border-slate-200/50 dark:border-slate-700/50"
            : "bg-transparent"
        )}
      >
        <div className="container mx-auto px-4">
          <div className="flex h-16 md:h-20 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                className="relative flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-2xl bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 shadow-lg shadow-blue-500/30 overflow-hidden"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="text-xl md:text-2xl font-black text-white relative z-10">V</span>
                {/* Shine effect */}
                <motion.div 
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                />
              </motion.div>
              <div className="flex flex-col">
                <span className={cn(
                  "text-lg md:text-xl font-bold transition-colors duration-300",
                  scrolled || !isHomePage
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"
                    : "text-white"
                )}>
                  Vocaplanet
                </span>
                <span className={cn(
                  "text-[10px] -mt-0.5 font-medium transition-colors duration-300 hidden sm:block",
                  scrolled || !isHomePage
                    ? "text-slate-500 dark:text-slate-400"
                    : "text-blue-200"
                )}>
                  Learn & Share Words
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center">
              <div className={cn(
                "flex items-center gap-1 p-1.5 rounded-2xl transition-all duration-300",
                scrolled || !isHomePage
                  ? "bg-slate-100/80 dark:bg-slate-800/80"
                  : "bg-white/10 backdrop-blur-md"
              )}>
                {navItems.map((item) => {
                  const Icon = item.icon
                  const isActive = pathname === item.href
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                    >
                      <motion.div
                        className={cn(
                          "px-4 py-2.5 text-sm font-semibold rounded-xl transition-all duration-300 flex items-center gap-2",
                          isActive
                            ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg shadow-blue-500/30"
                            : scrolled || !isHomePage
                              ? "text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 hover:text-blue-600 dark:hover:text-blue-400"
                              : "text-white/80 hover:text-white hover:bg-white/10"
                        )}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Icon className="w-4 h-4" />
                        {item.name}
                      </motion.div>
                    </Link>
                  )
                })}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Notifications Icon */}
              {mounted && isAuthenticated && (
                <motion.button
                  onClick={() => router.push('/notifications')}
                  className={cn(
                    "hidden md:flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300 relative",
                    scrolled || !isHomePage
                      ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                      : "bg-white/10 hover:bg-white/20 backdrop-blur-md"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Bell className={cn(
                    "h-5 w-5",
                    scrolled || !isHomePage ? "text-slate-600 dark:text-slate-300" : "text-white"
                  )} />
                  {unreadNotifications > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </motion.span>
                  )}
                </motion.button>
              )}

              {/* Theme Toggle */}
              {mounted && (
                <motion.button
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                  className={cn(
                    "hidden md:flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-300",
                    scrolled || !isHomePage
                      ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                      : "bg-white/10 hover:bg-white/20 backdrop-blur-md"
                  )}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <AnimatePresence mode="wait">
                    {theme === "dark" ? (
                      <motion.div
                        key="sun"
                        initial={{ rotate: -90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: 90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Sun className="h-5 w-5 text-amber-400" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="moon"
                        initial={{ rotate: 90, scale: 0 }}
                        animate={{ rotate: 0, scale: 1 }}
                        exit={{ rotate: -90, scale: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Moon className={cn(
                          "h-5 w-5",
                          scrolled || !isHomePage ? "text-slate-600" : "text-white"
                        )} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              )}

              {/* Login button for non-authenticated users */}
              {mounted && !isAuthenticated && (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    size="sm"
                    onClick={() => router.push('/auth')}
                    className={cn(
                      "hidden md:flex gap-2 rounded-xl font-semibold px-5 py-2.5 transition-all duration-300",
                      scrolled || !isHomePage
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30"
                        : "bg-white text-blue-600 hover:bg-blue-50 shadow-lg"
                    )}
                  >
                    <Sparkles className="h-4 w-4" />
                    Đăng nhập
                  </Button>
                </motion.div>
              )}

              {/* User Avatar Menu for authenticated users */}
              {mounted && isAuthenticated && (
                <div className="hidden md:block relative" ref={userMenuRef}>
                  <motion.button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-xl transition-all duration-300",
                      scrolled || !isHomePage
                        ? "hover:bg-slate-100 dark:hover:bg-slate-800"
                        : "hover:bg-white/10"
                    )}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={cn(
                      "w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg ring-2 ring-white/50",
                      getAvatarColor(user?.name)
                    )}>
                      {getUserInitials(user?.name)}
                    </div>
                    <div className="text-left hidden lg:block">
                      <p className={cn(
                        "text-sm font-semibold transition-colors",
                        scrolled || !isHomePage
                          ? "text-slate-900 dark:text-white"
                          : "text-white"
                      )}>
                        {user?.name || 'User'}
                      </p>
                      {isAdmin && (
                        <p className="text-xs text-cyan-400 flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          Admin
                        </p>
                      )}
                    </div>
                    <ChevronDown className={cn(
                      "w-4 h-4 transition-all duration-300",
                      showUserMenu && "rotate-180",
                      scrolled || !isHomePage
                        ? "text-slate-600 dark:text-slate-400"
                        : "text-white/70"
                    )} />
                  </motion.button>

                  {/* Dropdown Menu */}
                  <AnimatePresence>
                    {showUserMenu && (
                      <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden"
                      >
                        {/* User Info Header */}
                        <div className="p-4 bg-gradient-to-r from-blue-500 to-indigo-600">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center text-white font-bold shadow-lg ring-2 ring-white/30",
                              getAvatarColor(user?.name)
                            )}>
                              {getUserInitials(user?.name)}
                            </div>
                            <div>
                              <p className="text-white font-semibold">
                                {user?.name || 'User'}
                              </p>
                              <p className="text-blue-100 text-sm">
                                {user?.email}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          <button
                            onClick={() => {
                              router.push('/lessons')
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                              <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <span>Bài học của tôi</span>
                          </button>
                          <button
                            onClick={() => {
                              router.push('/progress')
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                              <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                            </div>
                            <span>Tiến độ học tập</span>
                          </button>
                          {isAdmin && (
                            <button
                              onClick={() => {
                                router.push('/admin')
                                setShowUserMenu(false)
                              }}
                              className="w-full px-4 py-3 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-purple-50 dark:hover:bg-slate-700/50 flex items-center gap-3 transition-colors"
                            >
                              <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                              </div>
                              <span className="font-medium">Quản trị viên</span>
                            </button>
                          )}
                        </div>

                        {/* Logout */}
                        <div className="border-t border-slate-200 dark:border-slate-700 p-2">
                          <button
                            onClick={handleLogout}
                            className="w-full px-4 py-2.5 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-3 rounded-xl transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            <span>Đăng xuất</span>
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}

              {/* Mobile menu button */}
              <motion.button
                className={cn(
                  "md:hidden p-2.5 rounded-xl transition-all duration-300",
                  scrolled || !isHomePage
                    ? "bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    : "bg-white/10 hover:bg-white/20 backdrop-blur-md"
                )}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
                whileTap={{ scale: 0.9 }}
              >
                <AnimatePresence mode="wait">
                  {isOpen ? (
                    <motion.div
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={22} className={cn(
                        scrolled || !isHomePage ? "text-slate-700 dark:text-slate-300" : "text-white"
                      )} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Menu size={22} className={cn(
                        scrolled || !isHomePage ? "text-slate-700 dark:text-slate-300" : "text-white"
                      )} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-slate-900 z-50 md:hidden shadow-2xl"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                  <div className="flex items-center justify-between">
                    <Link href="/" className="flex items-center space-x-3" onClick={() => setIsOpen(false)}>
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 via-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg">
                        <span className="text-xl font-black text-white">V</span>
                      </div>
                      <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        Vocaplanet
                      </span>
                    </Link>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700"
                    >
                      <X size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                  </div>
                </div>

                {/* User Info (mobile) */}
                {mounted && isAuthenticated && user && (
                  <div className="p-5 border-b border-slate-200 dark:border-slate-800">
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl">
                      <div className={cn(
                        "w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg ring-2 ring-white/30",
                        getAvatarColor(user?.name)
                      )}>
                        {getUserInitials(user?.name)}
                      </div>
                      <div className="text-white">
                        <p className="font-semibold">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-sm text-blue-100">
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <p className="text-xs text-cyan-300 flex items-center gap-1 mt-1">
                            <Shield className="w-3 h-3" />
                            Quản trị viên
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto p-5">
                  <div className="space-y-2">
                    {navItems.map((item, index) => {
                      const Icon = item.icon
                      const isActive = pathname === item.href
                      return (
                        <motion.div
                          key={item.href}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Link
                            href={item.href}
                            className={cn(
                              "flex items-center gap-4 py-3.5 px-4 rounded-xl font-medium transition-all",
                              isActive
                                ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg"
                                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                            )}
                            onClick={() => setIsOpen(false)}
                          >
                            <Icon className="w-5 h-5" />
                            {item.name}
                          </Link>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Additional Actions */}
                  <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-2">
                    {mounted && !isAuthenticated && (
                      <motion.button
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        onClick={() => {
                          router.push('/auth')
                          setIsOpen(false)
                        }}
                        className="flex items-center gap-4 py-3.5 px-4 rounded-xl font-medium text-white bg-gradient-to-r from-blue-500 to-indigo-600 w-full shadow-lg"
                      >
                        <Sparkles className="w-5 h-5" />
                        Đăng nhập
                      </motion.button>
                    )}

                    {mounted && isAuthenticated && (
                      <>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              router.push('/admin')
                              setIsOpen(false)
                            }}
                            className="flex items-center gap-4 py-3.5 px-4 rounded-xl font-medium text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/20 w-full"
                          >
                            <Shield className="w-5 h-5" />
                            Quản trị viên
                          </button>
                        )}
                        <button
                          onClick={() => {
                            handleLogout()
                            setIsOpen(false)
                          }}
                          className="flex items-center gap-4 py-3.5 px-4 rounded-xl font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 w-full"
                        >
                          <LogOut className="w-5 h-5" />
                          Đăng xuất
                        </button>
                      </>
                    )}
                  </div>
                </div>

                {/* Footer - Theme Toggle */}
                <div className="p-5 border-t border-slate-200 dark:border-slate-800">
                  {mounted && (
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="flex items-center justify-between w-full py-3 px-4 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                      <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {theme === "dark" ? "Chế độ sáng" : "Chế độ tối"}
                      </span>
                      {theme === "dark" ? (
                        <Sun className="h-5 w-5 text-amber-400" />
                      ) : (
                        <Moon className="h-5 w-5 text-slate-600" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </>
  )
}
