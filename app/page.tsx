'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, Users, Shield, Zap, Sparkles, Globe } from "lucide-react"

const features = [
  {
    icon: MessageCircle,
    title: "Chat Realtime",
    description: "Nhắn tin tức thì với công nghệ WebSocket, tin nhắn được gửi và nhận ngay lập tức.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: Users,
    title: "Chat Nhóm",
    description: "Tạo nhóm chat với bạn bè, đồng nghiệp. Quản lý thành viên và phân quyền dễ dàng.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: Shield,
    title: "Bảo Mật Cao",
    description: "Đăng nhập an toàn với Google OAuth. Dữ liệu được mã hóa và bảo vệ tuyệt đối.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: Zap,
    title: "Nhanh & Mượt",
    description: "Giao diện hiện đại, tối ưu hiệu năng. Trải nghiệm chat mượt mà trên mọi thiết bị.",
    gradient: "from-orange-500 to-red-500",
  },
]

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/chat')
    }
  }, [status, router])

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 py-16 md:py-24 lg:py-32">
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
          <div 
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), 
                               linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="flex flex-col items-center text-center space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-sm font-semibold text-white">✨ Kết nối mọi lúc, mọi nơi</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <span className="inline-block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent">
                ChatApp
              </span>
              <br />
              <span className="text-white/90 text-3xl md:text-4xl lg:text-5xl font-light mt-4 block">
                Chat Thông Minh & Hiện Đại
              </span>
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-blue-100/80 max-w-3xl leading-relaxed"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Trải nghiệm nhắn tin{" "}
              <span className="font-bold text-cyan-400">thời gian thực</span> với 
              giao diện đẹp mắt, bảo mật cao và nhiều tính năng vượt trội
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <Link href="/auth/signin">
                <Button size="lg" className="group w-full sm:w-auto text-lg px-10 py-7 rounded-2xl shadow-2xl shadow-blue-500/40 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 border-0 transition-all duration-300 hover:scale-105">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  <span>Bắt đầu Chat</span>
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <Users className="w-5 h-5 mr-2" />
                  Đăng ký ngay
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
            <path 
              d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
              className="fill-white dark:fill-slate-900"
            />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-12"
          >
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tính năng nổi bật
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Mọi thứ bạn cần cho một ứng dụng chat hiện đại
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {features.map((feature, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                >
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden group">
                    <CardHeader className="space-y-4">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <CardTitle className="text-xl font-bold text-slate-900 dark:text-white">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="leading-relaxed text-slate-600 dark:text-slate-400">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <motion.div
            className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
          <motion.div
            className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
            transition={{ duration: 6, repeat: Infinity }}
          />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center text-white space-y-8"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold">
              Sẵn sàng trò chuyện?
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Tham gia ngay hôm nay và trải nghiệm cách chat hiện đại nhất
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/auth/signin">
                <Button
                  size="lg"
                  className="mt-4 text-lg px-12 py-8 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 shadow-2xl shadow-black/20 font-bold"
                >
                  🚀 Bắt đầu Chat ngay
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
