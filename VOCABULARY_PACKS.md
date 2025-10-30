# 📚 Vocabulary Packs - Bộ Từ Vựng Tiếng Anh

## 🎯 Tổng quan

Ứng dụng cung cấp **820+ từ vựng và cụm từ** trong 7 bộ từ vựng chuyên đề, giúp bạn học tiếng Anh hiệu quả theo từng chủ đề cụ thể.

## 📦 Danh sách các bộ từ vựng

### 1. **100 Basic Verbs** (100 động từ cơ bản)
- **File**: `100-basic-verbs.json`
- **Nội dung**: 100 động từ thông dụng nhất
- **Level**: Beginner
- **Thời lượng**: ~30 phút
- **Ví dụ**: Be, Have, Do, Say, Get, Make, Go, Know, Take, See...

### 2. **150 Adjectives** (150 tính từ phổ biến)
- **File**: `150-adjectives.json`
- **Nội dung**: 150 tính từ mô tả người, vật, sự việc
- **Level**: Beginner
- **Thời lượng**: ~50 phút
- **Ví dụ**: Good, New, Big, Small, Happy, Beautiful, Hot, Cold...

### 3. **100 Adverbs** (100 trạng từ thông dụng)
- **File**: `100-adverbs.json`
- **Nội dung**: 100 trạng từ bổ nghĩa động từ, tính từ
- **Level**: Beginner
- **Thời lượng**: ~30 phút
- **Ví dụ**: Very, Also, Well, Always, Never, Often, Quickly, Slowly...

### 4. **150 Common Phrases** (150 cụm từ giao tiếp)
- **File**: `150-phrases.json`
- **Nội dung**: 150 cụm từ và câu giao tiếp hàng ngày
- **Level**: Beginner
- **Thời lượng**: ~40 phút
- **Ví dụ**: Thank you, I'm sorry, How are you?, See you later...

### 5. **100 Business Vocabulary** (100 từ kinh doanh)
- **File**: `100-business.json`
- **Nội dung**: Từ vựng môi trường làm việc và kinh doanh
- **Level**: Intermediate
- **Thời lượng**: ~35 phút
- **Ví dụ**: Meeting, Manager, Contract, Project, Deadline, Report...

### 6. **100 Travel Vocabulary** (100 từ du lịch)
- **File**: `100-travel.json`
- **Nội dung**: Từ vựng cần thiết khi đi du lịch
- **Level**: Beginner
- **Thời lượng**: ~35 phút
- **Ví dụ**: Passport, Flight, Hotel, Ticket, Reservation, Airport...

### 7. **120 Food & Cooking** (120 từ đồ ăn & nấu ăn)
- **File**: `120-food-cooking.json`
- **Nội dung**: Từ vựng về thực phẩm, đồ uống và nấu ăn
- **Level**: Beginner
- **Thời lượng**: ~40 phút
- **Ví dụ**: Breakfast, Fruit, Vegetable, Cook, Delicious, Recipe...

## 📊 Thống kê tổng hợp

```
Tổng số từ vựng: 820+ items
- Động từ: 100
- Tính từ: 150
- Trạng từ: 100
- Cụm từ giao tiếp: 150
- Từ vựng chuyên ngành: 320
```

## 🚀 Cách sử dụng

### Option 1: Import trực tiếp từ ứng dụng

1. Vào trang **Admin Dashboard** (`/admin`)
2. Click nút **"📥 Import Lessons"**
3. Chọn file JSON từ thư mục `public/vocab-packs/`
4. Click **"Open"** để import

### Option 2: Download và Import

1. Truy cập: `http://your-app-url/vocab-packs/[filename].json`
2. Download file về máy
3. Vào Admin Dashboard
4. Import file đã download

### Option 3: Bulk Import (Import hàng loạt)

Bạn có thể import tất cả các file cùng lúc bằng cách:

1. Mở Admin Dashboard
2. Import lần lượt từng file theo thứ tự:
   - `100-basic-verbs.json`
   - `150-adjectives.json`
   - `100-adverbs.json`
   - `150-phrases.json`
   - `100-business.json`
   - `100-travel.json`
   - `120-food-cooking.json`

## ✨ Tính năng mỗi bài học

Mỗi từ vựng bao gồm:
- ✅ **Word**: Từ tiếng Anh
- ✅ **Pronunciation**: Phiên âm IPA
- ✅ **Meaning**: Nghĩa tiếng Việt
- ✅ **Example**: Câu ví dụ
- ✅ **Audio**: Phát âm bằng giọng nói (Text-to-Speech)

Mỗi cụm từ bao gồm:
- ✅ **Phrase**: Cụm từ tiếng Anh
- ✅ **Meaning**: Nghĩa tiếng Việt
- ✅ **Usage**: Cách sử dụng
- ✅ **Audio**: Phát âm bằng giọng nói

## 🎓 Lộ trình học tập đề xuất

### Level 1: Beginner (Người mới bắt đầu)
1. 100 Basic Verbs (động từ cơ bản)
2. 150 Adjectives (tính từ phổ biến)
3. 150 Common Phrases (cụm từ giao tiếp)
4. 100 Adverbs (trạng từ)

### Level 2: Everyday Life (Đời sống hàng ngày)
5. 120 Food & Cooking (đồ ăn & nấu ăn)

### Level 3: Specialized (Chuyên ngành)
6. 100 Travel Vocabulary (du lịch)
7. 100 Business Vocabulary (kinh doanh)

## 💡 Tips học tập hiệu quả

1. **Chia nhỏ mục tiêu**: Học 10-20 từ mỗi ngày
2. **Lặp lại thường xuyên**: Ôn tập các từ đã học
3. **Sử dụng phát âm**: Click nút 🔊 để nghe phát âm chuẩn
4. **Tạo câu ví dụ**: Áp dụng từ vào câu của riêng bạn
5. **Học theo chủ đề**: Tập trung vào chủ đề bạn cần nhất

## 📝 Format file JSON

Mỗi file vocabulary pack có cấu trúc:

```json
[
  {
    "id": "unique-id",
    "title": "Tiêu đề bài học",
    "category": "daily/business/travel/beginner",
    "level": "beginner/intermediate/advanced",
    "description": "Mô tả bài học",
    "duration": "30 phút",
    "vocabulary": [
      {
        "word": "Example",
        "pronunciation": "/ɪɡˈzæmpl/",
        "meaning": "Ví dụ",
        "example": "For example..."
      }
    ],
    "phrases": [],
    "dialogues": []
  }
]
```

## 🔄 Cập nhật

Các bộ từ vựng được tạo ngày: **30/10/2024**

Nếu cần thêm từ vựng hoặc chủ đề mới, bạn có thể:
1. Tạo file JSON mới theo format trên
2. Đặt trong thư mục `public/vocab-packs/`
3. Import vào ứng dụng

## 🎯 Mục tiêu

Với **820+ từ vựng**, bạn có thể:
- ✅ Giao tiếp cơ bản trong đời sống hàng ngày
- ✅ Đọc hiểu văn bản đơn giản
- ✅ Viết email và tin nhắn cơ bản
- ✅ Đi du lịch tự tin
- ✅ Làm việc trong môi trường quốc tế

## 📞 Hỗ trợ

Nếu có thắc mắc hoặc cần thêm từ vựng, vui lòng liên hệ hoặc tạo issue trên GitHub.

---

**Happy Learning! 🎉**
