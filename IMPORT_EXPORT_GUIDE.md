# 📚 Hướng dẫn Import/Export Bài học

## 🎯 Giới thiệu

Ứng dụng hỗ trợ Import/Export bài học dưới dạng file JSON, cho phép bạn:
- Sao lưu dữ liệu bài học
- Chia sẻ bài học với người khác
- Tạo bài học offline rồi import vào app
- Cập nhật nhiều bài học cùng lúc

## 📥 Import Bài học

### Cách 1: Sử dụng giao diện Admin

1. Vào trang **Admin** (`/admin`)
2. Click nút **"Import"** ở góc trên bên phải
3. Chọn file JSON chứa bài học
4. Hệ thống sẽ tự động:
   - Kiểm tra định dạng
   - Thêm bài học mới
   - Cập nhật bài học đã tồn tại (nếu có ID trùng)
   - Cập nhật số lượng bài học theo danh mục

### Cách 2: Tạo bài học từ Template

1. Click nút **"Tải mẫu"** để tải file template
2. Mở file `lesson-template.json`
3. Chỉnh sửa nội dung theo bài học của bạn
4. Import file đã chỉnh sửa vào hệ thống

## 📤 Export Bài học

### Export tất cả bài học

1. Vào trang **Admin** (`/admin`)
2. Click nút **"Export"**
3. File JSON sẽ được tải xuống với tên: `lessons-[timestamp].json`
4. File này chứa TẤT CẢ bài học trong hệ thống

### Sử dụng file Export

- **Sao lưu**: Lưu file để phòng trường hợp mất dữ liệu
- **Chia sẻ**: Gửi file cho người khác để họ import
- **Chỉnh sửa hàng loạt**: Mở file, sửa nhiều bài cùng lúc, rồi import lại

## 📝 Cấu trúc File JSON

### Cấu trúc cơ bản

```json
[
  {
    "id": "1",
    "title": "Tên bài học",
    "category": "daily",
    "level": "beginner",
    "description": "Mô tả bài học",
    "duration": "15 phút",
    "completed": false,
    "progress": 0,
    "vocabulary": [...],
    "phrases": [...],
    "dialogues": [...]
  }
]
```

### Các trường bắt buộc

- **id**: ID duy nhất (string) - Có thể để "auto-generated" khi import
- **title**: Tên bài học (string)
- **category**: Danh mục - `daily`, `business`, `travel`, hoặc `beginner`
- **level**: Cấp độ - `beginner`, `intermediate`, hoặc `advanced`
- **description**: Mô tả ngắn (string)
- **duration**: Thời lượng (string) - VD: "15 phút"

### Cấu trúc Vocabulary

```json
"vocabulary": [
  {
    "word": "Hello",
    "pronunciation": "/həˈloʊ/",
    "meaning": "Xin chào",
    "example": "Hello! How are you?"
  }
]
```

### Cấu trúc Phrases

```json
"phrases": [
  {
    "phrase": "How are you?",
    "meaning": "Bạn khỏe không?",
    "example": "Hi! How are you? - I'm fine, thanks!"
  }
]
```

### Cấu trúc Dialogues

```json
"dialogues": [
  {
    "speaker": "A",
    "text": "Hello!",
    "translation": "Xin chào!"
  },
  {
    "speaker": "B",
    "text": "Hi there!",
    "translation": "Chào bạn!"
  }
]
```

## ✅ Tips và Best Practices

### 1. Validate JSON trước khi Import

Sử dụng các tool online để kiểm tra:
- https://jsonlint.com/
- https://jsonformatter.org/

### 2. Backup thường xuyên

- Export bài học mỗi tuần
- Lưu nhiều phiên bản backup
- Đặt tên file có ngày tháng: `lessons-2024-10-30.json`

### 3. Tạo bài học ngoại tuyến

1. Copy file template
2. Tạo nhiều bài học trong file
3. Import một lần vào hệ thống

### 4. Chia sẻ bài học

Tạo một bộ bài học theo chủ đề:
- Ví dụ: `business-english-lessons.json`
- Ví dụ: `travel-english-lessons.json`
- Chia sẻ với cộng đồng

### 5. Cập nhật hàng loạt

