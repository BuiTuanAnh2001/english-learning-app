# Hướng dẫn cấu hình Supabase Realtime

## Lấy Supabase Anon Key

1. Truy cập Supabase Dashboard: https://supabase.com/dashboard
2. Chọn project của bạn: `vehatkcukaloprvqcejz`
3. Vào **Settings** > **API**
4. Tìm section **Project API keys**
5. Copy **anon/public** key
6. Paste vào file `.env`:
   ```
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-copied-key-here"
   ```

## Bật Realtime cho các bảng

1. Vào Supabase Dashboard > **Database** > **Replication**
2. Tìm các bảng sau và bật Realtime:
   - ✅ `Message`
   - ✅ `Notification`
   - ✅ `Friendship` (optional - nếu muốn realtime friend requests)

3. Hoặc chạy SQL sau trong **SQL Editor**:
   ```sql
   -- Enable realtime for Message table
   ALTER PUBLICATION supabase_realtime ADD TABLE "Message";
   
   -- Enable realtime for Notification table
   ALTER PUBLICATION supabase_realtime ADD TABLE "Notification";
   
   -- Enable realtime for Friendship table (optional)
   ALTER PUBLICATION supabase_realtime ADD TABLE "Friendship";
   ```

## Cấu hình Row Level Security (RLS)

Để Realtime hoạt động, cần cấu hình RLS policies:

```sql
-- Message RLS policies
ALTER TABLE "Message" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own messages"
ON "Message"
FOR SELECT
USING (
  auth.uid()::text = "senderId" OR 
  auth.uid()::text = "receiverId"
);

CREATE POLICY "Users can insert their own messages"
ON "Message"
FOR INSERT
WITH CHECK (auth.uid()::text = "senderId");

-- Notification RLS policies
ALTER TABLE "Notification" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
ON "Notification"
FOR SELECT
USING (auth.uid()::text = "userId");

-- Friendship RLS policies (optional)
ALTER TABLE "Friendship" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view friendships they're part of"
ON "Friendship"
FOR SELECT
USING (
  auth.uid()::text = "senderId" OR 
  auth.uid()::text = "receiverId"
);
```

## Lưu ý quan trọng

1. **Auth vs Custom JWT**: App này đang dùng custom JWT, không dùng Supabase Auth. Do đó RLS policies trên sẽ không hoạt động với `auth.uid()`.

2. **Giải pháp**: Có 2 cách:
   - **Cách 1** (Khuyến nghị): Disable RLS và chỉ dùng Realtime để lắng nghe thay đổi. App logic sẽ filter data.
   - **Cách 2**: Migrate sang Supabase Auth thay vì custom JWT.

3. **Disable RLS** (nếu chọn cách 1):
   ```sql
   ALTER TABLE "Message" DISABLE ROW LEVEL SECURITY;
   ALTER TABLE "Notification" DISABLE ROW LEVEL SECURITY;
   ALTER TABLE "Friendship" DISABLE ROW LEVEL SECURITY;
   ```

## Kiểm tra Realtime hoạt động

1. Restart dev server: `npm run dev`
2. Mở 2 browser/tab khác nhau
3. Đăng nhập 2 tài khoản khác nhau
4. Gửi tin nhắn từ tài khoản A
5. Tài khoản B sẽ nhận được tin nhắn ngay lập tức (không cần đợi 3 giây)

## Lợi ích so với Polling

- ⚡ **Realtime thực sự**: Nhận tin nhắn ngay lập tức
- 🔋 **Tiết kiệm tài nguyên**: Không cần gọi API liên tục mỗi 3 giây
- 📡 **WebSocket**: Kết nối 2 chiều hiệu quả hơn HTTP polling
- 💰 **Giảm chi phí**: Ít requests hơn = ít bandwidth và database queries

## Troubleshooting

### Lỗi: Cannot connect to Realtime
- Kiểm tra `NEXT_PUBLIC_SUPABASE_ANON_KEY` đã được set chưa
- Kiểm tra project URL đúng chưa (trong `lib/supabase.ts`)
- Xem console browser có lỗi WebSocket không

### Realtime không trigger
- Kiểm tra đã bật Realtime cho bảng chưa (Database > Replication)
- Kiểm tra filter có đúng không (userId, senderId, receiverId)
- Xem Supabase logs: Dashboard > Logs > Realtime

### RLS blocking realtime events
- Disable RLS cho các bảng Message, Notification, Friendship
- Hoặc migrate sang Supabase Auth để dùng RLS đúng cách
