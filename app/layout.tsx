import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/navigation/footer"

export const metadata: Metadata = {
  title: "EnglishApp - Học Tiếng Anh Giao Tiếp Hiệu Quả",
  description:
    "Nền tảng học tiếng Anh giao tiếp với phương pháp học tương tác, thực hành thực tế và theo dõi tiến độ chi tiết.",
  keywords: [
    "học tiếng anh",
    "tiếng anh giao tiếp",
    "english learning",
    "online english",
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
