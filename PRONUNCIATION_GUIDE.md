# 🎤 Pronunciation Practice Guide

## Tổng quan

Tính năng **Pronunciation Practice** (Luyện phát âm) cho phép người học:
- Ghi âm giọng nói của mình
- So sánh với văn bản gốc bằng công nghệ nhận dạng giọng nói
- Nhận đánh giá độ chính xác (0-100%)
- Nhận phản hồi chi tiết và gợi ý cải thiện

## Công nghệ sử dụng

- **Web Speech API**: Nhận dạng giọng nói trực tiếp trên trình duyệt
- **Levenshtein Distance Algorithm**: Tính toán độ tương đồng giữa văn bản
- **Word-level Analysis**: Phân tích từng từ (đúng, thiếu, thừa)
- **Real-time Feedback**: Phản hồi ngay lập tức sau khi ghi âm

## Hỗ trợ trình duyệt

✅ **Hoạt động tốt:**
- Google Chrome (Desktop & Mobile)
- Microsoft Edge
- Safari (macOS & iOS)

❌ **Không hỗ trợ:**
- Firefox (chưa hỗ trợ Web Speech API)
- Các trình duyệt cũ

## Cách sử dụng

### 1. Từ vựng (Vocabulary)

1. Vào trang Lessons → Chọn một bài học
2. Ở mục Vocabulary, click vào thẻ từ
3. Click nút **"Luyện phát âm"** (icon 🎤)
4. Trong popup:
   - Click **"Listen"** để nghe phát âm chuẩn
   - Click **"Record Your Voice"** và nói từ đó
   - Nhận kết quả đánh giá ngay lập tức

### 2. Hội thoại (Dialogues)

1. Vào trang Lessons → Chọn một bài học
2. Ở mục Dialogues, tìm câu muốn luyện
3. Click nút 🎤 bên cạnh nút phát âm
4. Làm tương tự như với từ vựng

## Cách đánh giá

### Điểm số (Accuracy Score)

- **90-100%**: 🎉 Excellent - Xuất sắc
- **75-89%**: 👍 Great - Rất tốt
- **60-74%**: 😊 Good - Tốt
- **40-59%**: 💪 Fair - Trung bình
- **0-39%**: 📚 Needs Practice - Cần luyện tập

### Phân tích từ

#### ✅ Correct Words (Từ đúng)
- Hiển thị các từ bạn phát âm chính xác
- Màu xanh lá

#### ❌ Missed Words (Từ thiếu)
- Các từ trong câu gốc nhưng hệ thống không nghe thấy
- Màu đỏ
- **Gợi ý**: Phát âm rõ ràng hơn, tăng âm lượng

#### ➕ Extra Words (Từ thừa)
- Các từ bạn nói nhưng không có trong câu gốc
- Màu vàng
- **Gợi ý**: Đọc lại câu gốc, tránh thêm từ

## Feedback & Tips

Hệ thống cung cấp:
- Phản hồi tổng quan về phát âm
- Liệt kê từ thiếu và từ thừa cụ thể
- Gợi ý cải thiện
- Hiển thị câu gốc để so sánh

## Mẹo để đạt điểm cao

1. **Nghe trước khi nói**: 
   - Click "Listen" nhiều lần
   - Chú ý đến cách phát âm, ngữ điệu

2. **Môi trường yên tĩnh**:
   - Tìm nơi ít tiếng ồn
   - Tắt nhạc, TV

3. **Micro tốt**:
   - Sử dụng micro rõ ràng
   - Giữ khoảng cách vừa phải với micro

4. **Nói rõ ràng**:
   - Không nói quá nhanh
   - Phát âm từng từ rõ ràng
   - Tránh ăn âm cuối

5. **Luyện tập nhiều lần**:
   - Click "Try Again" để thử lại
   - Mục tiêu: Đạt 90%+

## Xử lý sự cố

