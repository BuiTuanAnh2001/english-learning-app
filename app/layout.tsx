import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { LessonsProvider } from "@/lib/contexts/lessons-context"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/navigation/footer"

export const metadata: Metadata = {
  title: "Vocaplanet - Learn & Share Words",
  description:
    "Nền tảng học tiếng Anh giao tiếp với phương pháp học tương tác, thực hành thực tế và theo dõi tiến độ chi tiết. Vocaplanet - Learn & Share Words.",
  keywords: [
    "vocaplanet",
    "học tiếng anh",
    "tiếng anh giao tiếp",
    "english learning",
    "online english",
    "vocabulary learning",
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
          <AuthProvider>
            <LessonsProvider>
              <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1">{children}</main>
                <Footer />
              </div>
            </LessonsProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
