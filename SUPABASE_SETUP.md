# 🚀 Hướng dẫn Setup Supabase cho Vocaplanet

## 📋 Tổng quan

Supabase là PostgreSQL database miễn phí, dễ dùng, perfect cho project này.

**Ưu điểm:**
- ✅ Miễn phí (500MB database, 2GB bandwidth)
- ✅ PostgreSQL managed (không cần tự cài)
- ✅ Dashboard trực quan
- ✅ Auto backups
- ✅ Realtime features

## 🎯 Bước 1: Tạo Supabase Account

### 1.1 Đăng ký
1. Truy cập: https://supabase.com
2. Click **"Start your project"**
3. Sign up với:
   - GitHub (recommended)
   - Google
   - Email

### 1.2 Verify Email
- Check email và verify account

## 🏗️ Bước 2: Tạo Project

### 2.1 New Project
1. Click **"New Project"**
2. Chọn Organization (hoặc tạo mới)
3. Điền thông tin:

```
Project name: vocaplanet
Database Password: [Tạo password mạnh]
Region: Southeast Asia (Singapore)
Pricing Plan: Free
```

**⚠️ Lưu ý:**
- **LƯU MẬT KHẨU** này - sẽ cần dùng sau
- Chọn region gần bạn nhất (Singapore cho VN)

### 2.2 Đợi khởi tạo
- Mất khoảng 1-2 phút
- Có thể uống nước đợi ☕

## 🔌 Bước 3: Lấy Connection String

### 3.1 Vào Database Settings
1. Sidebar → **Settings** (⚙️)
2. Click **"Database"**
3. Scroll xuống **"Connection string"**

### 3.2 Chọn URI Mode
1. Click tab **"URI"** (không phải Pooler)
2. Copy connection string, format:
```
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-xxx.pooler.supabase.com:5432/postgres
```

### 3.3 Thay Password
Connection string có `[YOUR-PASSWORD]` - thay bằng password bạn tạo ở bước 2.1

**Ví dụ:**
```
Trước:
postgresql://postgres.xxxxx:[YOUR-PASSWORD]@aws-0-xx-xxx.pooler.supabase.com:5432/postgres

Sau (với password là "MySecurePass123"):
postgresql://postgres.xxxxx:MySecurePass123@aws-0-xx-xxx.pooler.supabase.com:5432/postgres
```

## ⚙️ Bước 4: Cấu hình Local Project

### 4.1 Tạo/Edit file .env
```bash
# Ở root project
code .env
# Hoặc
nano .env
```

### 4.2 Paste Connection String
```env
# Database - Supabase
DATABASE_URL="postgresql://postgres.xxxxx:YourPassword@aws-0-xx-xxx.pooler.supabase.com:5432/postgres"

# JWT Secret (tạo random string)
JWT_SECRET="your-random-secret-key-here"

# API URL
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

### 4.3 Tạo JWT Secret
```bash
# Generate random secret
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"

# Copy output và paste vào JWT_SECRET
```

**Ví dụ .env hoàn chỉnh:**
```env
DATABASE_URL="postgresql://postgres.abcxyz:MyPass123@aws-0-ap-southeast-1.pooler.supabase.com:5432/postgres"
JWT_SECRET="a8f5f167f44f4964e6c998dee827110c8b9c2e5f3a4d6e7f8b9a0c1d2e3f4a5b"
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

## 🗄️ Bước 5: Setup Database Schema

### 5.1 Install Dependencies
```bash
npm install
```

### 5.2 Generate Prisma Client
```bash
npm run db:generate
```

Output mong đợi:
```
✔ Generated Prisma Client (5.x.x) to ./node_modules/@prisma/client
```

### 5.3 Push Schema to Supabase
```bash
npm run db:push
```

Output mong đợi:
```
🚀  Your database is now in sync with your Prisma schema. Done in XXms
✔ Generated Prisma Client
```

### 5.4 Seed Data (Import lessons)
```bash
npm run db:seed
```

Output mong đợi:
```
🌱 Starting database seed...
👤 Creating admin user...
✅ Admin user created: admin@vocaplanet.com
📁 Creating categories...
  ✓ Category: Daily Conversation
  ✓ Category: Business English
  ...
📚 Creating lessons...
  ✓ Lesson: Greetings (X vocab, Y phrases)
  ...
🎉 Database seeded successfully!
```

## ✅ Bước 6: Verify Setup

### 6.1 Open Supabase Dashboard
1. Quay lại Supabase dashboard
2. Sidebar → **Table Editor**
3. Kiểm tra tables đã được tạo:
   - User
   - Category
   - Lesson
   - Vocabulary
   - Phrase
   - Dialogue
   - v.v.

### 6.2 Check Data
Click vào table `Lesson` → Xem có data không

