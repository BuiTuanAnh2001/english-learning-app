# ChatApp - Ứng dụng Chat Hiện Đại

Ứng dụng chat thời gian thực được xây dựng với Next.js 14, Supabase, và Prisma ORM.

![ChatApp Banner](https://via.placeholder.com/1200x400/0F172A/06B6D4?text=ChatApp+-+K%E1%BA%BFt+n%E1%BB%91i+m%E1%BB%8Di+n%C6%A1i%2C+tr%C3%B2+chuy%E1%BB%87n+kh%C3%B4ng+gi%E1%BB%9Bi+h%E1%BA%A1n)

## ✨ Tính Năng

### 🔐 Authentication

- Đăng nhập/Đăng ký với Email & Password
- Đăng nhập với Google OAuth
- Đăng nhập với Apple ID
- Session management với NextAuth.js

### 💬 Chat Features

- **Chat 1-1**: Trò chuyện riêng tư với bạn bè
- **Chat Nhóm**: Tạo và quản lý nhóm chat
- **Realtime Messaging**: Tin nhắn thời gian thực với Supabase
- **Typing Indicators**: Hiển thị khi người khác đang nhập
- **Online Status**: Trạng thái online/offline
- **Message History**: Lưu trữ toàn bộ lịch sử chat

### 📁 File Sharing

- Gửi và nhận hình ảnh
- Chia sẻ files/documents
- Preview ảnh trong chat

### 👤 User Profile

- Chỉnh sửa thông tin cá nhân
- Upload avatar
- Cài đặt privacy
- Cài đặt thông báo

### 🎨 UI/UX

- Modern dark theme design
- Responsive trên mọi thiết bị
- Smooth animations
- Intuitive navigation

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **Styling**: Tailwind CSS, Radix UI
- **Authentication**: NextAuth.js
- **Database**: PostgreSQL (Supabase)
- **ORM**: Prisma
- **Realtime**: Supabase Realtime
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Date Handling**: date-fns

## 📋 Prerequisites

- Node.js 18+
- npm hoặc yarn
- PostgreSQL database (hoặc Supabase account)
- Google OAuth credentials (optional)
- Apple Developer account (optional)

## 🛠️ Installation

### 1. Clone repository

\`\`\`bash
git clone <repository-url>
cd english-learning-app
\`\`\`

### 2. Install dependencies

\`\`\`bash
npm install
\`\`\`

### 3. Setup environment variables

Tạo file \`.env\` và điền các thông tin sau:

\`\`\`env

# Database

DATABASE_URL="postgresql://user:password@localhost:5432/chatapp"

# NextAuth

NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth (Optional)

GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Apple OAuth (Optional)

APPLE_ID="your-apple-id"
APPLE_TEAM_ID="your-apple-team-id"
APPLE_PRIVATE_KEY="your-apple-private-key"
APPLE_KEY_ID="your-apple-key-id"

# Supabase

NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-supabase-anon-key"
\`\`\`

### 4. Setup database

\`\`\`bash

# Generate Prisma Client

npm run db:generate

# Push schema to database

npm run db:push

# Seed database (optional)

npm run db:seed
\`\`\`

### 5. Run development server

\`\`\`bash
npm run dev
\`\`\`

Mở [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

## 📁 Project Structure

\`\`\`
├── app/
│ ├── (auth)/
│ │ ├── login/ # Trang đăng nhập
│ │ └── signup/ # Trang đăng ký
│ ├── (chat)/
│ │ ├── chat/ # Trang chat chính
│ │ └── profile/ # Trang profile
│ ├── api/
│ │ ├── auth/ # NextAuth routes
│ │ ├── conversations/ # Conversations API
│ │ └── user/ # User API
│ ├── layout.tsx # Root layout
│ └── page.tsx # Home page
├── components/
│ ├── ui/ # UI components
│ ├── auth/ # Auth components
│ └── chat/ # Chat components
├── lib/
│ ├── auth.ts # NextAuth config
│ ├── prisma.ts # Prisma client
│ ├── supabase.ts # Supabase client
│ └── realtime-context.tsx # Realtime provider
├── prisma/
│ ├── schema.prisma # Database schema
│ └── seed.ts # Seed data
└── types/
└── next-auth.d.ts # NextAuth types
\`\`\`

## 🎯 Usage

### Đăng ký tài khoản mới

1. Truy cập `/signup`
2. Điền thông tin hoặc đăng ký với Google/Apple
3. Tự động chuyển đến trang chat

### Bắt đầu chat

1. Đăng nhập vào tài khoản
2. Chọn người dùng từ danh sách contacts
3. Bắt đầu trò chuyện!

### Tạo nhóm chat

1. Click vào nút "Tạo nhóm"
2. Chọn thành viên
3. Đặt tên nhóm và avatar
4. Bắt đầu chat nhóm

## 🔧 Available Scripts

\`\`\`bash
npm run dev # Chạy development server
npm run build # Build production
npm run start # Start production server
npm run lint # Run ESLint
npm run db:generate # Generate Prisma Client
npm run db:push # Push schema to database
npm run db:studio # Open Prisma Studio
npm run db:seed # Seed database
\`\`\`

## 🌐 Deployment

### Vercel (Recommended)

1. Push code lên GitHub
2. Import project vào Vercel
3. Thêm environment variables
4. Deploy!

\`\`\`bash

# Build command

npm run build

# Output directory

.next
\`\`\`

### Database

- Sử dụng Supabase cho database (recommended)
- Hoặc deploy PostgreSQL riêng

## 🔒 Security

- ✅ Passwords được hash với bcrypt
- ✅ JWT tokens cho authentication
- ✅ CSRF protection
- ✅ XSS protection
- ✅ Environment variables cho secrets
- ✅ Prisma ORM để prevent SQL injection

## 🐛 Troubleshooting

### Database connection errors

- Kiểm tra DATABASE_URL trong .env
- Verify database đang chạy
- Check network connection

### Authentication issues

- Verify NEXTAUTH_SECRET được set
- Check OAuth credentials
- Clear browser cookies

### Realtime không hoạt động

- Check Supabase credentials
- Verify Realtime is enabled trong Supabase dashboard
- Check network/firewall settings

## 📝 License

MIT License

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

Nếu có câu hỏi hoặc feedback, vui lòng tạo issue hoặc liên hệ qua email.

---

**Made with ❤️ using Next.js and Supabase**
