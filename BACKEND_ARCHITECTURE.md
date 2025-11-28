# 🏗️ Cấu trúc Backend - Vocaplanet

## 📁 Cấu trúc Folder

```
/workspaces/english-learning-app/
├── prisma/
│   ├── schema.prisma          # Database schema definition
│   └── seed.ts                # Seed script để import data mẫu
│
├── app/api/                   # Next.js API Routes
│   ├── auth/
│   │   ├── login/route.ts     # POST /api/auth/login
│   │   └── register/route.ts  # POST /api/auth/register
│   │
│   ├── categories/
│   │   └── route.ts           # GET, POST /api/categories
│   │
│   └── lessons/
│       ├── route.ts           # GET, POST /api/lessons
│       └── [id]/route.ts      # GET, PUT, DELETE /api/lessons/:id
│
├── lib/
│   ├── prisma.ts              # Prisma Client instance
│   ├── middleware/
│   │   └── auth.ts            # Authentication middleware
│   │
│   └── services/
│       ├── api.ts             # NEW: API service layer (thay localStorage)
│       └── storage.ts         # OLD: localStorage service (sẽ deprecate)
│
└── .env                       # Environment variables
```

## 🗄️ Database Schema

### Core Models

#### 1. User (Authentication)
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String   // Hashed với bcrypt
  name      String?
  role      Role     @default(USER)
  
  // Relations
  progress     UserProgress[]
  quizResults  QuizResult[]
}

enum Role {
  USER
  ADMIN
}
```

#### 2. Category
```prisma
model Category {
  id          String   @id
  name        String   @unique
  description String
  icon        String
  
  // Relations
  lessons Lesson[]
}
```

#### 3. Lesson (Main content)
```prisma
model Lesson {
  id           String   @id
  title        String
  description  String
  level        Level
  duration     String
  thumbnailUrl String?
  categoryId   String
  
  // Relations
  category    Category      @relation(...)
  vocabulary  Vocabulary[]  // 1-to-many
  phrases     Phrase[]      // 1-to-many
  dialogues   Dialogue[]    // 1-to-many
  objectives  Objective[]   // 1-to-many
  tips        Tip[]         // 1-to-many
}

enum Level {
  beginner
  intermediate
  advanced
}
```

#### 4. Vocabulary, Phrase, Dialogue
```prisma
model Vocabulary {
  id            String
  word          String
  pronunciation String
  meaning       String
  example       String
  imageUrl      String?
  tags          String[]  // Array field
  lessonId      String
  order         Int       // Thứ tự trong lesson
  
  lesson Lesson @relation(...)
}

model Phrase { ... }
model Dialogue { ... }
```

#### 5. Progress Tracking
```prisma
model UserProgress {
  userId     String
  lessonId   String
  completed  Boolean
  progress   Int      // 0-100
  lastAccess DateTime
  
  user   User   @relation(...)
  lesson Lesson @relation(...)
  
  @@unique([userId, lessonId])
}
```

## 🔌 API Endpoints

### Authentication

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Đăng ký user mới | ❌ |
| POST | `/api/auth/login` | Đăng nhập | ❌ |

**Example Request:**
```typescript
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'password123'
  })
})

const { data } = await response.json()
// data.user, data.token
```

### Lessons

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/lessons` | Lấy tất cả lessons | ❌ |
| GET | `/api/lessons?category=daily` | Filter by category | ❌ |
| GET | `/api/lessons?level=beginner` | Filter by level | ❌ |
| GET | `/api/lessons?search=hello` | Search lessons | ❌ |
| GET | `/api/lessons/:id` | Lấy lesson theo ID | ❌ |
| POST | `/api/lessons` | Tạo lesson mới | ✅ Admin |
| PUT | `/api/lessons/:id` | Update lesson | ✅ Admin |
| DELETE | `/api/lessons/:id` | Xóa lesson | ✅ Admin |

**Example Request:**
```typescript
// GET lessons
const response = await fetch('/api/lessons?category=daily')
const { data } = await response.json()
// data = array of lessons

// POST new lesson (Admin only)
const response = await fetch('/api/lessons', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: "New Lesson",
    description: "Description",
    level: "beginner",
    categoryId: "category-id",
    vocabulary: [...],
    phrases: [...],
    dialogues: [...]
  })
})
```

### Categories

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | Lấy tất cả categories | ❌ |
| POST | `/api/categories` | Tạo category mới | ✅ Admin |

## 🔐 Authentication Flow

### 1. Register/Login
```typescript
import { login } from '@/lib/services/api'

// User login
const { user, token } = await login('email@example.com', 'password')

// Token được tự động lưu vào localStorage
// Các API calls sau sẽ tự động gửi token
```

### 2. Protected Routes
```typescript
// Frontend: Check authentication
import { isAuthenticated, getCurrentUser } from '@/lib/services/api'

if (!isAuthenticated()) {
  // Redirect to login
}

const user = getCurrentUser()
// { id, email, name, role }
```

### 3. Backend: Verify Token
```typescript
// Backend middleware
import { requireAuth, requireAdmin } from '@/lib/middleware/auth'

// Require any authenticated user
export const GET = requireAuth(async (request, user) => {
  // user = { userId, email, role }
  // Handle request
})

// Require admin
export const POST = requireAdmin(async (request, user) => {
  // Only ADMIN can access
})
```

## 🔄 Migration Guide

### Từ localStorage → API

