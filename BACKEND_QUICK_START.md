# 🚀 Backend Quick Start

## ⚠️ Important: Prisma Version

Nếu gặp lỗi `P1012` khi chạy `db:generate`, đã downgrade về Prisma 5 trong package.json.

Chỉ cần chạy:
```bash
npm install
```

## Cài đặt nhanh (5 phút)

### 1. Cài dependencies
```bash
npm install
```

### 2. Setup Database (chọn 1 trong 3)

**A. Supabase (Miễn phí - Recommended):**
1. Tạo account: https://supabase.com
2. New Project → Copy connection string
3. Paste vào `.env`:
```env
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
JWT_SECRET="random-secret-key-here"
```

**B. Railway (Miễn phí):**
1. https://railway.app → New Project → PostgreSQL
2. Copy connection string → Paste vào `.env`

**C. Local PostgreSQL:**
```bash
# Install PostgreSQL
createdb english_learning_db
# Update .env với connection string
```

### 3. Khởi tạo Database
```bash
npm run db:generate    # Generate Prisma Client
npm run db:push       # Tạo tables
npm run db:seed       # Import data mẫu
```

### 4. Chạy server
```bash
npm run dev
```

**Done!** 🎉 API chạy tại http://localhost:3000/api

## 🔑 Admin Account
- Email: `admin@vocaplanet.com`
- Password: `admin123`

## 📖 Docs đầy đủ
Xem [BACKEND_SETUP.md](./BACKEND_SETUP.md) để biết thêm chi tiết.

## ⚡ Commands hay dùng
```bash
npm run db:studio     # Mở GUI database
npm run db:reset      # Reset database
npm run db:seed       # Import data lại
```

## 🔄 Migrate từ localStorage sang API

**Trước:**
```typescript
import { getLessons } from '@/lib/services/storage'
const lessons = getLessons()
```

**Sau:**
```typescript
import { getLessons } from '@/lib/services/api'
const lessons = await getLessons()
```

Chỉ cần thay import path, function names giữ nguyên! ✨
