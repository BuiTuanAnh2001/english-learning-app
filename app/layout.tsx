import SessionProvider from "@/components/auth/session-provider";
import { ThemeProvider } from "@/components/theme-provider";
import { RealtimeProvider } from "@/lib/realtime-context";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("http://localhost:3000"),
  title: {
    default: "ChatApp - Kết nối mọi nơi, trò chuyện không giới hạn",
    template: "%s | ChatApp",
  },
  description:
    "Ứng dụng chat thời gian thực với Supabase, Google OAuth, Apple login, chat nhóm và nhiều tính năng hiện đại",
  keywords: [
    "chat",
    "messaging",
    "realtime",
    "google oauth",
    "apple login",
    "group chat",
    "supabase",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#06B6D4" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="ChatApp" />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          <SessionProvider>
            <RealtimeProvider>{children}</RealtimeProvider>
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