**1. Import thay đổi:**
```typescript
// OLD
import { getLessons } from '@/lib/services/storage'

// NEW
import { getLessons } from '@/lib/services/api'
```

**2. Async/await:**
```typescript
// OLD (synchronous)
const lessons = getLessons()

// NEW (asynchronous)
const lessons = await getLessons()
```

**3. Function mapping:**
| localStorage (OLD) | API (NEW) | Note |
|-------------------|-----------|------|
| `getLessons()` | `getLessons()` | ✅ Same name |
| `getLessonById(id)` | `getLessonById(id)` | ✅ Same name |
| `createLesson(data)` | `createLesson(data)` | ✅ Same name |
| `updateLesson(id, data)` | `updateLesson(id, data)` | ✅ Same name |
| `deleteLesson(id)` | `deleteLesson(id)` | ✅ Same name |
| `getCategories()` | `getCategories()` | ✅ Same name |

**4. Component example:**
```typescript
// Before
'use client'
import { useEffect, useState } from 'react'
import { getLessons } from '@/lib/services/storage'

export default function LessonsPage() {
  const [lessons, setLessons] = useState([])
  
  useEffect(() => {
    const data = getLessons()
    setLessons(data)
  }, [])
  
  return <div>{/* render lessons */}</div>
}

// After
'use client'
import { useEffect, useState } from 'react'
import { getLessons } from '@/lib/services/api'

export default function LessonsPage() {
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  
  useEffect(() => {
    async function fetchData() {
      const data = await getLessons()
      setLessons(data)
      setLoading(false)
    }
    fetchData()
  }, [])
  
  if (loading) return <div>Loading...</div>
  
  return <div>{/* render lessons */}</div>
}
```

## 📊 Database Operations

### Prisma Studio (GUI)
```bash
npm run db:studio
```
Mở http://localhost:5555 để xem và edit data trực quan.

### Common Commands
```bash
# Generate Prisma Client (sau khi thay đổi schema)
npm run db:generate

# Push schema changes (không cần migrations)
npm run db:push

# Seed database
npm run db:seed

# Reset database (xóa hết và seed lại)
npm run db:reset
```

### Prisma Query Examples
```typescript
import { prisma } from '@/lib/prisma'

// Find all lessons
const lessons = await prisma.lesson.findMany({
  include: {
    vocabulary: true,
    category: true
  }
})

// Create lesson with relations
const lesson = await prisma.lesson.create({
  data: {
    title: "Lesson 1",
    level: "beginner",
    categoryId: "category-id",
    vocabulary: {
      create: [
        { word: "Hello", meaning: "Xin chào", ... }
      ]
    }
  }
})

// Update
await prisma.lesson.update({
  where: { id: "lesson-id" },
  data: { title: "Updated Title" }
})

// Delete
await prisma.lesson.delete({
  where: { id: "lesson-id" }
})
```

## 🚀 Performance Tips

### 1. Include Relations Selectively
```typescript
// ❌ Bad: Load everything
const lessons = await prisma.lesson.findMany({
  include: {
    vocabulary: true,
    phrases: true,
    dialogues: true,
    objectives: true,
    tips: true
  }
})

// ✅ Good: Only load what you need
const lessons = await prisma.lesson.findMany({
  select: {
    id: true,
    title: true,
    description: true,
    _count: { select: { vocabulary: true } }
  }
})
```

### 2. Pagination
```typescript
const lessons = await prisma.lesson.findMany({
  take: 10,      // Limit
  skip: 20,      // Offset
  orderBy: { createdAt: 'desc' }
})
```

### 3. Caching (Frontend)
```typescript
// Use React Query or SWR
import useSWR from 'swr'

function LessonsPage() {
  const { data, error } = useSWR('/api/lessons', fetcher)
  // Auto caching, revalidation
}
```

## 🔒 Security Best Practices

### 1. Environment Variables
```env
# ❌ Never commit real values
JWT_SECRET="super-secret-key-12345"

# ✅ Use strong random values
JWT_SECRET="a8f5f167f44f4964e6c998dee827110c"
```

### 2. Password Hashing
```typescript
// Always use bcrypt
import bcrypt from 'bcryptjs'

const hashedPassword = await bcrypt.hash(password, 10)
const isValid = await bcrypt.compare(password, hashedPassword)
```

### 3. SQL Injection Protection
Prisma tự động protect khỏi SQL injection:
```typescript
// ✅ Safe
const user = await prisma.user.findUnique({
  where: { email: userInput }
})
```

### 4. Authorization Checks
```typescript
// ❌ Bad
export async function DELETE(req, { params }) {
  await prisma.lesson.delete({ where: { id: params.id } })
}

// ✅ Good
export const DELETE = requireAdmin(async (req, user, params) => {
  await prisma.lesson.delete({ where: { id: params.id } })
})
```

## 📈 Monitoring & Logging

### Development
```typescript
// lib/prisma.ts
new PrismaClient({
  log: ['query', 'error', 'warn']  // See all queries
})
```

### Production
```typescript
new PrismaClient({
  log: ['error']  // Only errors
})
```

## 🎯 Next Steps

1. ✅ Setup database
2. ✅ Run migrations
3. ✅ Seed data
4. ⏳ Migrate frontend components
5. ⏳ Add user progress tracking
6. ⏳ Implement quiz system
7. ⏳ Deploy to production

Chi tiết: Xem [BACKEND_SETUP.md](./BACKEND_SETUP.md)