### Lỗi: "Speech recognition is not supported"
**Nguyên nhân**: Trình duyệt không hỗ trợ
**Giải pháp**: Chuyển sang Chrome, Edge hoặc Safari

### Lỗi: "Speech recognition error: not-allowed"
**Nguyên nhân**: Chưa cho phép truy cập micro
**Giải pháp**: 
1. Click icon khóa/cài đặt bên trái thanh địa chỉ
2. Cho phép truy cập Microphone
3. Reload trang

### Lỗi: "Speech recognition error: no-speech"
**Nguyên nhân**: Hệ thống không nghe thấy giọng nói
**Giải pháp**:
- Kiểm tra micro có hoạt động không
- Tăng âm lượng
- Nói gần micro hơn
- Kiểm tra cài đặt âm thanh hệ thống

### Điểm số thấp không rõ nguyên nhân
**Có thể do**:
- Giọng địa phương/accent quá nặng
- Phát âm sai
- Tiếng ồn xung quanh
- Micro kém chất lượng

**Thử**:
- Phát âm chậm hơn, rõ hơn
- Nghe lại câu gốc nhiều lần
- Di chuyển đến nơi yên tĩnh hơn

## Giới hạn

1. **Chỉ hỗ trợ tiếng Anh (en-US)**
   - Hiện tại chỉ nhận dạng giọng Mỹ
   - Giọng Anh, Úc có thể cho kết quả thấp hơn

2. **Phụ thuộc kết nối mạng**
   - Một số trình duyệt cần Internet để nhận dạng giọng nói
   - Chrome có thể hoạt động offline

3. **Độ chính xác không tuyệt đối**
   - Thuật toán có thể bị ảnh hưởng bởi:
     - Chất lượng micro
     - Tiếng ồn xung quanh
     - Giọng địa phương
     - Tốc độ nói

4. **Câu dài có thể khó hơn**
   - Câu dài, phức tạp khó đạt 100%
   - Nên tập từ vựng đơn trước, sau đó tập câu

## Tính năng tương lai (Roadmap)

- [ ] Hỗ trợ nhiều giọng tiếng Anh (UK, AU, etc.)
- [ ] Phân tích phát âm chi tiết từng âm (phoneme-level)
- [ ] Lưu lịch sử luyện tập
- [ ] Biểu đồ tiến bộ theo thời gian
- [ ] Mode luyện tập nâng cao với slow-motion playback
- [ ] Nhận dạng cảm xúc trong giọng nói

## Ví dụ sử dụng

### Ví dụ 1: Từ vựng đơn giản

**Từ gốc**: "Hello"

**Bạn nói**: "Hello"
- ✅ Accuracy: 100%
- Feedback: "🎉 Excellent pronunciation!"

**Bạn nói**: "Halo"
- ✅ Accuracy: 85%
- Feedback: "👍 Great job! Very close."

### Ví dụ 2: Câu hội thoại

**Câu gốc**: "Nice to meet you"

**Bạn nói**: "Nice to meet you"
- ✅ Accuracy: 100%
- Matched: [nice, to, meet, you]

**Bạn nói**: "Nice meet you"
- ⚠️ Accuracy: 75%
- Matched: [nice, meet, you]
- Missed: [to]

**Bạn nói**: "Very nice to meet you"
- ⚠️ Accuracy: 80%
- Matched: [nice, to, meet, you]
- Extra: [very]

## Kết luận

Tính năng Pronunciation Practice là công cụ mạnh mẽ giúp bạn:
- ✅ Tự học phát âm hiệu quả
- ✅ Nhận phản hồi ngay lập tức
- ✅ Theo dõi tiến bộ qua điểm số
- ✅ Xác định điểm yếu cần cải thiện

**Lời khuyên**: Luyện tập ít nhất 10-15 phút mỗi ngày để cải thiện phát âm nhanh chóng!

---

💡 **Pro Tip**: Sử dụng headphone có micro để có trải nghiệm tốt nhất!
