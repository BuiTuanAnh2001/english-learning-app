'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Headphones, MessageCircle, BarChart, Sparkles, Globe, BookOpen, Zap } from "lucide-react"
import { categories } from "@/lib/data/lessons"
import { useEffect, useState } from "react"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// 3D Floating elements
const floatingElements = [
  { emoji: "📚", delay: 0, duration: 6, x: "10%", y: "20%" },
  { emoji: "🎯", delay: 1, duration: 7, x: "85%", y: "15%" },
  { emoji: "💡", delay: 2, duration: 5, x: "75%", y: "70%" },
  { emoji: "🌍", delay: 0.5, duration: 8, x: "15%", y: "75%" },
  { emoji: "✨", delay: 1.5, duration: 6, x: "90%", y: "45%" },
  { emoji: "🎓", delay: 2.5, duration: 7, x: "5%", y: "50%" },
  { emoji: "🗣️", delay: 3, duration: 5.5, x: "80%", y: "85%" },
  { emoji: "📝", delay: 0.8, duration: 6.5, x: "20%", y: "35%" },
]

// Stats counter animation
const stats = [
  { value: 500, suffix: "+", label: "Từ vựng", icon: BookOpen },
  { value: 50, suffix: "+", label: "Bài học", icon: Target },
  { value: 100, suffix: "+", label: "Hội thoại", icon: MessageCircle },
  { value: 24, suffix: "/7", label: "Học mọi lúc", icon: Zap },
]

const features = [
  {
    icon: Target,
    title: "Học theo chủ đề",
    description: "Các bài học được phân loại theo chủ đề thực tế như giao tiếp hàng ngày, công việc, du lịch.",
    gradient: "from-orange-500 to-red-500",
  },
  {
    icon: Headphones,
    title: "Luyện nghe với audio",
    description: "Học phát âm chuẩn với các đoạn hội thoại thực tế từ người bản xứ.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: MessageCircle,
    title: "Thực hành giao tiếp",
    description: "Rèn luyện kỹ năng giao tiếp qua các tình huống thực tế trong cuộc sống.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: BarChart,
    title: "Theo dõi tiến độ",
    description: "Đo lường và theo dõi quá trình học tập của bạn một cách chi tiết.",
    gradient: "from-purple-500 to-pink-500",
  },
]

// Counter animation hook
function useCounter(end: number, duration: number = 2000) {
  const [count, setCount] = useState(0)
  
  useEffect(() => {
    let startTime: number | null = null
    let animationFrame: number
    
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }
    
    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [end, duration])
  
  return count
}

