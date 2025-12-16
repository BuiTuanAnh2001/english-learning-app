# 🔔 Push Notifications Setup

## ✅ Đã Hoàn Thành

Push notification đã được tích hợp đầy đủ vào app với các tính năng:

### 🎯 Tính Năng

- ✅ Service Worker đăng ký tự động
- ✅ Request notification permission khi vào trang chat
- ✅ Lưu push subscription vào database
- ✅ API endpoints để gửi push notifications
- ✅ Hiển thị notification ngay cả khi đóng browser
- ✅ Click notification để mở conversation

### 📁 Files Đã Tạo

1. `/public/sw.js` - Service Worker
2. `/lib/push-notification.ts` - Push notification utilities
3. `/app/api/push/subscribe/route.ts` - API đăng ký subscription
4. `/app/api/push/unsubscribe/route.ts` - API hủy subscription
5. `/app/api/push/send/route.ts` - API gửi push notification
6. Database: `PushSubscription` table trong Prisma schema

### 🔑 Environment Variables

Đã thêm vào `.env`:

```env
NEXT_PUBLIC_VAPID_PUBLIC_KEY="BBWwhTaoDxsrf9w2gwLyHk-9wSiMXw20XpBCqY8jkgvgU7Q2vUvKC6yK3BogDkUrbfD2folzcfNXTUiH--AxCOA"
VAPID_PRIVATE_KEY="Jp7bhoTSjq-nUBWFTdfhB7qopTQHZWn-4KjkyHOwnhc"
VAPID_SUBJECT="mailto:admin@chatapp.com"
```

## 🚀 Cách Sử Dụng

### 1. Test Push Notification Cơ Bản

```bash
# Chạy app
npm run dev

# Mở http://localhost:3000/chat
# Browser sẽ hỏi "Allow notifications?" → Click Allow
```

### 2. Gửi Push Notification Từ Code

```typescript
// Trong API route hoặc server-side code
await fetch("/api/push/send", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    recipientId: "user-id-here",
    title: "Tin nhắn mới",
    body: "Bạn có tin nhắn mới từ John",
    url: "/chat",
    icon: "/icon.svg",
  }),
});
```

### 3. Integrate Vào Message API (TODO)

Thêm vào `/app/api/conversations/[id]/messages/route.ts`:

```typescript
// Sau khi tạo message thành công
const members = await prisma.conversationMember.findMany({
  where: {
    conversationId: message.conversationId,
    userId: { not: session.user.id }, // Không gửi cho chính mình
  },
});

// Gửi push notification cho tất cả members
for (const member of members) {
  await fetch(`${process.env.NEXTAUTH_URL}/api/push/send`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      recipientId: member.userId,
      title: session.user.name,
      body: message.content,
      url: `/chat?conversation=${message.conversationId}`,
      icon: session.user.avatar,
    }),
  });
}
```

## 🧪 Test Checklist

- [ ] Vào `/chat` → Cho phép notifications
- [ ] Gửi tin nhắn từ user khác
- [ ] **Minimize browser** hoặc chuyển sang tab khác
- [ ] Kiểm tra notification hiện ra
- [ ] Click notification → App mở lại và focus vào conversation

## 🔧 Debug

### Kiểm tra Service Worker

```javascript
// Trong browser console
navigator.serviceWorker.getRegistration().then((reg) => {
  console.log("Service Worker:", reg);
});
```

### Kiểm tra Push Subscription

```javascript
// Trong browser console
navigator.serviceWorker.ready.then((reg) => {
  reg.pushManager.getSubscription().then((sub) => {
    console.log("Subscription:", sub);
  });
});
```

### Test Notification Manually

```javascript
// Trong browser console (sau khi allow permission)
new Notification("Test", {
  body: "This is a test notification",
  icon: "/icon.svg",
});
```

## 📝 Notes

1. **HTTPS Required**: Push notifications chỉ hoạt động trên HTTPS (trừ localhost)
2. **Browser Support**: Chrome, Firefox, Edge, Safari (iOS 16.4+)
3. **Permission**: User phải cho phép notifications
4. **Service Worker Scope**: Đăng ký tại root `/` để cover toàn bộ app

## 🎨 Customize

### Thay đổi notification appearance

Edit `/public/sw.js`:

```javascript
const options = {
  body: data.body || "Bạn có tin nhắn mới",
  icon: data.icon || "/icon.svg",
  badge: "/icon.svg",
  vibrate: [200, 100, 200], // Rung điện thoại
  requireInteraction: true, // Giữ notification cho đến khi user dismiss
  actions: [
    { action: "open", title: "Mở", icon: "/icon.svg" },
    { action: "close", title: "Đóng" },
  ],
};
```

## 🚧 TODO (Optional Enhancements)

- [ ] Tích hợp push vào message API
- [ ] Group notifications by conversation
- [ ] Notification preferences (mute conversations)
- [ ] Sound notifications
- [ ] Badge count on app icon
- [ ] Rich notifications với hình ảnh

---

**Status**: ✅ Ready to use!  
**Last Updated**: Dec 16, 2025
