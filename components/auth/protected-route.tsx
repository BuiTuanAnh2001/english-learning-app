'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/contexts/auth-context'
import { motion } from 'framer-motion'
import { Shield, Lock } from 'lucide-react'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/')
    }
  }, [isAuthenticated, router])

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto text-center space-y-6"
        >
          <div className="mx-auto w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center">
            <Lock className="w-10 h-10 text-destructive" />
          </div>
          <h1 className="text-3xl font-bold">Truy cập bị từ chối</h1>
          <p className="text-muted-foreground">
            Bạn cần đăng nhập với quyền Admin để truy cập trang này.
          </p>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Shield className="w-16 h-16 mx-auto text-muted-foreground/20" />
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return <>{children}</>
}
