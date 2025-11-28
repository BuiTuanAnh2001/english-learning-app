# Backend Setup Guide - Vocaplanet

Hướng dẫn cài đặt và cấu hình backend cho Vocaplanet English Learning App.

## 🎯 Tổng quan

Backend được xây dựng với:
- **Next.js API Routes** - RESTful API endpoints
- **Prisma ORM** - Database management
- **PostgreSQL** - Primary database
- **JWT** - Authentication & Authorization
- **bcryptjs** - Password hashing

## 📋 Prerequisites

1. **Node.js** v18+ 
2. **PostgreSQL** database (local hoặc cloud như Supabase, Railway, Neon)
3. **npm** hoặc **yarn**

## 🚀 Cài đặt

### Bước 1: Cài đặt dependencies

```bash
npm install tsx -D
npm install
```

### Bước 2: Cấu hình Database

#### Option A: PostgreSQL Local

1. Cài đặt PostgreSQL trên máy
2. Tạo database mới:
```sql
CREATE DATABASE english_learning_db;
```

3. Cập nhật `.env`:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/english_learning_db?schema=public"
```

#### Option B: Sử dụng Supabase (Recommended - Free)

1. Tạo tài khoản tại https://supabase.com
2. Tạo project mới
3. Lấy connection string từ Settings > Database
4. Cập nhật `.env`:
```env
DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
```

#### Option C: Sử dụng Railway (Free tier)

1. Tạo tài khoản tại https://railway.app
2. Tạo PostgreSQL database
3. Copy connection string
4. Cập nhật `.env`

### Bước 3: Cấu hình Environment Variables

Copy file `.env.example` thành `.env`:

```bash
cp .env.example .env
```

Cập nhật các giá trị:

```env
# Database
DATABASE_URL="your-postgresql-connection-string"

# JWT Secret (tạo random string dài và phức tạp)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# Next.js
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
```

Để tạo JWT_SECRET ngẫu nhiên:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Bước 4: Khởi tạo Database

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (tạo tables)
npm run db:push

# Seed data (import data mẫu)
npm run db:seed
```

### Bước 5: Chạy Development Server

```bash
npm run dev
```

Server sẽ chạy tại http://localhost:3000

## 📚 API Endpoints

### Authentication

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "name": "User Name"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "...",
      "email": "user@example.com",
      "name": "User Name",
      "role": "USER"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Lessons

#### Get All Lessons
```http
GET /api/lessons
GET /api/lessons?category=daily
GET /api/lessons?level=beginner
GET /api/lessons?search=hello
```

#### Get Lesson by ID
```http
GET /api/lessons/:id
```

#### Create Lesson (Admin only)
```http
POST /api/lessons
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Lesson Title",
  "description": "Description",
  "level": "beginner",
  "duration": "15 phút",
  "categoryId": "category-id",
  "vocabulary": [...],
  "phrases": [...],
  "dialogues": [...]
}
```

#### Update Lesson (Admin only)
```http
PUT /api/lessons/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Updated Title",
  ...
}
```

#### Delete Lesson (Admin only)
```http
DELETE /api/lessons/:id
Authorization: Bearer {token}
```

### Categories

#### Get All Categories
```http
GET /api/categories
```

#### Create Category (Admin only)
```http
POST /api/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Category Name",
  "description": "Description",
  "icon": "BookOpen"
}
```

## 👤 Default Admin Account

Sau khi chạy seed:
- **Email**: `admin@vocaplanet.com`
- **Password**: `admin123`

⚠️ **Quan trọng**: Đổi password ngay sau khi login lần đầu!

## 🔧 Database Commands

```bash
# Generate Prisma Client (sau khi thay đổi schema)
npm run db:generate

# Push schema changes to database
npm run db:push

# Seed database với data mẫu
npm run db:seed

# Open Prisma Studio (GUI để xem database)
npm run db:studio

# Reset database (xóa tất cả data và seed lại)
npm run db:reset
```

## 📊 Database Schema

### Models:
- **User** - User accounts (USER hoặc ADMIN)
- **Category** - Lesson categories
- **Lesson** - Main lesson content
- **Vocabulary** - Vocabulary items trong lesson
- **Phrase** - Phrases trong lesson
- **Dialogue** - Dialogue conversations
- **Objective** - Learning objectives
- **Tip** - Learning tips
- **UserProgress** - Track user progress
- **Quiz** - Quiz for lessons
- **QuizQuestion** - Quiz questions
- **QuizResult** - User quiz results
- **QuizAnswer** - Individual answers

## 🔐 Authentication Flow

1. User register/login → Nhận JWT token
2. Store token trong localStorage
3. Gửi token trong header: `Authorization: Bearer {token}`
4. Backend verify token và trả về user info

## 🎨 Frontend Integration

### Replace localStorage với API:

**Before (localStorage):**
```typescript
import { getLessons } from '@/lib/services/storage'
const lessons = getLessons()
```

**After (API):**
```typescript
import { getLessons } from '@/lib/services/api'
const lessons = await getLessons()
```

### Tất cả functions tương tự:
- `getLessons()` ✅
- `getLessonById(id)` ✅
- `createLesson(lesson)` ✅
- `updateLesson(id, updates)` ✅
- `deleteLesson(id)` ✅
- `getCategories()` ✅
- `login(email, password)` ✅
- `register(email, password)` ✅

## 🚀 Deploy to Production

### Vercel (Recommended)

1. Push code lên GitHub
2. Import project vào Vercel
3. Add environment variables:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `NEXT_PUBLIC_API_URL`
4. Deploy!

### Database setup:
- Sử dụng Supabase hoặc Railway cho PostgreSQL
- Run migrations: `npx prisma db push`
- Run seed: `npx prisma db seed`

## 📝 Migration từ localStorage

1. Export data hiện tại:
```typescript
import { exportLessonsToJSON } from '@/lib/services/storage'
const jsonData = exportLessonsToJSON()
// Save file
```

2. Seed database với data đã export
3. Update frontend code để dùng API
4. Test kỹ trước khi deploy

## 🐛 Troubleshooting

### Lỗi connection database:
- Kiểm tra DATABASE_URL đúng format
- Kiểm tra database đang chạy
- Kiểm tra firewall/network

### Lỗi Prisma Client:
```bash
npm run db:generate
```

### Lỗi authentication:
- Kiểm tra JWT_SECRET đã set
- Kiểm tra token format: `Bearer {token}`
- Kiểm tra token chưa expire

## 📚 Tài liệu thêm

- [Prisma Documentation](https://www.prisma.io/docs)
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)
- [JWT.io](https://jwt.io)

## 🎉 Done!

Backend đã sẵn sàng! Giờ bạn có thể:
- ✅ Quản lý lessons qua database
- ✅ User authentication
- ✅ Admin panel với authorization
- ✅ RESTful API endpoints
- ✅ Scalable và production-ready