### 6.3 Test với Prisma Studio
```bash
npm run db:studio
```

Mở http://localhost:5555 → Browse data

## 🧪 Bước 7: Test API

### 7.1 Start Dev Server
```bash
npm run dev
```

### 7.2 Test Login API
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@vocaplanet.com",
    "password": "admin123"
  }'
```

Nếu thành công → Nhận được token!

### 7.3 Test Get Lessons
```bash
curl http://localhost:3000/api/lessons
```

Nếu thành công → Nhận được array of lessons!

## 🎉 Done! Setup hoàn tất

Bạn giờ có:
- ✅ PostgreSQL database trên Supabase (cloud)
- ✅ 13+ lessons đã được import
- ✅ Admin account ready
- ✅ API hoạt động

## 🔑 Thông tin quan trọng

### Admin Account (Mặc định)
```
Email: admin@vocaplanet.com
Password: admin123
```

**⚠️ QUAN TRỌNG:** Đổi password ngay sau khi login!

### Database Info
- **Provider:** Supabase
- **Region:** Bạn đã chọn
- **Plan:** Free (500MB storage)
- **Backup:** Auto daily backups

### Useful Links
- **Dashboard:** https://supabase.com/dashboard
- **Table Editor:** Dashboard → Table Editor
- **SQL Editor:** Dashboard → SQL Editor
- **Logs:** Dashboard → Logs

## 📊 Supabase Features

### Xem Data Realtime
Dashboard → Table Editor → Browse tables

### Chạy SQL Queries
Dashboard → SQL Editor → New Query
```sql
SELECT * FROM "Lesson";
SELECT * FROM "User";
SELECT COUNT(*) FROM "Vocabulary";
```

### Xem Database Usage
Dashboard → Settings → Usage

### Backup & Restore
Dashboard → Settings → Database → Point-in-time Recovery

## 🔒 Security Tips

### 1. Bảo mật Connection String
```bash
# ❌ KHÔNG commit .env vào git
# .env đã có trong .gitignore

# ✅ Chỉ share với team qua secure channel
```

### 2. Row Level Security (RLS)
Supabase có RLS - bật nếu muốn bảo mật cao hơn:
1. Dashboard → Authentication → Policies
2. Enable RLS cho tables cần thiết

### 3. API Keys
Dashboard → Settings → API
- `anon` key - Public (frontend)
- `service_role` key - Secret (backend only)

## 🚀 Deploy to Production

### Bước 1: Production Database
**Option A:** Dùng cùng Supabase project (đơn giản)

**Option B:** Tạo Supabase project riêng cho production
1. New Project → vocaplanet-prod
2. Lấy connection string mới
3. Set trong Vercel env vars

### Bước 2: Vercel Deployment
1. Push code lên GitHub
2. Import vào Vercel
3. Environment Variables:
```
DATABASE_URL=your-supabase-connection-string
JWT_SECRET=your-production-secret
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
```

### Bước 3: Run Migrations
```bash
# Local: Connect to production DB
DATABASE_URL="your-prod-url" npm run db:push
DATABASE_URL="your-prod-url" npm run db:seed
```

## 🆘 Troubleshooting

### ❌ "Can't reach database server"
**Giải pháp:**
1. Check internet connection
2. Verify connection string đúng
3. Check password không có ký tự đặc biệt (% → %25)
4. Try reconnect: `npm run db:push`

### ❌ "Invalid connection string"
**Giải pháp:**
1. Copy lại từ Supabase (Settings → Database)
2. Đảm bảo thay `[YOUR-PASSWORD]`
3. Không có space thừa
4. Format: `postgresql://user:pass@host:5432/db`

### ❌ "Authentication failed"
**Giải pháp:**
1. Password sai → Check lại password tạo khi setup project
2. Reset password: Dashboard → Settings → Database → Reset Password

### ❌ "Too many connections"
**Giải pháp:**
1. Free plan có limit connections
2. Close unused connections
3. Restart Prisma Studio nếu đang mở
4. Dùng connection pooling (mặc định có rồi)

## 💡 Tips & Tricks

### Xem Connection Status
```bash
npx prisma db pull
# Nếu thành công = connected!
```

### Backup Data
```bash
# Export to JSON
npm run db:studio
# Click Export button

# Hoặc SQL dump từ Supabase dashboard
```

### Monitor Performance
Dashboard → Reports → Performance

### Check Database Size
Dashboard → Settings → Usage → Database

## 📚 Next Steps

1. ✅ Database setup xong
2. → Migrate frontend components
3. → Test all features
4. → Deploy to production

Chi tiết: Xem [MIGRATION_CHECKLIST.md](./MIGRATION_CHECKLIST.md)

---

**Cần help?** Check [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 🔧
