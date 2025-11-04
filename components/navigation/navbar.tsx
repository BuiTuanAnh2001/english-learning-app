'use client'

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Menu, X, Sun, Moon, Shield, LogOut } from "lucide-react"
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
  const { theme, setTheme } = useTheme()
  const { isAuthenticated, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  React.useEffect(() => {
    setMounted(true)
  }, [])

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
    if (pathname.startsWith('/admin')) {
      router.push('/')
    }
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

          {/* Dark Mode Toggle & Admin/Logout & Mobile Menu Button */}
          <div className="flex items-center gap-2">
            {mounted && isAuthenticated && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hidden md:flex gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl"
              >
                <LogOut className="h-4 w-4" />
                Đăng xuất
              </Button>
            )}
            
            {mounted && (
              <Button
                variant={isAuthenticated ? "default" : "outline"}
                size="sm"
                onClick={handleAdminClick}
                className={cn(
                  "hidden md:flex gap-2 rounded-xl",
                  isAuthenticated && "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg shadow-blue-500/30"
                )}
              >
                <Shield className="h-4 w-4" />
                Admin
              </Button>
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
            className="md:hidden py-4 space-y-3"
          >
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "block py-2 text-sm font-medium transition-colors hover:text-primary",
                  pathname === item.href
                    ? "text-primary"
                    : "text-muted-foreground"
                )}
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            
            {mounted && (
              <button
                onClick={() => {
                  handleAdminClick()
                  setIsOpen(false)
                }}
                className="flex items-center gap-2 py-2 text-sm font-medium text-muted-foreground hover:text-primary"
              >
                <Shield className="h-4 w-4" /> Admin
              </button>
            )}

            {mounted && isAuthenticated && (
              <button
                onClick={() => {
                  handleLogout()
                  setIsOpen(false)
                }}
                className="flex items-center gap-2 py-2 text-sm font-medium text-destructive hover:text-destructive/80"
              >
                <LogOut className="h-4 w-4" /> Đăng xuất
              </button>
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
