# 🚀 Quick Start - Hướng dẫn Nhanh

## 📦 Bạn đã có gì?

✅ **13 bài học** đa dạng từ Beginner đến Advanced
✅ **820+ từ vựng** trong 7 bộ từ vựng chuyên đề
✅ **Admin Dashboard** quản lý bài học dễ dàng
✅ **Import/Export** dữ liệu JSON
✅ **Text-to-Speech** phát âm tự động
✅ **Dark Mode** & Responsive Design

---

## 🎯 Bắt đầu ngay

### 1. Cài đặt và chạy

```bash
# Clone repository
git clone https://github.com/BuiTuanAnh2001/english-learning-app.git
cd english-learning-app

# Cài đặt
npm install

# Chạy development
npm run dev

# Mở http://localhost:3000
```

### 2. Import Vocabulary Packs

**Cách 1: Tự động (Recommended)**

Truy cập: `http://localhost:3000/admin` và import lần lượt:

1. `100-basic-verbs.json` (100 động từ)
2. `150-adjectives.json` (150 tính từ)
3. `100-adverbs.json` (100 trạng từ)
4. `150-phrases.json` (150 cụm từ)
5. `100-business.json` (100 từ kinh doanh)
6. `100-travel.json` (100 từ du lịch)
7. `120-food-cooking.json` (120 từ đồ ăn)

**Cách 2: Script tự động (Coming soon)**

---

## 📚 Cấu trúc Nội dung

### 13 Bài học có sẵn

| Category | Bài học | Level |
|----------|---------|-------|
| Daily | Chào hỏi và giới thiệu | Beginner |
| Daily | Đặt hàng tại nhà hàng | Intermediate |
| Daily | Mua sắm tại cửa hàng | Beginner |
| Daily | Hỏi đường và chỉ đường | Beginner |
| Daily | Gọi điện thoại | Intermediate |
| Daily | Khám bệnh | Intermediate |
| Daily | Thư giãn và sở thích | Beginner |
| Business | Họp và thuyết trình | Advanced |
| Business | Email công việc | Advanced |
| Business | Phỏng vấn xin việc | Advanced |
| Travel | Đặt phòng khách sạn | Intermediate |
| Travel | Đặt vé máy bay | Intermediate |
| Travel | Mở tài khoản ngân hàng | Intermediate |

### 7 Bộ từ vựng (820 items)

| Pack | Items | Category | Level |
|------|-------|----------|-------|
| Basic Verbs | 100 | Beginner | Beginner |
| Adjectives | 150 | Beginner | Beginner |
| Adverbs | 100 | Beginner | Beginner |
| Common Phrases | 150 | Daily | Beginner |
| Business Vocab | 100 | Business | Intermediate |
| Travel Vocab | 100 | Travel | Beginner |
| Food & Cooking | 120 | Daily | Beginner |

---

## 🎓 Lộ trình học đề xuất

### Tuần 1-2: Nền tảng (Foundation)
```
✓ 100 Basic Verbs
✓ 150 Adjectives  
✓ 150 Common Phrases
✓ Bài: Chào hỏi và giới thiệu
✓ Bài: Mua sắm tại cửa hàng
```

### Tuần 3-4: Giao tiếp hàng ngày
```
✓ 100 Adverbs
✓ 120 Food & Cooking
✓ Bài: Đặt hàng tại nhà hàng
✓ Bài: Hỏi đường
✓ Bài: Gọi điện thoại
```

### Tuần 5-6: Chuyên ngành
```
✓ 100 Travel Vocabulary (nếu du lịch)
✓ 100 Business Vocabulary (nếu làm việc)
✓ Các bài travel/business tương ứng
```

---

## 🛠️ Tính năng Admin

Truy cập: `/admin`

### Quản lý bài học
- ➕ **Create**: Tạo bài học mới
- ✏️ **Edit**: Chỉnh sửa bài học
- 🗑️ **Delete**: Xóa bài học
- 🔍 **Search**: Tìm kiếm theo tên
- 🏷️ **Filter**: Lọc theo danh mục

### Import/Export
- 📥 **Import**: Nhập bài học từ JSON
- 📤 **Export**: Xuất tất cả bài học
- 📄 **Template**: Tải file mẫu

---

## 📱 Tính năng cho Người học

### Trang chủ (`/`)
- Hiển thị tổng quan categories
- Quick access đến bài học

### Danh sách bài học (`/lessons`)
- Xem tất cả bài học
- Filter theo category và level
- Progress tracking

### Chi tiết bài học (`/lessons/[id]`)
- 📖 Vocabulary với IPA pronunciation
- 💬 Common phrases
- 🎭 Dialogues với translation
- 🔊 Text-to-Speech cho tất cả

### Theo dõi tiến độ (`/progress`)
- Xem tiến độ từng category
- Statistics và insights

---

## 🎨 Customization

### Theme
- Light mode / Dark mode toggle
- Tự động theo system preference

### Phát âm
- Click icon 🔊 để nghe
- Sử dụng Web Speech API
- Hỗ trợ giọng English (US/UK)

---

## 📖 Documentation Files

1. **README.md** - Tổng quan dự án
2. **VOCABULARY_PACKS.md** - Chi tiết 7 bộ từ vựng
3. **IMPORT_EXPORT_GUIDE.md** - Hướng dẫn Import/Export
4. **DEPLOY_GUIDE.md** - Hướng dẫn deploy
5. **DEPLOYMENT.md** - Chi tiết deployment
6. **CHANGELOG.md** - Lịch sử cập nhật

---

## 🚀 Deploy to Production

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Production
vercel --prod
```

### Netlify

```bash
# Build
npm run build

# Deploy folder: .next
```

### Docker

```bash
# Build image
docker build -t english-app .

# Run
docker run -p 3000:3000 english-app
```

---

## 💡 Tips sử dụng

1. **Học từ vựng trước**: Import và học qua các bộ vocab
2. **Thực hành với bài học**: Áp dụng từ vựng vào dialogues
3. **Lặp lại nhiều lần**: Dùng tính năng phát âm
4. **Tạo bài riêng**: Dùng Admin để tạo bài theo nhu cầu
5. **Backup thường xuyên**: Export data định kỳ

---

## 🆘 Troubleshooting

### Không nghe được phát âm?
- Kiểm tra browser support Web Speech API
- Chrome, Edge: ✅ Full support
- Firefox, Safari: ⚠️ Limited support

### Import bị lỗi?
- Check JSON format
- Dùng file template làm mẫu
- Xem console logs

### Mất dữ liệu?
- Data lưu trong localStorage
- Clear cache = mất data
- Nên Export backup thường xuyên

---

## 📞 Support

- **Issues**: GitHub Issues
- **Email**: [your-email]
- **Documentation**: Xem các file .md trong repo

---

**Happy Learning! 🎉📚**

Made with ❤️ using Next.js, TypeScript & Tailwind CSS
