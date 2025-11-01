# 🔐 Hướng dẫn đăng nhập Admin

## Tổng quan

Hệ thống admin đã được bảo vệ bằng mật khẩu. Chỉ những người có mật khẩu admin mới có thể truy cập các trang quản trị để thêm, sửa, xóa bài học.

## 🎯 Tính năng

### 1. **Nút Admin trên Navbar**
- Hiển thị trên cả desktop và mobile
- Khi chưa đăng nhập: Nút "Admin" với icon 🛡️
- Khi đã đăng nhập: Nút sáng màu + thêm nút "Đăng xuất"

### 2. **Modal đăng nhập có Animation**
- Animation fade-in với backdrop blur
- Icon khóa 🔒 với animation scale
- Input password với tracking rộng
- Loading state với icon xoay khi xác thực
- Error message với animation slide-down khi sai mật khẩu

### 3. **Bảo vệ tất cả trang Admin**
- `/admin` - Trang quản lý bài học
- `/admin/lessons/new` - Tạo bài học mới
- `/admin/lessons/[id]/edit` - Chỉnh sửa bài học

### 4. **Lưu trạng thái đăng nhập**
- Sử dụng localStorage để lưu session
- Không cần đăng nhập lại khi refresh trang
- Tự động redirect về trang chủ khi chưa đăng nhập

## 🔑 Thông tin đăng nhập

```
Mật khẩu: bta@23901
```

## 📝 Cách sử dụng

### Đăng nhập Admin (Desktop)

1. Click nút **"Admin"** trên thanh navigation (góc phải)
2. Nhập mật khẩu: `bta@23901`
3. Click **"Đăng nhập"**
4. Bạn sẽ được chuyển đến trang Admin tự động

### Đăng nhập Admin (Mobile)

1. Click icon Menu (☰)
2. Chọn **"Admin"** trong menu
3. Nhập mật khẩu và đăng nhập

### Đăng xuất

**Desktop:**
- Click nút **"Đăng xuất"** màu đỏ bên cạnh nút Admin

**Mobile:**
- Mở menu → Chọn **"Đăng xuất"**

## 🎨 Animations

### Modal Login
- **Entry**: Fade in + Scale up + Slide up từ dưới lên
- **Lock Icon**: Scale animation với spring effect
- **Loading**: Icon xoay 360° liên tục
- **Error**: Slide down từ trên xuống
- **Exit**: Fade out + Scale down

### Protected Route
- Khi truy cập trái phép: Hiển thị trang "Access Denied"
- Icon shield nhấp nháy với scale animation
- Tự động redirect về trang chủ

## 🛡️ Bảo mật

### Client-side Protection
- Kiểm tra authentication trước khi render nội dung admin
- Redirect ngay lập tức nếu chưa đăng nhập
- Clear session khi đăng xuất

### Password
- Mật khẩu được lưu trong `lib/contexts/auth-context.tsx`
- Để thay đổi mật khẩu, sửa constant `ADMIN_PASSWORD`

```typescript
const ADMIN_PASSWORD = 'bta@23901' // Thay đổi ở đây
```

## 📂 Cấu trúc Code

```
lib/contexts/
  └── auth-context.tsx          # Context quản lý authentication

components/auth/
  ├── login-modal.tsx            # Modal đăng nhập với animations
  └── protected-route.tsx        # Wrapper bảo vệ routes

app/
  ├── layout.tsx                 # Wrap app với AuthProvider
  └── admin/
      ├── page.tsx               # Protected với ProtectedRoute
      └── lessons/
          ├── new/page.tsx       # Protected
          └── [id]/edit/page.tsx # Protected

components/navigation/
  └── navbar.tsx                 # Nút Admin + Logout logic
```

## 🔄 Flow đăng nhập

```mermaid
graph TD
    A[User click "Admin"] --> B{Đã đăng nhập?}
    B -->|Có| C[Chuyển đến /admin]
    B -->|Không| D[Hiển thị LoginModal]
    D --> E[Nhập password]
    E --> F{Password đúng?}
    F -->|Đúng| G[Lưu vào localStorage]
    G --> H[Đóng modal]
    H --> C
    F -->|Sai| I[Hiển thị lỗi]
    I --> E
```

## ⚡ State Management

### AuthContext API

```typescript
// Hook để sử dụng auth
const { isAuthenticated, login, logout } = useAuth()

// Kiểm tra đã đăng nhập
isAuthenticated // boolean

// Đăng nhập
const success = login('bta@23901') // returns boolean

// Đăng xuất
logout() // clears localStorage & sets isAuthenticated = false
```

## 🎯 Best Practices

1. **Luôn wrap admin pages với `<ProtectedRoute>`**
   ```tsx
   export default function AdminPage() {
     return (
       <ProtectedRoute>
         <YourAdminContent />
       </ProtectedRoute>
     )
   }
   ```

2. **Sử dụng useAuth() để kiểm tra auth state**
   ```tsx
   const { isAuthenticated } = useAuth()
   
   if (isAuthenticated) {
     // Hiển thị content cho admin
   }
   ```

3. **Xử lý logout đúng cách**
   ```tsx
   const { logout } = useAuth()
   const router = useRouter()
   
   const handleLogout = () => {
     logout()
     if (pathname.startsWith('/admin')) {
       router.push('/') // Redirect nếu đang ở trang admin
     }
   }
   ```

## 🐛 Troubleshooting

### Vấn đề: Đăng nhập thành công nhưng vẫn redirect về trang chủ
- **Nguyên nhân**: localStorage chưa được set
- **Giải pháp**: Kiểm tra browser console, clear localStorage và thử lại

### Vấn đề: Animation không chạy mượt
- **Nguyên nhân**: Framer Motion chưa được cài đặt
- **Giải pháp**: `npm install framer-motion`

### Vấn đề: Sau khi refresh vẫn bị đăng xuất
- **Nguyên nhân**: localStorage bị clear hoặc private mode
- **Giải pháp**: Tắt private browsing mode

## 📱 Responsive Design

- **Desktop (≥768px)**: 
  - Nút Admin và Logout nằm ngang
  - Modal rộng max-width: 28rem

- **Mobile (<768px)**:
  - Admin và Logout trong menu dropdown
  - Modal full-width với padding 1rem

## 🎓 Demo Flow

1. Vào trang chủ → Click "Admin" → Thấy modal đăng nhập
2. Nhập sai mật khẩu → Thấy error message màu đỏ
3. Nhập đúng `bta@23901` → Thấy loading animation → Chuyển đến /admin
4. Refresh trang → Vẫn đăng nhập (localStorage)
5. Click "Đăng xuất" → Về trang chủ

---

**Lưu ý**: Đây là authentication client-side đơn giản, phù hợp cho demo và development. Với production app, nên sử dụng authentication server-side với JWT, sessions, hoặc OAuth.
