# EnglishApp - Học Tiếng Anh Giao Tiếp Hiệu Quả

Nền tảng học tiếng Anh giao tiếp với phương pháp học tương tác, thực hành thực tế và theo dõi tiến độ chi tiết.

## ✨ Tính năng

- 🎯 **Học theo chủ đề**: Các bài học được phân loại rõ ràng theo chủ đề thực tế
- 🎧 **Luyện nghe với audio**: UI hỗ trợ phát âm chuẩn (audio chưa tích hợp)
- 💬 **Thực hành giao tiếp**: Rèn luyện kỹ năng qua tình huống thực tế
- 📊 **Theo dõi tiến độ**: Đo lường và theo dõi quá trình học tập chi tiết
- 🌓 **Dark Mode**: Chế độ sáng/tối thân thiện với mắt
- 📱 **Responsive Design**: Giao diện tối ưu trên mọi thiết bị
- ✨ **Animations mượt mà**: Hiệu ứng chuyển động với Framer Motion

## 🛠️ Công nghệ sử dụng

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Theme**: next-themes

## 📦 Cài đặt

1. Clone repository:
```bash
git clone https://github.com/BuiTuanAnh2001/english-learning-app.git
cd english-learning-app
```

2. Cài đặt dependencies:
```bash
npm install
```

3. Chạy development server:
```bash
npm run dev
```

4. Mở trình duyệt tại [http://localhost:3000](http://localhost:3000)

## 🏗️ Build production

```bash
npm run build
npm start
```

## 📂 Cấu trúc thư mục

```
english-learning-app/
├── app/                      # Next.js App Router pages
│   ├── lessons/             # Trang danh sách và chi tiết bài học
│   ├── progress/            # Trang theo dõi tiến độ
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Homepage
│   └── globals.css          # Global styles
├── components/              # React components
│   ├── ui/                  # UI components (Button, Card, Badge, etc.)
│   ├── navigation/          # Navbar & Footer
│   ├── lessons/             # Lesson-related components
│   └── theme-provider.tsx   # Dark mode provider
├── lib/                     # Utilities & data
│   ├── types.ts            # TypeScript type definitions
│   ├── utils.ts            # Utility functions
│   └── data/               # Mock data
│       └── lessons.ts      # Lessons & categories data
└── public/                  # Static assets
```

## 🎨 Chủ đề học tập

- 💬 **Giao tiếp hàng ngày**: Các tình huống giao tiếp thường ngày
- 💼 **Tiếng Anh thương mại**: Tiếng Anh cho công việc và kinh doanh
- ✈️ **Tiếng Anh du lịch**: Giao tiếp khi đi du lịch nước ngoài
- 🎯 **Dành cho người mới**: Các bài học cơ bản cho người mới bắt đầu

## 📚 Bài học mẫu

1. **Chào hỏi và giới thiệu** (Beginner)
2. **Đặt hàng tại nhà hàng** (Intermediate)
3. **Họp và thuyết trình** (Advanced)
4. **Đặt phòng khách sạn** (Intermediate)

Mỗi bài học bao gồm:
- Từ vựng với phát âm và ví dụ
- Cụm từ thông dụng
- Hội thoại thực tế có dịch

## 🚀 Tính năng tương lai

- [ ] Tích hợp audio thực sự cho từ vựng và hội thoại
- [ ] Authentication & User management
- [ ] Lưu tiến độ học tập vào database
- [ ] Bài tập và quiz
- [ ] Chứng chỉ hoàn thành khóa học
- [ ] Tích hợp API phát âm thực tế
- [ ] Gamification (điểm, cấp độ, thành tựu)

## 📝 License

MIT License

## 👨‍💻 Author

Bùi Tuấn Anh

---

Được xây dựng với ❤️ bằng Next.js và TypeScript
