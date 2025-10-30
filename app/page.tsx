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
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 py-20 md:py-32">
        <div className="container mx-auto px-4">
          <motion.div
            className="flex flex-col items-center text-center space-y-8"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.h1
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent"
              variants={fadeInUp}
            >
              Học Tiếng Anh Giao Tiếp Hiệu Quả
            </motion.h1>
            <motion.p
              className="text-lg md:text-xl text-muted-foreground max-w-2xl leading-relaxed"
              variants={fadeInUp}
            >
              Nâng cao khả năng giao tiếp tiếng Anh của bạn với các bài học
              tương tác, thực hành thực tế và phương pháp học hiện đại
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4"
              variants={fadeInUp}
            >
              <Link href="/lessons">
                <Button size="lg" className="w-full sm:w-auto">
                  Bắt đầu học ngay
                </Button>
              </Link>
              <Link href="/lessons">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Xem bài học
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-secondary/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2"></div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div className="text-center space-y-4" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold">
                Tại sao chọn EnglishApp?
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Phương pháp học hiện đại, tập trung vào kỹ năng giao tiếp thực tế
              </p>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
              variants={staggerContainer}
            >
              {features.map((feature, index) => (
                <motion.div key={index} variants={fadeInUp}>
                  <Card className="h-full hover:border-primary transition-colors">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center mb-4">
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-xl">{feature.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="leading-relaxed">
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
      <section className="py-16 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="space-y-12"
          >
            <motion.div className="text-center space-y-4" variants={fadeInUp}>
              <h2 className="text-3xl md:text-4xl font-bold">
                Chủ đề học tập
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
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
