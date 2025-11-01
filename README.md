# Vocaplanet - Learn & Share Words

Nền tảng học tiếng Anh giao tiếp với phương pháp học tương tác, thực hành thực tế và theo dõi tiến độ chi tiết.

## ✨ Tính năng

- 🎯 **Học theo chủ đề**: Các bài học được phân loại rõ ràng theo chủ đề thực tế
- 🎧 **Phát âm tự động**: Text-to-Speech tích hợp sẵn với Web Speech API
- 🎤 **Natural Voice với Emotion**: Giọng nói tự nhiên có cảm xúc (happy, sad, calm, friendly, excited)
- 👥 **Voice Alternation**: Giọng nam/nữ xen kẽ trong hội thoại
- 🇻🇳 **Vietnamese Voice**: Hỗ trợ giọng Việt Nam nói tiếng Anh
- 💬 **Thực hành giao tiếp**: Rèn luyện kỹ năng qua tình huống thực tế
- 📝 **Auto-generate Quiz**: Tự động tạo quiz từ nội dung bài học
- 🧪 **4 Quiz Types**: Multiple Choice, Fill Blank, True/False, Match
- ⏱️ **Quiz Timer**: Đếm thời gian làm bài và tracking
- 📊 **Theo dõi tiến độ**: Đo lường và theo dõi quá trình học tập chi tiết
- 🖼️ **Image Support**: 60+ ảnh minh họa từ Unsplash
- 🏷️ **Tags & Context**: Phân loại từ vựng theo tags
- 🔐 **Admin Authentication**: Đăng nhập admin với mật khẩu
- 🌓 **Dark Mode**: Chế độ sáng/tối thân thiện với mắt
- 📱 **Responsive Design**: Giao diện tối ưu trên mọi thiết bị
- ✨ **Animations mượt mà**: Hiệu ứng chuyển động với Framer Motion
- 👨‍💼 **Admin Panel**: Quản lý bài học không cần backend (localStorage)
- 📥 **Import/Export**: Nhập/xuất dữ liệu bài học dạng JSON
- 📚 **820+ Vocabulary Items**: 7 bộ từ vựng chuyên đề sẵn có
- 🔍 **Voice Debug Panel**: Test và debug giọng nói

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
- [x] Natural voice với emotion support (happy, sad, calm, friendly, etc.)
- [x] Voice gender alternation trong dialogues (nam/nữ xen kẽ)
- [x] Vietnamese voice support
- [x] Admin Dashboard với CRUD operations
- [x] Admin authentication với animated login modal
- [x] Protected routes cho admin pages
- [x] LocalStorage persistence (không cần backend)
- [x] Import/Export JSON functionality
- [x] Auto-generate quizzes từ lesson content
- [x] 4 loại quiz: Multiple Choice, Fill Blank, True/False, Match
- [x] Quiz với timer và progress tracking
- [x] 15 bài học đa dạng (13 default + 2 enhanced với images)
- [x] 820+ vocabulary items trong 7 bộ từ vựng
- [x] 60+ images từ Unsplash cho vocabulary
- [x] Tags và context cho từ vựng
- [x] Dark mode & responsive design
- [x] Animations với Framer Motion
- [x] Voice Debug Panel để test giọng nói

## � Tài liệu

- [ADMIN_LOGIN_GUIDE.md](./ADMIN_LOGIN_GUIDE.md) - Hướng dẫn đăng nhập Admin
- [VOICE_DEBUG_GUIDE.md](./VOICE_DEBUG_GUIDE.md) - Hướng dẫn debug giọng nói
- [VOCABULARY_PACKS.md](./VOCABULARY_PACKS.md) - Danh sách bộ từ vựng
- [ENHANCED_LESSONS_GUIDE.md](./ENHANCED_LESSONS_GUIDE.md) - Bài học nâng cao với images
- [IMPORT_EXPORT_GUIDE.md](./IMPORT_EXPORT_GUIDE.md) - Hướng dẫn import/export
- [QUICK_START.md](./QUICK_START.md) - Bắt đầu nhanh

## �🚀 Tính năng tương lai

- [ ] User authentication & profile management
- [ ] Lưu tiến độ học tập vào database (cloud)
- [ ] Chứng chỉ hoàn thành khóa học
- [ ] Tích hợp API phát âm chuyên nghiệp (Google/Azure TTS)
- [ ] Gamification (điểm, cấp độ, thành tựu)
- [ ] Học theo AI (gợi ý bài học phù hợp)
- [ ] Community features (chia sẻ, thảo luận)
- [ ] Spaced Repetition System (SRS)
- [ ] Speaking practice với voice recognition
- [ ] Multiplayer quiz challenges

## 📝 License

MIT License

## 👨‍💻 Author

Bùi Tuấn Anh

---

Được xây dựng với ❤️ bằng Next.js và TypeScript
