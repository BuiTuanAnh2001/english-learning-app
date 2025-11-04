import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail } from "lucide-react"
import { PageViewCounter } from "@/components/analytics/page-view-counter"

export function Footer() {
  return (
    <footer className="w-full border-t bg-gradient-to-r from-primary/5 via-secondary/5 to-accent/5">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* About */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              {/* V Icon - smaller version */}
              <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 shadow-md">
                <span className="text-xl font-black text-white">V</span>
                <div className="absolute -bottom-0.5 left-2.5 w-2.5 h-2.5 bg-orange-500 transform rotate-45 rounded-sm"></div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">Vocaplanet</h3>
                <p className="text-xs text-muted-foreground -mt-0.5">Learn & Share Words</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Nền tảng học tiếng Anh giao tiếp hiệu quả với phương pháp học
              tương tác và thực hành thực tế.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-lg font-bold mb-4">Liên kết</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link
                  href="/lessons"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Bài học
                </Link>
              </li>
              <li>
                <Link
                  href="/progress"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Tiến độ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h3 className="text-lg font-bold mb-4">Kết nối với chúng tôi</h3>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              &copy; {new Date().getFullYear()} Vocaplanet. All rights reserved.
            </p>
            <PageViewCounter />
          </div>
        </div>
      </div>
    </footer>
  )
}
