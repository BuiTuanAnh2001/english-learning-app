'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Headphones, MessageCircle, BarChart } from "lucide-react"
import { categories } from "@/lib/data/lessons"

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

const features = [
  {
    icon: Target,
    title: "Học theo chủ đề",
    description: "Các bài học được phân loại theo chủ đề thực tế như giao tiếp hàng ngày, công việc, du lịch.",
  },
  {
    icon: Headphones,
    title: "Luyện nghe với audio",
    description: "Học phát âm chuẩn với các đoạn hội thoại thực tế từ người bản xứ.",
  },
  {
    icon: MessageCircle,
    title: "Thực hành giao tiếp",
    description: "Rèn luyện kỹ năng giao tiếp qua các tình huống thực tế trong cuộc sống.",
  },
  {
    icon: BarChart,
    title: "Theo dõi tiến độ",
    description: "Đo lường và theo dõi quá trình học tập của bạn một cách chi tiết.",
  },
]

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-16 md:py-24 lg:py-32">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-3xl" />
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
              className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-200 dark:border-slate-700 shadow-sm"
            >
              <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">✨ Học tiếng Anh thông minh hơn</span>
            </motion.div>

            <motion.h1
              className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight"
              variants={fadeInUp}
            >
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Vocaplanet
              </span>
              <br />
              <span className="text-slate-800 dark:text-slate-200 text-3xl md:text-4xl lg:text-5xl">
                Learn & Share Words
              </span>
            </motion.h1>
            <motion.p
              className="text-base md:text-lg lg:text-xl text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed"
              variants={fadeInUp}
            >
              Nâng cao khả năng giao tiếp tiếng Anh với <span className="font-bold text-blue-600 dark:text-blue-400">phương pháp học thông minh</span>, 
              bài học tương tác, thực hành phát âm AI và nội dung được cập nhật liên tục
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeInUp}
            >
              <Link href="/lessons">
                <Button size="lg" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl shadow-lg shadow-blue-500/30 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700">
                  Bắt đầu học ngay
                </Button>
              </Link>
              <Link href="/progress">
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-base px-8 py-6 rounded-xl border-2 hover:bg-white dark:hover:bg-slate-800">
                  Xem tiến độ
                </Button>
              </Link>
            </motion.div>
          </motion.div>
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
                  whileHover={{ y: -8, scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-2xl transition-all duration-300 bg-white dark:bg-slate-800 rounded-2xl overflow-hidden">
                    <CardHeader className="space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                        <feature.icon className="w-7 h-7 text-white" />
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
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-slate-950 dark:to-slate-900">
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
              {categories.map((category) => (
                <motion.div key={category.id} variants={fadeInUp}>
                  <Link href={`/lessons?category=${category.id}`}>
                    <Card className="h-full cursor-pointer hover:border-primary transition-all group">
                      <CardHeader>
                        <div className="text-4xl mb-4 group-hover:scale-110 transition-transform">
                          {category.icon}
                        </div>
                        <CardTitle>{category.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="leading-relaxed">
                          {category.description}
                        </CardDescription>
                        <p className="text-sm text-primary font-medium mt-4">
                          {category.lessonCount} bài học
                        </p>
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
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary via-secondary to-accent">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center text-white space-y-6"
          >
            <h2 className="text-3xl md:text-4xl font-bold">
              Sẵn sàng bắt đầu hành trình học tiếng Anh?
            </h2>
            <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
              Tham gia ngay hôm nay và trải nghiệm phương pháp học hiệu quả
            </p>
            <Link href="/lessons">
              <Button
                size="lg"
                variant="secondary"
                className="mt-4"
              >
                Bắt đầu học miễn phí
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
