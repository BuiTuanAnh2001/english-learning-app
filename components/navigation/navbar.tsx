'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X, Sun, Moon, Shield, LogOut, User, ChevronDown, BookOpen, TrendingUp } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useAuth } from "@/lib/contexts/auth-context"
import { LoginModal } from "@/components/auth/login-modal"

const navItems = [
  { name: "Trang chủ", href: "/" },
  { name: "Bài học", href: "/lessons" },
  { name: "Tiến độ", href: "/progress" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [showLoginModal, setShowLoginModal] = React.useState(false)
  const [showUserMenu, setShowUserMenu] = React.useState(false)
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, isAdmin, logout, user } = useAuth()
  const pathname = usePathname()
  const router = useRouter()
  const userMenuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

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
      'bg-gradient-to-br from-blue-500 to-indigo-600',
      'bg-gradient-to-br from-purple-500 to-pink-600',
      'bg-gradient-to-br from-emerald-500 to-teal-600',
      'bg-gradient-to-br from-orange-500 to-red-600',
      'bg-gradient-to-br from-cyan-500 to-blue-600',
    ]
    const index = name.charCodeAt(0) % colors.length
    return colors[index]
  }

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 w-full border-b border-slate-200/60 dark:border-slate-800/60 bg-white/80 dark:bg-slate-950/80 backdrop-blur-xl shadow-sm"
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 transition-all group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-blue-500/40">
              <span className="text-2xl font-black text-white">V</span>
              <div className="absolute -bottom-1 left-3 w-2.5 h-2.5 bg-indigo-600 transform rotate-45 rounded-sm"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Vocaplanet
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 -mt-0.5 font-medium">
                Learn & Share Words
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "px-4 py-2 text-sm font-semibold rounded-xl transition-all duration-300 relative",
                  pathname === item.href
                    ? "text-white bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30"
                    : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                )}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Dark Mode Toggle & User Menu & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {/* Login button for non-authenticated users */}
            {mounted && !isAuthenticated && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => router.push('/auth')}
                className="hidden md:flex gap-2 rounded-xl border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 dark:hover:bg-blue-950/20"
              >
                <User className="h-4 w-4" />
                Đăng nhập
              </Button>
            )}

            {/* User Avatar Menu for authenticated users */}
            {mounted && isAuthenticated && (
              <div className="hidden md:block relative" ref={userMenuRef}>
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <div className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg",
                    getAvatarColor(user?.name)
                  )}>
                    {getUserInitials(user?.name)}
                  </div>
                  <div className="text-left hidden lg:block">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {user?.name || 'User'}
                    </p>
                    {isAdmin && (
                      <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1">
                        <Shield className="w-3 h-3" />
                        Admin
                      </p>
                    )}
                  </div>
                  <ChevronDown className={cn(
                    "w-4 h-4 text-slate-600 dark:text-slate-400 transition-transform",
                    showUserMenu && "rotate-180"
                  )} />
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50"
                    >
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-200 dark:border-slate-700">
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                          {user?.name || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {user?.email}
                        </p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <button
                          onClick={() => {
                            router.push('/lessons')
                            setShowUserMenu(false)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                        >
                          <BookOpen className="w-4 h-4" />
                          Bài học của tôi
                        </button>
                        <button
                          onClick={() => {
                            router.push('/progress')
                            setShowUserMenu(false)
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 flex items-center gap-3"
                        >
                          <TrendingUp className="w-4 h-4" />
                          Tiến độ học tập
                        </button>
                        {isAdmin && (
                          <button
                            onClick={() => {
                              router.push('/admin')
                              setShowUserMenu(false)
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/20 flex items-center gap-3 font-medium"
                          >
                            <Shield className="w-4 h-4" />
                            Quản trị viên
                          </button>
                        )}
                      </div>

                      {/* Logout */}
                      <div className="border-t border-slate-200 dark:border-slate-700 pt-2">
                        <button
                          onClick={handleLogout}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 flex items-center gap-3"
                        >
                          <LogOut className="w-4 h-4" />
                          Đăng xuất
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {mounted && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="hidden md:flex rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                {theme === "dark" ? (
                  <Sun className="h-5 w-5 text-amber-500" />
                ) : (
                  <Moon className="h-5 w-5 text-blue-600" />
                )}
              </Button>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} className="text-slate-700 dark:text-slate-300" /> : <Menu size={24} className="text-slate-700 dark:text-slate-300" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 space-y-3 border-t border-slate-200 dark:border-slate-800"
          >
            {/* User Info (mobile) */}
            {mounted && isAuthenticated && user && (
              <div className="flex items-center gap-3 px-2 py-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl mb-4">
                <div className={cn(
                  "w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-lg",
                  getAvatarColor(user?.name)
                )}>
                  {getUserInitials(user?.name)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {user?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {user?.email}
                  </p>
                  {isAdmin && (
                    <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                      <Shield className="w-3 h-3" />
                      Quản trị viên
                    </p>
                  )}
                </div>
              </div>
            )}

            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block py-2 px-2 text-sm font-medium transition-colors hover:text-primary rounded-lg",
                  pathname === item.href
                    ? "text-primary bg-blue-50 dark:bg-blue-950/20"
                    : "text-muted-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {/* Mobile menu - Login button for non-authenticated users */}
            {mounted && !isAuthenticated && (
              <button
                onClick={() => {
                  router.push('/auth')
                  setIsOpen(false)
                }}
                className="flex items-center gap-2 py-2 px-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 w-full rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
              >
                <User className="h-4 w-4" /> Đăng nhập
              </button>
            )}

            {/* Mobile menu - User actions for authenticated users */}
            {mounted && isAuthenticated && (
              <>
                {isAdmin && (
                  <button
                    onClick={() => {
                      router.push('/admin')
                      setIsOpen(false)
                    }}
                    className="flex items-center gap-2 py-2 px-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 w-full rounded-lg hover:bg-blue-50 dark:hover:bg-blue-950/20"
                  >
                    <Shield className="h-4 w-4" /> Quản trị viên
                  </button>
                )}
                <button
                  onClick={() => {
                    handleLogout()
                    setIsOpen(false)
                  }}
                  className="flex items-center gap-2 py-2 px-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 w-full rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20"
                >
                  <LogOut className="h-4 w-4" /> Đăng xuất
                </button>
              </>
            )}

            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                {theme === "dark" ? (
                  <>
                    <Sun className="h-4 w-4" /> Chế độ sáng
                  </>
                ) : (
                  <>
                    <Moon className="h-4 w-4" /> Chế độ tối
                  </>
                )}
              </button>
            )}
          </motion.div>
        )}
      </div>

      <LoginModal 
        isOpen={showLoginModal} 
        onClose={() => setShowLoginModal(false)}
        onSuccess={handleLoginSuccess}
      />
    </motion.nav>
  )
}
