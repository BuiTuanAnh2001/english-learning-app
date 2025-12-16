# Hướng Dẫn Cấu Hình Google OAuth

## Lỗi: "Access blocked: This app's request is invalid"

Lỗi này xảy ra vì Google OAuth chưa được cấu hình đúng. Làm theo các bước sau:

## Bước 1: Tạo Google OAuth Credentials

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project có sẵn
3. Vào **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Chọn **Application type**: Web application
6. Đặt tên: `ChatApp` (hoặc tên bất kỳ)

## Bước 2: Cấu Hình Authorized Redirect URIs

**Quan trọng:** Thêm các URIs sau vào **Authorized redirect URIs**:

### Development (Local)

```
http://localhost:3000/api/auth/callback/google
```

### Production (Vercel)

```
https://your-domain.vercel.app/api/auth/callback/google
```

## Bước 3: Lấy Client ID và Client Secret

Sau khi tạo, Google sẽ cung cấp:

- **Client ID**: Một chuỗi kết thúc bằng `.apps.googleusercontent.com`
- **Client Secret**: Một chuỗi ngẫu nhiên

## Bước 4: Cập Nhật File .env

Thêm vào file `.env`:

```env
# Google OAuth
GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-client-secret"

# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-random-secret-key-here"
```

### Tạo NEXTAUTH_SECRET

Chạy lệnh sau để tạo secret key:

```bash
openssl rand -base64 32
```

Hoặc online: https://generate-secret.vercel.app/32

## Bước 5: Enable Google+ API (nếu cần)

1. Vào **APIs & Services** → **Library**
2. Tìm "Google+ API"
3. Click **Enable**

## Bước 6: Restart Dev Server

```bash
# Stop server (Ctrl+C)
npm run dev
```

## Giải Pháp Tạm Thời: Tắt Google Login

Nếu chưa muốn cấu hình Google OAuth ngay, bạn có thể:

1. Chỉ sử dụng **Email/Password login**
2. Ẩn nút Google login trong UI

Để ẩn nút Google login, tôi có thể cập nhật trang login cho bạn.

---

## Troubleshooting

### Lỗi vẫn còn sau khi cấu hình?

1. **Clear browser cache** và cookies
2. **Kiểm tra lại Redirect URI** - phải khớp 100%
3. **Verify credentials** trong `.env`
4. **Restart dev server**

### Kiểm tra logs

Xem logs trong terminal khi đăng nhập để biết lỗi cụ thể.
