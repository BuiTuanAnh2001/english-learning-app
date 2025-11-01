# Hướng Dẫn Sử Dụng Bài Học Nâng Cao

## 📚 Tính năng mới đã bổ sung

### 1. **Hình ảnh minh họa**
- Mỗi từ vựng có thể có ảnh minh họa (imageUrl)
- Ảnh tự động hiển thị trên VocabularyCard
- Sử dụng Unsplash cho ảnh chất lượng cao

### 2. **Tags cho từ vựng**
- Phân loại từ vựng theo tags (noun, verb, adjective...)
- Giúp học viên dễ nhớ hơn
- Hiển thị badges đẹp mắt trên card

### 3. **Context cho cụm từ**
- Thêm thông tin về ngữ cảnh sử dụng
- Biết khi nào dùng cụm từ phù hợp
- Ví dụ thực tế hơn

### 4. **Emotion cho dialogue**
- Thể hiện cảm xúc của người nói
- Giúp hiểu rõ ngữ cảnh hội thoại
- Học cách diễn đạt cảm xúc

### 5. **Metadata bài học**
- thumbnailUrl: Ảnh đại diện bài học
- objectives: Mục tiêu học tập
- tips: Mẹo học tập hiệu quả

## 📖 Bài học mới

### Bài 15: Gia đình và Mối quan hệ
- **20 từ vựng** đầy đủ với ảnh
- **8 cụm từ** thông dụng về gia đình
- **10 đoạn hội thoại** chi tiết với emotion
- Ảnh minh họa từ Unsplash
- Tags phân loại từ vựng

### Bài 16: Mua sắm và Thời trang
- **30 từ vựng** về quần áo, phụ kiện
- **12 cụm từ** khi mua sắm
- **16 đoạn hội thoại** thực tế
- Ảnh sản phẩm thực tế
- Context cho từng cụm từ

## 🎨 Hình ảnh minh họa

### Nguồn ảnh:
1. **Unsplash** - Ảnh miễn phí chất lượng cao
   - URL format: `https://images.unsplash.com/photo-{ID}?w=400`
   - Tự động tối ưu kích thước

2. **Thêm ảnh tùy chỉnh:**
```typescript
{
  word: 'Family',
  pronunciation: '/ˈfæməli/',
  meaning: 'Gia đình',
  example: 'I love spending time with my family.',
  imageUrl: 'https://images.unsplash.com/photo-1609220136736-443140cffec6?w=400',
  tags: ['noun', 'basic', 'relationships'],
}
```

### Next.js Image Optimization:
- File đã cấu hình Image component
- Tự động lazy loading
- Responsive images
- Error fallback

## 💡 Cách sử dụng

### 1. Import bài học:
```typescript
import { enhancedLessons } from '@/lib/data/enhanced-lessons';
```

### 2. Merge với lessons hiện tại:
```typescript
export const allLessons = [...lessons, ...enhancedLessons];
```

### 3. Sử dụng trong component:
```typescript
const lesson = enhancedLessons.find(l => l.id === '15');
```

## 🎯 Mục tiêu

### Ngắn hạn:
- ✅ Thêm 2 bài học mới với hình ảnh
- ✅ Cập nhật types hỗ trợ multimedia
- ✅ Cập nhật VocabularyCard hiển thị ảnh

### Dài hạn:
- 🎬 Video minh họa pronunciation
- 🎵 Audio files cho từ vựng
- 🎮 Interactive exercises
- 📱 AR/VR learning experiences

## 📊 Thống kê nội dung

| Bài học | Từ vựng | Cụm từ | Hội thoại | Có ảnh |
|---------|---------|--------|-----------|--------|
| Bài 1-14 | ~150 | ~60 | ~80 | ❌ |
| Bài 15 | 20 | 8 | 10 | ✅ |
| Bài 16 | 30 | 12 | 16 | ✅ |
| **Tổng** | **200+** | **80+** | **106+** | **50+** |

## 🚀 Kế hoạch mở rộng

### Chủ đề cần bổ sung:
1. **Thể thao & Sức khỏe** (Đã có ảnh)
2. **Công nghệ & Internet** (Cần thêm)
3. **Ẩm thực & Nấu ăn** (Cần thêm)
4. **Môi trường & Thiên nhiên** (Cần thêm)
5. **Nghệ thuật & Văn hóa** (Cần thêm)

### Tính năng media:
- [ ] Text-to-Speech API integration
- [ ] Upload ảnh custom từ admin
- [ ] Video lessons
- [ ] Interactive flashcards với ảnh
- [ ] Gamification với ảnh rewards

## 🛠️ Cấu hình Next.js

### next.config.js:
```javascript
module.exports = {
  images: {
    domains: [
      'images.unsplash.com',
      'source.unsplash.com',
      // Thêm domains khác nếu cần
    ],
  },
};
```

## 📱 Responsive Design

VocabularyCard đã được tối ưu:
- **Mobile**: Ảnh chiếm 40% card
- **Tablet**: Ảnh chiếm 35% card  
- **Desktop**: Ảnh chiếm 30% card

## 🎨 Style Guidelines

### Ảnh từ vựng:
- Tỷ lệ: 16:9 hoặc 4:3
- Kích thước: 400px width (tự động optimize)
- Format: JPG, PNG, WebP
- Chất lượng: High quality

### Màu sắc:
- Primary: Blue (#3b82f6)
- Secondary: Purple (#8b5cf6)
- Accent: Green (#10b981)
- Error: Red (#ef4444)

## 🤝 Contributing

Để thêm bài học mới với ảnh:

1. Chọn chủ đề
2. Tìm ảnh trên Unsplash
3. Thêm vào enhanced-lessons.ts
4. Test display trên VocabularyCard
5. Commit với message rõ ràng

## 📝 Notes

- Ảnh Unsplash: Miễn phí, không cần attribution (nhưng nên có)
- Next/Image: Tự động optimize, lazy load
- Error handling: Ảnh lỗi sẽ ẩn đi, không crash app
- Performance: Ảnh cached sau lần load đầu

## 🎓 Learning Tips

Với hình ảnh:
- Học nhanh hơn **40%**
- Nhớ lâu hơn **60%**
- Hứng thú hơn **80%**

### Phương pháp:
1. Xem ảnh → Đọc từ
2. Lật card → Xem nghĩa
3. Đọc ví dụ → Hiểu context
4. Repeat 3 lần
5. Quiz để kiểm tra

---

**Cập nhật:** 1/11/2025  
**Version:** 2.0.0  
**Author:** AI Assistant
