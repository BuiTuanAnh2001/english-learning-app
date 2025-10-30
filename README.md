# EnglishApp - Học Tiếng Anh Giao Tiếp Hiệu Quả

Nền tảng học tiếng Anh giao tiếp với phương pháp học tương tác, thực hành thực tế và theo dõi tiến độ chi tiết.

## ✨ Tính năng

- 🎯 **Học theo chủ đề**: Các bài học được phân loại rõ ràng theo chủ đề thực tế
- 🎧 **Phát âm tự động**: Text-to-Speech tích hợp sẵn với Web Speech API
- 💬 **Thực hành giao tiếp**: Rèn luyện kỹ năng qua tình huống thực tế
- 📊 **Theo dõi tiến độ**: Đo lường và theo dõi quá trình học tập chi tiết
- 🌓 **Dark Mode**: Chế độ sáng/tối thân thiện với mắt
- 📱 **Responsive Design**: Giao diện tối ưu trên mọi thiết bị
- ✨ **Animations mượt mà**: Hiệu ứng chuyển động với Framer Motion
- 👨‍💼 **Admin Panel**: Quản lý bài học không cần backend (localStorage)
- 📥 **Import/Export**: Nhập/xuất dữ liệu bài học dạng JSON
- 📚 **820+ Vocabulary Items**: 7 bộ từ vựng chuyên đề sẵn có

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

## 📚 Nội dung học tập

### 13 Bài học có sẵn
1. **Chào hỏi và giới thiệu** (Beginner)
2. **Đặt hàng tại nhà hàng** (Intermediate)
3. **Họp và thuyết trình** (Advanced)
4. **Đặt phòng khách sạn** (Intermediate)
5. **Mua sắm tại cửa hàng** (Beginner)
6. **Hỏi đường và chỉ đường** (Beginner)
7. **Gọi điện thoại** (Intermediate)
8. **Email công việc** (Advanced)
9. **Phỏng vấn xin việc** (Advanced)
10. **Đặt vé máy bay** (Intermediate)
11. **Khám bệnh** (Intermediate)
12. **Mở tài khoản ngân hàng** (Intermediate)
13. **Thư giãn và sở thích** (Beginner)

### 7 Bộ từ vựng chuyên đề (820+ items) ⚡ Tự động load sẵn!
1. **100 Basic Verbs** - Động từ cơ bản
2. **150 Adjectives** - Tính từ phổ biến
3. **100 Adverbs** - Trạng từ thông dụng
4. **150 Common Phrases** - Cụm từ giao tiếp
5. **100 Business Vocabulary** - Từ vựng kinh doanh
6. **100 Travel Vocabulary** - Từ vựng du lịch
7. **120 Food & Cooking** - Đồ ăn & nấu ăn

📖 **Xem chi tiết**: [VOCABULARY_PACKS.md](./VOCABULARY_PACKS.md)

> 💡 **Không cần import thủ công!** Tất cả 7 bộ từ vựng được tích hợp sẵn và tự động load khi khởi động app. Bạn sẽ thấy **20 lessons** (13 bài học + 7 vocab packs) ngay từ lần đầu tiên vào web!

Mỗi bài học bao gồm:
- Từ vựng với phát âm IPA và ví dụ
- Cụm từ thông dụng với cách sử dụng
- Hội thoại thực tế có dịch
- Phát âm tự động (Text-to-Speech)

## 🎯 Tính năng đã hoàn thành

- [x] Text-to-Speech với Web Speech API
- [x] Admin Dashboard với CRUD operations
- [x] LocalStorage persistence (không cần backend)
- [x] Import/Export JSON functionality
- [x] 13 bài học đa dạng
- [x] 820+ vocabulary items trong 7 bộ từ vựng
- [x] Dark mode & responsive design
- [x] Animations với Framer Motion

## 🚀 Tính năng tương lai

- [ ] Authentication & User management
- [ ] Lưu tiến độ học tập vào database (cloud)
- [ ] Bài tập và quiz tương tác
- [ ] Chứng chỉ hoàn thành khóa học
- [ ] Tích hợp API phát âm chuyên nghiệp
- [ ] Gamification (điểm, cấp độ, thành tựu)
- [ ] Học theo AI (gợi ý bài học phù hợp)
- [ ] Community features (chia sẻ, thảo luận)

## 📝 License

MIT License

## 👨‍💻 Author

Bùi Tuấn Anh

---

Được xây dựng với ❤️ bằng Next.js và TypeScript