Khi cần sửa nhiều bài:
1. Export tất cả bài học
2. Mở file JSON, search & replace
3. Import lại để cập nhật

## 🔄 Import Modes

### Thêm bài mới (Add)

- Nếu ID không tồn tại → Tạo bài học mới
- ID sẽ tự động được tạo nếu để "auto-generated"

### Cập nhật bài có sẵn (Update)

- Nếu ID đã tồn tại → Cập nhật nội dung
- Giữ nguyên progress và completed status

## ⚠️ Lưu ý quan trọng

### 1. Định dạng JSON phải chính xác

❌ **Sai:**
```json
{
  word: "Hello",    // Thiếu dấu ngoặc kép
  meaning: "Xin chào",
}                   // Dấu phẩy thừa
```

✅ **Đúng:**
```json
{
  "word": "Hello",
  "meaning": "Xin chào"
}
```

### 2. Danh mục (category) phải hợp lệ

Chỉ chấp nhận: `daily`, `business`, `travel`, `beginner`

### 3. Cấp độ (level) phải hợp lệ

Chỉ chấp nhận: `beginner`, `intermediate`, `advanced`

### 4. Phiên âm (pronunciation)

- Sử dụng ký hiệu IPA (International Phonetic Alphabet)
- Đặt trong dấu `/` - VD: `/həˈloʊ/`
- Có thể tìm phiên âm tại: https://dictionary.cambridge.org/

## 🎓 Ví dụ hoàn chỉnh

Xem file `lesson-template.json` trong thư mục `/public` hoặc tải xuống bằng nút "Tải mẫu" trên trang Admin.

## 🆘 Xử lý lỗi

### Lỗi: "Invalid format"

**Nguyên nhân:** File không phải JSON hợp lệ hoặc không phải array

**Giải pháp:**
1. Kiểm tra file phải bắt đầu bằng `[` và kết thúc bằng `]`
2. Validate JSON tại jsonlint.com

### Lỗi: "Missing required fields"

**Nguyên nhân:** Thiếu các trường bắt buộc (title, category, level)

**Giải pháp:**
1. Kiểm tra mỗi lesson có đầy đủ trường
2. So sánh với template

### Lỗi: "Failed to import"

**Nguyên nhân:** Lỗi không xác định

**Giải pháp:**
1. Kiểm tra console log
2. Thử import từng phần nhỏ
3. Kiểm tra ký tự đặc biệt

## 🌐 Nguồn dữ liệu miễn phí

### 1. Cambridge Dictionary
- https://dictionary.cambridge.org/
- Phiên âm chuẩn IPA
- Ví dụ câu

### 2. Oxford Learner's Dictionaries
- https://www.oxfordlearnersdictionaries.com/
- Từ vựng theo level
- Audio pronunciation

### 3. British Council LearnEnglish
- https://learnenglish.britishcouncil.org/
- Các bài học mẫu
- Dialogues và conversations

### 4. VOA Learning English
- https://learningenglish.voanews.com/
- Tin tức đơn giản hoá
- Transcript có sẵn

### 5. ESL Discussions
- https://esldiscussions.com/
- Hội thoại theo chủ đề
- Cấp độ rõ ràng

## 📊 Thống kê sau Import

Sau khi import thành công, hệ thống sẽ hiển thị:
- ✅ Số bài học mới được thêm
- ✅ Số bài học được cập nhật
- ✅ Tổng số bài học hiện có
- ✅ Cập nhật số lượng theo danh mục

## 💡 Pro Tips

1. **Tạo bài theo series:** Tạo nhiều bài cùng chủ đề trong một file
2. **Đánh số ID:** Dùng số tuần tự dễ quản lý: "daily-001", "daily-002"
3. **Thêm metadata:** Có thể thêm trường mô tả tác giả, nguồn (sẽ bị bỏ qua khi import)
4. **Version control:** Nếu biết Git, lưu file JSON trong repository
5. **Collaborative editing:** Dùng Google Drive/Dropbox để nhiều người cùng chỉnh sửa

---

**Happy Learning! 🎉**

Nếu có câu hỏi hoặc gặp vấn đề, hãy mở issue trên GitHub repository.
