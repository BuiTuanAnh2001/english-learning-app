# Hướng dẫn sửa Realtime không hoạt động

## Vấn đề hiện tại
- ✅ Subscription thành công (SUBSCRIBED)
- ❌ Không nhận được message từ realtime
- ❌ Không có thông báo

## Nguyên nhân có thể

### 1. **Realtime chưa được enable trong Supabase Dashboard** (Nguyên nhân chính)

#### Cách kiểm tra và sửa:

1. Mở Supabase Dashboard: https://supabase.com/dashboard/project/vehatkcukaloprvqcejz

2. Vào **Database** → **Replication**

3. Tìm bảng `Message` (hoặc `message`)

4. Bật **Realtime** cho bảng này:
   - Tick vào checkbox bên cạnh bảng `Message`
   - Lưu thay đổi

5. Kiểm tra các bảng liên quan cũng cần enable:
   - ✅ `Message` - **BẮT BUỘC**
   - ✅ `Conversation` - Nên bật để sync conversation list
   - ✅ `ConversationMember` - Nên bật để sync members
   - ⚠️ `TypingStatus` - Optional (cho typing indicator)

### 2. **Table name không khớp**

PostgreSQL tables trong Supabase có thể là:
- `Message` (chữ M hoa) - Theo Prisma schema
- `message` (chữ thường) - Tự động lowercase bởi PostgreSQL

**Đã sửa trong code:**
- ✅ Thử table name `message` (lowercase)
- ✅ Nếu không work, thử `Message` (uppercase)

### 3. **Supabase Realtime Policies**

Kiểm tra RLS (Row Level Security):

1. Vào **Database** → **Tables** → `Message`

2. Vào tab **RLS Policies**

3. Đảm bảo có policy cho **REALTIME**:
   ```sql
   -- Policy để cho phép listen realtime
   CREATE POLICY "Enable realtime for authenticated users"
   ON "Message"
   FOR SELECT
   TO authenticated
   USING (true);
   ```

### 4. **Test Realtime bằng file HTML**

1. Mở file `test-realtime.html` trong browser

2. Mở Console (F12)

3. Gửi một message từ app

4. Kiểm tra Console xem nhận được event không

5. Nếu nhận được → Table name đúng
   Nếu không → Thử table name khác hoặc check enable Realtime

## Code đã sửa

### ✅ Optimistic Update không duplicate
```typescript
// Trước đó: Gọi fetchMessages() sau khi send → Duplicate message
// Bây giờ: Realtime tự động replace optimistic message
```

### ✅ Listen 3 events thay vì 1
```typescript
.on('postgres_changes', { event: 'INSERT' }) // Tin nhắn mới
.on('postgres_changes', { event: 'UPDATE' }) // Sửa tin nhắn
.on('postgres_changes', { event: 'DELETE' }) // Xóa tin nhắn
```

### ✅ Xử lý duplicate message
```typescript
setMessages(prev => {
  // Xóa optimistic message
  const filtered = prev.filter(m => !m.id.startsWith('temp-'))
  
  // Kiểm tra duplicate
  const exists = filtered.some(m => m.id === newMessage.id)
  if (exists) return filtered
  
  // Fetch để có đầy đủ sender info
  fetchMessages(selectedConv)
  return filtered
})
```

## Checklist để fix

- [ ] **Bước 1**: Vào Supabase Dashboard → Database → Replication
- [ ] **Bước 2**: Enable Realtime cho bảng `Message`
- [ ] **Bước 3**: Refresh app và test gửi message
- [ ] **Bước 4**: Mở Console (F12) kiểm tra log "📨 NEW MESSAGE FROM REALTIME"
- [ ] **Bước 5**: Nếu vẫn không work, chạy `test-realtime.html` để test table name

## Push Notification (Sau khi Realtime work)

Push notification cần:
1. ✅ Realtime hoạt động (bước trên)
2. Browser Notification permission
3. Service Worker (cho background notification)

Code sẽ add sau khi Realtime work ổn định.

## Liên hệ

Nếu làm theo hướng dẫn trên mà vẫn không work:
1. Chụp screenshot Console log
2. Chụp screenshot Supabase Replication settings
3. Share để debug tiếp