export default function Home() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Vocaplanet',
    url: 'https://vocaplanet.online',
    description: 'Học tiếng Anh giao tiếp online miễn phí',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://vocaplanet.online/lessons?search={search_term_string}',
      'query-input': 'required name=search_term_string'
    },
    publisher: {
      '@type': 'Organization',
      name: 'Vocaplanet',
      logo: {
        '@type': 'ImageObject',
        url: 'https://vocaplanet.online/logo.png'
      }
    }
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="flex flex-col">
      {/* Hero Section with 3D Effects */}
      <section className="relative min-h-[90vh] overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 py-16 md:py-24 lg:py-32">
        {/* Animated 3D Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {/* Gradient orbs with 3D effect */}
          <motion.div 
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(59, 130, 246, 0.4) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
            animate={{
              x: [0, 50, 0],
              y: [0, 30, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(139, 92, 246, 0.4) 0%, transparent 70%)",
              filter: "blur(60px)",
            }}
            animate={{
              x: [0, -40, 0],
              y: [0, -40, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div 
            className="absolute top-1/2 right-1/3 w-[300px] h-[300px] rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, transparent 70%)",
              filter: "blur(50px)",
            }}
            animate={{
              x: [0, 60, 0],
              y: [0, -30, 0],
              scale: [1, 0.9, 1],
            }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />
          
          {/* Grid overlay for depth */}
          <div 
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), 
                               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
              transform: "perspective(500px) rotateX(60deg)",
              transformOrigin: "center top",
            }}
          />
          
          {/* Floating 3D elements */}
          {floatingElements.map((el, index) => (
            <motion.div
              key={index}
              className="absolute text-4xl md:text-5xl"
              style={{ left: el.x, top: el.y }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
                scale: [1, 1.2, 1],
                y: [0, -20, 0],
                rotateY: [0, 180, 360],
              }}
              transition={{
                duration: el.duration,
                delay: el.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {el.emoji}
            </motion.div>
          ))}

          {/* Particles effect */}
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={`particle-${i}`}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1.5, 0],
                y: [0, -100],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                delay: Math.random() * 3,
                repeat: Infinity,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="flex flex-col items-center text-center space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full border border-white/20 shadow-lg"
            >
              <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
              <span className="text-sm font-semibold text-white">✨ Học tiếng Anh thông minh với AI</span>
            </motion.div>

            <motion.h1
              className="text-5xl md:text-6xl lg:text-8xl font-bold tracking-tight"
              variants={fadeInUp}
            >
              <motion.span 
                className="inline-block bg-gradient-to-r from-blue-400 via-cyan-400 to-purple-400 bg-clip-text text-transparent"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{ duration: 5, repeat: Infinity }}
                style={{ backgroundSize: "200% 200%" }}
              >
                Vocaplanet
              </motion.span>
              <br />
              <span className="text-white/90 text-3xl md:text-4xl lg:text-5xl font-light mt-4 block">
                Learn & Share Words
              </span>
            </motion.h1>
            
            <motion.p
              className="text-lg md:text-xl lg:text-2xl text-blue-100/80 max-w-3xl leading-relaxed"
              variants={fadeInUp}
            >
              Nâng cao khả năng giao tiếp tiếng Anh với{" "}
              <span className="font-bold text-cyan-400">phương pháp học thông minh</span>, 
              bài học tương tác, thực hành phát âm AI và nội dung được cập nhật liên tục
            </motion.p>
            
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-8"
              variants={fadeInUp}
            >
              <Link href="/lessons">
                <Button size="lg" className="group w-full sm:w-auto text-lg px-10 py-7 rounded-2xl shadow-2xl shadow-blue-500/40 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 hover:from-blue-600 hover:via-cyan-600 hover:to-blue-700 border-0 transition-all duration-300 hover:scale-105 hover:shadow-blue-500/60">
                  <span>Bắt đầu học ngay</span>
                  <motion.span 
                    className="ml-2 inline-block"
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Button>
              </Link>
              <Link href="/progress">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg px-10 py-7 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:scale-105">
                  <Globe className="w-5 h-5 mr-2" />
                  Xem tiến độ
                </Button>
              </Link>
            </motion.div>

            {/* Stats Section */}
            <motion.div 
              className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10 mt-16 w-full max-w-4xl"
              variants={fadeInUp}
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-all duration-300"
                  whileHover={{ scale: 1.05, y: -5 }}
                >
                  <stat.icon className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                  <div className="text-3xl md:text-4xl font-bold text-white">
                    {stat.value}{stat.suffix}
                  </div>
                  <div className="text-blue-200/70 text-sm mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom wave decoration */}
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
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div className="text-center space-y-4" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Tại sao chọn Vocaplanet?
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Phương pháp học hiện đại, tập trung vào kỹ năng giao tiếp thực tế
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"
              variants={staggerContainer}
            >
              {features.map((feature, index) => (
                <motion.div 
                  key={index} 
                  variants={fadeInUp}
                  whileHover={{ y: -12, scale: 1.03 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white dark:bg-slate-800 rounded-3xl overflow-hidden group">
                    <CardHeader className="space-y-4">
                      <motion.div 
                        className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
                        whileHover={{ rotate: [0, -10, 10, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <feature.icon className="w-8 h-8 text-white" />
                      </motion.div>
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 via-blue-50/50 to-purple-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div className="text-center space-y-4" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Chủ đề học tập
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-lg max-w-2xl mx-auto">
                Chọn chủ đề phù hợp với nhu cầu và mục tiêu của bạn
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
            >
              {categories.map((category, index) => (
                <motion.div 
                  key={category.id} 
                  variants={fadeInUp}
                  whileHover={{ y: -8 }}
                >
                  <Link href={`/lessons?category=${category.id}`}>
                    <Card className="h-full cursor-pointer border-2 border-transparent hover:border-blue-400 transition-all duration-300 group bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl">
                      <CardHeader>
                        <motion.div 
                          className="text-5xl mb-4"
                          whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.4 }}
                        >
                          {category.icon}
                        </motion.div>
                        <CardTitle className="group-hover:text-blue-600 transition-colors">{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="leading-relaxed">
                          {category.description}
                        </CardDescription>
                        <div className="flex items-center gap-2 mt-4">
                          <span className="text-sm font-bold text-blue-600 dark:text-blue-400">
                            {category.lessonCount} bài học
                          </span>
                          <motion.span
                            className="text-blue-600"
                            animate={{ x: [0, 5, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity }}
                          >
                            →
                          </motion.span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 relative overflow-hidden">
        {/* Animated background */}
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
          {/* Floating shapes */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 bg-white/20 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3,
              }}
            />
          ))}
        </div>
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center text-white space-y-8"
          >
            <motion.h2 
              className="text-4xl md:text-5xl lg:text-6xl font-bold"
              animate={{ opacity: [0.9, 1, 0.9] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Sẵn sàng bắt đầu hành trình?
            </motion.h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              Tham gia cùng hàng nghìn người học và trải nghiệm phương pháp học tiếng Anh hiệu quả nhất
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/lessons">
                <Button
                  size="lg"
                  className="mt-4 text-lg px-12 py-8 rounded-2xl bg-white text-blue-600 hover:bg-blue-50 shadow-2xl shadow-black/20 font-bold"
                >
                  🚀 Bắt đầu học miễn phí
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
      </div>
    </>
  )
}
