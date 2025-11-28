# 📚 Hướng dẫn thêm nội dung vào ứng dụng

## 🎯 Tổng quan

Đã tạo các script để thêm nhiều bài học, từ vựng, cụm từ và hội thoại mới vào database.

## 📦 Nội dung được thêm

### Bài học cơ bản (Beginner)
1. **Colors and Shapes** - Màu sắc và Hình dạng
2. **Numbers and Counting** - Số đếm
3. **Days, Months and Seasons** - Ngày tháng và Mùa

### Giao tiếp hàng ngày (Daily)
4. **At the Supermarket** - Ở siêu thị
5. **At the Doctor** - Khám bệnh
6. **Making Phone Calls** - Gọi điện thoại
7. **Small Talk** - Trò chuyện xã giao
8. **At the Restaurant** - Ở nhà hàng

### Kinh doanh (Business)
9. **Business Meetings** - Họp công việc
10. **Email Writing** - Viết email công việc

### Du lịch (Travel)
11. **At the Hotel** - Ở khách sạn
12. **Airport and Flight** - Sân bay và Chuyến bay

### Nâng cao (Advanced)
13. **Common English Idioms** - Thành ngữ tiếng Anh
14. **Essential Phrasal Verbs** - Cụm động từ thiết yếu
15. **Academic Vocabulary** - Từ vựng học thuật

## 🚀 Cách chạy

### Cách 1: Chạy script tổng hợp (Khuyên dùng)

```bash
chmod +x scripts/populate-content.sh
./scripts/populate-content.sh
```

### Cách 2: Chạy từng script riêng lẻ

```bash
# Thêm 10 bài học cơ bản
node scripts/add-more-lessons.js

# Thêm nội dung nâng cao
node scripts/add-advanced-content.js
```

## 📊 Thống kê nội dung

| Loại | Số lượng |
|------|----------|
| Bài học mới | 15 bài |
| Từ vựng | 180+ từ |
| Cụm từ | 50+ cụm |
| Hội thoại | 10+ đoạn |
| Categories | 4 loại |

## 📖 Chi tiết từng bài học

### 1. Colors and Shapes
- **Từ vựng**: 10 từ (Red, Blue, Green, Circle, Square...)
- **Cụm từ**: 3 cụm
- **Thời lượng**: 15 phút

### 2. Numbers and Counting
- **Từ vựng**: 10 từ (One, Two, Ten, Hundred...)
- **Cụm từ**: 3 cụm
- **Thời lượng**: 20 phút

### 3. Days, Months and Seasons
- **Từ vựng**: 10 từ (Monday, January, Spring...)
- **Hội thoại**: 1 đoạn
- **Thời lượng**: 18 phút

### 4. At the Supermarket
- **Từ vựng**: 10 từ (Aisle, Cart, Receipt, Discount...)
- **Hội thoại**: 1 đoạn (Shopping conversation)
- **Cụm từ**: 4 cụm
- **Thời lượng**: 25 phút

### 5. At the Doctor
- **Từ vựng**: 10 từ (Symptom, Fever, Prescription...)
- **Hội thoại**: 1 đoạn (Doctor visit)
- **Thời lượng**: 22 phút

### 6. Making Phone Calls
- **Từ vựng**: 10 từ (Dial, Extension, Voicemail...)
- **Cụm từ**: 4 cụm
- **Thời lượng**: 20 phút

### 7. Business Meetings
- **Từ vựng**: 10 từ (Agenda, Budget, Deadline...)
- **Cụm từ**: 4 cụm
- **Thời lượng**: 30 phút

### 8. Email Writing
- **Từ vựng**: 10 từ (Subject line, Attachment, Recipient...)
- **Cụm từ**: 4 cụm
- **Thời lượng**: 25 phút

### 9. At the Hotel
- **Từ vựng**: 10 từ (Reservation, Check-in, Suite...)
- **Hội thoại**: 1 đoạn (Hotel check-in)
- **Thời lượng**: 23 phút

### 10. Airport and Flight
- **Từ vựng**: 10 từ (Boarding pass, Gate, Customs...)
- **Cụm từ**: 4 cụm
- **Thời lượng**: 28 phút

### 11. Common English Idioms
- **Từ vựng**: 10 idioms (Break the ice, Piece of cake...)
- **Cụm từ**: 5 cụm
- **Thời lượng**: 35 phút

### 12. Essential Phrasal Verbs
- **Từ vựng**: 15 phrasal verbs (Look up, Give up, Turn down...)
- **Cụm từ**: 4 cụm
- **Thời lượng**: 30 phút

### 13. Small Talk
- **Từ vựng**: 10 từ (How have you been, Catch up...)
- **Hội thoại**: 1 đoạn (Meeting old friend)
- **Cụm từ**: 4 cụm
- **Thời lượng**: 25 phút

### 14. Academic Vocabulary
- **Từ vựng**: 10 từ (Analyze, Hypothesis, Methodology...)
- **Cụm từ**: 4 cụm
- **Thời lượng**: 40 phút

### 15. At the Restaurant
- **Từ vựng**: 12 từ (Menu, Appetizer, Dessert...)
- **Hội thoại**: 1 đoạn (Ordering food)
- **Cụm từ**: 4 cụm
- **Thời lượng**: 28 phút

## 🎨 Tính năng của các bài học

- ✅ Phát âm chuẩn (IPA)
- ✅ Ví dụ câu cho mỗi từ
- ✅ Hội thoại thực tế với gender (male/female) cho text-to-speech
- ✅ Cụm từ thông dụng với ngữ cảnh sử dụng
- ✅ Phân loại theo cấp độ (beginner/intermediate/advanced)
- ✅ Ước tính thời gian học

## 🔄 Xóa dữ liệu (nếu cần)

```bash
# Xóa tất cả bài học
npx prisma db push --force-reset

# Sau đó chạy lại migration
npx prisma db push

# Và thêm lại dữ liệu
./scripts/populate-content.sh
```

## 📝 Ghi chú

- Tất cả categories sẽ được tự động tạo nếu chưa có
- Script sử dụng `upsert` để tránh trùng lặp categories
- Mỗi bài học có ID riêng và liên kết với vocabulary, phrases, dialogues
- Hỗ trợ text-to-speech với gender cho dialogues

## 🐛 Troubleshooting

### Lỗi "Cannot read properties of undefined"
- **Nguyên nhân**: Categories chưa được tạo
- **Giải pháp**: Script đã tự động tạo categories bằng `upsert`

### Lỗi "Prisma Client not generated"
```bash
npx prisma generate
```

### Database connection error
```bash
# Kiểm tra DATABASE_URL trong .env
npx prisma db push
```

## 📞 Liên hệ

Nếu cần thêm nội dung hoặc có lỗi, vui lòng báo cáo.
