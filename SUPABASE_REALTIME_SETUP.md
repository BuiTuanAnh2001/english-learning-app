# Hướng dẫn cấu hình Supabase Realtime

## ✅ Đã hoàn thành

1. ✅ Đã cài `@supabase/supabase-js`
2. ✅ Đã thêm `NEXT_PUBLIC_SUPABASE_ANON_KEY` vào `.env`
3. ✅ Đã tạo `lib/supabase.ts` client
4. ✅ Đã tích hợp Realtime vào tất cả pages (messages, notifications, navbar)
5. ✅ Đã thêm `GlobalNotificationListener` để nhận thông báo ở mọi trang

## 🚀 Bước cuối cùng: Bật Realtime trên Supabase

### Cách 1: Dùng SQL Editor (Khuyến nghị)

1. Vào Supabase Dashboard: https://supabase.com/dashboard/project/vehatkcukaloprvqcejz/editor
2. Copy toàn bộ nội dung file `scripts/enable-realtime.sql`
3. Paste vào SQL Editor
4. Click **Run** (hoặc Ctrl+Enter)

### Cách 2: Dùng giao diện

1. Vào **Database** > **Replication**
2. Bật realtime cho các bảng:
   - ✅ `Message`
   - ✅ `Notification`
   - ✅ `Friendship`

## 🔧 Kiến trúc Hybrid (Realtime + Polling)

App hiện sử dụng **hybrid approach**:
- **Realtime (WebSocket)**: Cập nhật ngay lập tức khi kết nối thành công
- **Polling (Fallback)**: Tự động chuyển sang polling nếu Realtime fail
- **Intelligent Interval**: 
  - Nếu Realtime hoạt động: polling chậm hơn (10-30s)
  - Nếu Realtime fail: polling nhanh hơn (3-5s)

### Console Logs để debug

Mở DevTools Console, bạn sẽ thấy:
```
✅ Realtime connected for messages
🔔 Global notification received: {...}
💬 Global message received: {...}
Navbar notification channel: SUBSCRIBED
```

Nếu thấy lỗi:
```
⚠️ Realtime failed, using polling fallback
```
Nghĩa là cần chạy SQL ở trên hoặc kiểm tra RLS policies.

## 🌍 Global Notifications

Thông báo giờ đây hoạt động **ở mọi trang**:
- ✅ Đang xem bài học → nhận tin nhắn mới
- ✅ Đang xem tiến độ → nhận lời mời kết bạn
- ✅ Đang ở trang chủ → nhận thông báo

Khi click vào browser notification, tự động navigate đến:
- `FRIEND_REQUEST` → `/friends?tab=requests`
- `NEW_MESSAGE` → `/messages?user={senderId}`
- `FRIEND_ACCEPTED` → `/friends`

## 🐛 Troubleshooting

### 1. Tin nhắn/thông báo vẫn chậm

**Nguyên nhân**: Realtime chưa được bật hoặc RLS đang chặn
**Giải pháp**: Chạy `scripts/enable-realtime.sql` trong Supabase SQL Editor

### 2. Console hiển thị "CHANNEL_ERROR" hoặc "TIMED_OUT"

**Nguyên nhân**: RLS policies hoặc permissions
**Giải pháp**: 
```sql
ALTER TABLE "Message" DISABLE ROW LEVEL SECURITY;
ALTER TABLE "Notification" DISABLE ROW LEVEL SECURITY;
```

### 3. Không nhận thông báo khi ở trang khác

**Nguyên nhân**: Chưa grant browser notification permission
**Giải pháp**: 
- Khi app load, sẽ tự động hỏi permission
- Hoặc vào Settings browser → Site permissions → Notifications → Allow

### 4. Realtime không hoạt động sau khi deploy Vercel

**Nguyên nhân**: Thiếu `NEXT_PUBLIC_SUPABASE_ANON_KEY` trên Vercel
**Giải pháp**:
1. Vào Vercel Dashboard → Project Settings → Environment Variables
2. Thêm: `NEXT_PUBLIC_SUPABASE_ANON_KEY` = `{your-key}`
3. Redeploy

## 📊 So sánh Performance

### Trước (Polling only)
- Messages: 3s interval = 20 requests/phút
- Notifications: 5s interval = 12 requests/phút
- Navbar: 10s interval = 6 requests/phút
- **Total**: ~38 requests/phút

### Sau (Hybrid Realtime + Polling)
- Messages: WebSocket (instant) + 10s fallback = ~6 requests/phút
- Notifications: WebSocket (instant) + 15s fallback = ~4 requests/phút
- Navbar: WebSocket (instant) + 30s fallback = ~2 requests/phút
- **Total**: ~12 requests/phút (giảm 68%)

## 🎯 Kết luận

✅ **Đã fix scroll issue**: Chat không còn tự động scroll khi polling
✅ **Global notifications**: Nhận thông báo ở mọi trang
✅ **Hybrid approach**: Realtime nhanh + Polling làm backup
✅ **UI fix**: Chat container không còn đè lên footer

**Cần làm**: Chạy `scripts/enable-realtime.sql` để bật Realtime hoàn toàn!
