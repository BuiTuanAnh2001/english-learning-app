# 🎙️ Hướng dẫn Setup Agora Voice/Video Call (MIỄN PHÍ)

## ✅ Đã hoàn thành:

- ✅ Cài đặt Agora RTC SDK
- ✅ Tạo Call Dialog component
- ✅ Tích hợp vào Chat Page
- ✅ Thêm nút gọi thoại & video

## 📋 Các bước còn lại:

### 1. Lấy Agora App ID (MIỄN PHÍ - 10,000 phút/tháng)

1. Truy cập: https://console.agora.io/
2. Đăng ký tài khoản miễn phí (dùng email)
3. Tạo project mới:
   - Click **"Create Project"**
   - Nhập tên project (vd: "Chat App")
   - Chọn **"Secured mode: APP ID + Token"** (khuyến nghị)
   - Click **"Submit"**
4. Copy **App ID** từ dashboard

### 2. Cấu hình môi trường

Mở file `.env.local` và thay thế `your_app_id_here` bằng App ID vừa lấy:

```env
NEXT_PUBLIC_AGORA_APP_ID=your_actual_app_id_here
```

### 3. Test tính năng

1. Khởi động dev server:

   ```bash
   npm run dev
   ```

2. Mở 2 tab browser:

   - Tab 1: Đăng nhập user A
   - Tab 2: Đăng nhập user B (incognito mode)

3. Bắt đầu chat và click nút Phone (🎙️) hoặc Video (📹)

4. Kiểm tra:
   - ✅ Nút Phone/Video hiển thị
   - ✅ Click vào mở Call Dialog
   - ✅ Audio/Video hoạt động
   - ✅ Mute/Unmute hoạt động
   - ✅ End call hoạt động

## 🎯 Tính năng đã có:

### Voice Call (Gọi thoại)

- ✅ 1-1 voice call
- ✅ Mute/Unmute mic
- ✅ Speaker on/off
- ✅ Call timer
- ✅ End call

### Video Call (Gọi video)

- ✅ 1-1 video call
- ✅ Camera on/off
- ✅ Mute/Unmute mic
- ✅ Picture-in-picture local video
- ✅ Full screen remote video
- ✅ Call timer
- ✅ End call

## 📊 Free Tier Limits

**Agora miễn phí:**

- ✅ 10,000 phút/tháng
- ✅ Voice call không giới hạn người dùng
- ✅ Video call HD
- ✅ Screen sharing
- ✅ Recording (nếu cần)

**Tính toán:**

- 10,000 phút = ~167 giờ/tháng
- ~5.5 giờ/ngày
- Đủ cho testing và MVP!

## 🚀 Nâng cao (Optional)

### 1. Thêm incoming call notification

Tạo file `app/api/call/notify/route.ts`:

```typescript
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  const { userId, callType, callerName } = await req.json();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  // Broadcast incoming call
  const channel = supabase.channel(`user:${userId}:calls`);
  await channel.send({
    type: "broadcast",
    event: "incoming_call",
    payload: { callType, callerName },
  });

  return NextResponse.json({ success: true });
}
```

### 2. Thêm call history

Lưu lại lịch sử cuộc gọi vào database

### 3. Thêm ringtone

Thêm âm thanh chuông khi có cuộc gọi đến

## ⚠️ Lưu ý:

1. **Không commit App ID lên Git**

   - App ID đã được thêm vào `.env.local`
   - `.env.local` đã có trong `.gitignore`

2. **HTTPS required**

   - Agora cần HTTPS để truy cập camera/mic
   - Localhost vẫn OK trong development

3. **Browser permissions**

   - User phải allow microphone/camera permissions
   - Best practice: Xin phép trước khi bắt đầu call

4. **Testing**
   - Cần 2 thiết bị/tab để test call
   - Dùng incognito để test với chính mình

## 🐛 Troubleshooting:

### "Agora App ID not configured"

→ Kiểm tra `.env.local` có `NEXT_PUBLIC_AGORA_APP_ID`

### Camera/Mic không hoạt động

→ Check browser permissions (Settings → Privacy → Camera/Mic)

### Không kết nối được

→ Kiểm tra App ID đúng chưa, reload page

### Lỗi CORS

→ Agora SDK tự handle, không cần config thêm

## 📞 Support:

Nếu gặp vấn đề:

1. Check Console log (F12)
2. Kiểm tra Agora Console: https://console.agora.io/
3. Đọc docs: https://docs.agora.io/

## 🎉 Done!

Giờ bạn đã có tính năng gọi điện MIỄN PHÍ trong chat app!
