# Hướng dẫn Test Push Notifications

## 🔧 Cấu hình

### 1. Kiểm tra VAPID Keys

Đảm bảo trong file `.env.local` có:

```bash
# Generate VAPID keys: npx web-push generate-vapid-keys
NEXT_PUBLIC_VAPID_PUBLIC_KEY=your_public_key_here
VAPID_PRIVATE_KEY=your_private_key_here
VAPID_SUBJECT=mailto:your-email@example.com
```

### 2. Kiểm tra Prisma Schema

Đảm bảo model `PushSubscription` đã được định nghĩa:

```prisma
model PushSubscription {
  id        String   @id @default(cuid())
  userId    String   @unique
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  endpoint  String
  keys      Json     // { p256dh: string, auth: string }
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 🧪 Test trên Chrome

### Bước 1: Mở DevTools Console

1. Mở Chrome DevTools (F12)
2. Vào tab **Console**
3. Kiểm tra logs khi load trang `/chat`:

```
✅ Service Worker đã đăng ký
✅ Service Worker ready
🔑 Subscribing with VAPID key length: 65
✅ Successfully subscribed to push
📤 Sending subscription to server...
✅ Push subscription saved on server
🔔 Endpoint: https://fcm.googleapis.com/fcm/send/...
```

### Bước 2: Kiểm tra Notification Permission

Trong Console, chạy:

```javascript
Notification.permission;
// Phải trả về: "granted"
```

### Bước 3: Test gửi tin nhắn

1. Đăng nhập 2 tài khoản khác nhau (2 browser khác nhau hoặc Chrome + Incognito)
2. User A gửi tin nhắn cho User B
3. Kiểm tra Console của User B:

```
📨 New message received via broadcast
🔔 Push received
📦 Push data: { title: "...", body: "...", ... }
📨 Showing notification
✅ Notification shown successfully
```

### Bước 4: Kiểm tra Network

Trong DevTools > Network:

- Kiểm tra request POST đến `/api/conversations/[id]/messages`
- Response phải trả về thành công
- Server console phải hiển thị: `🔔 Push notification sent to: [User Name]`

## 🦁 Xử lý lỗi trên Brave Browser

Brave Browser có các cơ chế bảo mật đặc biệt:

### Lỗi thường gặp:

1. **"NotAllowedError"** - Brave đã chặn notifications
2. **"NotSupportedError"** - Push API bị vô hiệu hóa

### Giải pháp:

1. **Bật Notifications trong Brave**:

   - Vào `brave://settings/content/notifications`
   - Đảm bảo "Sites can ask to send notifications" được BẬT
   - Thêm site của bạn vào danh sách "Allowed"

2. **Kiểm tra Brave Shields**:

   - Click vào icon Brave Shields (con sư tử) trên thanh địa chỉ
   - Tắt "Block Scripts" nếu đang bật
   - Đặt "Advanced Controls" về "Standard"

3. **Clear Site Data**:

   - DevTools > Application > Clear storage
   - Clear all và reload

4. **Test lại**:
   ```javascript
   // Chạy trong Console
   Notification.requestPermission().then((permission) => {
     console.log("Permission:", permission);
     if (permission === "granted") {
       new Notification("Test", { body: "Hello from Brave!" });
     }
   });
   ```

## 🐛 Debug Checklist

### Server Side

```bash
# Kiểm tra logs khi gửi tin nhắn
✅ Realtime event broadcasted for message: [message-id]
🔔 Push notification sent to: [username]

# Nếu không thấy log trên:
1. Kiểm tra VAPID keys trong .env
2. Kiểm tra database có PushSubscription của user không
3. Kiểm tra web-push package đã install: npm ls web-push
```

### Client Side

```javascript
// Test trong Console
// 1. Kiểm tra Service Worker
navigator.serviceWorker.getRegistrations().then((regs) => {
  console.log("SW Registrations:", regs);
});

// 2. Kiểm tra Push Subscription
navigator.serviceWorker.ready.then((reg) => {
  reg.pushManager.getSubscription().then((sub) => {
    console.log("Current subscription:", sub);
  });
});

// 3. Test manual notification
new Notification("Test", {
  body: "This is a test notification",
  icon: "/icon.svg",
});
```

## 📱 Test trên các trình duyệt khác

### Firefox

- Hỗ trợ tốt push notifications
- Kiểm tra `about:preferences#privacy` > Notifications

### Edge

- Tương tự Chrome
- Kiểm tra `edge://settings/content/notifications`

### Safari (macOS)

- Yêu cầu website chạy HTTPS
- Push notifications có API riêng (không dùng web-push)

## ✅ Kết quả mong đợi

Khi mọi thứ hoạt động đúng:

1. **Đăng nhập lần đầu**:

   - Toast hiển thị: "✅ Thông báo đẩy đã được bật thành công!"
   - Console log: Push subscription saved

2. **Nhận tin nhắn mới**:

   - Notification popup hiển thị (ngay cả khi tab đang ẩn)
   - Click notification → mở tab chat
   - Tin nhắn xuất hiện realtime trong chat

3. **Test background**:
   - Minimize window hoặc switch sang tab khác
   - Gửi tin nhắn từ user khác
   - Notification phải hiện ngay lập tức

## 🔥 Lỗi thường gặp

### 1. Không nhận được notification

**Nguyên nhân**:

- VAPID keys chưa đúng
- Subscription chưa được lưu vào DB
- Service Worker chưa active

**Giải pháp**:

```javascript
// Kiểm tra subscription trong DB
// Trong API route hoặc Prisma Studio
const subs = await prisma.pushSubscription.findMany();
console.log(subs);
```

### 2. "Push subscription has expired or is invalid"

**Nguyên nhân**: Subscription hết hạn

**Giải pháp**: Unregister và subscribe lại

```javascript
// Trong Console
navigator.serviceWorker.ready.then((reg) => {
  reg.pushManager.getSubscription().then((sub) => {
    sub.unsubscribe();
    // Reload page để subscribe lại
  });
});
```

### 3. Service Worker không update

**Giải pháp**:

1. DevTools > Application > Service Workers
2. Click "Unregister"
3. Reload page
4. Check "Update on reload"

## 📊 Monitoring

Theo dõi trong production:

```javascript
// Thêm error tracking
try {
  await subscribeToPushNotifications(userId);
} catch (error) {
  // Send to error tracking service (Sentry, etc.)
  console.error("Push subscription failed:", error);
}
```

## 🎯 Next Steps

1. Test với nhiều users cùng lúc
2. Test network offline/online
3. Test khi battery saver mode
4. Thêm rate limiting cho push notifications
5. Thêm user preferences (mute, custom sounds, etc.)
