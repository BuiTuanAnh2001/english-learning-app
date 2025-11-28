# 🔧 Troubleshooting Guide

## ❌ Lỗi Prisma P1012: "datasource property `url` is no longer supported"

### Nguyên nhân
Bạn đang dùng Prisma 7 (có breaking changes), nhưng schema được viết cho Prisma 5.

### Giải pháp ✅

Đã fix trong `package.json` - downgrade về Prisma 5.22.0.

Chỉ cần chạy:

```bash
npm install
npm run db:generate
```

### Chi tiết

**Trước (Prisma 7 - gây lỗi):**
```json
"@prisma/client": "^7.0.1",
"prisma": "^7.0.1"
```

**Sau (Prisma 5 - stable):**
```json
"@prisma/client": "^5.22.0",
"prisma": "^5.22.0"
```

## ❌ Lỗi: "Module '@prisma/client' has no exported member 'PrismaClient'"

### Nguyên nhân
Prisma Client chưa được generate.

### Giải pháp
```bash
npm run db:generate
```

## ❌ Lỗi: "Environment variable not found: DATABASE_URL"

### Nguyên nhân
File `.env` chưa có hoặc DATABASE_URL chưa được set.

### Giải pháp
```bash
# Copy file .env.example
cp .env.example .env

# Edit .env và thêm DATABASE_URL
# VD với Supabase:
DATABASE_URL="postgresql://postgres:password@db.xxx.supabase.co:5432/postgres"
```

## ❌ Lỗi kết nối database: "Can't reach database server"

### Nguyên nhân
- Database chưa chạy
- Connection string sai
- Network/firewall block

### Giải pháp

**A. Với Supabase:**
1. Vào https://supabase.com/dashboard
2. Project Settings > Database
3. Copy "Connection string" (URI format)
4. Thay `[YOUR-PASSWORD]` bằng password thực

**B. Với Railway:**
1. Vào Railway dashboard
2. PostgreSQL service > Variables
3. Copy DATABASE_URL
4. Paste vào `.env`

**C. Với local PostgreSQL:**
```bash
# Check PostgreSQL đang chạy
psql --version
pg_isready

# Tạo database
createdb english_learning_db

# Update .env
DATABASE_URL="postgresql://localhost:5432/english_learning_db"
```

## ❌ Lỗi: "Command not found: tsx"

### Nguyên nhân
tsx chưa được cài.

### Giải pháp
```bash
npm install -D tsx
```

Hoặc dùng node trực tiếp:
```bash
node --loader tsx prisma/seed.ts
```

## ❌ Lỗi seed: "Cannot find module '../lib/data/lessons'"

### Nguyên nhân
Seed script cần data từ lessons.ts.

### Giải pháp
File `lib/data/lessons.ts` phải tồn tại với exported data:
```typescript
export const lessons = [...]
export const categories = [...]
```

Nếu không có, tạo file hoặc comment out phần import trong `prisma/seed.ts`.

## ❌ Lỗi TypeScript trong seed.ts

### Nguyên nhân
PrismaClient chưa được generate.

### Giải pháp
File đã có `@ts-nocheck` ở đầu. Nếu vẫn lỗi:

```bash
# Generate Prisma Client trước
npm run db:generate

# Sau đó seed
npm run db:seed
```

## ❌ Lỗi: "Invalid `prisma.user.create()` invocation"

### Nguyên nhân
Data trong seed script không match schema.

### Giải pháp
Check schema trong `prisma/schema.prisma` và đảm bảo:
- Required fields được provide
- Enum values đúng (e.g., `level: "beginner"` không phải `"easy"`)
- Relations được setup đúng

## ❌ API trả về 401 Unauthorized

### Nguyên nhân
- Token không được gửi
- Token sai format
- Token expired

### Giải pháp
```typescript
// Đảm bảo gửi token đúng format
fetch('/api/lessons', {
  headers: {
    'Authorization': `Bearer ${token}`  // ✅ Có "Bearer " prefix
  }
})

// Check token trong localStorage
const token = localStorage.getItem('auth_token')
console.log('Token:', token)
```

## ❌ API trả về 403 Forbidden

### Nguyên nhân
User không có quyền (VD: USER role cố tạo lesson).

### Giải pháp
- Đảm bảo user có role ADMIN
- Login với admin account: `admin@vocaplanet.com / admin123`

## 🔍 Debug Commands

### Check Prisma version
```bash
npx prisma --version
```

### View database
```bash
npm run db:studio
# Mở http://localhost:5555
```

### Test database connection
```bash
npx prisma db pull
# Nếu thành công = connection OK
```

### Reset database (xóa tất cả)
```bash
npm run db:reset
# Cẩn thận: Xóa hết data!
```

### Check logs
```bash
# Backend logs
npm run dev
# Xem terminal output

# Database logs (nếu dùng Supabase)
# Dashboard > Logs
```

## 📊 Quick Setup Script

Nếu muốn setup tự động:

```bash
# Make script executable
chmod +x setup-db.sh

# Run setup
./setup-db.sh
```

Script sẽ:
1. Install dependencies
2. Generate Prisma Client
3. Push schema
4. Seed database

## 🆘 Vẫn gặp vấn đề?

### 1. Clean install
```bash
rm -rf node_modules
rm package-lock.json
npm install
```

### 2. Clear Prisma cache
```bash
npx prisma generate --force
```

### 3. Reset everything
```bash
# Xóa database
npm run db:reset

# Clean install
rm -rf node_modules
npm install

# Setup lại
npm run db:generate
npm run db:push
npm run db:seed
```

## 📚 Tài liệu thêm

- [Prisma Docs](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [Supabase Docs](https://supabase.com/docs)

## ✅ Quick Checklist

Khi gặp lỗi, check theo thứ tự:

- [ ] Prisma version = 5.22.0 (check package.json)
- [ ] .env file tồn tại và có DATABASE_URL
- [ ] Database đang chạy và accessible
- [ ] `npm install` đã chạy xong
- [ ] `npm run db:generate` thành công
- [ ] `npm run db:push` thành công
- [ ] lib/data/lessons.ts tồn tại (cho seed)

Nếu tất cả ✅ thì sẽ hoạt động! 🎉
