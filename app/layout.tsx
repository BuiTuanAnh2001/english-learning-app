import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { LessonsProvider } from "@/lib/contexts/lessons-context"
import { Navbar } from "@/components/navigation/navbar"
import { Footer } from "@/components/navigation/footer"

export const metadata: Metadata = {
  metadataBase: new URL('https://vocaplanet.online'),
  title: {
    default: 'Vocaplanet - Học Tiếng Anh Giao Tiếp Online Miễn Phí',
    template: '%s | Vocaplanet'
  },
  description:
    "Học tiếng Anh giao tiếp online miễn phí với Vocaplanet. Phương pháp học tương tác, bài tập thực hành, luyện phát âm AI, và theo dõi tiến độ chi tiết. Phù hợp mọi trình độ từ cơ bản đến nâng cao.",
  keywords: [
    "vocaplanet",
    "học tiếng anh",
    "tiếng anh giao tiếp",
    "học tiếng anh online",
    "học tiếng anh miễn phí",
    "english learning",
    "online english",
    "vocabulary learning",
    "luyện phát âm tiếng anh",
    "từ vựng tiếng anh",
    "ngữ pháp tiếng anh",
    "tiếng anh giao tiếp hàng ngày",
    "tiếng anh thương mại",
    "tiếng anh du lịch"
  ],
  authors: [{ name: 'Vocaplanet' }],
  creator: 'Vocaplanet',
  publisher: 'Vocaplanet',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: 'https://vocaplanet.online',
    title: 'Vocaplanet - Học Tiếng Anh Giao Tiếp Online Miễn Phí',
    description: 'Học tiếng Anh giao tiếp online miễn phí với phương pháp tương tác, luyện phát âm AI và theo dõi tiến độ chi tiết',
    siteName: 'Vocaplanet',
    images: [{
      url: '/og-image.jpg',
      width: 1200,
      height: 630,
      alt: 'Vocaplanet - Học Tiếng Anh Online'
    }]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Vocaplanet - Học Tiếng Anh Giao Tiếp Online Miễn Phí',
    description: 'Học tiếng Anh giao tiếp online miễn phí với phương pháp tương tác và luyện phát âm AI',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/icon.svg',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    name: 'Vocaplanet',
    description: 'Nền tảng học tiếng Anh giao tiếp online miễn phí',
    url: 'https://vocaplanet.online',
    logo: 'https://vocaplanet.online/logo.png',
    sameAs: [
      'https://www.facebook.com/vocaplanet',
      'https://twitter.com/vocaplanet'
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'Customer Service',
      availableLanguage: ['vi', 'en']
    }
  }

  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3B82F6" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Vocaplanet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
