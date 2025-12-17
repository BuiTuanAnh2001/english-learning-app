# Hướng dẫn tích hợp tính năng GIF

## Tính năng mới

- ✅ Gửi GIF từ Giphy
- ✅ Reply GIF
- ✅ Hiển thị GIF trong chat
- ✅ Push notifications hỗ trợ GIF

## Cài đặt

### 1. Cập nhật database

Migration đã được tạo tự động. Nếu cần chạy lại:

```bash
npx prisma migrate dev
```

### 2. Cấu hình Giphy API (Tùy chọn)

Component GIF picker đã có API key mặc định từ Giphy, nhưng bạn nên tạo key riêng cho production:

1. Truy cập [Giphy Developers](https://developers.giphy.com/)
2. Đăng ký tài khoản và tạo app mới
3. Copy API key
4. Thêm vào `.env.local`:

```env
NEXT_PUBLIC_GIPHY_API_KEY=your_api_key_here
```

### 3. Chạy ứng dụng

```bash
npm run dev
```

## Cách sử dụng

### Gửi GIF

1. Mở chat với bất kỳ người dùng nào
2. Nhấn nút "GIF" bên cạnh nút upload ảnh
3. Tìm kiếm GIF hoặc chọn từ danh sách trending
4. Nhấn vào GIF để gửi

### Reply GIF

1. Hover vào tin nhắn muốn reply
2. Nhấn nút Reply
3. Nhấn nút "GIF" và chọn GIF
4. GIF sẽ được gửi kèm theo reply

## Thay đổi kỹ thuật

### Database Schema

- Thêm `GIF` vào `MessageType` enum

### API

- Hỗ trợ type `GIF` trong POST `/api/conversations/[id]/messages`
- Cập nhật push notification để hiển thị "🎬 Đã gửi một GIF"

### Frontend

- Component mới: `components/chat/gif-picker.tsx`
- Tích hợp Giphy API để tìm kiếm GIF
- Cập nhật UI hiển thị GIF trong chat
- Hỗ trợ GIF trong reply preview
- Thêm nút GIF vào input area

### Real-time

- Broadcast GIF messages qua Supabase realtime
- Hiển thị thông báo "🎬 Đã gửi một GIF" khi nhận GIF

## Lưu ý

- GIF được lưu trữ dưới dạng URL từ Giphy (không upload lên server)
- GIF hỗ trợ tất cả tính năng như message thông thường (reactions, reply, read receipts)
- API key công khai của Giphy có sẵn, nhưng nên sử dụng API key riêng cho production
