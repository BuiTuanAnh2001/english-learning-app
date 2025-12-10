'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Chrome } from 'lucide-react'

export default function SignInPage() {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/chat')
    }
  }, [status, router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4">
            <span className="text-3xl font-black text-white">C</span>
          </div>
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Chào mừng trở lại
          </CardTitle>
          <CardDescription className="text-base">
            Đăng nhập để tiếp tục chat
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={() => signIn('google', { callbackUrl: '/chat' })}
            className="w-full h-12 bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 font-semibold shadow-sm"
            size="lg"
          >
            <Chrome className="w-5 h-5 mr-2" />
            Đăng nhập với Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
